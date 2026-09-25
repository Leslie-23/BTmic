import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import LevelMeter from './LevelMeter';

// A physical-feeling talk key: the pad sits lifted off a solid block and
// sinks flush into it while held.
export default function PTTButton({ isTalking, voiceLevel, durationSec, onPressIn, onPressOut }) {
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(press, {
      toValue: isTalking ? 1 : 0,
      duration: isTalking ? 60 : 120,
      useNativeDriver: true,
    }).start();
  }, [isTalking]);

  const offset = press.interpolate({
    inputRange: [0, 1],
    outputRange: [-SPACE.lift, 0],
  });

  return (
    <View style={styles.wrapper}>
      <View style={[styles.base, { backgroundColor: isTalking ? COLORS.redDeep : COLORS.paper }]} />

      <Animated.View
        style={[styles.fill, { transform: [{ translateX: offset }, { translateY: offset }] }]}
      >
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          accessibilityRole="button"
          accessibilityLabel="Hold to talk"
          accessibilityHint="Your voice plays through the connected speaker while you hold"
          style={[
            styles.pad,
            isTalking
              ? { backgroundColor: COLORS.red, borderColor: COLORS.red }
              : { backgroundColor: COLORS.panel, borderColor: COLORS.paper },
          ]}
        >
          <View style={styles.padTop}>
            <Text style={[styles.meta, { color: isTalking ? '#fff' : COLORS.mute }]}>
              {isTalking ? 'LIVE' : 'PUSH TO TALK'}
            </Text>
            <Text style={[styles.meta, { color: isTalking ? '#fff' : COLORS.mute }]}>
              {durationSec} SEC DELAY
            </Text>
          </View>

          <Text style={[styles.headline, { color: isTalking ? '#fff' : COLORS.paper }]}>
            {isTalking ? "You're\nlive." : 'Hold\nto talk.'}
          </Text>

          <LevelMeter
            level={isTalking ? voiceLevel : 0}
            onColor={COLORS.ink}
            offColor={isTalking ? 'rgba(10,10,15,0.18)' : COLORS.line}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginLeft: SPACE.lift,
    marginTop: SPACE.lift,
  },
  base: {
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    flex: 1,
  },
  pad: {
    flex: 1,
    borderWidth: SPACE.border,
    padding: 20,
    justifyContent: 'space-between',
  },
  padTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontFamily: FONTS.heavy,
    fontSize: 12,
    letterSpacing: 2.5,
  },
  headline: {
    fontFamily: FONTS.black,
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -2.5,
  },
});
