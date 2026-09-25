import React from 'react';
import { View, StyleSheet } from 'react-native';

const SEGMENTS = 20;

// Segmented VU meter. `level` is 0–1.
export default function LevelMeter({ level, onColor, offColor }) {
  const lit = Math.round(level * SEGMENTS);
  return (
    <View style={styles.row}>
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <View
          key={i}
          style={[styles.seg, { backgroundColor: i < lit ? onColor : offColor }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 3,
    height: 14,
  },
  seg: {
    flex: 1,
  },
});
