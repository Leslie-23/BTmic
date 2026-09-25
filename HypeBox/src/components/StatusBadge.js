import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default function StatusBadge({ isActive }) {
  return (
    <View style={[styles.stamp, isActive ? styles.live : styles.idle]}>
      <View style={[styles.dot, { backgroundColor: isActive ? '#fff' : COLORS.mute }]} />
      <Text style={[styles.label, { color: isActive ? '#fff' : COLORS.mute }]}>
        {isActive ? 'ON AIR' : 'STANDBY'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 32,
    borderWidth: 2,
  },
  idle: {
    borderColor: COLORS.line,
  },
  live: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontFamily: FONTS.black,
    fontSize: 12,
    letterSpacing: 2.5,
  },
});
