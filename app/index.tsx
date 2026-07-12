import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { initDatabase, getActiveBundle } from '../lib/db';

export default function IndexScreen() {
  const [isReady, setReady] = useState(false);
  const [hasBundle, setHasBundle] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const checkOnboarding = async () => {
      console.log('[index] checkOnboarding() starting at', Date.now());
      try {
        await initDatabase();
        const bundle = await getActiveBundle();
        console.log('[index] getActiveBundle() returned:', bundle, 'at', Date.now());
        if (!cancelled) {
          setHasBundle(bundle !== null);
        }
      } catch (error) {
        console.error('[index] Failed to check onboarding status:', error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };
    
    checkOnboarding();
    
    return () => { cancelled = true; };
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('[index] Redirect decision:', hasBundle ? 'tabs (bundle found)' : 'onboarding (no bundle)', 'at', Date.now());

  if (!hasBundle) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}