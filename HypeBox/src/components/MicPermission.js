import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACE } from '../constants/theme';

const STEPS = [
  'Connect your Bluetooth speaker',
  'Hold the button and talk',
  'Your voice plays over the music',
];

export default function MicPermission({ onAllow, canAskAgain }) {
  const handlePress = canAskAgain ? onAllow : () => Linking.openSettings();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.tag}>HYPEBOX</Text>
        <Text style={styles.h1}>Your phone is now</Text>
        <View style={styles.markRow}>
          <Text style={styles.h1}>a </Text>
          <View style={styles.mark}>
            <Text style={[styles.h1, styles.markText]}>mic.</Text>
          </View>
        </View>
        <Text style={styles.lead}>
          Hold to talk and your voice comes out of the Bluetooth speaker, even
          while the music keeps playing.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        {!canAskAgain && (
          <Text style={styles.denied}>
            Mic access is off. Turn it on in Settings to use HypeBox.
          </Text>
        )}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handlePress}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {canAskAgain ? 'Continue' : 'Open Settings'}
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
        <Text style={styles.note}>
          The mic is only on while you hold the button. Nothing is uploaded.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ink,
    paddingHorizontal: SPACE.gutter,
    justifyContent: 'space-between',
  },
  top: {
    paddingTop: 48,
  },
  tag: {
    fontFamily: FONTS.heavy,
    fontSize: 12,
    letterSpacing: 4,
    color: COLORS.mute,
    marginBottom: 16,
  },
  h1: {
    fontFamily: FONTS.black,
    fontSize: 46,
    lineHeight: 48,
    letterSpacing: -1.8,
    color: COLORS.paper,
  },
  markRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mark: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 6,
  },
  markText: {
    color: '#fff',
  },
  lead: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.body,
    marginTop: 20,
  },
  steps: {
    marginTop: 32,
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: FONTS.black,
    fontSize: 13,
    color: '#fff',
  },
  stepText: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.paper,
  },
  bottom: {
    paddingBottom: 16,
    gap: 14,
  },
  denied: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.red,
  },
  button: {
    height: 60,
    backgroundColor: COLORS.paper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonPressed: {
    backgroundColor: COLORS.body,
  },
  buttonText: {
    fontFamily: FONTS.black,
    fontSize: 18,
    color: COLORS.ink,
  },
  buttonArrow: {
    fontFamily: FONTS.black,
    fontSize: 22,
    color: COLORS.ink,
  },
  note: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.mute,
  },
});
