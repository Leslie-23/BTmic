import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

import { COLORS, FONTS, SPACE } from './src/constants/theme';
import usePTT from './src/hooks/usePTT';
import PTTButton from './src/components/PTTButton';
import StatusBadge from './src/components/StatusBadge';
import MicPermission from './src/components/MicPermission';
import DurationPicker from './src/components/DurationPicker';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const {
    hasPermission,
    canAskAgain,
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

  if (!fontsLoaded || hasPermission === null) {
    return <View style={styles.blank} />;
  }

  if (!hasPermission) {
    return <MicPermission onAllow={requestPermission} canAskAgain={canAskAgain} />;
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>HYPEBOX</Text>
        <StatusBadge isActive={isTalking} />
      </View>

      <View style={styles.pad}>
        <PTTButton
          isTalking={isTalking}
          voiceLevel={voiceLevel}
          durationSec={durationSec}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </View>

      <View style={styles.footer}>
        <DurationPicker
          options={durationOptions}
          selected={durationSec}
          onChange={changeDuration}
          disabled={isTalking}
        />
        <View style={styles.hintRow}>
          {error ? (
            <Text style={[styles.hint, styles.error]}>{error}</Text>
          ) : (
            <Text style={styles.hint}>
              {isTalking
                ? `Your voice reaches the speaker about ${durationSec}s after you say it.`
                : 'Plays through whatever speaker your phone is connected to.'}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  blank: {
    flex: 1,
    backgroundColor: COLORS.ink,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.ink,
    paddingHorizontal: SPACE.gutter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 24,
  },
  wordmark: {
    fontFamily: FONTS.black,
    fontSize: 20,
    letterSpacing: 4,
    color: COLORS.paper,
  },
  pad: {
    flex: 1,
  },
  footer: {
    paddingTop: 28,
    paddingBottom: 12,
    gap: 16,
  },
  hintRow: {
    minHeight: 36,
  },
  hint: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.mute,
  },
  error: {
    color: COLORS.red,
  },
});
