import { MockExam, MockExamAttempt, MockExamSectionType } from '../types';
import { INITIAL_MOCK_EXAMS } from '../data/mockExamSeedData';

export interface MockExamSummaryItem {
  id: string;
  examCode: string;
  title: string;
  titleJa: string;
  level: string;
  description: string;
  descriptionBn: string;
  totalTimeMinutes: number;
  totalPossibleScore: number;
  overallPassingScore: number;
  sectionCount: number;
  totalQuestions: number;
  sectionBreakdown: {
    sectionType: MockExamSectionType;
    title: string;
    timeLimitMinutes: number;
    questionCount: number;
    maxScaledScore: number;
    passingThreshold: number;
  }[];
  userBestAttempt?: {
    attemptId: string;
    totalScaledScore: number;
    isPassed: boolean;
    letterGrade: string;
    submittedAt: string;
  } | null;
  attemptCount: number;
}

export async function fetchMockExams(level?: string): Promise<MockExamSummaryItem[]> {
  try {
    const token = localStorage.getItem('nihomi_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = level ? `/api/mock-exams?level=${level}` : '/api/mock-exams';
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.mockExams && data.mockExams.length > 0) {
        return data.mockExams;
      }
    }
  } catch (err) {
    console.warn('Backend fetchMockExams unavailable, using local mock seed:', err);
  }

  // Client-side fallback to initial mock exams
  return INITIAL_MOCK_EXAMS.map((exam) => ({
    id: exam.id,
    examCode: exam.examCode,
    title: exam.title,
    titleJa: exam.titleJa,
    level: exam.level,
    description: exam.description,
    descriptionBn: exam.descriptionBn,
    totalTimeMinutes: exam.totalTimeMinutes,
    totalPossibleScore: exam.totalPossibleScore,
    overallPassingScore: exam.overallPassingScore,
    sectionCount: exam.sections.length,
    totalQuestions: exam.sections.reduce((acc, s) => acc + s.questions.length, 0),
    sectionBreakdown: exam.sections.map((s) => ({
      sectionType: s.sectionType,
      title: s.title,
      timeLimitMinutes: s.timeLimitMinutes,
      questionCount: s.questions.length,
      maxScaledScore: s.maxScaledScore,
      passingThreshold: s.passingThreshold
    })),
    attemptCount: 0
  }));
}

export async function fetchMockExamById(id: string): Promise<{ mockExam: MockExam; userPastAttempts: MockExamAttempt[] } | null> {
  try {
    const token = localStorage.getItem('nihomi_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/mock-exams/${id}`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.mockExam) return data;
    }
  } catch (err) {
    console.warn('Backend fetchMockExamById unavailable, using local fallback:', err);
  }

  // Client-side fallback match
  const normalized = (id || '').trim().toLowerCase();
  const fallbackExam =
    INITIAL_MOCK_EXAMS.find(
      (e) =>
        e.id === id ||
        e.examCode === id ||
        e.id.toLowerCase() === normalized ||
        e.id.replace('exam-jlpt-', '') === normalized ||
        (normalized.includes('n5') && e.level === 'N5')
    ) || INITIAL_MOCK_EXAMS[0];

  if (!fallbackExam) return null;

  return {
    mockExam: fallbackExam,
    userPastAttempts: []
  };
}

export async function submitMockExamAttempt(
  examId: string,
  payload: {
    answers: {
      questionId: string;
      sectionType: MockExamSectionType;
      selectedOptionIndex: number;
      timeSpentSeconds: number;
    }[];
    sectionTimesSpentSeconds: Record<MockExamSectionType, number>;
    totalTimeSpentSeconds: number;
  }
): Promise<{
  success: boolean;
  attempt: MockExamAttempt;
  reviewSections: any[];
  message: string;
}> {
  try {
    const token = localStorage.getItem('nihomi_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/mock-exams/${examId}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.attempt) return data;
    }
  } catch (err) {
    console.warn('Backend submitMockExamAttempt unavailable, computing scaled score locally:', err);
  }

  // Client-side 3-Section Scaled Score Calculation (Official JLPT N5)
  const normalized = (examId || '').trim().toLowerCase();
  const exam =
    INITIAL_MOCK_EXAMS.find(
      (e) =>
        e.id === examId ||
        e.examCode === examId ||
        e.id.toLowerCase() === normalized ||
        e.id.replace('exam-jlpt-', '') === normalized
    ) || INITIAL_MOCK_EXAMS[0];

  // Evaluate each section
  const sectionScores: Record<string, any> = {};
  const reviewSections: any[] = [];
  let userCorrectTotal = 0;
  let totalQuestionsCount = 0;

  const sectionTypes: MockExamSectionType[] = ['vocabulary', 'grammar_reading', 'listening'];

  for (const sType of sectionTypes) {
    const sec = exam.sections.find((s) => s.sectionType === sType);
    if (!sec) continue;

    let secCorrect = 0;
    const questionsReview: any[] = [];

    sec.questions.forEach((q) => {
      totalQuestionsCount++;
      const userAns = payload.answers.find((a) => a.questionId === q.id);
      const selIdx = userAns !== undefined ? userAns.selectedOptionIndex : -1;
      const isCorrect = selIdx === q.correctOptionIndex;
      if (isCorrect) {
        secCorrect++;
        userCorrectTotal++;
      }

      questionsReview.push({
        id: q.id,
        questionNumber: q.questionNumber,
        sectionType: q.sectionType,
        type: q.type,
        questionText: q.questionText,
        questionTextJa: q.questionTextJa,
        readingPassage: q.readingPassage,
        audioScript: q.audioScript,
        options: q.options,
        pointValue: q.pointValue,
        userSelectedOptionIndex: selIdx,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanationJa: q.explanationJa,
        explanationBn: q.explanationBn,
        explanationEn: q.explanationEn
      });
    });

    const totalQ = Math.max(1, sec.questions.length);
    const accuracy = Math.round((secCorrect / totalQ) * 100);
    // Scaled score between 0 and 60
    const scaled = Math.min(60, Math.max(0, Math.round((secCorrect / totalQ) * 60)));
    const isSecPassed = scaled >= (sec.passingThreshold || 19);

    sectionScores[sType] = {
      sectionType: sType,
      sectionTitle: sec.title,
      sectionTitleJa: sec.titleJa,
      rawScore: secCorrect * 2,
      maxRawScore: totalQ * 2,
      rawScorePercent: accuracy,
      scaledScore: scaled,
      maxScaledScore: 60,
      passingThreshold: sec.passingThreshold || 19,
      isSectionPassed: isSecPassed,
      correctQuestions: secCorrect,
      totalQuestions: totalQ,
      timeSpentSeconds: payload.sectionTimesSpentSeconds[sType] || 0
    };

    reviewSections.push({
      sectionType: sType,
      title: sec.title,
      titleJa: sec.titleJa,
      scaledScore: scaled,
      maxScaledScore: 60,
      isSectionPassed: isSecPassed,
      questions: questionsReview
    });
  }

  const totalScaledScore =
    (sectionScores['vocabulary']?.scaledScore || 0) +
    (sectionScores['grammar_reading']?.scaledScore || 0) +
    (sectionScores['listening']?.scaledScore || 0);

  const overallThreshold = exam.overallPassingScore || 80;
  const allSectionsPassed =
    (sectionScores['vocabulary']?.isSectionPassed ?? false) &&
    (sectionScores['grammar_reading']?.isSectionPassed ?? false) &&
    (sectionScores['listening']?.isSectionPassed ?? false);

  const isPassed = totalScaledScore >= overallThreshold && allSectionsPassed;

  let failReason: string | undefined = undefined;
  if (!isPassed) {
    if (totalScaledScore < overallThreshold) {
      failReason = `মোট স্কোর ${totalScaledScore}/১৮০ (পাস মার্ক: ${overallThreshold}/১৮০)। কাঙ্ক্ষিত লক্ষ্য অর্জিত হয়নি।`;
    } else {
      const failedSecs: string[] = [];
      if (!sectionScores['vocabulary']?.isSectionPassed) failedSecs.push('文字・語彙 (Vocabulary < 19)');
      if (!sectionScores['grammar_reading']?.isSectionPassed) failedSecs.push('文法・読解 (Grammar/Reading < 19)');
      if (!sectionScores['listening']?.isSectionPassed) failedSecs.push('聴解 (Listening < 19)');
      failReason = `মোট পাস মার্ক অর্জিত হলেও সেকশনাল কাটঅফ পূরণ হয়নি: ${failedSecs.join(', ')}`;
    }
  }

  let letterGrade: 'A' | 'B' | 'C' | 'F' = 'F';
  if (isPassed) {
    if (totalScaledScore >= 140) letterGrade = 'A';
    else if (totalScaledScore >= 110) letterGrade = 'B';
    else letterGrade = 'C';
  }

  const certId = `NIHOMI-JLPT-N5-${Date.now().toString(36).toUpperCase()}`;

  const attempt: MockExamAttempt = {
    id: `att-${Date.now()}`,
    userId: 'usr_current',
    mockExamId: exam.id,
    examCode: exam.examCode,
    level: exam.level,
    startedAt: new Date(Date.now() - (payload.totalTimeSpentSeconds || 60) * 1000).toISOString(),
    submittedAt: new Date().toISOString(),
    timeSpentSeconds: payload.totalTimeSpentSeconds,
    sectionTimesSpentSeconds: payload.sectionTimesSpentSeconds,
    userAnswers: payload.answers.map((ans) => {
      let isCorrect = false;
      for (const s of exam.sections) {
        const q = s.questions.find((item) => item.id === ans.questionId);
        if (q) {
          isCorrect = q.correctOptionIndex === ans.selectedOptionIndex;
          break;
        }
      }
      return {
        ...ans,
        isCorrect
      };
    }),
    sectionScores: sectionScores as any,
    totalScaledScore,
    overallPassingScore: overallThreshold,
    isPassed,
    failReason,
    letterGrade,
    percentileRank: Math.min(99, Math.max(50, Math.round(50 + (totalScaledScore / 180) * 45))),
    certificateId: certId,
    weaknessSummaryBn: isPassed
      ? 'আপনার সামগ্রিক প্রস্তুতি সন্তোষজনক। তবে আরও নির্ভুলতার জন্য কাঞ্জি ও কণার সূক্ষ্ম ব্যবহারে মনোযোগী হোন।'
      : 'ব্যাকরণ ও লিসেনিং সেকশনে স্কোর উন্নয়নের সুযোগ রয়েছে। কণা (Particles: に, で, を) এবং অডিও প্র্যাকটিসে জোর দিন।',
    strengthSummaryBn:
      totalScaledScore >= 80
        ? 'মৌলিক শব্দভাণ্ডার এবং সাধারণ বাক্যগঠন বোধগম্যতা খুবই ভালো।'
        : 'নিয়মিত অনুশীলনের মাধ্যমে উন্নতি সম্ভব। নিহোমি স্পিড চ্যালেঞ্জ ড্রিল চালিয়ে যান।',
    actionableStudyPlanBn: [
      'N5 কাঞ্জি স্ট্রোক অর্ডার ও কুনিয়োমি রিডিং প্রতিদিন ২০ মিনিট রিভিশন করুন।',
      'MemoryOS™ ঘোস্ট মোডে ভুল হওয়া প্রশ্নগুলো পুনরায় অনুশীলন করুন।',
      'টোকিও মেট্রো ও কনবিনি লিসেনিং ডায়লগ নিয়মিত শুনুন।'
    ]
  };

  return {
    success: true,
    attempt,
    reviewSections,
    message: isPassed
      ? '🎉 অভিনন্দন! আপনি অফিসিয়াল JLPT N5 সিমুলেশন পরীক্ষায় সফলভাবে উত্তীর্ণ হয়েছেন (合格)!'
      : 'পরীক্ষা সম্পন্ন হয়েছে। কাঙ্ক্ষিত স্কোর অর্জনের জন্য দুর্বল অংশে পুনরায় অনুশীলন করুন।'
  };
}

export async function fetchMockAttemptDetail(attemptId: string): Promise<{ attempt: MockExamAttempt; reviewSections: any[] } | null> {
  try {
    const token = localStorage.getItem('nihomi_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/mock-exams/attempts/${attemptId}`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Error in fetchMockAttemptDetail:', err);
  }
  return null;
}
