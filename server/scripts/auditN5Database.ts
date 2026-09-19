import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function auditDatabase() {
  console.log('📊 Auditing Nihomi Database (N5 Curriculum Status)...\n');

  try {
    const course = await prisma.course.findUnique({
      where: { slug: 'n5-mastery' },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                vocabularies: true,
                kanjis: true
              },
              orderBy: { lessonNumber: 'asc' }
            }
          }
        }
      }
    });

    if (!course) {
      console.log('❌ Course "n5-mastery" not found in database.');
      return;
    }

    console.log(`✅ Course Found: ${course.title} (Level: ${course.level})`);
    
    let totalLessonsCount = 0;
    let totalVocabCount = 0;

    for (const mod of course.modules) {
      console.log(`\n📦 Module: ${mod.title}`);
      for (const lesson of mod.lessons) {
        totalLessonsCount++;
        totalVocabCount += lesson.vocabularies.length;
        console.log(`   📚 Lesson ${lesson.lessonNumber}: ${lesson.title} -> Vocab items: ${lesson.vocabularies.length}`);
      }
    }

    console.log('\n----------------------------------------');
    console.log(`🎯 AUDIT SUMMARY REPORT:`);
    console.log(`   - Total Lessons Populated: ${totalLessonsCount} / 25`);
    console.log(`   - Total Vocabulary Records: ${totalVocabCount}`);
    console.log(`   - Database Status: ${totalLessonsCount >= 25 ? '🎉 100% COMPLETE & VERIFIED' : '⏳ IN PROGRESS'}`);
    console.log('----------------------------------------\n');

  } catch (error) {
    console.error('❌ Audit Failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

auditDatabase();