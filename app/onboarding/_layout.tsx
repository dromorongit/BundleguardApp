import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ title: 'Welcome' }} />
      <Stack.Screen name="carrier-select" options={{ title: 'Select Carrier' }} />
      <Stack.Screen name="bundle-setup" options={{ title: 'Bundle Setup' }} />
    </Stack>
  );
}