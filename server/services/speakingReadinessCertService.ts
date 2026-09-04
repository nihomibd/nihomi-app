import crypto from 'crypto';
import { db } from '../db.js';
import {
  SpeakingReadinessCertificate,
  TokyoPitchAccentAssessment,
  AccentSrsCard
} from '../types.js';

export class SpeakingReadinessCertService {
  /**
   * Evaluates student's aggregated acoustic, prosodic, and SRS history
   * to issue an institutional Speaking & Pitch Accent Readiness Certificate.
   */
  public static async generateSpeakingCertificate(
    userId: string,
    studentName?: string
  ): Promise<SpeakingReadinessCertificate> {
    const assessments: TokyoPitchAccentAssessment[] = db.getVoiceAssessments(userId, 100);
    const srsCards: AccentSrsCard[] = db.getAccentSrsCards(userId);

    const profile = db.getProfileByUserId(userId);
    const user = db.findUserById(userId);
    const resolvedName = studentName || profile?.displayName || user?.email?.split('@')[0] || 'Nihomi Student';

    const sampleCount = assessments.length;

    // 1. Calculate Average Pitch Accuracy
    let pitchAccuracy = 78;
    if (sampleCount > 0) {
      const sum = assessments.reduce((acc, a) => acc + (a.pitchAccuracyScore || 75), 0);
      pitchAccuracy = Math.round(sum / sampleCount);
    }

    // 2. Calculate Mora Isochrony
    let moraIsochrony = 75;
    if (sampleCount > 0) {
      const sum = assessments.reduce((acc, a) => acc + (a.moraRhythmScore || 70), 0);
      moraIsochrony = Math.round(sum / sampleCount);
    }

    // 3. Intonation Phrase Boundary Reset Accuracy
    let intonationResetAccuracy = 76;
    if (sampleCount > 0) {
      // Analyze assessments for pattern adherence
      const accurateCount = assessments.filter((a) => a.passed).length;
      intonationResetAccuracy = Math.max(55, Math.round((accurateCount / sampleCount) * 100));
    }

    // 4. Bengali Dynamic Stress Suppression Score (100 - stress transfer rate)
    let stressSuppressionScore = 80;
    if (sampleCount > 0) {
      const transfers = assessments.filter(
        (a) =>
          a.bengaliAcousticAnalysis?.hasDynamicStressError ||
          a.coachingTips?.some((t) => t.includes('স্ট্রেস') || t.includes('জোর'))
      ).length;
      const transferRate = transfers / sampleCount;
      stressSuppressionScore = Math.max(40, Math.round(100 - transferRate * 60));
    }

    // 5. Conversational Pacing (Ratio of expected audio timing)
    let conversationalPacing = 82;
    if (sampleCount > 0) {
      const durations = assessments.map((a) => a.audioDurationMs || 1500);
      const avgDuration = durations.reduce((acc, d) => acc + d, 0) / durations.length;
      // Normal phrase duration is 1200-2400ms
      if (avgDuration >= 1100 && avgDuration <= 2600) {
        conversationalPacing = 90;
      } else {
        conversationalPacing = Math.max(50, Math.round(100 - Math.abs(avgDuration - 1800) / 30));
      }
    }

    // Boost with SRS mastery bonus if student has reviewed cards
    if (srsCards.length > 0) {
      const matureCards = srsCards.filter((c) => c.repetition >= 3).length;
      const srsMasteryRatio = matureCards / srsCards.length;
      pitchAccuracy = Math.min(100, Math.round(pitchAccuracy + srsMasteryRatio * 5));
      stressSuppressionScore = Math.min(100, Math.round(stressSuppressionScore + srsMasteryRatio * 5));
    }

    // 6. Calculate Weighted Overall Readiness Index (0 - 100%)
    const overallReadinessIndex = Math.max(
      30,
      Math.min(
        100,
        Math.round(
          pitchAccuracy * 0.35 +
            moraIsochrony * 0.25 +
            intonationResetAccuracy * 0.20 +
            stressSuppressionScore * 0.10 +
            conversationalPacing * 0.10
        )
      )
    );

    // 7. Map to Certified Level & Grade
    let certifiedLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Baito-Certified' | 'Business-Certified' = 'N5';
    if (overallReadinessIndex >= 90) {
      certifiedLevel = 'Business-Certified';
    } else if (overallReadinessIndex >= 82) {
      certifiedLevel = 'Baito-Certified';
    } else if (overallReadinessIndex >= 74) {
      certifiedLevel = 'N3';
    } else if (overallReadinessIndex >= 64) {
      certifiedLevel = 'N4';
    } else {
      certifiedLevel = 'N5';
    }

    let readinessGrade: 'S' | 'A' | 'B' | 'C' | 'D' = 'C';
    if (overallReadinessIndex >= 93) {
      readinessGrade = 'S';
    } else if (overallReadinessIndex >= 84) {
      readinessGrade = 'A';
    } else if (overallReadinessIndex >= 74) {
      readinessGrade = 'B';
    } else if (overallReadinessIndex >= 64) {
      readinessGrade = 'C';
    } else {
      readinessGrade = 'D';
    }

    // Strengths & Growth Areas in Bengali
    const strengthsBn: string[] = [];
    const growthAreasBn: string[] = [];

    if (pitchAccuracy >= 80) {
      strengthsBn.push('টোকিও স্ট্যান্ডার্ড পিচ কন্ট্রোল ও সুরের ভারসাম্য চমৎকার।');
    } else {
      growthAreasBn.push('শব্দভেদে হাই-লো (H-L) পিচ প্যাটার্ন আরও নিখুঁত করা প্রয়োজন।');
    }

    if (moraIsochrony >= 80) {
      strengthsBn.push('মোরা সমকালীন ছন্দ (Isochronous Timing) স্বাভাবিক ও অবিচ্ছিন্ন।');
    } else {
      growthAreasBn.push('ছোট ও বড় স্বরবর্ণের (চৌ-অন) টাইমিং সমান ও সুষম রাখা দরকার।');
    }

    if (intonationResetAccuracy >= 75) {
      strengthsBn.push('বাক্যের নতুন অংশে সুরের পুনরুদ্ধার (AP Reset) সঠিকভাবে হচ্ছে।');
    } else {
      growthAreasBn.push('দীর্ঘ বাক্যে একটানা সুর ফ্ল্যাট না করে নতুন শব্দগুচ্ছে সুর তুলে ধরুন।');
    }

    if (stressSuppressionScore >= 80) {
      strengthsBn.push('বাংলা ভাষার সহজাত ভলিউম-জোর (Dynamic Stress) সফলভাবে নিয়ন্ত্রণ করেছেন।');
    } else {
      growthAreasBn.push('অতিরিক্ত জোর দিয়ে কথা না বলে কেবল সুরের তারতম্য ব্যবহার করুন।');
    }

    if (strengthsBn.length === 0) {
      strengthsBn.push('মৌলিক শব্দ উচ্চারণে সুরের প্রাথমিক কাঠামো তৈরি হয়েছে।');
    }
    if (growthAreasBn.length === 0) {
      growthAreasBn.push('ন্যাচারাল বিজনেস কেইগো ও দ্রুত গতির স্পিচ শ্যাডোয়িং চালিয়ে যান।');
    }

    const issueDate = new Date().toISOString();
    const certificateId = `CERT-TOKYO-${userId.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Cryptographic verification hash
    const rawPayload = `${certificateId}:${userId}:${overallReadinessIndex}:${certifiedLevel}:${issueDate}`;
    const verificationHash = crypto.createHash('sha256').update(rawPayload).digest('hex').substring(0, 32);

    // Institutional Summaries
    const institutionalSummaryBn = `শিক্ষার্থী ${resolvedName} নিহোমি টোকিও স্পিকিং ও পিচ অ্যাকসেন্ট ল্যাবে মোট ${sampleCount}টি অডিও নমুনা ও এসআরএস কার্ড সফলভাবে সম্পন্ন করেছেন। সামগ্রিক বাচনভঙ্গির প্রস্তুতি স্কোর ${overallReadinessIndex}% (গ্রেড: ${readinessGrade}), যা তাকে "${certifiedLevel}" স্তরের প্রাকৃতিক টোকিও জাপানি সংলাপে সক্ষম হিসেবে প্রত্যয়িত করে।`;

    const institutionalSummaryEn = `Student ${resolvedName} has demonstrated acoustic and prosodic proficiency across ${sampleCount} verified voice assessments. Attaining a Tokyo Intonation Readiness Index of ${overallReadinessIndex}% (Grade: ${readinessGrade}), qualifying for institutional speaking readiness at ${certifiedLevel} tier.`;

    const certificate: SpeakingReadinessCertificate = {
      certificateId,
      studentId: userId,
      studentName: resolvedName,
      overallReadinessIndex,
      certifiedLevel,
      readinessGrade,
      issueDate,
      verificationHash,
      evaluationsSampledCount: sampleCount,
      subScores: {
        pitchAccuracy,
        moraIsochrony,
        intonationResetAccuracy,
        stressSuppressionScore,
        conversationalPacing
      },
      strengthsBn,
      growthAreasBn,
      institutionalSummaryBn,
      institutionalSummaryEn
    };

    // Save into durable database for public institutional verification
    db.saveSpeakingCertificate(certificate);

    return certificate;
  }

  /**
   * Public institutional verification method
   */
  public static verifyCertificate(certId: string): {
    valid: boolean;
    certificate?: SpeakingReadinessCertificate;
    tamperDetected?: boolean;
    errorBn?: string;
    verifiedAt?: string;
  } {
    if (!certId || !certId.startsWith('CERT-TOKYO-')) {
      return {
        valid: false,
        errorBn: 'সার্টিফিকেট আইডি সঠিক নয়। অনুগ্রহ করে CERT-TOKYO- দিয়ে শুরু হওয়া সঠিক আইডি দিন।'
      };
    }

    const certificate = db.getSpeakingCertificateById(certId);
    if (!certificate) {
      return {
        valid: false,
        errorBn: 'নিহোমি ডেটাবেসে এই সার্টিফিকেটটি খুঁজে পাওয়া যায়নি।'
      };
    }

    // Recompute cryptographic hash
    const rawPayload = `${certificate.certificateId}:${certificate.studentId}:${certificate.overallReadinessIndex}:${certificate.certifiedLevel}:${certificate.issueDate}`;
    const expectedHash = crypto.createHash('sha256').update(rawPayload).digest('hex').substring(0, 32);

    if (certificate.verificationHash !== expectedHash) {
      return {
        valid: false,
        tamperDetected: true,
        errorBn: 'নিরাপত্তা সতর্কতা: সনদের ডেটা টেম্পারিং বা গরমিল সনাক্ত হয়েছে!'
      };
    }

    return {
      valid: true,
      certificate,
      verifiedAt: new Date().toISOString()
    };
  }
}
