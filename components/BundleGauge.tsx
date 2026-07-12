import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface BundleGaugeProps {
  totalGb: number;
  usedGb: number;
}

const COLORS = {
  background: '#1B2130',
  filledArc: '#F2A65A',
  emptyTrack: '#2E3547',
  primaryText: '#F4F0E6',
  mutedText: '#8C93A8',
};

export default function BundleGauge({ totalGb, usedGb }: BundleGaugeProps) {
  const remainingGb = totalGb - usedGb;
  // Percentage represents remaining GB (amber shows what's left)
  const percentage = Math.min(1, Math.max(0, remainingGb / totalGb));

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Offset to center the 270-degree arc vertically
  const offsetY = 4;

  return (
    <View style={styles.card}>
      <Svg width={size} height={size + offsetY}>
        {/* Background track - 270 degree arc in muted gray */}
        <Path
          stroke={COLORS.emptyTrack}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 1 1 ${size - strokeWidth} ${center}`}
        />
        {/* Filled arc - amber showing remaining portion */}
        <Path
          stroke={COLORS.filledArc}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75 * percentage} ${circumference}`}
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 1 1 ${size - strokeWidth} ${center}`}
        />
      </Svg>
      <View style={styles.centerText}>
        <Text style={styles.gbRemaining}>{remainingGb.toFixed(1)}</Text>
        <Text style={styles.gbCaption}>GB LEFT OF {totalGb.toFixed(1)}GB</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: 240,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gbRemaining: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  gbCaption: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: 4,
  },
});