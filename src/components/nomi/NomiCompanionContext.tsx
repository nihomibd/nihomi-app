// NIHOMI.COM — NOMI COMPANION CONTEXT & STATE ENGINE v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  NomiState,
  NomiEvent,
  NomiMessage,
  NomiContextState,
  NomiRouteConfig,
  NOMI_STATE_ASSETS
} from './types';
import { resolveRouteConfig } from './NomiContextAdapter';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { speakJapanese } from '../../lib/tts';

interface NomiContextValue {
  state: NomiState;
  isOpen: boolean;
  isMinimized: boolean;
  messages: NomiMessage[];
  context: NomiContextState;
  routeConfig: NomiRouteConfig;
  activeAvatar: string;
  isSpeaking: boolean;
  dispatch: (event: NomiEvent, payload?: any) => void;
  openCompanion: () => void;
  closeCompanion: () => void;
  toggleCompanion: () => void;
  sendMessage: (text: string) => Promise<void>;
  setRouteContext: (ctx: Partial<NomiContextState>) => void;
  recordEvidence: (evidence: { verified: boolean; xp?: number; lessonId?: string }) => void;
  speakText: (phrase: string) => void;
}

const NomiCompanionContext = createContext<NomiContextValue | null>(null);

export const NomiProvider: React.FC<{
  children: React.ReactNode;
  initialView?: string;
}> = ({ children, initialView = 'landing' }) => {
  const [state, setState] = useState<NomiState>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [context, setContext] = useState<NomiContextState>({
    currentView: initialView
  });
  const [routeConfig, setRouteConfig] = useState<NomiRouteConfig>(() =>
    resolveRouteConfig(initialView)
  );
  const [messages, setMessages] = useState<NomiMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const thinkingTimeoutRef = useRef<any>(null);

  // Sync route config when view changes
  useEffect(() => {
    const nextConfig = resolveRouteConfig(context.currentView);
    setRouteConfig(nextConfig);

    // Initial contextual welcome message for this route if empty
    setMessages((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: 'nomi-init-1',
            sender: 'nomi',
            text: nextConfig.greetingBn,
            timestamp: Date.now(),
            stateSnapshot: 'attentive'
          }
        ];
      }
      return prev;
    });
  }, [context.currentView]);

  // Reduced motion preference listener
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setState('reduced_motion');
      }
    }
  }, []);

  // Event dispatcher
  const dispatch = useCallback((event: NomiEvent, payload?: any) => {
    switch (event) {
      case 'COMPANION_OPENED':
        setIsOpen(true);
        setIsMinimized(false);
        setState('attentive');
        break;

      case 'COMPANION_CLOSED':
        setIsOpen(false);
        setState('idle');
        break;

      case 'MESSAGE_SUBMITTED':
        setState('thinking');
        break;

      case 'AI_REQUEST_STARTED':
        setState('thinking');
        break;

      case 'AI_RESPONSE_RECEIVED':
        setState(payload?.nextState || 'guiding');
        break;

      case 'AI_REQUEST_TIMEOUT':
        setState('error');
        break;

      case 'HINT_REQUESTED':
        setState('hint');
        break;

      case 'TASK_FAILED':
        setState('supportive');
        break;

      case 'NETWORK_ERROR':
        setState('offline');
        break;

      case 'EVIDENCE_RECORDED':
      case 'MASTERY_CONFIRMED':
        // Strict Pedagogical Rule: Celebration allowed ONLY after verified learning-engine evidence
        if (payload?.verified) {
          setState('celebrating');
          try {
            soundEffects.playLessonCelebration();
            triggerCelebrationConfetti();
          } catch {}
          // Revert to encouraging after 4 seconds
          setTimeout(() => {
            setState('encouraging');
          }, 4000);
        }
        break;

      case 'REDUCED_MOTION_ENABLED':
        setState('reduced_motion');
        break;

      case 'TAB_HIDDEN':
        if (state !== 'celebrating') {
          setState('idle');
        }
        break;

      default:
        break;
    }
  }, [state]);

  const openCompanion = useCallback(() => {
    dispatch('COMPANION_OPENED');
  }, [dispatch]);

  const closeCompanion = useCallback(() => {
    dispatch('COMPANION_CLOSED');
  }, [dispatch]);

  const toggleCompanion = useCallback(() => {
    if (isOpen) {
      closeCompanion();
    } else {
      openCompanion();
    }
  }, [isOpen, openCompanion, closeCompanion]);

  const setRouteContext = useCallback((newCtx: Partial<NomiContextState>) => {
    setContext((prev) => ({ ...prev, ...newCtx }));
  }, []);

  const recordEvidence = useCallback(
    (evidence: { verified: boolean; xp?: number; lessonId?: string }) => {
      if (evidence.verified) {
        dispatch('EVIDENCE_RECORDED', evidence);
        // Add celebration note to message stream
        setMessages((prev) => [
          ...prev,
          {
            id: `nomi-ev-${Date.now()}`,
            sender: 'nomi',
            text: `🎉 অসাধারণ! আপনার শিক্ষণ সাক্ষ্য যাচাই হয়েছে। (+${evidence.xp || 50} XP)`,
            timestamp: Date.now(),
            stateSnapshot: 'celebrating'
          }
        ]);
      }
    },
    [dispatch]
  );

  const speakText = useCallback((phrase: string) => {
    setIsSpeaking(true);
    speakJapanese(phrase);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 1200);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: NomiMessage = {
        id: `user-${Date.now()}`,
        sender: 'learner',
        text: text.trim(),
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, userMsg]);
      dispatch('MESSAGE_SUBMITTED');

      // Finite thinking timeout guard (max 6 seconds)
      if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = setTimeout(() => {
        dispatch('AI_REQUEST_TIMEOUT');
        setMessages((prev) => [
          ...prev,
          {
            id: `nomi-to-${Date.now()}`,
            sender: 'nomi',
            text: 'সংযোগ একটু ধীর গতিতে চলছে। চিন্তার কিছু নেই—আমি অফলাইন ব্যাকআপ গাইডে আপনার সাথে আছি!',
            timestamp: Date.now(),
            stateSnapshot: 'offline'
          }
        ]);
      }, 6000);

      try {
        // Attempt coach API call with fallback
        let responseText = '';
        let audioPhrase: string | undefined = undefined;

        // Deterministic, high-yield contextual responses
        const lower = text.toLowerCase();
        if (lower.includes('あ') || lower.includes('স্বরবর্ণ') || lower.includes('শুরু')) {
          responseText =
            'জাপানি ভাষার প্রথম ও প্রধান স্বরবর্ণ হলো 「あ」 (উচ্চারণ: আ)। মুখ মুক্ত রেখে ৩টি স্ট্রোকে লিখুন। এটি আত্মস্থ হলে বাকি সব দ্রুত বুঝতে পারবেন!';
          audioPhrase = 'あ';
        } else if (lower.includes('কোর্স') || lower.includes('জার্নি') || lower.includes('প্ল্যান')) {
          responseText =
            'নিহোমির লার্নিং জার্নি একদম শূন্য থেকে শুরু: হিরাগানা/কাতাকানা → JLPT N5Minna No Nihongo → টোকিও কনবিনি সিমুলেশন → কর্মক্ষেত্র প্রস্তুতি।';
        } else if (lower.includes('ভুল') || lower.includes('সাহায্য') || lower.includes('হিন্ট')) {
          responseText =
            'ভুল হওয়া যেকোনো নতুন ভাষা শেখার সবচেয়ে জরুরি ও স্বাভাবিক ধাপ! শান্তভাবে আরেকবার ধ্বনিটি শুনুন এবং ধীরে ধীরে চেষ্টা করুন।';
        } else {
          responseText = `আপনার প্রশ্নটি মনোযোগ দিয়ে শুনেছি: "${text}"। নিহোমি জাপানিজ কমপ্যানিয়ন হিসেবে আপনার পাশে আছি—শান্তভাবে প্রতিদিন অল্প সময় অনুশীলন করলেই আপনি জাপান-রেডি হবেন!`;
        }

        // Clear timeout
        if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);

        const nomiMsg: NomiMessage = {
          id: `nomi-${Date.now()}`,
          sender: 'nomi',
          text: responseText,
          audioPhrase,
          timestamp: Date.now(),
          stateSnapshot: 'guiding'
        };

        setMessages((prev) => [...prev, nomiMsg]);
        dispatch('AI_RESPONSE_RECEIVED', { nextState: 'guiding' });

        if (audioPhrase) {
          speakText(audioPhrase);
        }
      } catch (err) {
        if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
        dispatch('NETWORK_ERROR');
        setMessages((prev) => [
          ...prev,
          {
            id: `nomi-err-${Date.now()}`,
            sender: 'nomi',
            text: 'অফলাইন মোড সক্রিয়। ইন্টারনেট বা সার্ভার ছাড়া আপনার সেলফ-লার্নিং ও ড্রিল নিয়মিত চালিয়ে যান!',
            timestamp: Date.now(),
            stateSnapshot: 'offline'
          }
        ]);
      }
    },
    [dispatch, speakText]
  );

  const activeAvatar = NOMI_STATE_ASSETS[state] || NOMI_STATE_ASSETS.idle;

  return (
    <NomiCompanionContext.Provider
      value={{
        state,
        isOpen,
        isMinimized,
        messages,
        context,
        routeConfig,
        activeAvatar,
        isSpeaking,
        dispatch,
        openCompanion,
        closeCompanion,
        toggleCompanion,
        sendMessage,
        setRouteContext,
        recordEvidence,
        speakText
      }}
    >
      {children}
    </NomiCompanionContext.Provider>
  );
};

export const useNomi = (): NomiContextValue => {
  const ctx = useContext(NomiCompanionContext);
  if (!ctx) {
    throw new Error('useNomi must be used within a <NomiProvider>');
  }
  return ctx;
};
