import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default function DurationPicker({ options, selected, onChange, disabled }) {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.header}>
        <Text style={styles.label}>DELAY</Text>
        <Text style={styles.caption}>Longer is steadier on slow speakers</Text>
      </View>
      <View style={styles.row} accessibilityRole="radiogroup">
        {options.map((sec, i) => {
          const isActive = sec === selected;
          return (
            <Pressable
              key={sec}
              disabled={disabled}
              onPress={() => onChange(sec)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isActive, disabled }}
              accessibilityLabel={`${sec} second delay`}
              style={[
                styles.cell,
                i > 0 && styles.cellDivider,
                isActive && styles.cellActive,
              ]}
            >
              <Text style={[styles.num, isActive && styles.numActive]}>{sec}</Text>
              <Text style={[styles.unit, isActive && styles.numActive]}>SEC</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  disabled: {
    opacity: 0.35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontFamily: FONTS.black,
    fontSize: 12,
    letterSpacing: 2.5,
    color: COLORS.paper,
  },
  caption: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.mute,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: COLORS.line,
  },
  cell: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDivider: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.line,
  },
  cellActive: {
    backgroundColor: COLORS.paper,
  },
  num: {
    fontFamily: FONTS.black,
    fontSize: 20,
    color: COLORS.mute,
  },
  unit: {
    fontFamily: FONTS.heavy,
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.mute,
    marginTop: 1,
  },
  numActive: {
    color: COLORS.ink,
  },
});
