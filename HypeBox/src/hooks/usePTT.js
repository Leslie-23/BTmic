import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { File } from 'expo-file-system';

const DURATION_OPTIONS = [1, 2, 3, 4, 5];

// Clips are throwaway; don't let them pile up in the cache
function discardClip(uri) {
  try { new File(uri).delete(); } catch {}
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function usePTT() {
  const [hasPermission, setHasPermission] = useState(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState(null);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [durationSec, setDurationSec] = useState(2);

  const isTalkingRef = useRef(false);
  const durationRef = useRef(2000);
  const currentSoundRef = useRef(null);

  useEffect(() => {
    checkPermission();
    return () => cleanup();
  }, []);

  async function checkPermission() {
    try {
      const res = await Audio.getPermissionsAsync();
      setCanAskAgain(res.canAskAgain !== false);
      setHasPermission(res.status === 'granted');
    } catch {
      setHasPermission(false);
    }
  }

  async function requestPermission() {
    try {
      const res = await Audio.requestPermissionsAsync();
      setCanAskAgain(res.canAskAgain !== false);
      setHasPermission(res.status === 'granted');
      return res.status === 'granted';
    } catch {
      setHasPermission(false);
      return false;
    }
  }

  function cleanup() {
    isTalkingRef.current = false;
    if (currentSoundRef.current) {
      try { currentSoundRef.current.unloadAsync(); } catch {}
      currentSoundRef.current = null;
    }
  }

  async function setRecordMode() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: false,
      interruptionModeIOS: 0,
      interruptionModeAndroid: 1,
    });
  }

  async function setPlaybackMode() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: false,
      interruptionModeIOS: 0,
      interruptionModeAndroid: 1,
    });
  }

  // Monitor recording to get voice levels for the UI
  function onRecordingStatus(status) {
    if (status.isRecording && status.metering != null) {
      // metering is in dB (negative values, -160 = silence, 0 = max)
      // normalize to 0-1 range
      const db = status.metering;
      const normalized = Math.max(0, Math.min(1, (db + 50) / 50));
      setVoiceLevel(normalized);
    }
  }

  const startLoop = useCallback(async () => {
    while (isTalkingRef.current) {
      let recording = null;
      let uri = null;

      try {
        // ── RECORD PHASE ──
        await setRecordMode();

        recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
          ...Audio.RecordingOptionsPresets.LOW_QUALITY,
          isMeteringEnabled: true,
        });
        recording.setOnRecordingStatusUpdate(onRecordingStatus);
        recording.setProgressUpdateInterval(100);
        await recording.startAsync();

        // Record for the full duration (or until PTT released)
        const dur = durationRef.current;
        const start = Date.now();
        while (isTalkingRef.current && Date.now() - start < dur) {
          await sleep(50);
        }

        await recording.stopAndUnloadAsync();
        uri = recording.getURI();
        recording = null;

        if (!uri) continue;

        // ── PLAYBACK PHASE ──
        // Switch to playback mode — releases recording session,
        // OS re-routes audio output to BT A2DP
        await setPlaybackMode();

        // Give BT a moment to re-establish the A2DP route
        await sleep(Platform.OS === 'ios' ? 100 : 80);

        if (!isTalkingRef.current) {
          // User released during the mode switch — play the last chunk anyway
          // so they hear the tail end of what they said
        }

        // Play the recorded audio through BT speaker
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true, volume: 1.0 }
        );
        currentSoundRef.current = sound;

        // Wait for playback to finish
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, dur + 1000);
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              clearTimeout(timeout);
              resolve();
            }
          });
        });

        // Clean up this sound
        try { await sound.unloadAsync(); } catch {}
        currentSoundRef.current = null;
        discardClip(uri);
      } catch (err) {
        if (recording) {
          try { await recording.stopAndUnloadAsync(); } catch {}
        }
        if (currentSoundRef.current) {
          try { await currentSoundRef.current.unloadAsync(); } catch {}
          currentSoundRef.current = null;
        }
        if (uri) discardClip(uri);
        if (isTalkingRef.current) {
          setError('Mic error — retrying...');
          await sleep(300);
          setError(null);
        }
      }
    }

    // End in playback mode so BT stays active for music
    try { await setPlaybackMode(); } catch {}
    setVoiceLevel(0);
  }, []);

  const changeDuration = useCallback((sec) => {
    setDurationSec(sec);
    durationRef.current = sec * 1000;
  }, []);

  const pressIn = useCallback(async () => {
    if (isTalkingRef.current) return;
    isTalkingRef.current = true;
    setIsTalking(true);
    setError(null);
    startLoop();
  }, [startLoop]);

  const pressOut = useCallback(() => {
    isTalkingRef.current = false;
    setIsTalking(false);
    setVoiceLevel(0);
  }, []);

  return {
    hasPermission,
    canAskAgain,
    requestPermission,
    isTalking,
    voiceLevel,
    error,
    pressIn,
    pressOut,
    durationSec,
    durationOptions: DURATION_OPTIONS,
    changeDuration,
  };
}
