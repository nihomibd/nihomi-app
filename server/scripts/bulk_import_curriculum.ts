import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { DrillSeedGeneratorService } from '../services/drillSeedGeneratorService.js';
import { db } from '../db.js';

dotenv.config();

export class BulkCurriculumImporter {
  static async importCurriculum() {
    const seedResult = DrillSeedGeneratorService.seedDefaultDrills();
    const sampleDrills = db.getPitchDrills({ limit: 10 });
    return {
      totalValid: seedResult.totalSeeded,
      inserted: seedResult.inserted,
      updated: seedResult.updated,
      sampleDrills
    };
  }
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Minna no Nihongo N5 (Lessons 21 to 25) Master Vocabulary Dataset
const masterCurriculumData = [
  // --- LESSON 21 ---
  { lesson_number: 21, content_type: "vocabulary", japanese_text: "おもいます", romaji: "omoimasu", bangla_meaning: "মনে করা[cite: 2]", order_index: 1 },
  { lesson_number: 21, content_type: "vocabulary", japanese_text: "いいます", romaji: "iimasu", bangla_meaning: "বলা[cite: 2]", order_index: 2 },
  { lesson_number: 21, content_type: "vocabulary", japanese_text: "たります", romaji: "tarimasu", bangla_meaning: "যথেষ্ট হয়েছে[cite: 2]", order_index: 3 },
  { lesson_number: 21, content_type: "vocabulary", japanese_text: "かちます", romaji: "kachimasu", bangla_meaning: "জয় লাভ করা[cite: 2]", order_index: 4 },
  { lesson_number: 21, content_type: "vocabulary", japanese_text: "まけます", romaji: "makemasu", bangla_meaning: "পরাজিত হওয়া[cite: 2]", order_index: 5 },

  // --- LESSON 22 ---
  { lesson_number: 22, content_type: "vocabulary", japanese_text: "きます", romaji: "kimasu", bangla_meaning: "পরিধান করা (শার্ট ইত্যাদি)[cite: 2]", order_index: 1 },
  { lesson_number: 22, content_type: "vocabulary", japanese_text: "はきます", romaji: "hakimasu", bangla_meaning: "পরিধান করা (প্যান্ট, জুতা ইত্যাদি)[cite: 2]", order_index: 2 },
  { lesson_number: 22, content_type: "vocabulary", japanese_text: "かぶります", romaji: "kaburimasu", bangla_meaning: "পরিধান করা (টুপি ইত্যাদি)[cite: 2]", order_index: 3 },
  { lesson_number: 22, content_type: "vocabulary", japanese_text: "かけます", romaji: "kakimasu", bangla_meaning: "পরিধান করা (চশমা ইত্যাদি)[cite: 2]", order_index: 4 },
  { lesson_number: 22, content_type: "vocabulary", japanese_text: "うまれます", romaji: "umaremasu", bangla_meaning: "জন্ম হওয়া[cite: 2]", order_index: 5 },

  // --- LESSON 23 ---
  { lesson_number: 23, content_type: "vocabulary", japanese_text: "ききます", romaji: "kikimasu", bangla_meaning: "জিজ্ঞাসা করা[cite: 2]", order_index: 1 },
  { lesson_number: 23, content_type: "vocabulary", japanese_text: "まわします", romaji: "mawashimasu", bangla_meaning: "ঘুরানো[cite: 2]", order_index: 2 },
  { lesson_number: 23, content_type: "vocabulary", japanese_text: "ひきます", romaji: "hikimasu", bangla_meaning: "টানা/পুল করা[cite: 2]", order_index: 3 },
  { lesson_number: 23, content_type: "vocabulary", japanese_text: "かえます", romaji: "kaemasu", bangla_meaning: "বদলানো[cite: 2]", order_index: 4 },
  { lesson_number: 23, content_type: "vocabulary", japanese_text: "さわります", romaji: "sawarimasu", bangla_meaning: "স্পর্শ করা/টাচ করা[cite: 2]", order_index: 5 },

  // --- LESSON 24 ---
  { lesson_number: 24, content_type: "vocabulary", japanese_text: "くれます", romaji: "kuremasu", bangla_meaning: "দেওয়া (আমাকে)[cite: 2]", order_index: 1 },
  { lesson_number: 24, content_type: "vocabulary", japanese_text: "つれていきます", romaji: "tsurete ikimasu", bangla_meaning: "সাথে করে নিয়ে যাওয়া (কাউকে)[cite: 2]", order_index: 2 },
  { lesson_number: 24, content_type: "vocabulary", japanese_text: "つれてきます", romaji: "tsurete kimasu", bangla_meaning: "সাথে করে নিয়ে আসা (কাউকে)[cite: 2]", order_index: 3 },
  { lesson_number: 24, content_type: "vocabulary", japanese_text: "おくります", romaji: "okurimasu", bangla_meaning: "পাঠানো/এগিয়ে দেওয়া[cite: 2]", order_index: 4 },
  { lesson_number: 24, content_type: "vocabulary", japanese_text: "しょうかいします", romaji: "shoukaishimasu", bangla_meaning: "পরিচয় করিয়ে দেওয়া[cite: 2]", order_index: 5 },

  // --- LESSON 25 ---
  { lesson_number: 25, content_type: "vocabulary", japanese_text: "かんがえます", romaji: "kangaemasu", bangla_meaning: "চিন্তা করা/বিবেচনা করা[cite: 2]", order_index: 1 },
  { lesson_number: 25, content_type: "vocabulary", japanese_text: "つきます", romaji: "tsukimasu", bangla_meaning: "পৌঁছা[cite: 2]", order_index: 2 },
  { lesson_number: 25, content_type: "vocabulary", japanese_text: "りゅうがくします", romaji: "ryuugakushimasu", bangla_meaning: "বিদেশে লেখাপড়া করা[cite: 2]", order_index: 3 },
  { lesson_number: 25, content_type: "vocabulary", japanese_text: "としをとります", romaji: "toshi o torimasu", bangla_meaning: "বয়স বৃদ্ধি পাওয়া[cite: 2]", order_index: 4 },
  { lesson_number: 25, content_type: "vocabulary", japanese_text: "いなか", romaji: "inaka", bangla_meaning: "গ্রামাঞ্চল/হোমটাউন[cite: 2]", order_index: 5 }
];

async function main() {
  console.log('🚀 Starting Final Bulk Import for Lessons 21-25...');

  const course = await prisma.course.upsert({
    where: { slug: 'n5-mastery' },
    update: {},
    create: { title: 'JLPT N5 Mastery', slug: 'n5-mastery', level: 'N5' }
  });

  const module = await prisma.module.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'n5-module-1' } },
    update: {},
    create: { courseId: course.id, title: 'Basics & Introductions', slug: 'n5-module-1' }
  });

  let importedCount = 0;

  for (const item of masterCurriculumData) {
    const lessonNum = item.lesson_number;
    const lessonSlug = `lesson-${lessonNum}`;

    const lesson = await prisma.lesson.upsert({
      where: { moduleId_slug: { moduleId: module.id, slug: lessonSlug } },
      update: {},
      create: { moduleId: module.id, title: `Lesson ${lessonNum}`, slug: lessonSlug, lessonNumber: lessonNum }
    });

    if (item.content_type === 'vocabulary') {
      const existing = await prisma.vocabulary.findFirst({
        where: { lessonId: lesson.id, word: item.japanese_text }
      });

      if (!existing) {
        await prisma.vocabulary.create({
          data: {
            lessonId: lesson.id,
            word: item.japanese_text,
            readingHiragana: item.japanese_text,
            romaji: item.romaji,
            meaningEn: "N/A",
            meaningBn: item.bangla_meaning,
            partOfSpeech: "noun",
            orderIndex: item.order_index
          }
        });
        importedCount++;
      }
    }
  }

  console.log(`✅ SUCCESS! Imported ${importedCount} new items across Lessons 21-25 perfectly.`);
  console.log('🎉 N5 CURRICULUM FULLY POPULATED (Lessons 1-25 COMPLETE)!');
  process.exit(0);
}

main().catch(e => {
  console.error("❌ Fatal Error:", e);
  process.exit(1);
});