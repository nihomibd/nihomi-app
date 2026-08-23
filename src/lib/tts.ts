// Utility to speak Japanese text using Web Speech API with rate & callback support
export function speakJapanese(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onError?: () => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    if (options?.onEnd) options.onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip furigana markup or brackets if present
  const cleanText = text.replace(/（[^）]+）|\([^\)]+\)/g, '').trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ja-JP';
  utterance.rate = options?.rate ?? 0.9;
  utterance.pitch = options?.pitch ?? 1.0;

  // Try to pick a native Japanese voice if available
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(
    (v) => v.lang.includes('ja') || v.lang.includes('JP') || v.name.toLowerCase().includes('japan')
  );
  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  if (options?.onEnd) {
    utterance.onend = () => {
      options.onEnd?.();
    };
  }

  if (options?.onError) {
    utterance.onerror = () => {
      options.onError?.();
    };
  }

  window.speechSynthesis.speak(utterance);
}

export function stopJapaneseSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
