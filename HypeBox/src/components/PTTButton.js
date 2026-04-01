import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function PTTButton({ isTalking, voiceLevel, onPressIn, onPressOut }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTalking) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }).start();
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isTalking]);

  // Drive glow from voice level
  useEffect(() => {
    if (!isTalking) return;
    Animated.timing(glowAnim, {
      toValue: voiceLevel,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [voiceLevel, isTalking]);

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.3, 0.8],
  });

  return (
    <View style={styles.wrapper}>
      {/* Voice-reactive glow ring */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[
            styles.button,
            {
              backgroundColor: isTalking ? COLORS.onAir : COLORS.standby,
              borderColor: isTalking
                ? 'rgba(255, 58, 58, 0.5)'
                : 'rgba(255, 255, 255, 0.05)',
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: isTalking ? '#fff' : COLORS.dimText },
            ]}
          >
            {isTalking ? 'ON AIR' : 'HOLD\nTO TALK'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const SIZE = SIZES.pttButton;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: SIZE + 60,
    height: SIZE + 60,
    borderRadius: (SIZE + 60) / 2,
    backgroundColor: COLORS.onAirGlow,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 24,
  },
});
