import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { requireNativeModule } from 'expo';

interface UsageStatsModule {
  hasUsageAccessPermission(): boolean;
  openUsageAccessSettings(): void;
}

const UsageStats = requireNativeModule<UsageStatsModule>('UsageStats');

export default function SettingsScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    const result = UsageStats.hasUsageAccessPermission();
    setHasPermission(result);
  };

  const handleEnableUsageAccess = () => {
    UsageStats.openUsageAccessSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Usage Access Permission</Text>
        <Text style={styles.status}>
          Status: {hasPermission === null ? 'Checking...' : hasPermission ? 'Granted' : 'Not Granted'}
        </Text>
        {!hasPermission && (
          <Button title="Enable Usage Access" onPress={handleEnableUsageAccess} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
});