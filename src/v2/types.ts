// src/v2/types.ts
// NIHOMI V2 — UNIFIED TYPE CONTRACTS

export type V2Route =
  | 'landing'
  | 'journey'
  | 'dashboard'
  | 'kana'
  | 'curriculum'
  | 'lesson'
  | 'exam'
  | 'workos'
  | 'rirekisho'
  | 'pricing'
  | 'founder'
  | 'terms'
  | 'privacy'
  | 'refund'
  | 'legacy';

export interface V2NavigationParams {
  lessonId?: string;
  char?: string;
  examId?: string;
  scenarioId?: string;
  planId?: string;
  interval?: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
  certId?: string;
  [key: string]: any;
}

export interface V2User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'founder' | 'instructor';
  planId?: 'free' | 'starter' | 'pro' | 'japan_ready';
  subscriptionStatus?: string;
  streakDays?: number;
  xpPoints?: number;
  avatarUrl?: string;
}

export interface V2MissionRecommendation {
  missionId: string;
  titleBn: string;
  titleJa: string;
  descriptionBn: string;
  route: V2Route;
  params?: V2NavigationParams;
  badgeBn: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  stageIndex: number;
}
