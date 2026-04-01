import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { COLORS } from './src/constants/theme';
import usePTT from './src/hooks/usePTT';
import PTTButton from './src/components/PTTButton';
import StatusBadge from './src/components/StatusBadge';
import MicPermission from './src/components/MicPermission';
import DurationPicker from './src/components/DurationPicker';

export default function App() {
  const {
    hasPermission,
    requestPermission,
    isTalking,
    voiceLevel,
    error,
    pressIn,
    pressOut,
    durationSec,
    durationOptions,
    changeDuration,
  } = usePTT();

  if (hasPermission === null) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <>
        <StatusBar style="light" />
        <MicPermission onAllow={requestPermission} />
      </>
    );
  }

  const handlePressIn = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    pressIn();
  };

  const handlePressOut = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    pressOut();
  };

  return (
    <LinearGradient
      colors={[COLORS.background, '#0F0F18', COLORS.background]}
      style={styles.container}
    >
      <StatusBar style="light" />

      <View style={styles.top}>
        <StatusBadge isActive={isTalking} />
      </View>

      <View style={styles.center}>
        <PTTButton
          isTalking={isTalking}
          voiceLevel={voiceLevel}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </View>

      <View style={styles.bottom}>
        <DurationPicker
          options={durationOptions}
          selected={durationSec}
          onChange={changeDuration}
          disabled={isTalking}
        />
        <View style={styles.hintRow}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.hint}>
              {isTalking
                ? `~${durationSec}s delay to Bluetooth speaker`
                : 'Audio routes to active Bluetooth speaker'}
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  top: {
    paddingTop: 60,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    paddingBottom: 50,
    alignItems: 'center',
    gap: 16,
  },
  hintRow: {
    alignItems: 'center',
  },
  hint: {
    fontSize: 13,
    color: COLORS.dimText,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.onAir,
  },
});
