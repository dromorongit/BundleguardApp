import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { insertBundle } from '../../lib/db';

export default function BundleSetupScreen() {
  const { carrier: initialCarrier } = useLocalSearchParams<{ carrier: string }>();
  const [size, setSize] = useState('');
  const [cost, setCost] = useState('');
  const [validity, setValidity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSizeValid = size.trim() !== '' && !isNaN(Number(size));
  const isCostValid = cost.trim() !== '' && !isNaN(Number(cost));
  const canFinish = isSizeValid && isCostValid && !isSubmitting;

  const handleFinish = async () => {
    if (!canFinish || !initialCarrier) return;

    setIsSubmitting(true);

    const purchasedAt = new Date().toISOString();
    const validityDays = parseInt(validity, 10) || 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityDays);

    try {
      const bundleId = await insertBundle({
        carrier: initialCarrier,
        size_mb: parseInt(size, 10),
        cost_ghc: parseFloat(cost),
        purchased_at: purchasedAt,
        expires_at: expiresAt.toISOString(),
      });

      console.log('Bundle inserted with id:', bundleId);
      const { getActiveBundle } = await import('../../lib/db');
      const activeBundle = await getActiveBundle();
      console.log('Active bundle after insert:', activeBundle);

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to insert bundle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bundle Setup</Text>
      <Text style={styles.carrierLabel}>Carrier: {initialCarrier}</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bundle Size (MB)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500"
            placeholderTextColor="#999"
            value={size}
            onChangeText={setSize}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cost (GHS)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            placeholderTextColor="#999"
            value={cost}
            onChangeText={setCost}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Validity (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 30"
            placeholderTextColor="#999"
            value={validity}
            onChangeText={setValidity}
            keyboardType="numeric"
          />
        </View>
      </View>
      <Pressable
        style={[styles.button, !canFinish && styles.disabledButton]}
        onPress={handleFinish}
        disabled={!canFinish}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  carrierLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});