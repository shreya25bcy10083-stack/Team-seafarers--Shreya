/**
 * CareCompanion Speech Helper (STT & TTS).
 *
 * Provides two-way voice interaction using Web Speech API with Speech Recognition
 * and Text-To-Speech (TTS) audio playback.
 */

let recognition: any = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const isSpeechSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hasSTT = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const hasTTS = 'speechSynthesis' in window;
  return hasSTT && hasTTS;
};

export const startListening = (
  onResult: (transcript: string, isFinal: boolean) => void,
  onError?: (errorMsg: string) => void
): boolean => {
  if (typeof window === 'undefined') return false;

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return false;
  }

  try {
    if (recognition) {
      recognition.abort();
    }

    recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        onResult(text, !!finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.log('[SpeechHelper] STT error:', event.error);
      if (onError && event.error !== 'no-speech') {
        onError(`Voice error: ${event.error}`);
      }
    };

    recognition.start();
    return true;
  } catch (e: any) {
    console.error('[SpeechHelper] STT Exception:', e);
    if (onError) onError('Failed to start voice recognition.');
    return false;
  }
};

export const stopListening = () => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {}
    recognition = null;
  }
};

export const speakText = (text: string, onStart?: () => void, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any active speech

    // Clean markdown asterisks or formatting before speaking
    const cleanText = text.replace(/[\*\_#`]/g, '').replace(/http\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Friendly conversational pace
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.log('[SpeechHelper] TTS error:', e);
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.log('[SpeechHelper] TTS Exception:', e);
    if (onEnd) onEnd();
  }
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};
