import crypto from 'crypto';
import { prisma, isDatabaseConfigured } from '../prisma.js';
import { supabase } from '../supabase.js';
import { MockExamAttempt } from '../types.js';
import { db } from '../db.js';

/**
 * NIHOMI.COM — JLPT N5 Mock Exam Persistence & Cryptographic Hash Service
 * Persists official simulation attempts to PostgreSQL table (mock_exam_results)
 * and generates tamper-proof verification hashes for official certificates.
 */
export class MockExamPersistenceService {
  private static tableInitialized = false;

  /**
   * Generates a 32-character SHA256 cryptographic verification hash for an official exam certificate.
   */
  public static generateVerificationHash(attempt: {
    certificateId: string;
    userId: string;
    examCode: string;
    totalScaledScore: number;
    submittedAt: string;
  }): string {
    const rawPayload = `${attempt.certificateId}:${attempt.userId}:${attempt.examCode}:${attempt.totalScaledScore}:${attempt.submittedAt}:nihomi_jlpt_n5_official_verify`;
    return crypto.createHash('sha256').update(rawPayload).digest('hex').substring(0, 32);
  }

  /**
   * Ensures the PostgreSQL `mock_exam_results` table exists.
   */
  private static async ensureTableExists(): Promise<void> {
    if (this.tableInitialized || !isDatabaseConfigured()) return;

    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS mock_exam_results (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(128) NOT NULL,
          mock_exam_id VARCHAR(64) NOT NULL,
          exam_code VARCHAR(64) NOT NULL,
          level VARCHAR(16) NOT NULL,
          started_at TIMESTAMPTZ NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL,
          time_spent_seconds INT NOT NULL,
          section_scores JSONB NOT NULL,
          total_scaled_score INT NOT NULL,
          overall_passing_score INT NOT NULL,
          is_passed BOOLEAN NOT NULL,
          fail_reason TEXT,
          letter_grade VARCHAR(8),
          percentile_rank INT,
          certificate_id VARCHAR(64),
          verification_hash VARCHAR(64),
          user_answers JSONB,
          strength_summary_bn TEXT,
          weakness_summary_bn TEXT,
          actionable_study_plan_bn JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      this.tableInitialized = true;
    } catch (err) {
      console.warn('[MockExamPersistence] Prisma executeRaw table init notice:', (err as any)?.message || err);
      // Non-blocking: table may already exist or Supabase fallback will handle
    }
  }

  /**
   * Persists an official mock exam attempt to PostgreSQL / Supabase storage.
   */
  public static async persistAttempt(attempt: MockExamAttempt): Promise<{ success: boolean; hash: string }> {
    const verificationHash = attempt.verificationHash || this.generateVerificationHash(attempt);
    attempt.verificationHash = verificationHash;

    // 1. Attempt PostgreSQL write via Prisma if configured
    if (isDatabaseConfigured()) {
      try {
        await this.ensureTableExists();

        await prisma.$executeRawUnsafe(
          `
          INSERT INTO mock_exam_results (
            id, user_id, mock_exam_id, exam_code, level, started_at, submitted_at,
            time_spent_seconds, section_scores, total_scaled_score, overall_passing_score,
            is_passed, fail_reason, letter_grade, percentile_rank, certificate_id,
            verification_hash, user_answers, strength_summary_bn, weakness_summary_bn,
            actionable_study_plan_bn, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6::timestamptz, $7::timestamptz,
            $8, $9::jsonb, $10, $11,
            $12, $13, $14, $15, $16,
            $17, $18::jsonb, $19, $20,
            $21::jsonb, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            section_scores = EXCLUDED.section_scores,
            total_scaled_score = EXCLUDED.total_scaled_score,
            is_passed = EXCLUDED.is_passed,
            letter_grade = EXCLUDED.letter_grade,
            verification_hash = EXCLUDED.verification_hash;
          `,
          attempt.id,
          attempt.userId,
          attempt.mockExamId,
          attempt.examCode,
          attempt.level,
          attempt.startedAt,
          attempt.submittedAt,
          attempt.timeSpentSeconds,
          JSON.stringify(attempt.sectionScores),
          attempt.totalScaledScore,
          attempt.overallPassingScore,
          attempt.isPassed,
          attempt.failReason || null,
          attempt.letterGrade,
          attempt.percentileRank || 0,
          attempt.certificateId,
          verificationHash,
          JSON.stringify(attempt.userAnswers || []),
          attempt.strengthSummaryBn || '',
          attempt.weaknessSummaryBn || '',
          JSON.stringify(attempt.actionableStudyPlanBn || [])
        );

        console.log(`[MockExamPersistence] Attempt ${attempt.id} saved to PostgreSQL successfully.`);
        return { success: true, hash: verificationHash };
      } catch (prismaErr: any) {
        console.warn('[MockExamPersistence] Prisma attempt save error, trying Supabase fallback:', prismaErr?.message || prismaErr);
      }
    }

      // 2. Supabase fallback
      try {
        const { error: sbError } = await supabase.from('mock_exam_results').upsert({
          id: attempt.id,
          user_id: attempt.userId,
          mock_exam_id: attempt.mockExamId,
          exam_code: attempt.examCode,
          level: attempt.level,
          started_at: attempt.startedAt,
          submitted_at: attempt.submittedAt,
          time_spent_seconds: attempt.timeSpentSeconds,
          section_scores: attempt.sectionScores,
          total_scaled_score: attempt.totalScaledScore,
          overall_passing_score: attempt.overallPassingScore,
          is_passed: attempt.isPassed,
          fail_reason: attempt.failReason || null,
          letter_grade: attempt.letterGrade,
          percentile_rank: attempt.percentileRank || 0,
          certificate_id: attempt.certificateId,
          verification_hash: verificationHash,
          user_answers: attempt.userAnswers || [],
          strength_summary_bn: attempt.strengthSummaryBn || '',
          weakness_summary_bn: attempt.weaknessSummaryBn || '',
          actionable_study_plan_bn: attempt.actionableStudyPlanBn || []
        });

        if (sbError) {
          console.warn('[MockExamPersistence] Supabase write error:', sbError.message);
        } else {
          console.log(`[MockExamPersistence] Attempt ${attempt.id} saved to Supabase successfully.`);
          return { success: true, hash: verificationHash };
        }
      } catch (sbErr: any) {
        console.warn('[MockExamPersistence] Supabase exception:', sbErr?.message || sbErr);
      }

    return { success: false, hash: verificationHash };
  }

  /**
   * Public verification helper for certificate QR / URL checks
   */
  public static async verifyCertificate(certificateId: string): Promise<{
    found: boolean;
    isPassed?: boolean;
    studentName?: string;
    examCode?: string;
    level?: string;
    totalScaledScore?: number;
    letterGrade?: string;
    submittedAt?: string;
    verificationHash?: string;
  }> {
    // 1. Check local DB attempts first
    const allAttempts = (db.data as any).mockExamAttempts as MockExamAttempt[] | undefined;
    const localAttempt = allAttempts?.find((a) => a.certificateId === certificateId);

    if (localAttempt) {
      const user = db.findUserById(localAttempt.userId);
      const profile = db.getProfileByUserId(localAttempt.userId);
      const studentName = profile?.displayName || user?.email?.split('@')[0] || 'Nihomi Student';

      return {
        found: true,
        isPassed: localAttempt.isPassed,
        studentName,
        examCode: localAttempt.examCode,
        level: localAttempt.level,
        totalScaledScore: localAttempt.totalScaledScore,
        letterGrade: localAttempt.letterGrade,
        submittedAt: localAttempt.submittedAt,
        verificationHash: localAttempt.verificationHash || this.generateVerificationHash(localAttempt)
      };
    }

    // 2. Query PostgreSQL if not in local memory and database is configured
    if (isDatabaseConfigured()) {
      try {
        const rows = await prisma.$queryRawUnsafe<any[]>(
          'SELECT * FROM mock_exam_results WHERE certificate_id = $1 LIMIT 1',
          certificateId
        );
        if (rows && rows.length > 0) {
          const row = rows[0];
          const user = db.findUserById(row.user_id);
          const profile = db.getProfileByUserId(row.user_id);
          const studentName = profile?.displayName || user?.email?.split('@')[0] || 'Nihomi Student';

          return {
            found: true,
            isPassed: row.is_passed,
            studentName,
            examCode: row.exam_code,
            level: row.level,
            totalScaledScore: row.total_scaled_score,
            letterGrade: row.letter_grade,
            submittedAt: row.submitted_at,
            verificationHash: row.verification_hash
          };
        }
      } catch {
        // Fall through to not found
      }
    }

    return { found: false };
  }
}
