import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function StatusBadge({ isActive }) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          { backgroundColor: isActive ? COLORS.onAir : COLORS.dimText },
        ]}
      />
      <Text
        style={[
          styles.label,
          { color: isActive ? COLORS.onAir : COLORS.dimText },
        ]}
      >
        {isActive ? 'ON AIR' : 'STANDBY'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
