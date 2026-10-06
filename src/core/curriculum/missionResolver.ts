// src/core/curriculum/missionResolver.ts
// Canonical Mission & Route Resolver — Nihomi Autonomous Learning OS
// Inviolable Law: Route ≠ Curriculum Progress.
// Only the Curriculum Graph & Learner Knowledge State determine executable content.

import { LearnerKnowledgeState, loadLearnerKnowledgeState } from './learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible, NextBestMission } from './journeyEngine';
import { CURRICULUM_GRAPH, CurriculumNode } from './curriculumGraph';

export interface MissionExecution {
  missionId: string;
  destination: string;
  viewRoute: string;
  viewParams: Record<string, any>;
  uiMode: 'canvas' | 'lesson' | 'quiz' | 'journey';
  targetChar?: string;
  targetContent?: string;
  titleBn: string;
  isFallback: boolean;
  reasonBn?: string;
}

/**
 * Maps a CurriculumNode into an executable MissionExecution contract.
 */
export function nodeToMissionExecution(node: CurriculumNode, isFallback = false, reasonBn?: string): MissionExecution {
  let uiMode: MissionExecution['uiMode'] = 'lesson';
  if (node.type === 'kana' || node.type === 'word_unlock' || node.type === 'mistake_repair') {
    uiMode = 'canvas';
  } else if (node.type === 'milestone_quiz') {
    uiMode = 'quiz';
  } else if (node.type === 'real_life') {
    uiMode = 'journey';
  }

  // Ensure viewParams always carries the target character for Kana canvas
  const params: Record<string, any> = { ...(node.viewParams || {}) };
  if (node.targetChar && !params.char) {
    params.char = node.targetChar;
  }

  return {
    missionId: node.id,
    destination: `${node.viewRoute}?${new URLSearchParams(params).toString()}`,
    viewRoute: node.viewRoute,
    viewParams: params,
    uiMode,
    targetChar: node.targetChar,
    targetContent: node.targetWord || node.targetChar,
    titleBn: node.titleBn,
    isFallback,
    reasonBn
  };
}

/**
 * Authoritatively resolves a learner route or requested mission.
 * Validates prerequisites before allowing access.
 * If unauthorized, safely diverts to the learner's true Next Best Mission.
 */
export function resolveLearnerMissionRoute(
  state: LearnerKnowledgeState,
  requestedRoute?: string,
  requestedParams?: Record<string, any>
): MissionExecution {
  const canonicalMission = getNextBestMission(state);

  // If no specific request, route directly to Canonical Next Best Mission
  if (!requestedRoute && !requestedParams) {
    return nodeToMissionExecution(canonicalMission);
  }

  const lessonId = requestedParams?.lessonId ? String(requestedParams.lessonId).toLowerCase().trim() : '';
  const charParam = requestedParams?.char ? String(requestedParams.char).trim() : '';

  // 1. Check Kana-specific navigation
  if (charParam) {
    // Check if the requested character's prerequisites are met
    const knownSet = new Set(state.knownHiragana);
    const VOWELS = ['あ', 'い', 'う', 'え', 'お'];

    if (VOWELS.includes(charParam)) {
      // Vowels: check vowel sequence prerequisites
      const charIndex = VOWELS.indexOf(charParam);
      const prevVowels = VOWELS.slice(0, charIndex);
      const allPrevKnown = prevVowels.every(v => knownSet.has(v));

      if (allPrevKnown) {
        const nodeId = `kana-${charParam === 'あ' ? 'a' : charParam === 'い' ? 'i' : charParam === 'う' ? 'u' : charParam === 'え' ? 'e' : 'o'}`;
        const node = CURRICULUM_GRAPH[nodeId] || canonicalMission;
        return nodeToMissionExecution(node);
      }
    } else if (charParam === 'か') {
      // 'か' requires all 5 vowels mastered and vowel gate passed
      const allVowelsMastered = VOWELS.every(v => knownSet.has(v));
      const hasPassedGate = state.masteredSkills.includes('vowels_5_mastered') ||
        state.masteredSkills.includes('5_vowels_gate') ||
        (typeof window !== 'undefined' && localStorage.getItem('nihomi_foundation_completed') === 'true');

      if (allVowelsMastered && hasPassedGate) {
        const kaNode = CURRICULUM_GRAPH['kana-ka-family'] || canonicalMission;
        return nodeToMissionExecution(kaNode);
      }
    }

    // Ineligible character request -> safely return canonical mission
    return nodeToMissionExecution(
      canonicalMission,
      true,
      `'${charParam}' বর্ণটি এখনো আনলক হয়নি। অনুগ্রহ করে আপনার নির্ধারিত মিশনটি সম্পন্ন করুন।`
    );
  }

  // 2. Check Grammar navigation (n5-l2 through n5-l25)
  const isGrammarLesson = /^n5-l([2-9]|1\d|2\d)/i.test(lessonId) || lessonId.includes('grammar');
  if (isGrammarLesson) {
    const grammarStatus = isGrammarEligible(state);
    if (!grammarStatus.eligible) {
      return nodeToMissionExecution(
        canonicalMission,
        true,
        grammarStatus.unmetReasonBn
      );
    }
  }

  // 3. If explicit canonical node ID requested in params
  if (requestedParams?.nodeId && CURRICULUM_GRAPH[requestedParams.nodeId]) {
    const node = CURRICULUM_GRAPH[requestedParams.nodeId];
    return nodeToMissionExecution(node);
  }

  // Default to canonical Next Best Mission
  return nodeToMissionExecution(canonicalMission);
}
