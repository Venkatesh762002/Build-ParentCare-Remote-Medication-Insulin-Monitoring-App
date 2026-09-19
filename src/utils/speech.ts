// Web Speech API Voice Utility for Tamil and English Text-to-Speech

export interface VoiceState {
  isSupported: boolean;
  isSpeaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
  tamilVoiceAvailable: boolean;
  lastError: string | null;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  if (cachedVoices.length > 0) return cachedVoices;
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    return cachedVoices;
  } catch (e) {
    console.warn('Speech synthesis voice retrieval failed:', e);
    return [];
  }
}

// Find appropriate Tamil voice or fallback to default
export function findTamilVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  // Try exact ta-IN or language starting with ta
  const exact = voices.find(v => v.lang.toLowerCase().includes('ta-in') || v.lang.toLowerCase() === 'ta');
  if (exact) return exact;
  const genericTa = voices.find(v => v.lang.toLowerCase().startsWith('ta'));
  if (genericTa) return genericTa;
  // Fallback to Indian English voice or general voice
  const inVoice = voices.find(v => v.lang.toLowerCase().includes('en-in'));
  if (inVoice) return inVoice;
  return null;
}

export function findEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  const enIn = voices.find(v => v.lang.toLowerCase().includes('en-in'));
  if (enIn) return enIn;
  const enUs = voices.find(v => v.lang.toLowerCase().includes('en-us') || v.lang.toLowerCase().startsWith('en'));
  if (enUs) return enUs;
  return voices[0] || null;
}

export function speakReminder(
  text: string, 
  lang: 'en' | 'ta' = 'en', 
  onStart?: () => void, 
  onEnd?: () => void, 
  onError?: (err: string) => void
): boolean {
  if (!isSpeechSupported()) {
    if (onError) onError('Speech synthesis not supported in this browser.');
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = lang === 'ta' ? 0.85 : 0.9; // Slightly slower for elderly comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (lang === 'ta') {
      utterance.lang = 'ta-IN';
      const taVoice = findTamilVoice();
      if (taVoice) {
        utterance.voice = taVoice;
      }
    } else {
      utterance.lang = 'en-US';
      const enVoice = findEnglishVoice();
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (onError) onError(e.error || 'Audio playback interrupted');
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('Failed to initiate speech:', error);
    if (onError) onError('Could not play voice reminder.');
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Speech cancellation error:', e);
    }
  }
}
