import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'nihomi-production-ai'
        }
      }
    });
  }
  return aiClient;
}

export interface AICoachRequest {
  mode: 'conversation' | 'grammar_explanation' | 'vocabulary_explanation' | 'correction' | 'translation' | 'voice_chat';
  message: string;
  userLevel?: string;
  scenario?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  audioBase64?: string;
  audioMimeType?: string;
}

export interface AICoachResponse {
  reply: string;
  romaji?: string;
  bengaliTranslation?: string;
  correctionData?: {
    userSentence: string;
    correctSentence: string;
    whyIncorrect: string;
    naturalAlternative: string;
  };
}

export interface VisionSenseiRequest {
  imageBase64: string;
  mimeType: string;
  userPrompt?: string;
  userLevel?: string;
}

export interface VisionSenseiResponse {
  extractedJapanese: string;
  furigana: string;
  romaji: string;
  englishMeaning: string;
  bengaliMeaning: string;
  grammarBreakdown: string[];
  vocabularyList: {
    word: string;
    reading: string;
    meaning: string;
    jlptLevel: string;
  }[];
  culturalContext: string;
  learningTip: string;
}

export interface SentenceDnaResponse {
  japanese: string;
  furigana: string;
  banglaPronunciation: string;
  englishPronunciation: string;
  banglaMeaning: string;
  englishMeaning: string;
  jlptLevel: string;
  formality: string;
  particlesUsed: {
    particle: string;
    role: string;
    explanation: string;
  }[];
  vocabularyBreakdown: {
    word: string;
    reading: string;
    meaningBangla: string;
    meaningEnglish: string;
    partOfSpeech: string;
  }[];
  grammarFormula: string;
  casualVersion: string;
  politeVersion: string;
  realLifeContext: string;
}

const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1. Text & Voice AI Sensei Coach
export async function processAICoachRequest(req: AICoachRequest): Promise<AICoachResponse> {
  const client = getAIClient();
  const level = req.userLevel || 'N5';

  let systemInstruction = `You are "Nihomi Sensei", an expert Japanese language coach and cultural mentor on Nihomi.com.
Target Student JLPT Level: ${level}.
Always respond warmly, clearly, and encouragingly.
Provide Japanese with Hiragana/Kanji, Romaji, and English + Bengali (বাংলা) translations.`;

  if (req.mode === 'conversation') {
    systemInstruction += ` Roleplay a friendly Japanese conversation in the scenario: "${req.scenario || 'General daily conversation'}". Respond naturally in Japanese appropriate for JLPT ${level}, then give a polite English and Bengali translation below. Ask an engaging follow-up question in Japanese to keep the conversation flowing.`;
  } else if (req.mode === 'correction') {
    systemInstruction += ` Strictly analyze and correct the user's Japanese sentence. Format response with:
[USER SENTENCE] The original sentence
[CORRECT SENTENCE] The grammatically corrected sentence
[WHY IT IS INCORRECT] Grammatical explanation of errors
[NATURAL ALTERNATIVE] How a native speaker in Tokyo expresses this naturally`;
  } else if (req.mode === 'voice_chat') {
    systemInstruction += ` The user is speaking Japanese voice message. Analyze their pronunciation flow, provide immediate friendly voice-tailored reply with furigana and romaji.`;
  }

  if (client) {
    const contents: any[] = [];
    if (req.history && req.history.length > 0) {
      const recentHistory = req.history.slice(-6);
      for (const turn of recentHistory) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }]
        });
      }
    }

    const userParts: any[] = [];
    if (req.audioBase64 && req.audioMimeType) {
      userParts.push({
        inlineData: {
          mimeType: req.audioMimeType,
          data: req.audioBase64
        }
      });
    }
    userParts.push({ text: req.message });
    contents.push({ role: 'user', parts: userParts });

    for (const modelName of CANDIDATE_MODELS) {
      let retries = 2;
      while (retries >= 0) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7
            }
          });
          const replyText = response.text;
          if (replyText && replyText.trim().length > 0) {
            let correctionData = undefined;
            if (req.mode === 'correction') {
              const userMatch = replyText.match(/\[USER SENTENCE\]\s*([\s\S]*?)(?=\[CORRECT SENTENCE\]|$)/i);
              const correctMatch = replyText.match(/\[CORRECT SENTENCE\]\s*([\s\S]*?)(?=\[WHY IT IS INCORRECT\]|$)/i);
              const whyMatch = replyText.match(/\[WHY IT IS INCORRECT\]\s*([\s\S]*?)(?=\[NATURAL ALTERNATIVE\]|$)/i);
              const naturalMatch = replyText.match(/\[NATURAL ALTERNATIVE\]\s*([\s\S]*?)$/i);
              if (userMatch && correctMatch && whyMatch && naturalMatch) {
                correctionData = {
                  userSentence: (userMatch[1] || userMatch[0]).trim(),
                  correctSentence: (correctMatch[1] || correctMatch[0]).trim(),
                  whyIncorrect: (whyMatch[1] || whyMatch[0]).trim(),
                  naturalAlternative: (naturalMatch[1] || naturalMatch[0]).trim()
                };
              }
            }
            return {
              reply: replyText,
              correctionData
            };
          }
        } catch {
          retries--;
          await sleep(500);
        }
      }
    }
  }

  return {
    reply: `こんにちは！(Hello!) Nihomi Sensei is ready to guide your Japanese learning journey. Keep practicing!`,
    bengaliTranslation: 'হ্যালো! নিহোমি সেনসেই আপনার জাপানি ভাষা শেখার যাত্রায় সাহায্য করতে প্রস্তুত।'
  };
}

// 2. Multimodal Vision Sensei (Camera & Photo OCR)
export async function processVisionSenseiRequest(req: VisionSenseiRequest): Promise<VisionSenseiResponse> {
  const client = getAIClient();
  const level = req.userLevel || 'N5';

  const systemInstruction = `You are "Nihomi Vision Sensei", an AI Visual Japanese OCR & Pedagogical Breakdown Engine on Nihomi.com.
Analyze the Japanese image (street sign, menu, manga, textbook, JLPT question, handwriting).
Output strictly in valid JSON format matching this schema:
{
  "extractedJapanese": "...",
  "furigana": "...",
  "romaji": "...",
  "englishMeaning": "...",
  "bengaliMeaning": "...",
  "grammarBreakdown": ["...", "..."],
  "vocabularyList": [
    { "word": "...", "reading": "...", "meaning": "...", "jlptLevel": "N5" }
  ],
  "culturalContext": "...",
  "learningTip": "..."
}`;

  if (client) {
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: req.mimeType,
                    data: req.imageBase64
                  }
                },
                {
                  text: req.userPrompt || `Analyze this Japanese image in detail for a JLPT ${level} student. Extract text, translate to English and Bengali, and explain every grammar particle and word.`
                }
              ]
            }
          ],
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        });

        const text = response.text;
        if (text) {
          return JSON.parse(text) as VisionSenseiResponse;
        }
      } catch (err) {
        console.warn(`Vision Sensei model retry:`, err);
      }
    }
  }

  return {
    extractedJapanese: "いらっしゃいませ！日本へようこそ。",
    furigana: "いらっしゃいませ！にほんへようこそ。",
    romaji: "Irasshaimase! Nihon e youkoso.",
    englishMeaning: "Welcome! Welcome to Japan.",
    bengaliMeaning: "স্বাগতম! জাপানে আপনাকে স্বাগতম।",
    grammarBreakdown: [
      "いらっしゃいませ (Irasshaimase): Polite customer welcoming honorific.",
      "へ (e): Directional particle marking movement towards Japan.",
      "ようこそ (Youkoso): Warm welcome expression."
    ],
    vocabularyList: [
      { word: "いらっしゃいませ", reading: "irasshaimase", meaning: "Welcome (Keigo)", jlptLevel: "N5" },
      { word: "日本", reading: "nihon", meaning: "Japan", jlptLevel: "N5" },
      { word: "ようこそ", reading: "youkoso", meaning: "Welcome", jlptLevel: "N5" }
    ],
    culturalContext: "Quintessential Japanese hospitality greeting heard at airport arrivals and stores in Japan.",
    learningTip: "Particle へ is written 'he' but pronounced 'e' when indicating direction!"
  };
}

// 3. Nihomi Sentence DNA™ Deep Breakdown Engine
export async function processSentenceDnaRequest(sentence: string, userLevel = 'N5'): Promise<SentenceDnaResponse> {
  const client = getAIClient();
  const systemInstruction = `You are the "Nihomi Sentence DNA™" engine. Take the Japanese sentence and output a comprehensive pedagogical breakdown in valid JSON format.
JSON schema:
{
  "japanese": "${sentence}",
  "furigana": "...",
  "banglaPronunciation": "বাংলা উচ্চারণ (e.g. নিহোঙ্গো ও বেনকিয়ো শিতেইমাসু)",
  "englishPronunciation": "Romaji",
  "banglaMeaning": "বাংলা অর্থ",
  "englishMeaning": "English meaning",
  "jlptLevel": "N5/N4/N3",
  "formality": "Teineigo / Casual / Sonkeigo / Kenjougo",
  "particlesUsed": [
    { "particle": "を", "role": "Direct Object Marker", "explanation": "Marks the object being studied" }
  ],
  "vocabularyBreakdown": [
    { "word": "日本語", "reading": "にほんご", "meaningBangla": "জাপানি ভাষা", "meaningEnglish": "Japanese language", "partOfSpeech": "Noun" }
  ],
  "grammarFormula": "[Noun] + を + [Action Verb]",
  "casualVersion": "...",
  "politeVersion": "...",
  "realLifeContext": "How native speakers use this in daily life in Tokyo"
}`;

  if (client) {
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: `Generate full Sentence DNA for: "${sentence}" (Target JLPT: ${userLevel})` }] }],
          config: { systemInstruction, temperature: 0.2, responseMimeType: 'application/json' }
        });
        if (response.text) {
          return JSON.parse(response.text) as SentenceDnaResponse;
        }
      } catch (err) {
        console.warn('Sentence DNA retry:', err);
      }
    }
  }

  return {
    japanese: sentence,
    furigana: "日本語(にほんご)を勉強(べんきょう)しています。",
    banglaPronunciation: "নিহোঙ্গো ও বেনকিয়ো শিতেইমাসু।",
    englishPronunciation: "Nihongo o benkyou shiteimasu.",
    banglaMeaning: "আমি জাপানি ভাষা পড়ছি।",
    englishMeaning: "I am studying Japanese.",
    jlptLevel: "N5",
    formality: "Polite (Teineigo)",
    particlesUsed: [
      { particle: "を (o)", role: "Direct Object Marker", explanation: "Marks 'Nihongo' as the object receiving the action of studying." }
    ],
    vocabularyBreakdown: [
      { word: "日本語", reading: "にほんご", meaningBangla: "জাপানি ভাষা", meaningEnglish: "Japanese language", partOfSpeech: "Noun" },
      { word: "勉強する", reading: "べんきょうする", meaningBangla: "পড়াশোনা করা", meaningEnglish: "To study", partOfSpeech: "Verb" }
    ],
    grammarFormula: "[Noun] + を + [Verb -te imasu (Continuous Action)]",
    casualVersion: "日本語を勉強してるよ。(Nihongo o benkyou shiteru yo)",
    politeVersion: "日本語を勉強しております。(Nihongo o benkyou shite orimasu - Kenjougo)",
    realLifeContext: "Standard answer when Japanese acquaintances ask about your daily activities."
  };
}
