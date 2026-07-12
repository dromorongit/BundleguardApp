import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getActiveBundle, Bundle } from '../../lib/db';
import BundleGauge from '../../components/BundleGauge';

export default function DashboardScreen() {
  const [bundle, setBundle] = useState<Bundle | null>(null);

  useEffect(() => {
    const fetchBundle = async () => {
      const activeBundle = await getActiveBundle();
      setBundle(activeBundle);
    };
    fetchBundle();
  }, []);

  if (bundle === null) {
    return (
      <View style={styles.container}>
        <Text>No active bundle found. Please complete onboarding.</Text>
      </View>
    );
  }

  const sizeGb = bundle.size_mb / 1024;
  const expiresDate = new Date(bundle.expires_at);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((expiresDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Placeholder: usedGb is hardcoded since real usage tracking not implemented yet
  // TODO: Replace with actual usage data from NetworkStatsManager
  const usedGb = 0;

  return (
    <View style={styles.container}>
      <BundleGauge totalGb={sizeGb} usedGb={usedGb} />
      <Text style={styles.daysCaption}>~{daysRemaining} days left</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  daysCaption: {
    fontSize: 14,
    color: '#8C93A8',
    marginTop: 16,
  },
});