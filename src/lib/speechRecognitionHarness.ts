// src/lib/speechRecognitionHarness.ts
// NIHOMI Fault-Tolerant Speech Recognition & Audio Fallback Harness
// Governed by Law 3: Fail Safely & Resilient Client Degradation

export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'permission_denied'
  | 'unsupported'
  | 'error';

export type SpeechErrorCode =
  | 'permission_denied'
  | 'not_supported'
  | 'network'
  | 'no_speech'
  | 'aborted'
  | 'unknown';

export interface SpeechSessionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMsg: string, code: SpeechErrorCode) => void;
  onEnd?: () => void;
}

export interface SpeechController {
  stop: () => void;
  isListening: () => boolean;
  getStatus: () => SpeechRecognitionStatus;
}

/**
 * Checks if Web Speech Recognition is natively supported in the current environment
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

/**
 * Safely starts a speech recognition session with graceful error containment
 * Never throws unhandled runtime exceptions or crashes the UI
 */
export function startResilientSpeechRecognition(options: SpeechSessionOptions): SpeechController {
  let status: SpeechRecognitionStatus = 'idle';
  let recognitionInstance: any = null;
  let active = false;

  if (!isSpeechRecognitionSupported()) {
    status = 'unsupported';
    options.onError?.(
      'এই ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়। বাটন ক্লিকের মাধ্যমে অনুশীলন চালিয়ে যান।',
      'not_supported'
    );
    return {
      stop: () => {},
      isListening: () => false,
      getStatus: () => 'unsupported'
    };
  }

  try {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionInstance = new SpeechRecognitionClass();
    recognitionInstance.lang = options.lang || 'ja-JP';
    recognitionInstance.continuous = options.continuous ?? false;
    recognitionInstance.interimResults = options.interimResults ?? false;
    recognitionInstance.maxAlternatives = 3;

    recognitionInstance.onstart = () => {
      active = true;
      status = 'listening';
      options.onStart?.();
    };

    recognitionInstance.onresult = (event: any) => {
      status = 'processing';
      if (!event.results || event.results.length === 0) return;

      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0]?.transcript?.trim() || '';
      const isFinal = Boolean(lastResult.isFinal);

      if (transcript) {
        options.onResult?.(transcript, isFinal);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      const errorStr = event.error || 'unknown';
      let code: SpeechErrorCode = 'unknown';
      let friendlyMsg = 'ভয়েস রিকগনিশনে সমস্যা হয়েছে। বাটন ক্লিকের মাধ্যমে কাজ সম্পন্ন করুন।';

      if (errorStr === 'not-allowed' || errorStr === 'permission-denied') {
        code = 'permission_denied';
        status = 'permission_denied';
        friendlyMsg = 'মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি (Permission Denied)। অনুগ্রহ করে বাটন চাপুন।';
      } else if (errorStr === 'no-speech') {
        code = 'no_speech';
        friendlyMsg = 'কোনো কথা শনাক্ত করা যায়নি। পুনরায় স্পষ্ট করে বলুন।';
      } else if (errorStr === 'network') {
        code = 'network';
        friendlyMsg = 'নেটওয়ার্ক সংযোগে বিলম্ব বা বিভ্রাট।';
      } else if (errorStr === 'aborted') {
        code = 'aborted';
        friendlyMsg = 'ভয়েস ইনপুট থামানো হয়েছে।';
      }

      options.onError?.(friendlyMsg, code);
    };

    recognitionInstance.onend = () => {
      active = false;
      if (status === 'listening' || status === 'processing') {
        status = 'idle';
      }
      options.onEnd?.();
    };

    recognitionInstance.start();
  } catch (err: any) {
    status = 'error';
    active = false;
    options.onError?.('ভয়েস সার্ভিস আরম্ভ করতে ব্যর্থ হয়েছে। বাটন ব্যবহার করুন।', 'unknown');
  }

  return {
    stop: () => {
      active = false;
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch {
          try {
            recognitionInstance.abort();
          } catch {}
        }
      }
      status = 'idle';
    },
    isListening: () => active,
    getStatus: () => status
  };
}

/**
 * Normalizes Japanese text or Romaji for robust matching
 */
export function normalizeJapaneseSpeech(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[！!？?。、.,\s]/g, '')
    .trim();
}

/**
 * Romaji-to-Kana phoneme equivalence dictionary for beginner speech tolerances
 */
const PHONETIC_MAPPINGS: Record<string, string[]> = {
  いらっしゃいませ: ['irasshaimase', 'irashaimase', 'irasshai', 'irashai', 'rasshaimase', 'いらっしゃい'],
  ありがとうございます: ['arigatougozaimasu', 'arigatogozaimasu', 'arigatou', 'arigato', 'domoarigatou'],
  ありがとうございました: ['arigatougozaimashita', 'arigatogozaimashita', 'arigatou', 'arigato'],
  おねがいします: ['onegaishimasu', 'onegai', 'onegashimasu', 'お願いします'],
  はい: ['hai', 'ha-i'],
  いいえ: ['iie', 'ie', 'i-e']
};

/**
 * Fuzzy matches spoken user speech against target Japanese phrases
 */
export function matchJapaneseGreeting(spokenText: string, targetPhrases: string[]): boolean {
  if (!spokenText || targetPhrases.length === 0) return false;

  const normalizedSpoken = normalizeJapaneseSpeech(spokenText);

  for (const target of targetPhrases) {
    const normalizedTarget = normalizeJapaneseSpeech(target);

    // 1. Direct substring or exact match
    if (normalizedSpoken.includes(normalizedTarget) || normalizedTarget.includes(normalizedSpoken)) {
      return true;
    }

    // 2. Romaji & Phonetic dictionary tolerance
    const aliases = PHONETIC_MAPPINGS[target] || PHONETIC_MAPPINGS[normalizedTarget] || [];
    for (const alias of aliases) {
      const normalizedAlias = normalizeJapaneseSpeech(alias);
      if (normalizedSpoken.includes(normalizedAlias) || normalizedAlias.includes(normalizedSpoken)) {
        return true;
      }
    }
  }

  return false;
}
