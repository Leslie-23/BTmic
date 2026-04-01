import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function DurationPicker({ options, selected, onChange, disabled }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>DELAY</Text>
      <View style={styles.row}>
        {options.map((sec) => {
          const isActive = sec === selected;
          return (
            <Pressable
              key={sec}
              onPress={() => !disabled && onChange(sec)}
              style={[
                styles.chip,
                isActive && styles.chipActive,
                disabled && styles.chipDisabled,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive && styles.chipTextActive,
                ]}
              >
                {sec}s
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.dimText,
    letterSpacing: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    width: 44,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chipActive: {
    backgroundColor: COLORS.standby,
    borderColor: COLORS.onAir,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dimText,
  },
  chipTextActive: {
    color: COLORS.text,
  },
});
