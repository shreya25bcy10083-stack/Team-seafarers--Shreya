/**
 * CareCompanion High-Priority Web Audio Synthesizer.
 *
 * Generates maximum loudness & priority audible medical reminder alarms with vibration.
 */

let audioCtx: AudioContext | null = null;
let alarmInterval: any = null;

export const playAlarmSound = () => {
  if (typeof window === 'undefined') return;

  try {
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

    // Trigger high-priority vibration on supported mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600]);
      } catch (e) {}
    }

    const playChimeSequence = () => {
      const now = ctx.currentTime;

      // High-volume 4-note medical alert chime (A5, C6, E6, A6)
      const freqs = [880, 1046.5, 1318.5, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Richer, louder harmonic sound
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        // Maximum safe volume gain (0.85)
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

export const stopAlarmSound = () => {
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
