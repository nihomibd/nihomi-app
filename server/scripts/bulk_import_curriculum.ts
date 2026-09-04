import fs from 'fs';
import path from 'path';
import { DrillSeedGeneratorService } from '../services/drillSeedGeneratorService.js';
import { db } from '../db.js';
import {
  DynamicDrillGenerationInput,
  TokyoPitchDrill,
  PitchAccentPattern
} from '../types.js';

export interface BulkImportOptions {
  filePath?: string;
  defaultJlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  defaultCategory?: TokyoPitchDrill['category'];
  dryRun?: boolean;
  format?: 'auto' | 'json' | 'csv' | 'tsv' | 'txt';
  items?: DynamicDrillGenerationInput[];
}

export interface BulkImportResult {
  totalParsed: number;
  totalValid: number;
  inserted: number;
  updated: number;
  skipped: number;
  durationMs: number;
  sampleDrills: TokyoPitchDrill[];
}

// Built-in Japanese High-Yield Core Curriculum Seed Set (JLPT N5-N3 + Minimal Pairs + Keigo)
export const BUILTIN_CURRICULUM_BATCH: DynamicDrillGenerationInput[] = [
  // Minimal Pairs
  { word: '箸', readingKana: 'はし', meaningEn: 'Chopsticks', meaningBn: 'চপস্টিক', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'hashi' },
  { word: '橋', readingKana: 'はし', meaningEn: 'Bridge', meaningBn: 'সেতু / ব্রিজ', overridePattern: 'odaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'hashi' },
  { word: '端', readingKana: 'はし', meaningEn: 'Edge / Border', meaningBn: 'প্রান্ত / কিনারা', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N4', contrastGroup: 'hashi' },
  { word: '雨', readingKana: 'あめ', meaningEn: 'Rain', meaningBn: 'বৃষ্টি', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'ame' },
  { word: '飴', readingKana: 'あめ', meaningEn: 'Candy', meaningBn: 'ক্যান্ডি / মিষ্টি', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'ame' },
  { word: '花', readingKana: 'はな', meaningEn: 'Flower', meaningBn: 'ফুল', overridePattern: 'odaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'hana' },
  { word: '鼻', readingKana: 'はな', meaningEn: 'Nose', meaningBn: 'নাক', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'hana' },
  { word: '牡蠣', readingKana: 'かき', meaningEn: 'Oyster', meaningBn: 'ঝিনুক / অয়েস্টার', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N3', contrastGroup: 'kaki' },
  { word: '柿', readingKana: 'かき', meaningEn: 'Persimmon fruit', meaningBn: 'পার্সিমন ফল (গাব)', overridePattern: 'odaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N4', contrastGroup: 'kaki' },
  { word: '垣', readingKana: 'かき', meaningEn: 'Fence / Hedge', meaningBn: 'বেড়া / সীমানা', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N3', contrastGroup: 'kaki' },
  { word: '神', readingKana: 'かみ', meaningEn: 'God / Deity', meaningBn: 'ঈশ্বর / দেবতা', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N4', contrastGroup: 'kami' },
  { word: '紙', readingKana: 'かみ', meaningEn: 'Paper', meaningBn: 'কাগজ', overridePattern: 'odaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'kami' },
  { word: '髪', readingKana: 'かみ', meaningEn: 'Hair', meaningBn: 'চুল', overridePattern: 'odaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'kami' },

  // Choon Long Vowel Contrasts
  { word: '叔母さん', readingKana: 'おばさん', meaningEn: 'Aunt', meaningBn: 'খালা / ফুফু / মাসি', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'obasan' },
  { word: 'お祖母さん', readingKana: 'おばあさん', meaningEn: 'Grandmother', meaningBn: 'দাদি / নানি', overridePattern: 'nakadaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'obasan' },
  { word: '叔父さん', readingKana: 'おじさん', meaningEn: 'Uncle', meaningBn: 'চাচা / মামা', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'ojisan' },
  { word: 'お祖父さん', readingKana: 'おじいさん', meaningEn: 'Grandfather', meaningBn: 'দাদা / নানা', overridePattern: 'nakadaka', overrideDownstepMora: 2, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'ojisan' },
  { word: '雪', readingKana: 'ゆき', meaningEn: 'Snow', meaningBn: 'তুষার / বরফ', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'yuki' },
  { word: '勇気', readingKana: 'ゆうき', meaningEn: 'Courage', meaningBn: 'সাহস', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N4', contrastGroup: 'yuki' },

  // Sokuon Rushed Contrasts
  { word: '過去', readingKana: 'かこ', meaningEn: 'Past', meaningBn: 'অতীত', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N4', contrastGroup: 'kako' },
  { word: '括弧', readingKana: 'かっこ', meaningEn: 'Parenthesis', meaningBn: 'বন্ধনী', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'minimal_pair', jlptLevel: 'N3', contrastGroup: 'kako' },
  { word: '来て', readingKana: 'きて', meaningEn: 'Come (te-form)', meaningBn: 'আসুন', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'kite' },
  { word: '切手', readingKana: 'きって', meaningEn: 'Postage Stamp', meaningBn: 'ডাকটিকিট', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'kite' },
  { word: '音', readingKana: 'おと', meaningEn: 'Sound', meaningBn: 'শব্দ', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N5', contrastGroup: 'oto' },
  { word: '夫', readingKana: 'おっと', meaningEn: 'Husband', meaningBn: 'স্বামী', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'minimal_pair', jlptLevel: 'N4', contrastGroup: 'oto' },

  // N5 Essentials
  { word: '本', readingKana: 'ほん', meaningEn: 'Book', meaningBn: 'বই', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '猫', readingKana: 'ねこ', meaningEn: 'Cat', meaningBn: 'বিড়াল', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '犬', readingKana: 'いぬ', meaningEn: 'Dog', meaningBn: 'কুকুর', overridePattern: 'odaka', overrideDownstepMora: 2, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '水', readingKana: 'みず', meaningEn: 'Water', meaningBn: 'পানি', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '車', readingKana: 'くるま', meaningEn: 'Car / Vehicle', meaningBn: 'গাড়ি', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '魚', readingKana: 'さかな', meaningEn: 'Fish', meaningBn: 'মাছ', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '卵', readingKana: 'たまご', meaningEn: 'Egg', meaningBn: 'ডিম', overridePattern: 'nakadaka', overrideDownstepMora: 2, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '朝', readingKana: 'あさ', meaningEn: 'Morning', meaningBn: 'সকাল', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '昼', readingKana: 'ひる', meaningEn: 'Noon / Daytime', meaningBn: 'দুপুর', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '夜', readingKana: 'よる', meaningEn: 'Night', meaningBn: 'রাত', overridePattern: 'atamadaka', overrideDownstepMora: 1, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '日本', readingKana: 'にほん', meaningEn: 'Japan', meaningBn: 'জাপান', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '学生', readingKana: 'がくせい', meaningEn: 'Student', meaningBn: 'শিক্ষার্থী', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n5_essential', jlptLevel: 'N5' },
  { word: '先生', readingKana: 'せんせい', meaningEn: 'Teacher / Master', meaningBn: 'শিক্ষক', overridePattern: 'nakadaka', overrideDownstepMora: 3, category: 'n5_essential', jlptLevel: 'N5' },

  // N4 Daily Life & Work
  { word: '会社', readingKana: 'かいしゃ', meaningEn: 'Company / Workplace', meaningBn: 'কোম্পানি / অফিস', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n4_conversation', jlptLevel: 'N4' },
  { word: '電話', readingKana: 'でんわ', meaningEn: 'Telephone', meaningBn: 'টেলিফোন / ফোন', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n4_conversation', jlptLevel: 'N4' },
  { word: '時間', readingKana: 'じかん', meaningEn: 'Time / Hour', meaningBn: 'সময়', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n4_conversation', jlptLevel: 'N4' },
  { word: '約束', readingKana: 'やくそく', meaningEn: 'Promise / Appointment', meaningBn: 'প্রতিশ্রুতি / অ্যাপয়েন্টমেন্ট', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n4_conversation', jlptLevel: 'N4' },
  { word: '経験', readingKana: 'けいけん', meaningEn: 'Experience', meaningBn: 'অভিজ্ঞতা', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n4_conversation', jlptLevel: 'N4' },
  { word: '質問', readingKana: 'しつもん', meaningEn: 'Question', meaningBn: 'প্রশ্ন', overridePattern: 'heiban', overrideDownstepMora: 0, category: 'n4_conversation', jlptLevel: 'N4' },

  // Keigo Business Formulas
  { word: '失礼します', readingKana: 'しつれいします', meaningEn: 'Excuse me / Goodbye', meaningBn: 'অনুমতি নিয়ে বিদায় / মাফ করবেন', overridePattern: 'nakadaka', overrideDownstepMora: 2, category: 'keigo_formula', jlptLevel: 'N4' },
  { word: '恐れ入ります', readingKana: 'おそれいります', meaningEn: 'I am deeply sorry / grateful', meaningBn: 'আমি অত্যন্ত দুঃখিত / কৃতজ্ঞ', overridePattern: 'nakadaka', overrideDownstepMora: 5, category: 'keigo_formula', jlptLevel: 'N3' },
  { word: 'かしこまりました', readingKana: 'かしこまりました', meaningEn: 'Understood with pleasure', meaningBn: 'নিশ্চয়ই, বুঝলাম (সম্মানসূচক)', overridePattern: 'nakadaka', overrideDownstepMora: 5, category: 'keigo_formula', jlptLevel: 'N4' },
  { word: '少々お待ちください', readingKana: 'しょうしょうおまちください', meaningEn: 'Please wait a moment', meaningBn: 'দয়া করে একটু অপেক্ষা করুন', overridePattern: 'nakadaka', overrideDownstepMora: 7, category: 'keigo_formula', jlptLevel: 'N4' }
];

export class BulkCurriculumImporter {
  /**
   * Parse input file or raw data into DynamicDrillGenerationInput array
   */
  public static parseFile(filePath: string, options: BulkImportOptions = {}): DynamicDrillGenerationInput[] {
    const absPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absPath)) {
      throw new Error(`Curriculum import file not found: ${absPath}`);
    }

    const content = fs.readFileSync(absPath, 'utf-8').trim();
    let format = options.format || 'auto';

    if (format === 'auto') {
      if (filePath.endsWith('.json')) format = 'json';
      else if (filePath.endsWith('.csv')) format = 'csv';
      else if (filePath.endsWith('.tsv')) format = 'tsv';
      else format = 'txt';
    }

    if (format === 'json') {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          word: item.word || item.kanji || '',
          readingKana: item.readingKana || item.reading || undefined,
          meaningEn: item.meaningEn || item.meaning || '',
          meaningBn: item.meaningBn || '',
          category: item.category || options.defaultCategory || 'n5_essential',
          jlptLevel: item.jlptLevel || options.defaultJlptLevel || 'N5',
          overridePattern: item.pattern as PitchAccentPattern,
          overrideDownstepMora: typeof item.downstepMora === 'number' ? item.downstepMora : undefined,
          contrastGroup: item.contrastGroup,
          contextNote: item.contextNote
        }));
      }
      throw new Error('JSON curriculum file must contain an array of items.');
    }

    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#'));
    const results: DynamicDrillGenerationInput[] = [];

    const delimiter = format === 'csv' ? ',' : format === 'tsv' ? '\t' : /[,\t\s]+/;

    // Check if first line is a header
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('word') || firstLine.includes('kanji') || firstLine.includes('reading');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    for (const line of dataLines) {
      let parts: string[];
      if (typeof delimiter === 'string') {
        parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));
      } else {
        parts = line.split(delimiter).map((p) => p.trim());
      }

      if (parts.length === 0 || !parts[0]) continue;

      const word = parts[0];
      const readingKana = parts[1] || undefined;
      const meaningEn = parts[2] || word;
      const meaningBn = parts[3] || word;
      const jlptLevel = (parts[4] as any) || options.defaultJlptLevel || 'N5';
      const overridePattern = (parts[5] as PitchAccentPattern) || undefined;
      const overrideDownstepMora = parts[6] ? parseInt(parts[6], 10) : undefined;

      results.push({
        word,
        readingKana,
        meaningEn,
        meaningBn,
        jlptLevel,
        category: options.defaultCategory || 'n5_essential',
        overridePattern,
        overrideDownstepMora
      });
    }

    return results;
  }

  /**
   * Bulk import curriculum into platform database with full precomputed F0 & intensity contours
   */
  public static async importCurriculum(options: BulkImportOptions = {}): Promise<BulkImportResult> {
    const startTime = Date.now();
    let inputs: DynamicDrillGenerationInput[] = [];

    if (options.filePath) {
      inputs = this.parseFile(options.filePath, options);
    } else if (options.items && options.items.length > 0) {
      inputs = options.items;
    } else {
      // Use comprehensive built-in core curriculum
      inputs = BUILTIN_CURRICULUM_BATCH;
    }

    const totalParsed = inputs.length;
    const validInputs = inputs.filter((i) => i.word && i.word.trim().length > 0);
    const totalValid = validInputs.length;
    const skipped = totalParsed - totalValid;

    // Generate complete pitch drill records with pre-computed acoustic contours
    const { drills } = DrillSeedGeneratorService.generateDrills(validInputs);

    let inserted = 0;
    let updated = 0;

    if (!options.dryRun) {
      const stats = db.bulkUpsertPitchDrills(drills);
      inserted = stats.inserted;
      updated = stats.updated;
    }

    const durationMs = Date.now() - startTime;

    return {
      totalParsed,
      totalValid,
      inserted,
      updated,
      skipped,
      durationMs,
      sampleDrills: drills.slice(0, 5)
    };
  }
}

// CLI Execution Entry Point
async function runCLI() {
  const args = process.argv.slice(2);
  let filePath: string | undefined;
  let defaultJlptLevel: any = 'N5';
  let defaultCategory: any = 'n5_essential';
  let dryRun = false;

  for (const arg of args) {
    if (arg.startsWith('--jlpt=')) {
      defaultJlptLevel = arg.split('=')[1].toUpperCase();
    } else if (arg.startsWith('--category=')) {
      defaultCategory = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (!arg.startsWith('--')) {
      filePath = arg;
    }
  }

  console.log('================================================================');
  console.log('🚀 NIHOMI.COM: BULK CURRICULUM & PITCH ACCENT IMPORTER');
  console.log('================================================================');
  console.log(`- Target File:     ${filePath || '[BUILT-IN JAPANESE CORE CURRICULUM]'}`);
  console.log(`- Default JLPT:    ${defaultJlptLevel}`);
  console.log(`- Default Category: ${defaultCategory}`);
  console.log(`- Mode:            ${dryRun ? 'DRY-RUN (Preview Only)' : 'LIVE DATABASE INGESTION'}\n`);

  try {
    const result = await BulkCurriculumImporter.importCurriculum({
      filePath,
      defaultJlptLevel,
      defaultCategory,
      dryRun
    });

    console.log('----------------------------------------------------------------');
    console.log('✅ Ingestion Completed Successfully!');
    console.log(`- Total Parsed:       ${result.totalParsed}`);
    console.log(`- Valid Items:        ${result.totalValid}`);
    console.log(`- New Drills Inserted: ${result.inserted}`);
    console.log(`- Existing Updated:    ${result.updated}`);
    console.log(`- Skipped:             ${result.skipped}`);
    console.log(`- Processing Time:     ${result.durationMs}ms`);
    console.log('----------------------------------------------------------------\n');

    console.log('📋 Sample Pre-Computed Drills with Acoustic Contours:');
    result.sampleDrills.forEach((d, i) => {
      console.log(`\n  [${i + 1}] ${d.kanji} (${d.readingKana} / ${d.romaji})`);
      console.log(`      Pattern:      ${d.patternNameJa} (${d.pattern}) | Downstep Mora: ${d.downstepMora}`);
      console.log(`      Morae Breakdown: [${d.morae.join(' - ')}]`);
      console.log(`      Pitch Registers: [${d.targetPitches.join(' - ')}]`);
      console.log(`      Ref F0 (Hz):     [${d.standardHzContour.join(', ')}]`);
      console.log(`      Intensity Env:   [${d.targetIntensityEnvelope.map((v) => v.toFixed(2)).join(', ')}]`);
      console.log(`      Meaning:         ${d.meaningEn} | ${d.meaningBn}`);
    });

    console.log('\n✨ Database is fully primed with zero-latency pre-computed acoustic models.\n');
  } catch (error: any) {
    console.error('❌ Ingestion failed:', error.message || error);
    process.exit(1);
  }
}

// Execute CLI if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI();
}
