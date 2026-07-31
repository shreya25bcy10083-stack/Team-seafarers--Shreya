import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * CareCompanion High-Priority Audio Synthesizer.
 *
 * Generates maximum loudness & priority audible medical reminder alarms with vibration.
 */

let nativeMedSound: Audio.Sound | null = null;
let audioCtx: AudioContext | null = null;
let alarmInterval: any = null;

export const playAlarmSound = async () => {
  try {
    if (Platform.OS !== 'web') {
      stopAlarmSound();
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      nativeMedSound = sound;
      return;
    }

    if (typeof window === 'undefined') return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
      const unlockAudio = () => {
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      };
      if (typeof window !== 'undefined') {
        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('touchstart', unlockAudio, { once: true });
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopAlarmSound();

    const ctx = audioCtx;
    if (!ctx) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600]);
      } catch (e) {}
    }

    const playChimeSequence = () => {
      const now = ctx.currentTime;
      const freqs = [880, 1046.5, 1318.5, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0.85, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.45);
      });
    };

    playChimeSequence();
    alarmInterval = setInterval(playChimeSequence, 1500);
  } catch (e) {
    console.log('[SoundHelper] Audio playback error:', e);
  }
};

export const stopAlarmSound = async () => {
  if (nativeMedSound) {
    try {
      await nativeMedSound.stopAsync();
      await nativeMedSound.unloadAsync();
    } catch (e) {}
    nativeMedSound = null;
  }
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch (e) {}
  }
};
