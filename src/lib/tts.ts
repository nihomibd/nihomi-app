// Utility to speak Japanese text using Web Speech API
export function speakJapanese(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip furigana markup or brackets if present
  const cleanText = text.replace(/（[^）]+）|\([^\)]+\)/g, '').trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9; // Slightly slower for crisp language learning clarity
  utterance.pitch = 1.0;

  // Try to pick a native Japanese voice if available
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(
    (v) => v.lang.includes('ja') || v.lang.includes('JP') || v.name.toLowerCase().includes('japan')
  );
  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  window.speechSynthesis.speak(utterance);
}
