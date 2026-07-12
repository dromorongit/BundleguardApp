import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

const carriers = ['MTN', 'Telecel', 'AirtelTigo', 'Other'] as const;

export default function CarrierSelectScreen() {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedCarrier) {
      router.push(`/onboarding/bundle-setup?carrier=${selectedCarrier}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Carrier</Text>
      <View style={styles.carrierList}>
        {carriers.map((carrier) => (
          <Pressable
            key={carrier}
            style={({ pressed }) => [
              styles.carrierCard,
              selectedCarrier === carrier && styles.selectedCard,
              pressed && styles.pressedCard,
            ]}
            onPress={() => setSelectedCarrier(carrier)}
          >
            <Text style={[styles.carrierText, selectedCarrier === carrier && styles.selectedCardText]}>{carrier}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={[styles.button, !selectedCarrier && styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedCarrier}
      >
        <Text style={styles.buttonText}>Next</Text>
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
  carrierList: {
    gap: 12,
  },
  carrierCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressedCard: {
    backgroundColor: '#e0e0e0',
  },
  selectedCard: {
    backgroundColor: '#007AFF',
  },
  selectedCardText: {
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  carrierText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});