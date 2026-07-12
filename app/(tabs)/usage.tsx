import { View, Text, StyleSheet } from 'react-native';

export default function UsageScreen() {
  return (
    <View style={styles.container}>
      <Text>Usage Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});