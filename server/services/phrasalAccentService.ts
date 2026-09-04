import {
  PitchAccentPattern,
  GrammaticalParticle,
  PhrasalSandhiRule,
  PhrasalPreviewInput,
  PhrasalPitchPreview,
  TokyoPitchDrill
} from '../types.js';
import { db } from '../db.js';

interface ParticleMeta {
  particle: string;
  romaji: string;
  meaningBn: string;
  functionEn: string;
  moraCount: number;
  morae: string[];
}

const PARTICLE_REGISTRY: Record<string, ParticleMeta> = {
  'が': {
    particle: 'が',
    romaji: 'ga',
    meaningBn: 'কর্তা / সাবজেক্ট নির্দেশক (Subject Marker)',
    functionEn: 'Nominative Subject Marker',
    moraCount: 1,
    morae: ['が']
  },
  'は': {
    particle: 'は',
    romaji: 'wa',
    meaningBn: 'প্রসঙ্গ / টপিক নির্দেশক (Topic Marker)',
    functionEn: 'Topic Marker',
    moraCount: 1,
    morae: ['は']
  },
  'を': {
    particle: 'を',
    romaji: 'o',
    meaningBn: 'কর্ম / অবজেক্ট নির্দেশক (Direct Object Marker)',
    functionEn: 'Accusative Object Marker',
    moraCount: 1,
    morae: ['を']
  },
  'に': {
    particle: 'に',
    romaji: 'ni',
    meaningBn: 'স্থান / সময় / লক্ষ্য নির্দেশক (Direction/Time/Indirect Object)',
    functionEn: 'Dative/Locative Marker',
    moraCount: 1,
    morae: ['に']
  },
  'で': {
    particle: 'で',
    romaji: 'de',
    meaningBn: 'স্থান / মাধ্যম / উপকরণ নির্দেশক (Location of Action/Means)',
    functionEn: 'Instrumental/Locative Marker',
    moraCount: 1,
    morae: ['で']
  },
  'の': {
    particle: 'の',
    romaji: 'no',
    meaningBn: 'সম্বন্ধ / র বা এর নির্দেশক (Possessive/Genitive Marker)',
    functionEn: 'Genitive Possessive Marker',
    moraCount: 1,
    morae: ['の']
  },
  'から': {
    particle: 'から',
    romaji: 'kara',
    meaningBn: 'হতে / থেকে নির্দেশক (Source/Origin Marker)',
    functionEn: 'Ablative Marker',
    moraCount: 2,
    morae: ['か', 'ら']
  },
  'まで': {
    particle: 'まで',
    romaji: 'made',
    meaningBn: 'পর্যন্ত নির্দেশক (Limit/Goal Marker)',
    functionEn: 'Terminative Marker',
    moraCount: 2,
    morae: ['ま', 'で']
  }
};

export class PhrasalAccentService {
  public static readonly HIGH_PITCH_HZ = 290;
  public static readonly LOW_PITCH_HZ = 210;
  public static readonly CATATHESIS_LOW_HZ = 200;

  /**
   * Decomposes Japanese kana text into discrete phonological morae.
   * Properly combines digraphs (しゃ, きょ, etc.) and handles geminates/long vowels.
   */
  public static decomposeMorae(text: string): string[] {
    if (!text) return [];
    const clean = text.replace(/[\s\u3000。、！？!?,.\-]/g, '');
    const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゎ', 'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ヮ']);
    const morae: string[] = [];

    let i = 0;
    while (i < clean.length) {
      const char = clean[i];
      const next = clean[i + 1];
      if (next && smallKana.has(next)) {
        morae.push(char + next);
        i += 2;
      } else {
        morae.push(char);
        i += 1;
      }
    }
    return morae.length > 0 ? morae : [text];
  }

  /**
   * Retrieves or builds particle metadata.
   */
  public static getParticleMeta(rawParticle: string): ParticleMeta {
    const clean = rawParticle.trim();
    if (PARTICLE_REGISTRY[clean]) {
      return PARTICLE_REGISTRY[clean];
    }
    const morae = this.decomposeMorae(clean);
    return {
      particle: clean,
      romaji: clean,
      meaningBn: 'ব্যাকরণগত পার্টিকেল (Grammatical Particle)',
      functionEn: 'Grammatical Particle',
      moraCount: morae.length,
      morae
    };
  }

  /**
   * Computes Unified Phrasal Target Pitch Contour with Particle Sandhi.
   */
  public static computePhrasalPitchContour(input: PhrasalPreviewInput): PhrasalPitchPreview {
    return this.computePhrasalPreview(input);
  }

  public static computePhrasalPreview(input: PhrasalPreviewInput): PhrasalPitchPreview {
    let baseDrill: TokyoPitchDrill | null = null;
    if (input.drillId) {
      baseDrill = db.getPitchDrillById(input.drillId);
    }

    const word = (input.word || (baseDrill ? baseDrill.kanji : '言葉')).trim();
    const readingKana = (input.readingKana || (baseDrill ? baseDrill.readingKana : word)).trim();
    const romaji = (input.romaji || (baseDrill ? baseDrill.romaji : '')).trim();
    const pattern: PitchAccentPattern = input.pattern || (baseDrill ? baseDrill.pattern : 'heiban');
    const wordMorae = this.decomposeMorae(readingKana);
    const wordMoraCount = wordMorae.length;

    // Resolve word downstep locus
    let wordDownstepMora = 0;
    if (typeof input.downstepMora === 'number') {
      wordDownstepMora = input.downstepMora;
    } else if (baseDrill && typeof baseDrill.downstepMora === 'number') {
      wordDownstepMora = baseDrill.downstepMora;
    } else {
      if (pattern === 'heiban') wordDownstepMora = 0;
      else if (pattern === 'atamadaka') wordDownstepMora = 1;
      else if (pattern === 'odaka') wordDownstepMora = wordMoraCount;
      else if (pattern === 'nakadaka') wordDownstepMora = Math.max(2, Math.floor(wordMoraCount / 2));
    }

    const particleMeta = this.getParticleMeta(input.particle || 'が');
    const particleMorae = particleMeta.morae;
    const particleMoraCount = particleMorae.length;

    // Combined word + particle morae
    const combinedMorae = [...wordMorae, ...particleMorae];
    const totalMoraCount = combinedMorae.length;

    // Apply Tokyo Sandhi Rules
    const targetPitches: ('H' | 'L')[] = [];
    let sandhiRule: PhrasalSandhiRule;
    let downstepMora = 0;
    let hasDownstepAtParticleBoundary = false;
    let downstepExplanationBn = '';
    let downstepExplanationEn = '';
    let contrastTipBn = '';

    if (pattern === 'heiban') {
      // 平板 (Heiban ⓪):
      // Word: L H H ... H
      // Rule: High pitch propagates through the particle without any drop.
      sandhiRule = 'heiban_high_propagation';
      downstepMora = 0;
      hasDownstepAtParticleBoundary = false;

      for (let i = 0; i < totalMoraCount; i++) {
        if (i === 0 && wordMoraCount > 1) {
          targetPitches.push('L');
        } else {
          targetPitches.push('H');
        }
      }

      downstepExplanationBn = `平板型 (Heiban ⓪) শব্দে কোনো সুরের পতন (Downstep) নেই। পার্টিকেল '${particleMeta.particle}' যুক্ত হলেও হাই পিচ (H) সমতলভাবে বজায় থাকে (L-H-H...)। পার্টিকেলে সুর নামাবেন না বা চিৎকার করবেন না।`;
      downstepExplanationEn = `Heiban (⓪) has no lexical downstep. High pitch propagates continuously across the particle '${particleMeta.particle}' without dropping.`;
      contrastTipBn = `Heiban ও Odaka শব্দ একা বললে একই রকম (L-H) শোনায়, কিন্তু '${particleMeta.particle}' পার্টিকেল যোগ করলে Heiban-এ সুর সবসময় উঁচু থাকবে (L-H-H)।`;

    } else if (pattern === 'odaka') {
      // 尾高 (Odaka N):
      // Word: L H H ... H (drop on final mora N)
      // Rule: Explicit downstep drop occurs right at the boundary! Particle is Low (L).
      sandhiRule = 'odaka_boundary_drop';
      downstepMora = wordMoraCount;
      hasDownstepAtParticleBoundary = true;

      for (let i = 0; i < totalMoraCount; i++) {
        if (i === 0 && wordMoraCount > 1) {
          targetPitches.push('L');
        } else if (i < wordMoraCount) {
          targetPitches.push('H');
        } else {
          // Particle and beyond is LOW
          targetPitches.push('L');
        }
      }

      downstepExplanationBn = `尾高型 (Odaka ${wordMoraCount}) শব্দে শব্দের শেষ মোরায় ডাউনস্টেপ কার্নেল থাকে। ফলে শব্দ শেষ হয়ে পার্টিকেল '${particleMeta.particle}' শুরু হওয়ামাত্রই সুর খাড়াভাবে নিচে নেমে যায় (L-H-L)। পার্টিকেলে জোর দেওয়ার বদলে সুর নামান।`;
      downstepExplanationEn = `Odaka has its downstep on the final mora. The pitch drops precipitously right at the boundary into the particle '${particleMeta.particle}'.`;
      contrastTipBn = `বাঙালি শিক্ষার্থীদের সবচেয়ে বড় ভুল হলো ওদাকা পার্টিকেলে জোরে চিৎকার করা (Dynamic Stress)। এখানে ভলিউম না বাড়িয়ে কেবল সুরের পিচ নিচে নামান (F0 Drop)।`;

    } else if (pattern === 'atamadaka') {
      // 頭高 (Atamadaka ①):
      // Word: H L L ... L (drop on mora 1)
      // Rule: Particle remains LOW due to catathesis / downstep propagation.
      sandhiRule = 'atamadaka_catathesis_propagation';
      downstepMora = 1;
      hasDownstepAtParticleBoundary = false;

      for (let i = 0; i < totalMoraCount; i++) {
        if (i === 0) {
          targetPitches.push('H');
        } else {
          targetPitches.push('L');
        }
      }

      downstepExplanationBn = `頭高型 (Atamadaka ①) শব্দে ১ম মোরাতেই সুর উঁচু হয়ে সাথে সাথে নেমে যায় (H-L...)। পার্টিকেল '${particleMeta.particle}' স্বাভাবিকভাবেই লো পিচে (L) থাকবে।`;
      downstepExplanationEn = `Atamadaka (①) drops after the first mora. Catathesis keeps all subsequent morae and particle '${particleMeta.particle}' at a low baseline.`;
      contrastTipBn = `প্রথম মোরাটি উঁচু সুরে শুরু করে অবিলম্বে সুর নামিয়ে দিন। এরপর পার্টিকেল পর্যন্ত সুর নিচু ও শান্ত রাখুন।`;

    } else {
      // 中高 (Nakadaka k):
      // Word: L H ... H(k) L ... L
      // Rule: Downstep already occurred at mora k, so particle remains LOW.
      sandhiRule = 'nakadaka_catathesis_propagation';
      downstepMora = wordDownstepMora > 0 ? wordDownstepMora : Math.max(2, Math.floor(wordMoraCount / 2));
      hasDownstepAtParticleBoundary = false;

      for (let i = 0; i < totalMoraCount; i++) {
        if (i === 0 && wordMoraCount > 1) {
          targetPitches.push('L');
        } else if (i < downstepMora) {
          targetPitches.push('H');
        } else {
          targetPitches.push('L');
        }
      }

      downstepExplanationBn = `中高型 (Nakadaka ⓪${downstepMora}) শব্দে ${downstepMora}তম মোরায় সুরের পতন ঘটে। তাই পরবর্তী সকল মোরা এবং পার্টিকেল '${particleMeta.particle}' লো পিচে (L) স্থির থাকবে।`;
      downstepExplanationEn = `Nakadaka drops on mora ${downstepMora}. The particle '${particleMeta.particle}' remains low following the post-accentual catathesis.`;
      contrastTipBn = `${downstepMora}তম মোরা পর্যন্ত সুর তুলুন, তারপর আকস্মিকভাবে নিচে নামিয়ে পার্টিকেল শান্ত রাখুন।`;
    }

    // Compute standard acoustic contours (Hz & Relative ratios)
    const relativeContour: number[] = [];
    const standardHzContour: number[] = [];
    const targetIntensityEnvelope: number[] = [];

    for (let m = 0; m < totalMoraCount; m++) {
      const pitch = targetPitches[m];
      const isPastDownstep = downstepMora > 0 && m >= downstepMora;
      
      const hz = pitch === 'H' 
        ? this.HIGH_PITCH_HZ 
        : isPastDownstep 
          ? this.CATATHESIS_LOW_HZ 
          : this.LOW_PITCH_HZ;

      const rel = pitch === 'H' ? 1.28 : isPastDownstep ? 0.95 : 1.0;

      // 20 interpolation points per mora for smooth high-resolution SVG curves
      for (let pt = 0; pt < 20; pt++) {
        relativeContour.push(Number(rel.toFixed(3)));
        standardHzContour.push(Math.round(hz));
        // Flat, uniform intensity characteristic of mora-timed Japanese
        targetIntensityEnvelope.push(0.78);
      }
    }

    const phraseKanji = `${word}${particleMeta.particle}`;
    const phraseKana = `${readingKana}${particleMeta.particle}`;
    const phraseRomaji = romaji ? `${romaji}-${particleMeta.romaji}` : phraseKana;

    return {
      word,
      readingKana,
      romaji,
      pattern,
      wordDownstepMora,
      particle: particleMeta.particle,
      particleRomaji: particleMeta.romaji,
      particleMeaningBn: particleMeta.meaningBn,
      particleFunctionEn: particleMeta.functionEn,
      phraseKanji,
      phraseKana,
      phraseRomaji,
      wordMoraCount,
      particleMoraCount,
      totalMoraCount,
      morae: combinedMorae,
      targetPitches,
      downstepMora,
      hasDownstepAtParticleBoundary,
      sandhiRule,
      downstepExplanationBn,
      downstepExplanationEn,
      relativeContour,
      standardHzContour,
      targetIntensityEnvelope,
      contrastTipBn
    };
  }
}
