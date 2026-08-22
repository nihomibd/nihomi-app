import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';

export const japanTwinRouter = Router();

// 1. Get or Generate JapanTwin Profile
japanTwinRouter.get('/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const profile = db.getProfileByUserId(userId);
  const progress = db.getProgressByUserId(userId);

  const completedCount = progress?.completedLessonIds?.length || 0;
  const overallReadiness = Math.min(96, Math.max(45, 52 + completedCount * 4));

  const twinData = {
    userId,
    studentName: profile?.displayName || 'Nihomi Student',
    targetCity: 'Tokyo (Shinjuku / Takadanobaba)',
    targetPurpose: 'Language School & Career Relocation',
    daysToJapan: 206,
    arrivalDate: '2027-03-15',
    targetJLPT: profile?.targetLevel || 'N4',
    readinessScore: overallReadiness,
    metrics: {
      speaking: Math.min(90, 48 + completedCount * 3),
      listening: Math.min(92, 54 + completedCount * 4),
      grammar: Math.min(95, 58 + completedCount * 4),
      kanji: Math.min(88, 42 + completedCount * 3),
      keigo: Math.min(85, 38 + completedCount * 3),
      dailyLife: Math.min(94, 65 + completedCount * 3),
      workplace: Math.min(86, 40 + completedCount * 3),
      emergency: Math.min(80, 32 + completedCount * 3)
    },
    predictedBottlenecks: [
      {
        id: 'risk-1',
        title: 'Workplace Fast-Speech Listening',
        severity: 'High',
        description: 'You are likely to freeze when Japanese conbini managers or customers speak rapidly.'
      },
      {
        id: 'risk-2',
        title: 'Keigo Humility (Kenjougo vs Sonkeigo)',
        severity: 'Medium',
        description: 'Confusion when humbling your actions in front of external clients or teachers.'
      },
      {
        id: 'risk-3',
        title: 'Emergency Medical Vocabulary',
        severity: 'High',
        description: 'Explaining specific illness symptoms at a Japanese clinic or pharmacy.'
      }
    ],
    recommendedPlan: {
      title: '14-Day Japan Survival & Keigo Accelerator',
      dailyMinutes: 12,
      priorityDrill: '10-minute Conbini Register & Listening Drill'
    }
  };

  return res.json({ success: true, japanTwin: twinData });
});

// 2. Simulate Single Day in Japan
japanTwinRouter.post('/simulate-day', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { dayNumber, userActionResponse } = req.body;

  const dayScenarios: Record<number, any> = {
    1: {
      day: 1,
      title: 'Tokyo Narita Airport: Immigration & Customs',
      titleJa: '成田空港・入国審査と税関',
      situation: 'The immigration officer inspects your COE and passport.',
      npcPrompt: 'こんにちは。パスポートと在留資格認定証明書（COE）を見せてください。滞在期間と目的は何ですか？',
      romaji: 'Konnichiwa. Pasupooto to zairyuu shikaku nintei shoumeisho o misete kudasai. Taizai kikan to mokuteki wa nan desu ka?',
      bangla: 'শুভ দিন। আপনার পাসপোর্ট এবং সিওই পেপার দেখতে দিন। আপনার জাপানে থাকার উদ্দেশ্য ও মেয়াদ কী?',
      evaluation: 'Excellent response speed. Keep eye contact and speak with standard polite Teineigo (〜です・〜ます).'
    },
    2: {
      day: 2,
      title: 'Yamanote Subway: Buying Suica Card & Train Route',
      titleJa: '山手線・Suica購入と乗り換え',
      situation: 'You are at Shinjuku Station trying to purchase a train pass to your dormitory.',
      npcPrompt: 'すみません、Suicaカードのチャージ機はどこですか？高田馬場駅までいくらですか？',
      romaji: 'Sumimasen, Suica kaado no chaaji-ki wa doko desu ka? Takadanobaba-eki made ikura desu ka?',
      bangla: 'মাফ করবেন, সুইকা কার্ড রিচার্জ মেশিন কোথায়? তাকাদানবাবা স্টেশন পর্যন্ত ভাড়া কত?',
      evaluation: 'Good question formulation. Remember to use すみません (Sumimasen) before asking station staff.'
    },
    3: {
      day: 3,
      title: 'Language School First Day: Sensei Orientation',
      titleJa: '日本語学校・オリエンテーション',
      situation: 'Meeting your academic supervisor in Tokyo.',
      npcPrompt: '初めまして！クラス分けテストの結果、N4クラスになりました。何か不安なことはありますか？',
      romaji: 'Hajimemashite! Kurasu wake tesuto no kekka, N4 kurasu ni narimashita. Nanika fuan na koto wa arimasu ka?',
      bangla: 'প্রথম দেখা হয়ে ভালো লাগলো! প্লেসমেন্ট টেস্ট অনুযায়ী আপনি N4 ক্লাসে স্থান পেয়েছেন। কোনো বিষয়ে প্রশ্ন বা দ্বিধা আছে কি?',
      evaluation: 'Polite and clear. Use これからお世話になります (Korekara osewa ni narimasu) to leave a great impression.'
    },
    4: {
      day: 4,
      title: '7-Eleven Convenience Store: Ordering & Bagging',
      titleJa: 'コンビニでの買い物・袋と温め',
      situation: 'Buying lunch at 7-Eleven in Tokyo.',
      npcPrompt: 'いらっしゃいませ！お弁当あたためますか？袋はお付けしますか？',
      romaji: 'Irasshaimase! Obentou atatamemasu ka? Fukuro wa otsuke shimasu ka?',
      bangla: 'স্বাগতম! লাঞ্চ বক্সটি কি গরম করে দেব? প্লাস্টিক ব্যাগ লাগবে কি?',
      evaluation: 'Daily survival phrase mastered! Say 大丈夫です (Daijoubu desu) or お願いします (Onegai shimasu).'
    },
    5: {
      day: 5,
      title: 'Shinjuku City Hall: Resident Card & Health Insurance',
      titleJa: '区役所・住民票と国民健康保険登録',
      situation: 'Registering your address at the Ward Office.',
      npcPrompt: 'こちらの申請書にお名前とアパートの住所をご記入ください。',
      romaji: 'Kochira no shinseisho ni onamae to apaato no juusho o gokinyuu kudasai.',
      bangla: 'অনুগ্রহ করে এই আবেদনপত্রে আপনার নাম এবং অ্যাপার্টমেন্টের ঠিকানা লিখুন।',
      evaluation: 'Crucial bureaucratic paperwork step. Kanji writing skill tested.'
    },
    6: {
      day: 6,
      title: 'Part-Time Job (Baito) First Shift: Fast-Talking Manager',
      titleJa: 'バイト初日・店長の早い指示',
      situation: 'Handling customer orders during peak lunch rush.',
      npcPrompt: 'タンビル君、3番テーブルのバッシング急いで！それからお冷や補充しておいてね！',
      romaji: 'Tanvir-kun, 3-ban teeburu no basshingu isoide! Sorekara ohiya hojuu shite oite ne!',
      bangla: 'তানভীর, ৩ নম্বর টেবিলের থালাবাসন দ্রুত পরিষ্কার করো! আর টেবিলের পানির জগ রিফিল করে রাখো!',
      evaluation: 'High stress test. Always respond loudly with はい、かしこまりました！(Hai, kashikomarimashita!).'
    },
    7: {
      day: 7,
      title: 'Emergency Clinic: Explaining Symptoms in Japanese',
      titleJa: 'クリニック・症状の説明',
      situation: 'Sudden fever and stomach ache in Tokyo.',
      npcPrompt: 'どうされましたか？いつから熱がありますか？アレルギーはありますか？',
      romaji: 'Dou saremashita ka? Itsu kara netsu ga arimasu ka? Arerugii wa arimasu ka?',
      bangla: 'কী সমস্যা হয়েছে? কতদিন ধরে জ্বর? কোনো ওষুধে অ্যালার্জি আছে?',
      evaluation: 'Survival medical Japanese tested. You have survived your simulated first week in Japan!'
    }
  };

  const scenario = dayScenarios[Number(dayNumber) || 1] || dayScenarios[1];
  return res.json({
    success: true,
    dayResult: {
      ...scenario,
      survived: true,
      weakSkillDetected: dayNumber === 6 ? 'Fast Colloquial Listening' : 'Particle Precision',
      followUpLessonId: 'les-n5-1-2'
    }
  });
});
