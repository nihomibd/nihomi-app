import { MockExam, MockExamAttempt, MockExamSectionType } from '../types';

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
    if (!res.ok) throw new Error(`Failed to load mock exams: ${res.statusText}`);
    const data = await res.json();
    return data.mockExams || [];
  } catch (err) {
    console.error('Error in fetchMockExams:', err);
    return [];
  }
}

export async function fetchMockExamById(id: string): Promise<{ mockExam: MockExam; userPastAttempts: MockExamAttempt[] } | null> {
  try {
    const token = localStorage.getItem('nihomi_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/mock-exams/${id}`, { headers });
    if (!res.ok) throw new Error(`Failed to load mock exam: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error in fetchMockExamById:', err);
    return null;
  }
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

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to submit mock exam attempt');
  }

  return await res.json();
}

export async function fetchMockAttemptDetail(attemptId: string): Promise<{ attempt: MockExamAttempt; reviewSections: any[] } | null> {
  try {
    const token = localStorage.getItem('nihomi_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/mock-exams/attempts/${attemptId}`, { headers });
    if (!res.ok) throw new Error(`Failed to load attempt: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error in fetchMockAttemptDetail:', err);
    return null;
  }
}
