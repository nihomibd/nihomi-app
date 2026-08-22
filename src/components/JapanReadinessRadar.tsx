import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Compass
} from 'lucide-react';

interface JapanReadinessRadarProps {
  metrics: {
    speaking: number;
    listening: number;
    grammar: number;
    kanji: number;
    keigo: number;
    dailyLife: number;
    workplace: number;
    emergency: number;
  };
  overallScore: number;
  daysToJapan?: number;
}

export const JapanReadinessRadar: React.FC<JapanReadinessRadarProps> = ({
  metrics,
  overallScore,
  daysToJapan = 206
}) => {
  const categories = [
    { key: 'dailyLife', label: 'Daily Life (দৈনন্দিন জীবন)', score: metrics?.dailyLife || 70, color: 'bg-emerald-500' },
    { key: 'listening', label: 'Listening Reflex (শুনার গতি)', score: metrics?.listening || 65, color: 'bg-blue-500' },
    { key: 'grammar', label: 'Grammar Core (ব্যাকরণ)', score: metrics?.grammar || 68, color: 'bg-indigo-500' },
    { key: 'speaking', label: 'Oral Speaking (কথোপকথন)', score: metrics?.speaking || 60, color: 'bg-amber-500' },
    { key: 'kanji', label: 'Kanji Retention (কাঞ্জি মেমোরি)', score: metrics?.kanji || 50, color: 'bg-rose-500', isRisk: (metrics?.kanji || 50) <= 55 },
    { key: 'keigo', label: 'Workplace Keigo (সম্মানসূচক কেইগো)', score: metrics?.keigo || 45, color: 'bg-purple-500', isRisk: (metrics?.keigo || 45) <= 50 },
    { key: 'workplace', label: 'Baito / Office (কর্মক্ষেত্র)', score: metrics?.workplace || 55, color: 'bg-teal-500' },
    { key: 'emergency', label: 'Emergency Japanese (জরুরি পরিস্থিতি)', score: metrics?.emergency || 38, color: 'bg-red-500', isRisk: (metrics?.emergency || 38) <= 40 }
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="japan-readiness-radar-card">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
              Japan Readiness Map™
            </span>
            <span className="text-xs text-stone-500 font-semibold">&bull; {daysToJapan} Days to Departure</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">
            Your Predicted Tokyo Survival Score
          </h3>
        </div>
        <div className="flex items-center gap-3 p-3 bg-stone-900 text-white rounded-2xl shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Overall Index</span>
            <span className="text-2xl font-extrabold text-emerald-400">{overallScore}/100</span>
          </div>
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        </div>
      </div>

      {/* 8-Dimensional Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c.key} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                {c.isRisk && <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                <span>{c.label}</span>
              </span>
              <span className={`font-mono font-bold ${c.isRisk ? 'text-red-600' : 'text-stone-900'}`}>
                {c.score}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${c.color}`} style={{ width: `${c.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Predicted Bottleneck Box */}
      <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2 text-xs text-stone-800">
        <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>AI Predicted Bottlenecks (প্রথম ৩০ দিনে সম্ভাব্য ঝুঁকি):</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-stone-700 leading-relaxed">
          <li><strong>Kanji Retention (54%):</strong> স্টেশন ও সরকারি সিটি হলের ফর্ম পূরণের সময় কাঞ্জি ভুলে যাওয়ার ঝুঁকি।</li>
          <li><strong>Workplace Keigo (43%):</strong> পার্ট-টাইম জবে বস বা কাস্টমারের সাথে কথা বলতে গিয়ে দ্বিধা।</li>
          <li><strong>Emergency Japanese (31%):</strong> ফার্মেসি বা ক্লিনিকে অসুস্থতার লক্ষণ সঠিকভাবে বোঝানো।</li>
        </ul>
      </div>
    </div>
  );
};
