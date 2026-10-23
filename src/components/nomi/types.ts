// NIHOMI.COM — NOMI COMPANION TYPES & STATE CONSTITUTION v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

export type NomiState =
  | 'idle'
  | 'attentive'
  | 'opening'
  | 'listening'
  | 'thinking'
  | 'responding'
  | 'guiding'
  | 'encouraging'
  | 'celebrating'
  | 'supportive'
  | 'hint'
  | 'waiting'
  | 'error'
  | 'offline'
  | 'reduced_motion';

export type NomiEvent =
  | 'COMPANION_OPENED'
  | 'COMPANION_CLOSED'
  | 'MESSAGE_SUBMITTED'
  | 'AI_REQUEST_STARTED'
  | 'AI_RESPONSE_RECEIVED'
  | 'AI_REQUEST_TIMEOUT'
  | 'HINT_REQUESTED'
  | 'TASK_FAILED'
  | 'NETWORK_ERROR'
  | 'EVIDENCE_RECORDED'
  | 'MASTERY_CONFIRMED'
  | 'TAB_HIDDEN'
  | 'REDUCED_MOTION_ENABLED';

export type NomiRouteFamily = 'public' | 'learner' | 'workos' | 'founder';

export interface NomiPronunciationFeedback {
  score: number;
  accuracyGrade: 'S' | 'A' | 'B' | 'C';
  pitchAccuracy: string;
  moraRhythm: string;
  detectedText: string;
  feedbackBn: string;
}

export interface NomiMessage {
  id: string;
  sender: 'learner' | 'nomi' | 'system';
  text: string;
  audioPhrase?: string;
  romaji?: string;
  bengaliTranslation?: string;
  isVoiceInput?: boolean;
  pronunciationFeedback?: NomiPronunciationFeedback;
  timestamp: number;
  stateSnapshot?: NomiState;
}

export interface NomiRouteConfig {
  family: NomiRouteFamily;
  viewName: string;
  titleBn: string;
  greetingBn: string;
  quickPrompts: { labelBn: string; query: string }[];
  soundEnabled?: boolean;
}

export interface NomiContextState {
  currentView: string;
  lessonId?: string;
  activeConcept?: {
    symbol?: string;
    reading?: string;
    meaningBn?: string;
  };
  hasMicPermission?: boolean;
}

export const NOMI_STATE_ASSETS: Record<NomiState, string> = {
  idle: '/brand/nomi-sensei/nomi-sensei-primary.png',
  attentive: '/brand/nomi/nomi-listen.png',
  opening: '/brand/nomi-sensei/nomi-sensei-primary.png',
  listening: '/brand/nomi/nomi-listen.png',
  thinking: '/brand/nomi/nomi-think.png',
  responding: '/brand/nomi/nomi-think.png',
  guiding: '/brand/nomi/nomi-guide.png',
  encouraging: '/brand/nomi/nomi-encourage.png',
  celebrating: '/brand/nomi/nomi-celebrate.png',
  supportive: '/brand/nomi/nomi-encourage.png',
  hint: '/brand/nomi/nomi-guide.png',
  waiting: '/brand/nomi-sensei/nomi-sensei-primary.png',
  error: '/brand/nomi/nomi-guide.png',
  offline: '/brand/nomi/nomi-think.png',
  reduced_motion: '/brand/nomi-sensei/nomi-sensei-primary.png'
};
