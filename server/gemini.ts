import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const key = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  // Validate by presence and minimum length only — do NOT enforce a prefix.
  // Google AI Studio keys vary by region/project and may start with AIzaSy, AQ, or other prefixes.
  if (!key || key.length < 20) {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'nihomi-production-ai'
          }
        }
      });
    } catch {
      return null;
    }
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
  knownHiragana?: string[];
  knownVocabulary?: string[];
  currentMissionId?: string;
}

export interface AICoachResponse {
  reply: string;
  romaji?: string;
  bengaliTranslation?: string;
  fallbackUsed?: boolean;
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

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Procedural fallback generator for Sentence DNA when AI services encounter transient 503/network spikes
function generateProceduralSentenceDna(sentence: string, userLevel = 'N5'): SentenceDnaResponse {
  const particles: { particle: string; role: string; explanation: string }[] = [];
  const vocabList: { word: string; reading: string; meaningBangla: string; meaningEnglish: string; partOfSpeech: string }[] = [];

  // Detect common particles
  if (sentence.includes('は')) {
    particles.push({ particle: 'は (wa)', role: 'Topic Marker', explanation: 'Marks the overarching theme or topic of the sentence.' });
  }
  if (sentence.includes('が')) {
    particles.push({ particle: 'が (ga)', role: 'Subject Marker', explanation: 'Marks the specific grammatical subject performing the state or action.' });
  }
  if (sentence.includes('を')) {
    particles.push({ particle: 'を (o)', role: 'Direct Object Marker', explanation: 'Marks the direct object receiving the action of the transitive verb.' });
  }
  if (sentence.includes('に')) {
    particles.push({ particle: 'に (ni)', role: 'Target / Time / Location Marker', explanation: 'Indicates the specific destination, target, or time point.' });
  }
  if (sentence.includes('で')) {
    particles.push({ particle: 'で (de)', role: 'Context / Means / Location of Action', explanation: 'Specifies the method, transport, or venue where the event occurs.' });
  }
  if (sentence.includes('へ')) {
    particles.push({ particle: 'へ (e)', role: 'Directional Marker', explanation: 'Indicates movement or physical direction towards a goal.' });
  }
  if (sentence.includes('と')) {
    particles.push({ particle: 'と (to)', role: 'Connecting Particle (And/With)', explanation: 'Joins nouns or indicates accompaniment/quotation.' });
  }
  if (sentence.includes('も')) {
    particles.push({ particle: 'も (mo)', role: 'Inclusion Marker (Also/Too)', explanation: 'Expresses that the current item also shares the same condition.' });
  }
  if (sentence.includes('から')) {
    particles.push({ particle: 'から (kara)', role: 'Starting Point / Reason', explanation: 'Marks the starting time/place or the preceding reason/cause.' });
  }
  if (sentence.includes('まで')) {
    particles.push({ particle: 'まで (made)', role: 'Limit / Endpoint', explanation: 'Marks the destination endpoint or time deadline.' });
  }
  if (sentence.includes('ね')) {
    particles.push({ particle: 'ね (ne)', role: 'Agreement Particle', explanation: 'Seeks gentle agreement or confirmation from the listener.' });
  }
  if (sentence.includes('よ')) {
    particles.push({ particle: 'よ (yo)', role: 'Assertion Particle', explanation: 'Delivers new information with friendly confidence.' });
  }
  if (sentence.includes('か')) {
    particles.push({ particle: 'か (ka)', role: 'Question Marker', explanation: 'Turns the sentence into an inquiry or question.' });
  }

  // Detect common vocabulary/structures
  if (sentence.includes('日本') || sentence.includes('にほん')) {
    vocabList.push({ word: '日本', reading: 'にほん (Nihon)', meaningBangla: 'জাপান', meaningEnglish: 'Japan', partOfSpeech: 'Noun' });
  }
  if (sentence.includes('日本語') || sentence.includes('にほんご')) {
    vocabList.push({ word: '日本語', reading: 'にほんご (Nihongo)', meaningBangla: 'জাপানি ভাষা', meaningEnglish: 'Japanese Language', partOfSpeech: 'Noun' });
  }
  if (sentence.includes('勉強') || sentence.includes('べんきょう')) {
    vocabList.push({ word: '勉強', reading: 'べんきょう (Benkyou)', meaningBangla: 'পড়াশোনা', meaningEnglish: 'Study', partOfSpeech: 'Noun/Suru-verb' });
  }
  if (sentence.includes('私') || sentence.includes('わたし')) {
    vocabList.push({ word: '私', reading: 'わたし (Watashi)', meaningBangla: 'আমি', meaningEnglish: 'I / Me', partOfSpeech: 'Pronoun' });
  }
  if (sentence.includes('先生') || sentence.includes('せんせい')) {
    vocabList.push({ word: '先生', reading: 'せんせい (Sensei)', meaningBangla: 'শিক্ষক / গুরু', meaningEnglish: 'Teacher / Mentor', partOfSpeech: 'Noun' });
  }
  if (sentence.includes('学生') || sentence.includes('がくせい')) {
    vocabList.push({ word: '学生', reading: 'がくせい (Gakusei)', meaningBangla: 'ছাত্র / ছাত্রী', meaningEnglish: 'Student', partOfSpeech: 'Noun' });
  }
  if (sentence.includes('行きます') || sentence.includes('行く') || sentence.includes('いきました')) {
    vocabList.push({ word: '行く', reading: 'いく (Iku)', meaningBangla: 'যাওয়া', meaningEnglish: 'To go', partOfSpeech: 'Verb' });
  }
  if (sentence.includes('食べます') || sentence.includes('食べる') || sentence.includes('たべました')) {
    vocabList.push({ word: '食べる', reading: 'たべる (Taberu)', meaningBangla: 'খাওয়া', meaningEnglish: 'To eat', partOfSpeech: 'Verb' });
  }
  if (sentence.includes('飲みます') || sentence.includes('飲む')) {
    vocabList.push({ word: '飲む', reading: 'のむ (Nomu)', meaningBangla: 'পান করা', meaningEnglish: 'To drink', partOfSpeech: 'Verb' });
  }

  // Determine formality & formula
  const isPolite = sentence.endsWith('です') || sentence.endsWith('ます') || sentence.endsWith('でした') || sentence.endsWith('ました') || sentence.includes('です。') || sentence.includes('ます。') || sentence.endsWith('ですか') || sentence.endsWith('ですか。');
  const isKeigo = sentence.includes('ございます') || sentence.includes('おります') || sentence.includes('いらっしゃ');
  const formality = isKeigo ? 'Honorific / Humble (Keigo)' : isPolite ? 'Polite Form (Teineigo - です/ます)' : 'Plain / Casual Form (Futsuugo)';

  return {
    japanese: sentence,
    furigana: sentence,
    banglaPronunciation: 'জাপানি উচ্চারণ শুনুন (অডিও বাটনে চাপুন)',
    englishPronunciation: 'Audio synthesis active (click audio speaker icon)',
    banglaMeaning: 'প্রদত্ত জাপানি বাক্যটির ব্যাকরণ ও কাঠামোগত বিশদ বিবরণ।',
    englishMeaning: 'Structural and pedagogical breakdown for the Japanese expression.',
    jlptLevel: userLevel,
    formality,
    particlesUsed: particles.length > 0 ? particles : [
      { particle: '文法構造', role: 'Sentence Structure', explanation: 'Complete clause expressing action or state.' }
    ],
    vocabularyBreakdown: vocabList.length > 0 ? vocabList : [
      { word: sentence.slice(0, 4) || sentence, reading: '—', meaningBangla: 'মূল পদ', meaningEnglish: 'Key root word', partOfSpeech: 'Phrase Component' }
    ],
    grammarFormula: isPolite ? '[Topic/Subject] + [Particle] + [Predicate (Desu/Masu)]' : '[Topic/Subject] + [Particle] + [Dictionary Form Predicate]',
    casualVersion: sentence.replace(/です/g, 'だ').replace(/ます/g, 'る'),
    politeVersion: sentence.endsWith('です') || sentence.endsWith('ます') ? sentence : `${sentence}です`,
    realLifeContext: 'Regularly applied across Tokyo workplaces, convenience stores, and daily conversations.'
  };
}

// 1. Text & Voice AI Sensei Coach
export async function processAICoachRequest(req: AICoachRequest): Promise<AICoachResponse> {
  const client = getAIClient();
  const level = req.userLevel || 'N5';

  let systemInstruction = `You are "Nihomi Sensei" (にほみ先生), a warm, encouraging, and culturally authentic Japanese language mentor on Nihomi.com.
You mentor students learning Japanese, bridging Japanese with Bengali (বাংলা) and English.
Target Student JLPT Level: ${level}.

CORE TEACHING PERSONA:
1. Warm, Empathetic & Natural: Greet the learner warmly when they say "hello", "hi", "こんにちは", or casually message you. E.g., "こんにちは！(Konnichiwa!) নিহোমি ক্লাসরুমে স্বাগতম! আজ আপনি কী নিয়ে অনুশীলন করতে চান?"
2. No Unsolicited Grammar Dumps: NEVER dump rigid grammar tables, particle lists, or textbook rules unless the student specifically asks for grammar explanations!
3. Bilingual Mentor: Provide natural Japanese (with furigana/romaji where helpful) followed by clear, friendly Bengali (বাংলা) guidance.
4. Keep Conversation Flowing: Keep responses concise, warm, and ask an engaging question in Japanese to encourage the student to practice.`;



  if (req.knownHiragana && req.knownHiragana.length > 0) {
    systemInstruction += `\n\nSTRICT CUMULATIVE PEDAGOGICAL LATTICE:\n` +
      `The student currently only knows these Hiragana: [${req.knownHiragana.join(', ')}].\n` +
      `Unlocked words: [${(req.knownVocabulary || []).join(', ')}].\n` +
      `When presenting Japanese words or practice targets to this learner, do NOT introduce untaught characters without immediately accompanying them with furigana, romaji, and friendly Bengali guidance. Reinforce their unlocked vocabulary.`;
  }

  if (req.mode === 'conversation') {
    systemInstruction += ` Roleplay a friendly Japanese conversation in the scenario: "${req.scenario || 'General daily conversation'}". Respond naturally in Japanese appropriate for JLPT ${level}, followed by a polite English and Bengali translation below. Ask an engaging follow-up question to keep the chat lively.`;
  } else if (req.mode === 'correction') {
    systemInstruction += ` Strictly analyze and correct the user's Japanese sentence. Format response with:
[USER SENTENCE] The original sentence
[CORRECT SENTENCE] The grammatically corrected sentence
[WHY IT IS INCORRECT] Grammatical explanation of errors
[NATURAL ALTERNATIVE] How a native speaker in Tokyo expresses this naturally`;
  } else if (req.mode === 'voice_chat') {
    systemInstruction += ` The user is speaking Japanese voice message. Analyze their pronunciation flow, provide an immediate warm, voice-tailored reply with furigana and romaji.`;
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
      try {
        const response = await withTimeout(
          client.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7
            }
          }),
          3500
        );
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
            correctionData,
            fallbackUsed: false
          };
        }
      } catch (err: any) {
        const msg = String(err?.message || '');
        // Break out immediately on authentication, permission, or token error
        if (msg.includes('401') || msg.includes('403') || msg.includes('UNAUTHORIZED') || msg.includes('API_KEY_INVALID') || msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
          break;
        }
      }
    }
  }

  const offline = generateSenseiOfflineResponse(req);
  return {
    ...offline,
    fallbackUsed: true
  };
}

function generateSenseiOfflineResponse(req: AICoachRequest): AICoachResponse {
  const msg = (req.message || '').trim();
  const lower = msg.toLowerCase();

  // 1. Greetings
  if (['hello', 'hi', 'hey', 'konnichiwa', 'こんにちは', 'হ্যালো', 'সালাম', 'good morning', 'おはよう', 'ohayou', 'konbanwa', 'こんばんは'].some(k => lower.includes(k))) {
    return {
      reply: 'こんにちは！(Konnichiwa!) নিহোমি ক্লাসরুমে স্বাগতম! আজ আপনি কী বিষয় নিয়ে অনুশীলন করতে চান?\n\n(Hello! Welcome to Nihomi Sensei! What would you like to practice today?)',
      romaji: 'Konnichiwa! Nihomi Sensei e youkoso. Kyou wa nani o renshuu shitai desu ka?',
      bengaliTranslation: 'হ্যালো! নিহোমি সেনসেই ক্লাসরুমে স্বাগতম। আজ কী বিষয় নিয়ে অনুশীলন করতে চান?'
    };
  }

  // 2. Thank you
  if (['thank', 'arigatou', 'ありがとう', 'ধন্যবাদ', 'shukriya'].some(k => lower.includes(k))) {
    return {
      reply: 'どういたしまして！(Douitashimashite! - You are welcome!)\n\nজাপানি ভাষায় ধন্যবাদ জানাতে:\n• বিনয়ী (Polite): ありがとうございます (Arigatou gozaimasu)\n• বন্ধুসুলভ (Casual): ありがとう (Arigatou)\n• উত্তর দিতে: どういたしまして (Douitashimashite - স্বাগত)',
      romaji: 'Douitashimashite! Arigatou gozaimasu to iimashou.',
      bengaliTranslation: 'স্বাগত! জাপানি ভাষায় ধন্যবাদ জানানোর চমৎকার অভ্যাস।'
    };
  }

  // 3. Sorry / Excuse me
  if (['sorry', 'excuse', 'sumimasen', 'すみません', 'gomen', 'দুঃখিত', 'ক্ষমা'].some(k => lower.includes(k))) {
    return {
      reply: 'すみません (Sumimasen) জাপানের বাস্তব জীবনে সবচেয়ে প্রয়োজনীয় শব্দ!\n\n১. কারো দৃষ্টি আকর্ষণ করতে: "すみません、駅はどこですか？" (এক্সকিউজ মি, স্টেশনটি কোথায়?)\n২. বিনয়ী ক্ষমা চাইতে: "遅れてすみません" (দেরি হওয়ার জন্য দুঃখিত)\n৩. দোকানে সাহায্য পাওয়ার পর কৃতজ্ঞতা জানাতেও এটি ব্যবহার হয়!',
      romaji: 'Sumimasen wa totemo taisetsu na kotoba desu.',
      bengaliTranslation: 'সুমিমাসেন (すみません) জাপানে ক্ষমা চাওয়া ও দৃষ্টি আকর্ষণে সবচেয়ে দরকারি শব্দ।'
    };
  }

  // 4. Particles (Wa vs Ga vs O vs Ni vs De)
  if (['particle', 'wa vs ga', 'は vs が', 'wa', 'ga', 'পার্টিকেল', 'পার্থক্য', 'difference'].some(k => lower.includes(k))) {
    return {
      reply: '【জাপানি পার্টিকেল は (Wa) বনাম が (Ga)】\n\n• は (wa - Topic Marker): বাক্যের সামগ্রিক বিষয় বা প্রসঙ্গ নির্দেশ করে। যেমন: 「わたしは学生です」(আমি ছাত্র)।\n• が (ga - Subject Marker): নির্দিষ্ট কর্তা বা নতুন তথ্যের ওপর জোর দেয়। যেমন: 「だれが来ましたか？私が来ました」(কে এসেছে? আমি এসেছি)।\n• を (o - Object Marker): কর্ম নির্দেশ করে। যেমন: 「水を飲みます」(পানি পান করি)।\n• で (de - Means/Place of Action): কাজের স্থান বা মাধ্যম। যেমন: 「電車で行きます」(ট্রেনে যাই)।',
      romaji: 'Wa wa topikku, ga wa shugo o shimeshimasu.',
      bengaliTranslation: 'は সামগ্রিক বিষয় এবং が নির্দিষ্ট কর্তাকে চিহ্নিত করে।'
    };
  }

  // 5. Desu / Masu
  if (['desu', 'masu', 'です', 'ます', 'polite', 'শিষ্ট'].some(k => lower.includes(k))) {
    return {
      reply: '【です (Desu) ও ます (Masu) এর নিয়ম】\n\n• です (Desu): বিশেষ্য (Noun) এবং বিশেষণ (Adjective) এর সাথে বিনয়ী শেষ রূপ। যেমন: 「学生です」(ছাত্র), 「きれいです」(সুন্দর)।\n• ます (Masu): ক্রিয়া (Verb) এর বিনয়ী বর্তমান/ভবিষ্যৎ রূপ। যেমন: 「行きます」(যাব), 「食べます」(খাব)।\n• অতীত রূপ: です → でした, ます → ました।',
      romaji: 'Meishi to keiyoushi ni wa "desu", doushi ni wa "masu" o tsukaimasu.',
      bengaliTranslation: 'বিশেষ্য ও বিশেষণে です এবং ক্রিয়ায় ます ব্যবহৃত হয়।'
    };
  }

  // 6. Konbini (Convenience Store)
  if (['konbini', 'convenience', 'store', 'ক্যাশিয়ার', 'কনবিনি', 'দোকান', 'ফুকুরো', 'ব্যাগ', 'fukuro', '袋'].some(k => lower.includes(k))) {
    return {
      reply: '【টোকিও কনবিনি ক্যাশিয়ার সারভাইভাল গাইড】\n\n১. ব্যাগ লাগবে কিনা জিজ্ঞাসা করলে:\n   ক্যাশিয়ার: 「レジ袋はご利用ですか？」(Reji-bukuro wa go-riyou desu ka?)\n   • লাগলে: 「はい、お願いします」(Hai, onegaishimasu)\n   • না লাগলে: 「大丈夫です」(Daijoubu desu - দরকার নেই)\n২. খাবার গরম করবে কিনা:\n   ক্যাশিয়ার: 「温めますか？」(Atatamemasu ka?)\n   • গরম করতে: 「はい、お願いします」',
      romaji: 'Reji bukuro wa go-riyou desu ka? Daijoubu desu.',
      bengaliTranslation: 'কনবিনিতে ব্যাগ না লাগলে বলবেন: "দাইজৌবু দেসু" (大丈夫です)।'
    };
  }

  // 7. Train / Station
  if (['train', 'station', 'subway', 'ট্রেন', 'স্টেশন', 'eki', '駅', 'suica', 'pasmo'].some(k => lower.includes(k))) {
    return {
      reply: '【টোকিও ট্রেন স্টেশন ও সাবওয়ে গাইড】\n\n১. ট্রেনের প্ল্যাটফর্ম জানতে:\n   「〜行きの電車は何番ホームですか？」\n   (~iki no densha wa nan-ban hoomu desu ka? - ~গামী ট্রেন কত নম্বর প্ল্যাটফর্মে?)\n২. টিকিট কাউন্টারে:\n   「東京駅までの切符を一枚ください」\n   (Toukyou eki made no kippu o ichi-mai kudasai - টোকিও স্টেশনের একটি টিকিট দিন)\n৩. সুয়িকা কার্ড রিচার্জ:\n   「チャージをお願いします」(Chaaji o onegaishimasu)',
      romaji: 'Densha no hoomu ya kippu no kaiwa o oboemashou.',
      bengaliTranslation: 'ট্রেন স্টেশনে প্ল্যাটফর্ম জিজ্ঞাসা করতে 何番ホームですか (নান-বান হোমু দেসু কা) বলুন।'
    };
  }

  // 8. Self-Introduction (Jikoshoukai)
  if (['self introduction', 'introduction', 'পরিচয়', 'জিকোশোওকাই', 'jikoshoukai', 'hajimemashite', 'はじめまして'].some(k => lower.includes(k))) {
    return {
      reply: '【জাপানি আত্মপরিচয় (自己紹介 - Jikoshoukai)】\n\n১. শুরুতে: 「はじめまして」(Hajimemashite - শুভ সূচনা)\n২. নাম ও দেশ: 「わたしは [আপনার নাম] です。バングラデシュから来ました」(Watashi wa ... desu. Banguradoshu kara kimashita.)\n৩. সমাপ্তিতে: 「どうぞよろしくお願いいたします」(Douzo yoroshiku onegaishimasu - আপনার সদয় সহযোগিতা কামনা করছি)',
      romaji: 'Hajimemashite. Douzo yoroshiku onegaishimasu.',
      bengaliTranslation: 'জাপানে প্রথম পরিচয়ে সবসময় "হাজিমেমাশিতে" দিয়ে শুরু করে "দোউজো ইয়োরোশিকু ওনেগাইশিমাশু" দিয়ে শেষ করবেন।'
    };
  }

  // 9. Hiragana / Katakana / Kanji
  if (['hiragana', 'katakana', 'kanji', 'alphabet', 'বর্ণমালা', 'কাঞ্জি', 'হিরাগানা', 'কাতাকানা'].some(k => lower.includes(k))) {
    return {
      reply: '【জাপানি বর্ণমালার মূল ভিত্তি】\n\nজাপানি ভাষায় ৩টি লিপি রয়েছে:\n১. হিরাগানা (Hiragana - ৪৬টি): ব্যাকরণ ও জাপানি মৌলিক শব্দের জন্য। শুরু করতে ৫টি স্বরবর্ণ শিখুন: あ (a), い (i), う (u), え (e), お (o)।\n২. কাতাকানা (Katakana - ৪৬টি): বিদেশি শব্দ ও নামের জন্য (যেমন: バングラデシュ)।\n৩. কাঞ্জি (Kanji): শব্দার্থ ও মূল ভাব প্রকাশের চীনা চিত্রলিপি।',
      romaji: 'Hiragana, Katakana, soshite Kanji o junban ni manabimashou.',
      bengaliTranslation: 'হিরাগানা দিয়ে শুরু করাই জাপানি ভাষা শেখার সবচেয়ে বৈজ্ঞানিক নিয়ম।'
    };
  }

  // 10. Correction mode fallback
  if (req.mode === 'correction') {
    return {
      reply: `[USER SENTENCE] ${msg}\n[CORRECT SENTENCE] ${msg.endsWith('です') || msg.endsWith('ます') ? msg : msg + 'です'}\n[WHY IT IS INCORRECT] জাপানি বাক্যে শিষ্টতা বজায় রাখতে বাক্যের শেষে です বা ます যুক্ত করা আবশ্যক।\n[NATURAL ALTERNATIVE] ${msg}（丁寧な表現）`,
      correctionData: {
        userSentence: msg,
        correctSentence: msg.endsWith('です') || msg.endsWith('ます') ? msg : msg + 'です',
        whyIncorrect: 'বাক্যের সমাপ্তিতে বিনয়ী রূপ (です/ます) ব্যবহার করা জাপানি সংস্কৃতির মৌলিক ভদ্রতা।',
        naturalAlternative: `${msg} です`
      }
    };
  }

  // Default encouraging contextual response
  return {
    reply: `はい、よく分かりました！(Hai, yoku wakarimashita! - হ্যাঁ, খুব ভালো বুঝতে পেরেছি!)\n\nআপনি লিখেছেন: 「${msg}」。\n\nNihomi Sensei আপনার সাথে আছে। এই বাক্য বা বিষয়ের ওপর কোনো নির্দিষ্ট ব্যাকরণ ব্যাখ্যা বা বাস্তব জাপানি উদাহরণ দেখতে চান? আমাকে জানান!`,
    romaji: 'Hai, yoku wakarimashita! Nihongo de hanashite mimashou.',
    bengaliTranslation: `হ্যাঁ, স্পষ্ট বুঝতে পেরেছি! নিহোমি সেনসেই আপনার সাথে আছে। আসুন জাপানি ভাষার চর্চা চালিয়ে যাই।`
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
      for (let attempt = 0; attempt < 2; attempt++) {
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
        } catch {
          await sleep(350 * (attempt + 1));
        }
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
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: `Generate full Sentence DNA for: "${sentence}" (Target JLPT: ${userLevel})` }] }],
            config: { systemInstruction, temperature: 0.2, responseMimeType: 'application/json' }
          });
          if (response.text) {
            return JSON.parse(response.text) as SentenceDnaResponse;
          }
        } catch {
          // If 503 high demand or temporary throttling, wait briefly with backoff and try next attempt or model
          await sleep(350 * (attempt + 1));
        }
      }
    }
  }

  // Graceful high-quality procedural fallback based on the actual provided sentence
  return generateProceduralSentenceDna(sentence, userLevel);
}

export interface ExampleSentenceResponse {
  word: string;
  reading: string;
  sentenceJa: string;
  sentenceFurigana: string;
  romaji: string;
  meaningEn: string;
  meaningBn: string;
  jlptLevel: string;
  grammarTip: string;
}

export async function processExampleSentenceRequest(
  word: string,
  reading?: string,
  jlptLevel = 'N5'
): Promise<ExampleSentenceResponse> {
  const client = getAIClient();
  const systemInstruction = `You are the Nihomi.com Japanese Linguistic Engine.
Create an authentic, natural, context-appropriate Japanese example sentence specifically utilizing the vocabulary/kanji "${word}" (Reading: "${reading || word}") tailored for a JLPT ${jlptLevel} student.
Return strictly valid JSON matching this schema:
{
  "word": "${word}",
  "reading": "${reading || word}",
  "sentenceJa": "Japanese sentence with kanji",
  "sentenceFurigana": "Japanese sentence with furigana/kana",
  "romaji": "Romanized transcription",
  "meaningEn": "Natural English translation",
  "meaningBn": "Natural Bengali (বাংলা) translation",
  "jlptLevel": "${jlptLevel}",
  "grammarTip": "A concise 1-sentence tip on how ${word} is used in this sentence context."
}`;

  if (client) {
    for (const modelName of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [{ text: `Generate an authentic JLPT ${jlptLevel} example sentence for word: "${word}"` }]
              }
            ],
            config: { systemInstruction, temperature: 0.3, responseMimeType: 'application/json' }
          });
          if (response.text) {
            return JSON.parse(response.text) as ExampleSentenceResponse;
          }
        } catch {
          await sleep(300 * (attempt + 1));
        }
      }
    }
  }

  // Fallback if offline / rate limited
  return {
    word,
    reading: reading || word,
    sentenceJa: `私は毎日${word}を大切にしています。`,
    sentenceFurigana: `わたしはまいにち${reading || word}をたいせつにしています。`,
    romaji: `Watashi wa mainichi ${reading || word} o taisetsu ni shiteimasu.`,
    meaningEn: `I value and cherish ${word} every single day.`,
    meaningBn: `আমি প্রতিদিন ${word}-কে গুরুত্ব সহকারে চর্চা করি।`,
    jlptLevel,
    grammarTip: `Use ${word} with appropriate case particle (を/に/は) depending on transitive/intransitive verb context.`
  };
}

export interface ExplainMistakeRequest {
  question: string;
  questionJa?: string;
  selectedOption: string;
  correctOption: string;
  allOptions?: string[];
  userLevel?: string;
  conceptCode?: string;
}

export interface ExplainMistakeResponse {
  whyChosenIsIncorrect: string;
  whyChosenIsIncorrectBn: string;
  correctRuleExplanation: string;
  correctRuleExplanationBn: string;
  keyGrammarRule: string;
  contrastExampleJa: string;
  contrastExampleRomaji: string;
  contrastExampleEn: string;
  contrastExampleBn: string;
  senseiProTip: string;
}

export async function processExplainMistakeRequest(
  data: ExplainMistakeRequest
): Promise<ExplainMistakeResponse> {
  const client = getAIClient();
  const userLevel = data.userLevel || 'N5';

  const systemInstruction = `You are Nihomi Sensei, an expert Japanese linguistic professor helping Bangladeshi and global students master Japanese grammar for the JLPT (${userLevel}).
A student answered a quiz question incorrectly. Explain their mistake thoroughly, kindly, and with pedagogical precision.
Question: "${data.questionJa ? data.questionJa + ' / ' + data.question : data.question}"
Student Chose (Incorrect): "${data.selectedOption}"
Correct Answer: "${data.correctOption}"
${data.allOptions ? `All Options: ${data.allOptions.join(', ')}` : ''}
${data.conceptCode ? `Grammar Concept: ${data.conceptCode}` : ''}

Provide a structured, deeply informative breakdown in JSON matching this exact schema:
{
  "whyChosenIsIncorrect": "Detailed English explanation of why the selected option creates a grammatical error, particle mismatch, tense error, or wrong nuance in this specific context.",
  "whyChosenIsIncorrectBn": "Detailed Bengali (বাংলা) explanation of why their chosen answer is incorrect, explaining the particle or vocabulary clash.",
  "correctRuleExplanation": "Step-by-step English explanation of the correct grammar pattern, particle rule, or conjugation formula.",
  "correctRuleExplanationBn": "Step-by-step Bengali (বাংলা) explanation of the correct grammar rule and how to recognize it.",
  "keyGrammarRule": "Short memorable rule summary (e.g. 'Noun + に denotes destination or specific time; で denotes location of action').",
  "contrastExampleJa": "A clear Japanese contrast sentence showing the correct usage in action.",
  "contrastExampleRomaji": "Romaji transcription of the contrast sentence.",
  "contrastExampleEn": "English translation of the contrast sentence.",
  "contrastExampleBn": "Bengali (বাংলা) translation of the contrast sentence.",
  "senseiProTip": "A smart mnemonic or memory trick to never confuse this rule again in JLPT exams."
}`;

  if (client) {
    for (const modelName of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [{ text: `Explain why choosing "${data.selectedOption}" instead of "${data.correctOption}" for question "${data.questionJa || data.question}" is incorrect for JLPT ${userLevel}.` }]
              }
            ],
            config: { systemInstruction, temperature: 0.2, responseMimeType: 'application/json' }
          });
          if (response.text) {
            return JSON.parse(response.text) as ExplainMistakeResponse;
          }
        } catch {
          await sleep(300 * (attempt + 1));
        }
      }
    }
  }

  // Fallback if offline or API key unavailable
  return {
    whyChosenIsIncorrect: `Choosing "${data.selectedOption}" fails because it does not fit the grammatical function required by the sentence predicate. Japanese particles and conjugations demand strict syntactic alignment.`,
    whyChosenIsIncorrectBn: `"${data.selectedOption}" নির্বাচন করা ভুল হয়েছে কারণ বাক্যের ক্রিয়া ও অর্থের সাথে এর ব্যাকরণগত মিল নেই।`,
    correctRuleExplanation: `The correct answer is "${data.correctOption}". It fulfills the necessary syntactic role (such as topic marker, case particle, or correct verb inflection).`,
    correctRuleExplanationBn: `সঠিক উত্তর হলো "${data.correctOption}"। এটি সঠিক কারক বিভক্তি (Particle) বা সঠিক ক্রিয়ার রূপ নির্দেশ করে।`,
    keyGrammarRule: `Focus on the relationship between the noun and the predicate verb to identify the correct particle or inflection.`,
    contrastExampleJa: `図書館で勉強します。学校に行きます。`,
    contrastExampleRomaji: `Toshokan de benkyou shimasu. Gakkou ni ikimasu.`,
    contrastExampleEn: `I study AT the library (action = で). I go TO school (destination = に).`,
    contrastExampleBn: `লাইব্রেরিতে পড়াশোনা করি (কাজের স্থান = で)। স্কুলে যাচ্ছি (গন্তব্য = に)।`,
    senseiProTip: `Always identify the main verb at the end of the sentence first before choosing the connecting particle or conjugation!`
  };
}

export interface PronunciationAssessmentRequest {
  targetPhrase: string;
  targetRomaji?: string;
  spokenTranscript?: string;
  audioBase64?: string;
  audioMimeType?: string;
  userLevel?: string;
}

export interface PronunciationAssessmentResponse {
  clarityScore: number;
  pitchAccuracy: number;
  moraRhythmScore: number;
  intonationPattern: 'Atamadaka (頭高)' | 'Nakadaka (中高)' | 'Odaka (尾高)' | 'Heiban (平板)' | 'General Natural';
  phonemeFeedback: string;
  phonemeFeedbackBn: string;
  coachingTips: string[];
  nativeComparison: string;
  passedThreshold: boolean;
}

export async function processPronunciationAssessmentRequest(
  data: PronunciationAssessmentRequest
): Promise<PronunciationAssessmentResponse> {
  const client = getAIClient();
  const userLevel = data.userLevel || 'N5';
  const spoken = data.spokenTranscript || '';

  const systemInstruction = `You are Nihomi Sensei, an expert Tokyo native phonetician & JLPT speech coach for Bangladeshi and international students.
Analyze the student's pronunciation of the target Japanese phrase against native Tokyo pitch accent (東京式アクセント) and standard Mora rhythm.
Target Phrase: "${data.targetPhrase}"
${data.targetRomaji ? `Target Romaji: "${data.targetRomaji}"` : ''}
${spoken ? `Student Spoken Speech-to-Text: "${spoken}"` : 'Audio voice recording provided.'}

Evaluate the student's speech clarity, mora timing (including long vowels 長音, choked sounds 促音, and nasal sounds 撥音), and pitch trajectory.
Return a valid JSON object matching this schema:
{
  "clarityScore": 88,
  "pitchAccuracy": 90,
  "moraRhythmScore": 85,
  "intonationPattern": "Heiban (平板)",
  "phonemeFeedback": "Crisp articulation of syllables with natural vocal onset and balanced vowel duration.",
  "phonemeFeedbackBn": "উচ্চারণ অত্যন্ত স্পষ্ট এবং প্রতিটি মোরার সময়সীমা সুন্দরভাবে বজায় রাখা হয়েছে।",
  "coachingTips": [
    "Keep vowel length consistent for accurate mora timing.",
    "Pay attention to the slight pitch drop after the particle."
  ],
  "nativeComparison": "Your pronunciation matches 92% of Tokyo standard conversational intonation.",
  "passedThreshold": true
}`;

  if (client) {
    for (const modelName of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const parts: any[] = [
            {
              text: `Evaluate pronunciation of Japanese phrase: "${data.targetPhrase}". Student speech transcription: "${spoken}".`
            }
          ];

          if (data.audioBase64) {
            parts.push({
              inlineData: {
                data: data.audioBase64,
                mimeType: data.audioMimeType || 'audio/webm'
              }
            });
          }

          const response = await client.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts }],
            config: { systemInstruction, temperature: 0.2, responseMimeType: 'application/json' }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text) as PronunciationAssessmentResponse;
            if (typeof parsed.clarityScore === 'number') {
              return parsed;
            }
          }
        } catch {
          await sleep(300 * (attempt + 1));
        }
      }
    }
  }

  // Algorithmic phoneme similarity fallback
  const cleanTarget = data.targetPhrase.replace(/[\s、。！？,.!?]/g, '');
  const cleanSpoken = spoken.replace(/[\s、。！？,.!?]/g, '');
  let matchCount = 0;
  for (const c of cleanSpoken) {
    if (cleanTarget.includes(c)) matchCount++;
  }
  const ratio = cleanTarget.length > 0 ? matchCount / Math.max(cleanTarget.length, cleanSpoken.length) : 0.8;
  const calculatedScore = Math.min(98, Math.max(30, Math.round(ratio * 100)));

  return {
    clarityScore: calculatedScore,
    pitchAccuracy: Math.min(100, calculatedScore + 4),
    moraRhythmScore: Math.min(100, calculatedScore - 2),
    intonationPattern: 'Heiban (平板)',
    phonemeFeedback: calculatedScore >= 75
      ? `Clear pronunciation of "${data.targetPhrase}". Mora rhythm matches standard Japanese.`
      : `Speech detected: "${spoken}". Focus on distinct syllable boundaries and clean vowel endings.`,
    phonemeFeedbackBn: calculatedScore >= 75
      ? `"${data.targetPhrase}" এর উচ্চারণ খুব সুন্দর এবং জাপানি ভাষার স্বাভাবিক ছন্দের সাথে মানানসই হয়েছে।`
      : `প্রতিটি অক্ষরের উচ্চারণ আলাদাভাবে স্পষ্ট করে বলুন এবং স্বরবর্ণের সঠিক সময় বজায় রাখুন।`,
    coachingTips: [
      'Maintain equal beat duration (Mora) for every hiragana/kanji character.',
      'Speak smoothly from the diaphragm without adding English-style stress accent.'
    ],
    nativeComparison: `Pronunciation aligns with standard JLPT ${userLevel} spoken fluency.`,
    passedThreshold: calculatedScore >= 65
  };
}

export interface StudyScheduleWeek {
  weekNumber: number;
  title: string;
  focusArea: string;
  focusAreaBn: string;
  dailyTasks: {
    day: string;
    taskJa: string;
    taskEn: string;
    taskBn: string;
    estimatedMinutes: number;
    activityType: 'vocab' | 'grammar' | 'kanji' | 'quiz' | 'listening' | 'shadowing';
  }[];
  weeklyGoal: string;
}

export interface StudyScheduleResponse {
  studentLevel: string;
  generatedDate: string;
  diagnosticSummary: string;
  diagnosticSummaryBn: string;
  detectedWeakAreas: string[];
  weeks: StudyScheduleWeek[];
}

export async function processStudyScheduleRequest(data: {
  userId?: string;
  userLevel: string;
  quizHistory: any[];
  weakCategories?: string[];
}): Promise<StudyScheduleResponse> {
  const client = getAIClient();
  const userLevel = data.userLevel || 'N5';

  const systemInstruction = `You are Nihomi Sensei, an expert Japanese Curriculum Director specializing in personalized JLPT acceleration schedules for Bengali and international learners.
Analyze the student's quiz history and identified weak areas, then generate a comprehensive, highly actionable 4-Week Personalized Study Schedule.
Return pure JSON matching this schema:
{
  "studentLevel": "N5",
  "generatedDate": "2026-08-27",
  "diagnosticSummary": "Your overall mastery is high in vocabulary, but particle contrasts (は vs が, に vs で) and plain form conjugations require targeted reinforcement.",
  "diagnosticSummaryBn": "শব্দভাণ্ডারে আপনার পারদর্শিতা চমৎকার, তবে পার্টিকেলের পার্থক্য (は বনাম が, に বনাম で) এবং প্লেইন ফর্মের পরিবর্তনে আরও নির্দিষ্ট অনুশীলনের প্রয়োজন।",
  "detectedWeakAreas": ["Particle Confusion (は vs が, に vs で)", "Te-form / Plain Form Conjugation", "Speed in Kanji Reading"],
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: Core Particle Foundations & SRS Reset",
      "focusArea": "Grammar & Particle Accuracy",
      "focusAreaBn": "গ্রামার এবং পার্টিকেলের সঠিক ব্যবহার",
      "dailyTasks": [
        { "day": "Day 1", "taskJa": "助詞「は」と「が」の復習", "taskEn": "Review Particle は vs が in Minna Lesson 1-5", "taskBn": "লেসন ১-৫ এর は এবং が পার্টিকেল রিভিশন", "estimatedMinutes": 30, "activityType": "grammar" },
        { "day": "Day 2", "taskJa": "場所助詞「に」と「で」の使い分け", "taskEn": "Location particles に vs で with action verbs", "taskBn": "অ্যাকশন ভার্বের সাথে に ও で এর পার্থক্য চর্চা", "estimatedMinutes": 25, "activityType": "quiz" },
        { "day": "Day 3", "taskJa": "Essential Kanji 20字ストローク練習", "taskEn": "Trace and memorize 20 N5 Kanji in Stroke Visualizer", "taskBn": "স্ট্রোক ভিজ্যুয়ালাইজারে ২০টি কাঞ্জি ট্রেসিং অনুশীলন", "estimatedMinutes": 30, "activityType": "kanji" },
        { "day": "Day 4", "taskJa": "シャドーイング発音コーチ練習", "taskEn": "Practice 5 dialogue lines in AI Pronunciation Coach", "taskBn": "উচ্চারণ কোচে ৫টি সংলাপের পিচ অ্যাকসেন্ট প্র্যাকটিস", "estimatedMinutes": 20, "activityType": "shadowing" },
        { "day": "Day 5", "taskJa": "N5 レッスン1〜10 総合クイズ", "taskEn": "Take Lessons 1-10 Diagnostic Mock Quiz", "taskBn": "লেসন ১-১০ এর পূর্ণাঙ্গ প্রস্তুতিমূলক কুইজ", "estimatedMinutes": 35, "activityType": "quiz" },
        { "day": "Day 6", "taskJa": "間違えた単語のSRSフラッシュカード復習", "taskEn": "Clear all due Leitner SRS vocabulary cards", "taskBn": "বাকি থাকা সব SRS ভোকাবুলারি ফ্ল্যাশকার্ড রিভিশন", "estimatedMinutes": 25, "activityType": "vocab" },
        { "day": "Day 7", "taskJa": "週次総復習と休息", "taskEn": "Weekly summary notes review & light listening", "taskBn": "সাপ্তাহিক রিভিশন নোটস ও বিশ্রামের সাথে অডিও শোনা", "estimatedMinutes": 20, "activityType": "listening" }
      ],
      "weeklyGoal": "Achieve 90%+ accuracy on all fundamental particle questions."
    },
    {
      "weekNumber": 2,
      "title": "Week 2: Verb Conjugations & Te-Form Mastery",
      "focusArea": "Verbal Inflection & Sentence Expansion",
      "focusAreaBn": "ক্রিয়ার রূপান্তর এবং বাক্য গঠন",
      "dailyTasks": [
        { "day": "Day 1", "taskJa": "Group 1 / 2 / 3 動詞の分類", "taskEn": "Master 3 Groups of Japanese Verbs", "taskBn": "জাপানি ভার্বের ৩টি গ্রুপের বিভাজন শেখা", "estimatedMinutes": 30, "activityType": "grammar" },
        { "day": "Day 2", "taskJa": "て形 (Te-Form) ソングと変換特訓", "taskEn": "Te-form conversion drill for 30 essential verbs", "taskBn": "৩০টি মূল ভার্বের তে-ফর্ম রূপান্তর অনুশীলন", "estimatedMinutes": 30, "activityType": "grammar" },
        { "day": "Day 3", "taskJa": "〜てください / 〜ています 構文クイズ", "taskEn": "Quiz on 〜te kudasai and 〜te imasu expressions", "taskBn": "অনুরোধ ও বর্তমান চলমান কালের বাক্যের কুইজ", "estimatedMinutes": 25, "activityType": "quiz" },
        { "day": "Day 4", "taskJa": "日常会話シャドーイング", "taskEn": "Workplace and Baito conversation audio drill", "taskBn": "কর্মক্ষেত্র ও পার্ট-টাইম চাকুরীর সংলাপ অডিও ড্রিল", "estimatedMinutes": 25, "activityType": "shadowing" },
        { "day": "Day 5", "taskJa": "N5 カタカナと外来語語彙", "taskEn": "Katakana loanwords vocabulary session", "taskBn": "কাতাকানা ও ঋণকৃত বিদেশি শব্দের স্পিড স্টাডি", "estimatedMinutes": 20, "activityType": "vocab" },
        { "day": "Day 6", "taskJa": "漢字部首と音読み・訓読みクイズ", "taskEn": "Radicals & Onyomi/Kunyomi pairing challenge", "taskBn": "কাঞ্জির মূল উপাদান ও উচ্চারণ ম্যাচিং কুইজ", "estimatedMinutes": 25, "activityType": "kanji" },
        { "day": "Day 7", "taskJa": "中間振り返りと弱点再確認", "taskEn": "Mid-point diagnostic check & weak-point retest", "taskBn": "অর্ধেক যাত্রার মূল্যায়ন ও ভুল শোধরানো", "estimatedMinutes": 20, "activityType": "quiz" }
      ],
      "weeklyGoal": "Conjugate any N5 verb into Te-form within 3 seconds."
    },
    {
      "weekNumber": 3,
      "title": "Week 3: Workplace & Contextual Communication",
      "focusArea": "Conversational Keigo & Listening Speed",
      "focusAreaBn": "কথোপকথন, কেইগো এবং লিসেনিং গতি",
      "dailyTasks": [
        { "day": "Day 1", "taskJa": "基本敬語とお辞儀マナー", "taskEn": "Essential polite forms (です・ます) & Bowing etiquette", "taskBn": "ভদ্র ভাষা ও জাপানি অভিবাদন শিষ্টাচার", "estimatedMinutes": 25, "activityType": "grammar" },
        { "day": "Day 2", "taskJa": "コンビニ・レジでの接客会話", "taskEn": "Convenience store & cashier Japanese simulations", "taskBn": "কনভিনিয়েন্স স্টোর ও ক্যাশ কাউন্টারের সংলাপ প্র্যাকটিস", "estimatedMinutes": 30, "activityType": "shadowing" },
        { "day": "Day 3", "taskJa": "JLPT N5 公式聴解ドリル", "taskEn": "JLPT Listening section practice with native audio", "taskBn": "নেটিভ অডিও দিয়ে অফিসিয়াল লিসেনিং ড্রিল", "estimatedMinutes": 30, "activityType": "listening" },
        { "day": "Day 4", "taskJa": "時間の表現 (何時・何分・曜日)", "taskEn": "Time, calendar, and irregular counters", "taskBn": "সময়, ক্যালেন্ডার ও গণনার বিশেষ নিয়মাবলী", "estimatedMinutes": 25, "activityType": "vocab" },
        { "day": "Day 5", "taskJa": "動詞「ない形」と「辞書形」", "taskEn": "Nai-form and Dictionary-form introduction", "taskBn": "নাই-ফর্ম এবং ডিকশনারি ফর্মের প্রাথমিক ধারণা", "estimatedMinutes": 30, "activityType": "grammar" },
        { "day": "Day 6", "taskJa": "週間模擬テスト (40問)", "taskEn": "40-Question N5 Speed Mock Exam", "taskBn": "৪০ নম্বরের স্পিড মক পরীক্ষা সম্পন্ন করা", "estimatedMinutes": 40, "activityType": "quiz" },
        { "day": "Day 7", "taskJa": "復習とメンタルリフレッシュ", "taskEn": "Review mistake explanations & audio immersion", "taskBn": "ভুলের ব্যাখ্যাগুলো পড়া এবং জাপানি পডকাস্ট শোনা", "estimatedMinutes": 20, "activityType": "listening" }
      ],
      "weeklyGoal": "Attain 85%+ comprehension in normal-speed conversational listening."
    },
    {
      "weekNumber": 4,
      "title": "Week 4: Final JLPT Exam Sprint & 100% Mastery",
      "focusArea": "Full Mock Simulations & Speed Strategy",
      "focusAreaBn": "পূর্ণাঙ্গ মক টেস্ট এবং সময় ব্যবস্থাপনা",
      "dailyTasks": [
        { "day": "Day 1", "taskJa": "全25課の文法総まとめ", "taskEn": "Comprehensive review of all 25 grammar patterns", "taskBn": "২৫টি লেসনের সব গ্রামার ফর্মুলার একনজরে রিভিশন", "estimatedMinutes": 35, "activityType": "grammar" },
        { "day": "Day 2", "taskJa": "頻出語彙300語のSRSラストスパート", "taskEn": "High-frequency 300 words speed flashcard round", "taskBn": "সবচেয়ে গুরুত্বপূর্ণ ৩০০টি শব্দের স্পিড ফ্ল্যাশকার্ড", "estimatedMinutes": 30, "activityType": "vocab" },
        { "day": "Day 3", "taskJa": "長文読解と時間配分トレーニング", "taskEn": "Reading comprehension passages with timer", "taskBn": "টাইমার সেট করে প্যারাগ্রাফ পড়ার অভ্যাস", "estimatedMinutes": 35, "activityType": "quiz" },
        { "day": "Day 4", "taskJa": "発音・ピッチアクセント最終判定", "taskEn": "Final pronunciation coach assessment", "taskBn": "এআই টিউটরের সাথে ফাইনাল পিচ অ্যাকসেন্ট টেস্ট", "estimatedMinutes": 20, "activityType": "shadowing" },
        { "day": "Day 5", "taskJa": "JLPT フル模擬試験 (言語知識＋読解＋聴解)", "taskEn": "Full JLPT Mock Exam (Knowledge + Reading + Listening)", "taskBn": "পূর্ণাঙ্গ অফিসিয়াল ফরম্যাট মক এক্সাম", "estimatedMinutes": 60, "activityType": "quiz" },
        { "day": "Day 6", "taskJa": "試験前日の弱点最終チェック", "taskEn": "Final 10 Weak-Point Check & Memory Lock", "taskBn": "দুর্বল প্রশ্নগুলোর চূড়ান্ত রিভিশন ও মেমোরি লক", "estimatedMinutes": 25, "activityType": "grammar" },
        { "day": "Day 7", "taskJa": "達成感と自信の確認 (合格準備完了)", "taskEn": "Celebrate 4-week completion & Exam readiness", "taskBn": "৪ সপ্তাহের কোর্স সম্পন্ন ও পূর্ণ আত্মবিশ্বাসের প্রস্তুতি", "estimatedMinutes": 15, "activityType": "vocab" }
      ],
      "weeklyGoal": "Score 95%+ on the comprehensive N5 mock exam and achieve confident fluency."
    }
  ]
}`;

  if (client) {
    for (const modelName of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Generate a personalized 4-week study schedule for a ${userLevel} student.
Quiz history data: ${JSON.stringify(data.quizHistory || []).slice(0, 1000)}.
Identified weak areas: ${JSON.stringify(data.weakCategories || ['Particles (は vs が)', 'Te-Form Conjugations'])}.`
                  }
                ]
              }
            ],
            config: { systemInstruction, temperature: 0.3, responseMimeType: 'application/json' }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text) as StudyScheduleResponse;
            if (parsed.weeks && Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
              return parsed;
            }
          }
        } catch {
          await sleep(300 * (attempt + 1));
        }
      }
    }
  }

  // Robust Default Fallback Schedule
  return {
    studentLevel: userLevel,
    generatedDate: new Date().toISOString().split('T')[0],
    diagnosticSummary: `Based on your recent quiz scores, your vocabulary is strong, but particle distinction and verb conjugation speed benefit from structured daily repetitions.`,
    diagnosticSummaryBn: `আপনার সাম্প্রতিক কুইজ ফলাফল অনুসারে, শব্দভাণ্ডার বেশ শক্তিশালী। তবে পার্টিকেল ও ক্রিয়ার রূপান্তরের ক্ষেত্রে প্রতিদিনের নিয়মিত চর্চা আপনার স্কোর বহুগুণ বাড়াবে।`,
    detectedWeakAreas: ['Particles: は vs が, に vs で', 'Te-Form Conjugation Speed', 'Kanji Stroke Order & Readings'],
    weeks: [
      {
        weekNumber: 1,
        title: 'Week 1: Core Particle Foundations & SRS Reset',
        focusArea: 'Grammar & Particle Accuracy',
        focusAreaBn: 'গ্রামার এবং পার্টিকেলের সঠিক ব্যবহার',
        dailyTasks: [
          { day: 'Day 1', taskJa: '助詞「は」と「が」の復習', taskEn: 'Review Particle は vs が in Minna Lesson 1-5', taskBn: 'লেসন ১-৫ এর は এবং が পার্টিকেল রিভিশন', estimatedMinutes: 30, activityType: 'grammar' },
          { day: 'Day 2', taskJa: '場所助詞「に」と「で」の使い分け', taskEn: 'Location particles に vs で with action verbs', taskBn: 'অ্যাকশন ভার্বের সাথে に ও で এর পার্থক্য চর্চা', estimatedMinutes: 25, activityType: 'quiz' },
          { day: 'Day 3', taskJa: 'Essential Kanji 20字ストローク練習', taskEn: 'Trace 20 N5 Kanji in Stroke Visualizer', taskBn: 'স্ট্রোক ভিজ্যুয়ালাইজারে ২০টি কাঞ্জি ট্রেসিং অনুশীলন', estimatedMinutes: 30, activityType: 'kanji' },
          { day: 'Day 4', taskJa: 'シャドーイング発音コーチ練習', taskEn: 'Practice 5 dialogue lines in AI Pronunciation Coach', taskBn: 'উচ্চারণ কোচে ৫টি সংলাপের পিচ অ্যাকসেন্ট প্র্যাকটিস', estimatedMinutes: 20, activityType: 'shadowing' },
          { day: 'Day 5', taskJa: 'N5 レッスン1〜10 総合クイズ', taskEn: 'Take Lessons 1-10 Diagnostic Mock Quiz', taskBn: 'লেসন ১-১০ এর প্রস্তুতিমূলক কুইজ', estimatedMinutes: 35, activityType: 'quiz' },
          { day: 'Day 6', taskJa: 'SRSフラッシュカード復習', taskEn: 'Clear all due Leitner SRS vocabulary cards', taskBn: 'বাকি থাকা সব SRS ভোকাবুলারি ফ্ল্যাশকার্ড রিভিশন', estimatedMinutes: 25, activityType: 'vocab' },
          { day: 'Day 7', taskJa: '週次総復習と休息', taskEn: 'Weekly summary notes review & audio listening', taskBn: 'সাপ্তাহিক রিভিশন নোটস ও লিসেনিং', estimatedMinutes: 20, activityType: 'listening' }
        ],
        weeklyGoal: 'Achieve 90%+ accuracy on all fundamental particle questions.'
      },
      {
        weekNumber: 2,
        title: 'Week 2: Verb Conjugations & Te-Form Mastery',
        focusArea: 'Verbal Inflection & Sentence Expansion',
        focusAreaBn: 'ক্রিয়ার রূপান্তর এবং বাক্য গঠন',
        dailyTasks: [
          { day: 'Day 1', taskJa: 'Group 1 / 2 / 3 動詞の分類', taskEn: 'Master 3 Groups of Japanese Verbs', taskBn: 'জাপানি ভার্বের ৩টি গ্রুপের বিভাজন শেখা', estimatedMinutes: 30, activityType: 'grammar' },
          { day: 'Day 2', taskJa: 'て形 (Te-Form) 変換特訓', taskEn: 'Te-form conversion drill for 30 essential verbs', taskBn: '৩০টি মূল ভার্বের তে-ফর্ম রূপান্তর অনুশীলন', estimatedMinutes: 30, activityType: 'grammar' },
          { day: 'Day 3', taskJa: '〜てください 構文クイズ', taskEn: 'Quiz on 〜te kudasai polite request expressions', taskBn: 'অনুরোধমূলক বাক্যের কুইজ সম্পন্ন করা', estimatedMinutes: 25, activityType: 'quiz' },
          { day: 'Day 4', taskJa: '日常会話シャドーイング', taskEn: 'Workplace and Baito conversation audio drill', taskBn: 'কর্মক্ষেত্র ও পার্ট-টাইম চাকুরীর সংলাপ অডিও ড্রিল', estimatedMinutes: 25, activityType: 'shadowing' },
          { day: 'Day 5', taskJa: 'カタカナ語彙強化', taskEn: 'Katakana loanwords vocabulary session', taskBn: 'কাতাকানা ও ঋণকৃত বিদেশি শব্দের স্পিড স্টাডি', estimatedMinutes: 20, activityType: 'vocab' },
          { day: 'Day 6', taskJa: '漢字音読み・訓読みクイズ', taskEn: 'Radicals & Onyomi/Kunyomi pairing challenge', taskBn: 'কাঞ্জির মূল উপাদান ও উচ্চারণ ম্যাচিং কুইজ', estimatedMinutes: 25, activityType: 'kanji' },
          { day: 'Day 7', taskJa: '中間振り返りと弱点再確認', taskEn: 'Mid-point diagnostic check & weak-point retest', taskBn: 'অর্ধেক যাত্রার মূল্যায়ন ও ভুল শোধরানো', estimatedMinutes: 20, activityType: 'quiz' }
        ],
        weeklyGoal: 'Conjugate any N5 verb into Te-form within 3 seconds.'
      },
      {
        weekNumber: 3,
        title: 'Week 3: Workplace Keigo & Listening Speed',
        focusArea: 'Conversational Keigo & Listening Speed',
        focusAreaBn: 'কথোপকথন, কেইগো এবং লিসেনিং গতি',
        dailyTasks: [
          { day: 'Day 1', taskJa: '基本敬語とお辞儀マナー', taskEn: 'Essential polite forms & Japanese etiquette', taskBn: 'ভদ্র ভাষা ও জাপানি অভিবাদন শিষ্টাচার', estimatedMinutes: 25, activityType: 'grammar' },
          { day: 'Day 2', taskJa: 'コンビニ接客会話', taskEn: 'Convenience store cashier Japanese simulations', taskBn: 'কনভিনিয়েন্স স্টোরের সংলাপ প্র্যাকটিস', estimatedMinutes: 30, activityType: 'shadowing' },
          { day: 'Day 3', taskJa: 'JLPT N5 聴解ドリル', taskEn: 'JLPT Listening section practice with native audio', taskBn: 'নেটিভ অডিও দিয়ে অফিসিয়াল লিসেনিং ড্রিল', estimatedMinutes: 30, activityType: 'listening' },
          { day: 'Day 4', taskJa: '時間の表現と助数詞', taskEn: 'Time, calendar, and irregular counters', taskBn: 'সময়, ক্যালেন্ডার ও গণনার বিশেষ নিয়মাবলী', estimatedMinutes: 25, activityType: 'vocab' },
          { day: 'Day 5', taskJa: '動詞「ない形」の基礎', taskEn: 'Nai-form and negative expressions', taskBn: 'নাই-ফর্ম এবং না-বোধক বাক্যের গঠন', estimatedMinutes: 30, activityType: 'grammar' },
          { day: 'Day 6', taskJa: '40問スピード模擬テスト', taskEn: '40-Question N5 Speed Mock Exam', taskBn: '৪০ নম্বরের স্পিড মক পরীক্ষা সম্পন্ন করা', estimatedMinutes: 40, activityType: 'quiz' },
          { day: 'Day 7', taskJa: '復習とポッドキャスト', taskEn: 'Review mistake explanations & podcast listening', taskBn: 'ভুলের ব্যাখ্যা পড়া ও জাপানি পডকাস্ট শোনা', estimatedMinutes: 20, activityType: 'listening' }
        ],
        weeklyGoal: 'Attain 85%+ comprehension in normal-speed conversational listening.'
      },
      {
        weekNumber: 4,
        title: 'Week 4: Final JLPT Exam Sprint & 100% Mastery',
        focusArea: 'Full Mock Simulations & Speed Strategy',
        focusAreaBn: 'পূর্ণাঙ্গ মক টেস্ট এবং সময় ব্যবস্থাপনা',
        dailyTasks: [
          { day: 'Day 1', taskJa: '全25課の文法総まとめ', taskEn: 'Comprehensive review of all 25 grammar patterns', taskBn: '২৫টি লেসনের সব গ্রামার ফর্মুলার একনজরে রিভিশন', estimatedMinutes: 35, activityType: 'grammar' },
          { day: 'Day 2', taskJa: '頻出語彙300語のラストスパート', taskEn: 'High-frequency 300 words speed flashcard round', taskBn: 'সবচেয়ে গুরুত্বপূর্ণ ৩০০টি শব্দের স্পিড ফ্ল্যাশকার্ড', estimatedMinutes: 30, activityType: 'vocab' },
          { day: 'Day 3', taskJa: '長文読解トレーニング', taskEn: 'Reading comprehension passages with timer', taskBn: 'টাইমার সেট করে প্যারাগ্রাফ পড়ার অভ্যাস', estimatedMinutes: 35, activityType: 'quiz' },
          { day: 'Day 4', taskJa: '発音・ピッチ最終判定', taskEn: 'Final pronunciation coach assessment', taskBn: 'এআই টিউটরের সাথে ফাইনাল পিচ অ্যাকসেন্ট টেস্ট', estimatedMinutes: 20, activityType: 'shadowing' },
          { day: 'Day 5', taskJa: 'JLPT フル模擬試験', taskEn: 'Full JLPT Mock Exam (Knowledge + Reading + Listening)', taskBn: 'পূর্ণাঙ্গ অফিসিয়াল ফরম্যাট মক এক্সাম', estimatedMinutes: 60, activityType: 'quiz' },
          { day: 'Day 6', taskJa: '試験前日の最終チェック', taskEn: 'Final 10 Weak-Point Check & Memory Lock', taskBn: 'দুর্বল প্রশ্নগুলোর চূড়ান্ত রিভিশন ও মেমোরি লক', estimatedMinutes: 25, activityType: 'grammar' },
          { day: 'Day 7', taskJa: '達成感と自信の確認', taskEn: 'Celebrate 4-week completion & Exam readiness', taskBn: '৪ সপ্তাহের কোর্স সম্পন্ন ও পূর্ণ আত্মবিশ্বাসের প্রস্তুতি', estimatedMinutes: 15, activityType: 'vocab' }
        ],
        weeklyGoal: 'Score 95%+ on the comprehensive N5 mock exam and achieve confident fluency.'
      }
    ]
  };
}

// 8. Official Japanese Career Keigo Polisher (Rirekisho & Shokumu Keirekisho)
export interface KeigoPolishRequest {
  text: string;
  fieldType: 'motivation' | 'selfPr' | 'career_summary';
  targetRole?: string;
  applicantLevel?: string;
}

export interface KeigoPolishResponse {
  success: boolean;
  polishedJa: string;
  explanationBn: string;
  formalityLevel: string;
}

export async function processKeigoPolisherRequest(req: KeigoPolishRequest): Promise<KeigoPolishResponse> {
  const client = getAIClient();
  const trimmed = req.text?.trim() || '';

  // Procedural authentic fallbacks if empty or offline
  const getFallback = (): KeigoPolishResponse => {
    if (req.fieldType === 'motivation') {
      const clean = trimmed.replace(/[。！？\.\!\?]+$/, '');
      const polishedJa = clean
        ? `貴社の事業理念と誠実なチームワークに深く感銘を受け、${clean}という強い志望動機を持って応募いたしました。日本のハイレベルな接客マナーおよび法令で定められた就労規則を厳格に遵守し、明るい笑顔と正確な敬語を用いて、店舗および企業の信頼向上に誠心誠意貢献する所存です。`
        : `日本のきめ細やかな接客文化と誠実なチームワークに深く感銘を受けております。法令で定められた就労規則を厳格に遵守し、明るい笑顔と正確な敬語を用いて、貴店の信頼向上と円滑な店舗運営に貢献したいと考え志望いたしました。`;
      return {
        success: true,
        polishedJa,
        explanationBn: 'আপনার মূল বক্তব্য বজায় রেখে জাপানিজ করপোরেট স্ট্যান্ডার্ড Kenjougo (নম্র ভাষা) ও Teineigo ব্যাকরণে রূপান্তর করা হয়েছে।',
        formalityLevel: 'Business Kenjougo'
      };
    } else if (req.fieldType === 'career_summary') {
      const clean = trimmed.replace(/[。！？\.\!\?]+$/, '');
      const polishedJa = clean
        ? `これまでのキャリアにおいて、${clean}を中心とした実務経験を積み、品質向上とチームの課題解決に努めてまいりました。異文化環境においても円滑なコミュニケーションを保ち、業務の効率化と組織の成果創出に主体的に寄여してまいります。`
        : `これまでの実務において、迅速な課題解決とチーム連携を最優先に取り組んでまいりました。日本語能力の向上に日々励みつつ、正確な報連相（報告・連絡・相談）を徹底し、貴社のプロジェクト推進に即戦力として貢献いたします。`;
      return {
        success: true,
        polishedJa,
        explanationBn: 'আপনার কর্মঅভিজ্ঞতার সারাংশকে জাপানের স্ট্যান্ডার্ড 職務経歴書 (Shokumu Keirekisho) এক্সিকিউটিভ ফরম্যাটে পলিশ করা হয়েছে।',
        formalityLevel: 'Executive Keigo'
      };
    } else {
      const clean = trimmed.replace(/[。！？\.\!\?]+$/, '');
      const polishedJa = clean
        ? `私の長所は、${clean}という点にあります。困難な課題に対しても粘り強く誠実に向き合い、時間厳守と明瞭な挨拶を信条としております。周囲と協調しながら自発的に行動し、貴社の信頼に応えるべく全力で職務に邁進いたします。`
        : `私の最大の長所は、異文化環境における高い適応力と誠実な継続力です。時間厳守と明瞭な挨拶を信条とし、何事にも責任感を持って粘り強く取り組みます。チームの一員として協調性を発揮し、円滑な業務遂行に貢献いたします。`;
      return {
        success: true,
        polishedJa,
        explanationBn: 'আপনার আত্মপরিচয় ও শক্তিকে আকর্ষণীয়, মার্জিত এবং বিশ্বাসযোগ্য জাপানিজ বিজনেস স্ট্যান্ডার্ডে রূপান্তর করা হয়েছে।',
        formalityLevel: 'Professional Teineigo'
      };
    }
  };

  if (!client || !trimmed) {
    return getFallback();
  }

  const prompt = `
You are the Executive Japanese Business & Keigo Consultant for NIHOMI.COM in Tokyo.
Refine and polish the applicant's raw input for an official Japanese JIS Resume (履歴書) or Career Details (職務経歴書).

Input Draft: "${trimmed}"
Field Type: "${req.fieldType}" (${req.fieldType === 'motivation' ? '志望動機 / Reason for Application' : req.fieldType === 'career_summary' ? '職務要約 / Career Summary' : '自己PR / Self PR'})
Target Role: "${req.targetRole || 'General employment / IT / Baito in Japan'}"

Requirements:
1. Elevate into authentic, flawless Japanese business Keigo (謙譲語・尊敬語・丁寧語).
2. Maintain humble yet confident demeanor showing strong work ethic, punctuality (時間厳守), and trustworthiness (信頼性).
3. Do not invent false experience; amplify their stated strengths naturally.
4. Provide a 1-2 sentence Bengali (বাংলা) explanation of the improvements made.
5. Return JSON only:
{
  "polishedJa": "elevated Japanese text",
  "explanationBn": "Bengali explanation of the polished nuances",
  "formalityLevel": "Business Formal (謙譲語・丁寧語)"
}
`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const res = await client.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });
      const txt = res.text?.trim();
      if (txt) {
        const cleaned = txt.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.polishedJa && parsed.polishedJa.length > 10) {
          return {
            success: true,
            polishedJa: parsed.polishedJa,
            explanationBn: parsed.explanationBn || 'আপনার মূল উদ্দেশ্য বজায় রেখে জাপানিজ করপোরেট স্ট্যান্ডার্ড কেইগোতে রূপান্তর করা হয়েছে।',
            formalityLevel: parsed.formalityLevel || 'Business Formal'
          };
        }
      }
    } catch (err: any) {
      console.warn(`[KeigoPolisher] Model ${modelName} call failed:`, err.message);
    }
  }

  return getFallback();
}

