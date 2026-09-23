// src/components/canvas3d/engine/WorldInteractionLayer.ts
// NIHOMI REAL JAPAN CANVAS™ — CONTEXTUAL INTERACTION & LEARNING LAYER
// Manages Nihomi-owned interactive Points of Interest (POIs) anchored on top of the Real World Foundation.
// Connects in-world spatial proximity to Keigo dialogue, AI coaching, and MemoryOS learning loops.

import * as THREE from 'three';
import { MemoryOSEngine } from './MemoryOSEngine';

export interface WorldPOI {
  id: string;
  nameJa: string;
  nameEn: string;
  category: 'station' | 'conbini' | 'restaurant' | 'izakaya' | 'retail';
  position: THREE.Vector3;
  interactionRadius: number;
  promptText: string;
}

export const SHIBUYA_POIS: WorldPOI[] = [
  {
    id: 'conbini-7eleven',
    nameJa: '7-Eleven 渋谷宇田川町店',
    nameEn: '7-Eleven Shibuya Udagawacho',
    category: 'conbini',
    position: new THREE.Vector3(-14, 0.9, -6),
    interactionRadius: 5.0,
    promptText: "Press 'E' to Talk to Store Manager (店長 田中)"
  },
  {
    id: 'jr-shibuya-station',
    nameJa: 'JR 渋谷駅 ハチ公口',
    nameEn: 'JR Shibuya Station (Hachiko Exit)',
    category: 'station',
    position: new THREE.Vector3(0, 0.9, -35),
    interactionRadius: 6.0,
    promptText: "Press 'E' to Check Ticket Turnstiles & Yamanote Departures"
  },
  {
    id: 'ramen-ichiran',
    nameJa: '一蘭 渋谷店',
    nameEn: 'Ramen Ichiran Shibuya',
    category: 'restaurant',
    position: new THREE.Vector3(24, 0.9, 2),
    interactionRadius: 5.5,
    promptText: "Press 'E' to Order Tonkotsu Ramen in Japanese"
  },
  {
    id: 'izakaya-torikizoku',
    nameJa: '鳥貴族 渋谷井の頭通り店',
    nameEn: 'Izakaya Torikizoku Shibuya',
    category: 'izakaya',
    position: new THREE.Vector3(24, 0.9, -18),
    interactionRadius: 5.5,
    promptText: "Press 'E' to Practice Workplace Nomikai Etiquette"
  },
  {
    id: 'don-quijote',
    nameJa: 'MEGA ドン・キホーテ 渋谷本店',
    nameEn: 'MEGA Don Quijote Shibuya',
    category: 'retail',
    position: new THREE.Vector3(-20, 0.9, -22),
    interactionRadius: 6.0,
    promptText: "Press 'E' to Inquire about Tax-Free Shopping"
  }
];

export class WorldInteractionLayer {
  public pois: WorldPOI[] = SHIBUYA_POIS;

  /**
   * Checks for proximity to any registered POI from the player's current position
   */
  public checkProximity(playerPos: THREE.Vector3): WorldPOI | null {
    for (const poi of this.pois) {
      const dist = Math.hypot(playerPos.x - poi.position.x, playerPos.z - poi.position.z);
      if (dist <= poi.interactionRadius) {
        return poi;
      }
    }
    return null;
  }

  /**
   * Evaluates a conversational response and records the result to MemoryOS
   */
  public evaluateDialogueResponse(
    poi: WorldPOI,
    choiceId: string,
    chosenTextJa: string,
    isCorrectKeigo: boolean
  ): { xpGained: number; coinsGained: number; feedback: string } {
    let xpGained = 0;
    let coinsGained = 0;
    let feedback = '';

    if (isCorrectKeigo) {
      xpGained = 50;
      coinsGained = 25;
      feedback = 'Correct workplace Keigo applied! Polite tone acknowledged by conversational partner.';
    } else {
      xpGained = 10;
      coinsGained = 0;
      feedback = 'Informal phrasing detected. Recommended conversion to business Keigo (丁寧語).';
    }

    // Persist event to MemoryOS for spaced repetition review
    MemoryOSEngine.logInteraction({
      locationId: poi.id,
      locationName: poi.nameJa,
      targetRole: poi.category === 'conbini' ? 'Store Manager (店長)' : 'Staff Member',
      studentUtterance: chosenTextJa,
      isCorrectKeigo,
      keigoCategory: isCorrectKeigo ? 'teineigo' : 'casual',
      feedbackGiven: feedback,
      correctionPhrase: '「アルバイトの募集はありますか？」'
    });

    return { xpGained, coinsGained, feedback };
  }
}
