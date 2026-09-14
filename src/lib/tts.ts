/**
 * NIHOMI RESILIENT TOKYO NATIVE JAPANESE AUDIO & TTS ENGINE
 * Provides high-fidelity Web Speech API synthesis strictly prioritizing authentic Tokyo voices:
 * Google 日本語, Kyoko, Otoya, Nanami with automatic HTML5 streaming audio fallback.
 */

// Active utterance retention pool to prevent Chromium/Android GC bug
const activeUtterances = new Set<SpeechSynthesisUtterance>();
let activeFallbackAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voice cache early
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {}
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

/**
 * Selects the highest fidelity Tokyo native Japanese voice available on the platform.
 * Priority: Google 日本語 > Kyoko > Otoya > Nanami > Ayumi / Haruka > ja-JP
 */
export function selectTokyoNativeVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Strict priority ranking for authentic Tokyo native articulation
  const priorityPatterns = [
    /google\s*日本語/i,
    /google\s*japanese/i,
    /kyoko/i,
    /otoya/i,
    /nanami/i,
    /ayumi/i,
    /haruka/i,
    /sayaka/i,
    /ichiro/i,
    /shizuka/i,
  ];

  for (const pattern of priorityPatterns) {
    const matched = voices.find(
      (v) => pattern.test(v.name) && (v.lang.startsWith('ja') || v.lang.includes('JP'))
    );
    if (matched) return matched;
  }

  // Exact ja-JP match
  const exactJa = voices.find((v) => v.lang === 'ja-JP' || v.lang === 'ja_JP');
  if (exactJa) return exactJa;

  // Generic Japanese fallback
  return voices.find((v) => v.lang.startsWith('ja') || v.name.toLowerCase().includes('japanese')) || null;
}

/**
 * Fallback to HTML5 audio using lightweight Google TTS streaming when Web Speech is unavailable
 */
function playFallbackAudio(
  cleanText: string,
  options?: {
    rate?: number;
    onEnd?: () => void;
    onError?: () => void;
  }
): void {
  try {
    if (activeFallbackAudio) {
      activeFallbackAudio.pause();
      activeFallbackAudio.currentTime = 0;
      activeFallbackAudio = null;
    }

    // Check if network is offline on mobile to prevent failed fetch stalls
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
      activeFallbackAudio = null;
      options?.onError?.();
      return;
    }

    // Google Translate low-latency lightweight Tokyo Japanese audio stream
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(
      cleanText
    )}`;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = audioUrl;
    activeFallbackAudio = audio;

    if (options?.rate && options.rate !== 1.0) {
      try {
        audio.playbackRate = options.rate;
      } catch {}
    }

    audio.onended = () => {
      activeFallbackAudio = null;
      options?.onEnd?.();
    };

    audio.onerror = (e) => {
      console.warn('[TTS] Audio stream fallback error caught cleanly:', e);
      activeFallbackAudio = null;
      options?.onError?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined && typeof playPromise.catch === 'function') {
      playPromise.catch((err) => {
        console.warn('[TTS] Audio play promise handled cleanly without freezing UI:', err);
        activeFallbackAudio = null;
        options?.onError?.();
      });
    }
  } catch (err) {
    console.warn('[TTS] Fallback audio exception handled cleanly:', err);
    activeFallbackAudio = null;
    options?.onError?.();
  }
}

/**
 * Speaks Japanese text using Web Speech API with automatic HTML5 fallback.
 * Tuning: default rate: 0.9 (optimal for beginners), pitch: 1.0 (natural pitch).
 */
export function speakJapanese(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onError?: () => void;
  }
): void {
  if (!text || typeof text !== 'string') {
    options?.onEnd?.();
    return;
  }

  // Strip furigana markup or brackets like "食べる（たべる）" -> "食べる"
  const cleanText = text.replace(/（[^）]+）|\([^\)]+\)/g, '').trim();
  if (!cleanText) {
    options?.onEnd?.();
    return;
  }

  // If Web Speech is completely unsupported, use HTML5 audio directly
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playFallbackAudio(cleanText, options);
    return;
  }

  try {
    // Halt any active speech or fallback audio
    stopJapaneseSpeech();

    // If synthesis is paused, resume it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1.0;

    // Strictly select the best Tokyo native Japanese voice
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const nativeVoice = selectTokyoNativeVoice(voices);

    if (nativeVoice) {
      utterance.voice = nativeVoice;
    }

    let completed = false;

    // Protect utterance from garbage collection
    activeUtterances.add(utterance);

    utterance.onend = () => {
      if (!completed) {
        completed = true;
        activeUtterances.delete(utterance);
        options?.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      activeUtterances.delete(utterance);
      if (!completed) {
        completed = true;
        console.warn('[TTS] Web Speech error, falling back seamlessly to Google TTS audio proxy:', e);
        playFallbackAudio(cleanText, options);
      }
    };

    window.speechSynthesis.speak(utterance);

    // Timeout safety fallback: If speech synthesis hangs on mobile without firing onend
    const estimatedDurationMs = Math.max(1500, (cleanText.length / 4) * 1000 * (1 / (options?.rate || 0.9)));
    setTimeout(() => {
      if (activeUtterances.has(utterance)) {
        activeUtterances.delete(utterance);
        if (!completed) {
          completed = true;
          try {
            options?.onEnd?.();
          } catch {}
        }
      }
    }, estimatedDurationMs + 4000);
  } catch (err) {
    console.warn('[TTS] Web Speech exception, switching to Google TTS audio stream proxy:', err);
    playFallbackAudio(cleanText, options);
  }
}

/**
 * Halts all active audio and speech synthesis.
 */
export function stopJapaneseSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  activeUtterances.clear();

  if (activeFallbackAudio) {
    try {
      activeFallbackAudio.pause();
      activeFallbackAudio.currentTime = 0;
    } catch {}
    activeFallbackAudio = null;
  }
}

/**
 * Extracts Japanese segments (Kanji, Hiragana, Katakana) from mixed Bengali/English text.
 */
export function extractJapanesePhrases(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\u3000-\u303f]+/g);
  return matches || [];
}
