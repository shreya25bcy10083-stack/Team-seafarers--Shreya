import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * CareCompanion Emergency SOS Loud Siren Synthesizer.
 *
 * Generates a maximum priority & volume dual-tone emergency siren with continuous vibration.
 */

let nativeSirenSound: Audio.Sound | null = null;
let emergencyAudioCtx: AudioContext | null = null;
let sirenInterval: any = null;

export const playEmergencySiren = async () => {
  try {
    if (Platform.OS !== 'web') {
      stopEmergencySiren();
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      nativeSirenSound = sound;
      return;
    }

    if (typeof window === 'undefined') return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!emergencyAudioCtx) {
      emergencyAudioCtx = new AudioContextClass();
    }

    if (emergencyAudioCtx.state === 'suspended') {
      emergencyAudioCtx.resume();
    }

    stopEmergencySiren();

    const ctx = emergencyAudioCtx;
    if (!ctx) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([500, 100, 500, 100, 500, 100, 500, 100, 1000]);
      } catch (e) {}
    }

    let toggle = false;

    const playSirenBurst = () => {
      const now = ctx.currentTime;
      const freq = toggle ? 1200 : 600;
      toggle = !toggle;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    };

    playSirenBurst();
    sirenInterval = setInterval(playSirenBurst, 320);
  } catch (e) {
    console.log('[EmergencySound] Siren audio error:', e);
  }
};

export const stopEmergencySiren = async () => {
  if (nativeSirenSound) {
    try {
      await nativeSirenSound.stopAsync();
      await nativeSirenSound.unloadAsync();
    } catch (e) {}
    nativeSirenSound = null;
  }
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch (e) {}
  }
};
