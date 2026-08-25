import { JLPTLevel } from '../../types/nihomi';
import { ContentLifecycleStage } from './types';

export interface IngestionJobItem {
  id: string;
  filename: string;
  fileSizeBytes: number;
  level: JLPTLevel;
  sourceHash: string;
  stage: ContentLifecycleStage;
  progressPercent: number;
  extractedConceptsCount: number;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_JOBS: IngestionJobItem[] = [
  {
    id: 'job-mnh-01',
    filename: 'Minna_no_Nihongo_Lesson_1_to_25_Grammar_Master.pdf',
    fileSizeBytes: 14200000,
    level: 'N5',
    sourceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    stage: 'PUBLISHED',
    progressPercent: 100,
    extractedConceptsCount: 78,
    status: 'COMPLETED',
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-08-20T09:12:00.000Z'
  },
  {
    id: 'job-kanji-02',
    filename: 'JLPT_N5_Essential_100_Kanji_Radicals_Workbook.pdf',
    fileSizeBytes: 8900000,
    level: 'N5',
    sourceHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    stage: 'PUBLISHED',
    progressPercent: 100,
    extractedConceptsCount: 103,
    status: 'COMPLETED',
    createdAt: '2026-08-21T11:30:00.000Z',
    updatedAt: '2026-08-21T11:41:00.000Z'
  },
  {
    id: 'job-interview-03',
    filename: 'Tokyo_Language_School_Skype_Interview_Scenarios.pdf',
    fileSizeBytes: 5400000,
    level: 'N5',
    sourceHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    stage: 'HUMAN_REVIEW_REQUIRED',
    progressPercent: 80,
    extractedConceptsCount: 24,
    status: 'PROCESSING',
    createdAt: '2026-08-24T14:15:00.000Z',
    updatedAt: '2026-08-24T14:25:00.000Z'
  }
];

let activeJobs: IngestionJobItem[] = [...DEFAULT_JOBS];

export const BatchIngestionQueue = {
  getJobs(): IngestionJobItem[] {
    return [...activeJobs];
  },

  createBatch(files: { name: string; size: number; level: JLPTLevel }[]): IngestionJobItem[] {
    const newItems: IngestionJobItem[] = files.map((f, idx) => ({
      id: `job-${Date.now()}-${idx}`,
      filename: f.name,
      fileSizeBytes: f.size,
      level: f.level,
      sourceHash: `hash-${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
      stage: 'UPLOADED',
      progressPercent: 10,
      extractedConceptsCount: 0,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    activeJobs = [...newItems, ...activeJobs];
    return [...activeJobs];
  },

  processJobStep(jobId: string): IngestionJobItem | null {
    const jobIndex = activeJobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return null;

    const job = activeJobs[jobIndex];
    let nextStage: ContentLifecycleStage = job.stage;
    let nextProgress = job.progressPercent;
    let nextCount = job.extractedConceptsCount;

    if (job.stage === 'UPLOADED' || job.stage === 'INGESTING') {
      nextStage = 'EXTRACTING';
      nextProgress = 35;
      nextCount = Math.floor(Math.random() * 15) + 5;
    } else if (job.stage === 'EXTRACTING') {
      nextStage = 'NORMALIZING';
      nextProgress = 60;
      nextCount += Math.floor(Math.random() * 20) + 10;
    } else if (job.stage === 'NORMALIZING') {
      nextStage = 'NIHOMI_STANDARD_CHECK';
      nextProgress = 85;
      nextCount += Math.floor(Math.random() * 10) + 5;
    } else if (job.stage === 'NIHOMI_STANDARD_CHECK') {
      nextStage = 'APPROVED';
      nextProgress = 100;
    }

    const updatedJob: IngestionJobItem = {
      ...job,
      stage: nextStage,
      progressPercent: nextProgress,
      extractedConceptsCount: nextCount,
      status: nextProgress >= 100 ? 'COMPLETED' : 'PROCESSING',
      updatedAt: new Date().toISOString()
    };

    activeJobs[jobIndex] = updatedJob;
    return updatedJob;
  },

  clearJobs() {
    activeJobs = [];
  }
};
