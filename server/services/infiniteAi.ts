import { GoogleGenAI } from '@google/genai';
import { db } from '../db.js';

export interface InfiniteDrill {
  id: string;
  category: string;
  scenarioJa: string;
  audioPrompt: string;
  banglaContext: string;
  options: {
    textJa: string;
    textRomaji: string;
    textBn: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  grammarPoint: string;
  xpReward: number;
  visaReadinessGain: string;
}

export class InfiniteAiContentEngine {
  private static ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
  });

  /**
   * Generates a batch of endless, addictive, 15-second micro-learning drills
   * tailored to the student's level and weak areas.
   */
  public static async generateEndlessDrills(userId: string, targetLevel: string = 'N5'): Promise<InfiniteDrill[]> {
    const profile = db.getProfileByUserId(userId);
    const progress = db.getProgressByUserId(userId);
    const completedLessons = progress?.completedLessonIds?.length || (profile as any)?.completedLessons?.length || 1;

    try {
      const prompt = `You are the Lead Curriculum AI for NIHOMI.COM (Japanese Learning for Bangladesh students).
Generate 3 dynamic, fast-paced 15-second Japanese micro-drills for level ${targetLevel}, relevant up to Minna no Nihongo Lesson ${Math.max(completedLessons, 5)}.
The scenarios must be real-life (e.g., 7-Eleven cashier, Shinjuku train station, asking directions in Tokyo, part-time job interview).

Return ONLY valid JSON matching this structure:
[
  {
    "id": "drill-generated-1",
    "category": "Convenience Store (コンビニ)",
    "scenarioJa": "店員:「温めますか？」あなたはどう答えますか？",
    "audioPrompt": "Atatamemasu ka?",
    "banglaContext": "কনবিনি ক্যাশিয়ার জানতে চেয়েছেন: 'খাবারটি কি ওভেনে গরম করে দেব?' আপনি ভদ্রভাবে কী বলবেন?",
    "options": [
      {
        "textJa": "はい、お願いします。",
        "textRomaji": "Hai, onegai shimasu.",
        "textBn": "হ্যাঁ, গরম করে দিন (সবচেয়ে প্রাকৃতিক ও বিনম্র উত্তর)।",
        "isCorrect": true,
        "explanation": "অনুরোধ করার সবচেয়ে চমৎকার জাপানিজ এক্সপ্রেশন হলো お願いします。"
      },
      {
        "textJa": "いいえ、食べます。",
        "textRomaji": "Iie, tabemasu.",
        "textBn": "না, খাব।",
        "isCorrect": false,
        "explanation": "ভুল! এটি অযৌক্তিক শোনায়।"
      }
    ],
    "grammarPoint": "〜お願いします (Polite Request)",
    "xpReward": 40,
    "visaReadinessGain": "+0.4%"
  }
]`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('[Infinite AI Engine] Fallback to curated seed bank:', err);
    }

    // High-Quality Fallback Bank
    return [
      {
        id: `drill-fb-${Date.now()}-1`,
        category: 'Yamanote Line Transit (JR山手線)',
        scenarioJa: '駅員:「どちらまで行かれますか？」',
        audioPrompt: 'Dochira made ikaremasu ka?',
        banglaContext: 'স্টেশন মাস্টার জানতে চেয়েছেন: "আপনি কোন স্টেশনে যাবেন?"',
        options: [
          {
            textJa: '新宿駅まで 行きます。',
            textRomaji: 'Shinjuku-eki made ikimasu.',
            textBn: 'শিনজুকু স্টেশন পর্যন্ত যাব।',
            isCorrect: true,
            explanation: '〜まで行きます (..পর্যন্ত যাব) হলো সঠিক গন্তব্য প্রকাশের নিয়ম।'
          },
          {
            textJa: '新宿駅で 行きます。',
            textRomaji: 'Shinjuku-eki de ikimasu.',
            textBn: 'শিনজুকু স্টেশনে যাব।',
            isCorrect: false,
            explanation: 'ভুল! গন্তব্যের ক্ষেত্রে で বসে না, まで বা に বসে।'
          }
        ],
        grammarPoint: 'N (place) まで行きます',
        xpReward: 35,
        visaReadinessGain: '+0.5%'
      },
      {
        id: `drill-fb-${Date.now()}-2`,
        category: 'Tokyo Restaurant (居酒屋)',
        scenarioJa: '店員:「お飲み物は いかがですか？」',
        audioPrompt: 'Onomimono wa ikaga desu ka?',
        banglaContext: 'ওয়েটার জানতে চাইলেন: "পানীয় হিসেবে কিছু নেবেন কি?"',
        options: [
          {
            textJa: 'お水を ください。',
            textRomaji: 'Omizu o kudasai.',
            textBn: 'দয়া করে পানি দিন।',
            isCorrect: true,
            explanation: 'কোনো দ্রব্য চাওয়ার ক্ষেত্রে N を ください ব্যবহার করা হয়।'
          },
          {
            textJa: 'お水が 飲みます。',
            textRomaji: 'Omizu ga nomimasu.',
            textBn: 'পানি পান করি।',
            isCorrect: false,
            explanation: 'ভুল! পানের কর্মের সাথে を বসে, が নয়।'
          }
        ],
        grammarPoint: 'N を ください (Giving & Ordering)',
        xpReward: 45,
        visaReadinessGain: '+0.6%'
      }
    ];
  }
}
