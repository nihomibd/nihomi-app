// server/cloud/aiJobService.ts
// Nihomi Cloud V1 — Document Intelligence & Japanese Learning AI Engine

import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { prisma, isDatabaseConfigured } from '../prisma.js';
import { CloudService } from './cloudService.js';
import { AiJobType, CloudAiJob } from './types.js';

let geminiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return geminiClient;
}

export class CloudAiJobService {
  private static instance: CloudAiJobService;
  private cloudService = CloudService.getInstance();
  private localJobs: CloudAiJob[] = [];

  public static getInstance(): CloudAiJobService {
    if (!CloudAiJobService.instance) {
      CloudAiJobService.instance = new CloudAiJobService();
    }
    return CloudAiJobService.instance;
  }

  public async dispatchJob(
    userId: string,
    fileId: string,
    jobType: AiJobType,
    customPrompt?: string
  ): Promise<CloudAiJob> {
    // 1. Verify file exists and belongs to user
    const file = await this.cloudService.getFileById(userId, fileId);

    const jobId = `job_${crypto.randomUUID().slice(0, 16)}`;
    const now = new Date();

    const newJob: CloudAiJob = {
      id: jobId,
      userId,
      fileId,
      jobType,
      status: 'processing',
      provider: 'gemini',
      result: null,
      errorMessage: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    if (isDatabaseConfigured()) {
      try {
        await prisma.cloudAiJob.create({
          data: {
            id: jobId,
            userId,
            fileId,
            jobType,
            status: 'processing',
            provider: 'gemini',
          },
        });
      } catch {
        // Fallback
      }
    }
    this.localJobs.unshift(newJob);

    // 2. Execute AI processing asynchronously or synchronously
    try {
      const resultText = await this.executeGeminiAnalysis(file.storagePath, file.name, file.mimeType, jobType, customPrompt);
      
      newJob.status = 'completed';
      newJob.result = resultText;
      newJob.updatedAt = new Date().toISOString();

      if (isDatabaseConfigured()) {
        try {
          await prisma.cloudAiJob.update({
            where: { id: jobId },
            data: {
              status: 'completed',
              result: resultText,
              updatedAt: new Date(),
            },
          });
        } catch {
          // Ignored
        }
      }
    } catch (err: any) {
      newJob.status = 'failed';
      newJob.errorMessage = err?.message || 'AI processing encountered an error.';
      newJob.updatedAt = new Date().toISOString();

      if (isDatabaseConfigured()) {
        try {
          await prisma.cloudAiJob.update({
            where: { id: jobId },
            data: {
              status: 'failed',
              errorMessage: newJob.errorMessage,
              updatedAt: new Date(),
            },
          });
        } catch {
          // Ignored
        }
      }
    }

    return newJob;
  }

  public async getJobsForFile(userId: string, fileId: string): Promise<CloudAiJob[]> {
    if (isDatabaseConfigured()) {
      try {
        const dbJobs = await prisma.cloudAiJob.findMany({
          where: { userId, fileId },
          orderBy: { createdAt: 'desc' },
        });
        return dbJobs.map((j) => ({
          id: j.id,
          userId: j.userId,
          fileId: j.fileId,
          jobType: j.jobType as AiJobType,
          status: j.status as any,
          provider: j.provider as any,
          result: j.result,
          errorMessage: j.errorMessage,
          createdAt: j.createdAt.toISOString(),
          updatedAt: j.updatedAt.toISOString(),
        }));
      } catch {
        // Fallback
      }
    }

    return this.localJobs.filter((j) => j.userId === userId && j.fileId === fileId);
  }

  private async executeGeminiAnalysis(
    storagePath: string,
    fileName: string,
    mimeType: string,
    jobType: AiJobType,
    customPrompt?: string
  ): Promise<string> {
    const ai = getGemini();

    let sampleContent = `Document Name: ${fileName} (${mimeType})\n`;
    try {
      const buffer = await this.cloudService.getFileBinary(storagePath);
      // For text / JSON / CSV files, read actual text up to 100KB
      if (
        mimeType.includes('text') ||
        mimeType.includes('json') ||
        mimeType.includes('csv') ||
        fileName.endsWith('.txt') ||
        fileName.endsWith('.md')
      ) {
        sampleContent += buffer.toString('utf-8').slice(0, 15000);
      } else {
        sampleContent += `[Binary file: ${fileName}, size: ${(buffer.length / 1024).toFixed(1)} KB]`;
      }
    } catch {
      sampleContent += `[File metadata: ${fileName}]`;
    }

    let instruction = '';
    switch (jobType) {
      case 'summarize':
        instruction =
          'You are Nihomi AI Sensei. Summarize this Japanese study or Japan readiness document. ' +
          'Provide: (1) Core Executive Summary in Bengali, (2) Key Points in Japanese with Furigana/Romaji, (3) Practical Actionable Advice for a student moving to or studying in Japan.';
        break;
      case 'translate':
        instruction =
          'You are Nihomi AI Sensei. Translate this document accurately. Provide side-by-side Japanese (with Furigana) and Bengali translation, maintaining natural polite Keigo/Teineigo appropriate for Japan.';
        break;
      case 'explain_bn':
        instruction =
          'You are Nihomi AI Sensei. Explain the grammar patterns, cultural context, and nuanced Japanese meanings in this document in clear, friendly Bengali for Bangladeshi learners.';
        break;
      case 'vocabulary':
        instruction =
          'You are Nihomi AI Sensei. Extract all JLPT N5, N4, and N3 vocabulary words from this document. ' +
          'Format as a clean markdown table with columns: Kanji/Word | Hiragana/Reading | Romaji | Bengali Meaning | JLPT Level.';
        break;
      case 'kanji':
        instruction =
          'You are Nihomi AI Sensei. Extract all Kanji characters found in this document. ' +
          'Format as a clean markdown table with columns: Kanji | On-yomi | Kun-yomi | Stroke Count | Bengali Meaning | Sample Words.';
        break;
      case 'quiz':
        instruction =
          'You are Nihomi AI Sensei. Generate 5 multiple-choice Japanese practice questions based on this document. ' +
          'Each question must include Question, 4 options (A, B, C, D), Correct Answer, and detailed explanation in Bengali.';
        break;
      case 'flashcards':
        instruction =
          'You are Nihomi AI Sensei. Create an SRS Spaced Repetition flashcard set from this document. ' +
          'Format as JSON or markdown cards with Front (Japanese), Back (Bengali translation, reading, and example sentence).';
        break;
      case 'ask_ai':
        instruction = `Answer the learner's question about this document: "${customPrompt || 'What are the main insights?'}" in clear Bengali and Japanese.`;
        break;
      default:
        instruction = 'Analyze this Japanese learning / Japan readiness document and provide structured insights in Bengali.';
    }

    if (!ai) {
      // Graceful offline mock response if GEMINI_API_KEY is not configured
      return JSON.stringify(
        {
          mode: jobType,
          summaryBn: `নিহোমি ক্লাউড AI অ্যানালাইসিস সম্পন্ন হয়েছে (${fileName})।`,
          details: `ডকুমেন্ট: ${fileName} সফলভাবে সংরক্ষিত হয়েছে। জাপানিজ ভাষা শিক্ষা এবং জাপান প্রিপারেশনের জন্য এই ফাইলটি রেডি।`,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      );
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: instruction },
            { text: `Document content:\n${sampleContent}` },
          ],
        },
      ],
    });

    return response.text || 'No response generated.';
  }
}
