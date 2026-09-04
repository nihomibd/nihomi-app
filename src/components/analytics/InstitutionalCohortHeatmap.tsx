import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Info,
  ShieldCheck,
  Users,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { CohortAcousticTelemetry, CohortInterferenceHotspot } from '../../types';

export const InstitutionalCohortHeatmap: React.FC = () => {
  const [telemetry, setTelemetry] = useState<CohortAcousticTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<CohortInterferenceHotspot | null>(null);

  useEffect(() => {
    fetchCohortTelemetry();
  }, []);

  const fetchCohortTelemetry = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/voice/analytics/cohort-telemetry');
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
        if (data.telemetry.hotspots && data.telemetry.hotspots.length > 0) {
          setSelectedHotspot(data.telemetry.hotspots[0]);
        }
      } else {
        setErrorMessage(data.error || 'কোহর্ট ডেটা লোড করা সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'সার্ভার সংযোগে ত্রুটি।');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: 'critical' | 'moderate' | 'low') => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            মারাত্মক (Critical)
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            মধ্যম (Moderate)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            স্বাভাবিক (Low)
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Institutional Telemetry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Bengali L1 Phonetic Interference Heatmap
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              প্রাতিষ্ঠানিক শিক্ষার্থী কোহর্ট ফোনেটিক হিটম্যাপ
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              টোকিও অ্যাকসেন্ট ও বাংলা মাতৃভাষার টান জনিত ভুলভ্রান্তির রিয়েল-টাইম ক্লাউড অ্যানালিটিক্স। ল্যাঙ্গুয়েজ স্কুল ও ইনস্টিটিউশন লেভেল ড্যাশবোর্ড।
            </p>
          </div>

          <button
            onClick={fetchCohortTelemetry}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            রিফ্রেশ ডেটা
          </button>
        </div>
      </div>

      {telemetry && (
        <>
          {/* Key Aggregate Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">মোট পরীক্ষিত শিক্ষার্থী</span>
              <span className="text-2xl font-bold text-white mt-1">
                {telemetry.totalLearnersSampled}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> অ্যাক্টিভ লার্নার্স
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">মোট ভয়েস মূল্যায়ন</span>
              <span className="text-2xl font-bold text-white mt-1">
                {telemetry.totalVoiceAssessmentsSampled}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3" /> অডিও স্যাম্পল
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">ডায়নামিক স্ট্রেস ট্রান্সফার</span>
              <span className="text-2xl font-bold text-red-400 mt-1">
                {telemetry.dynamicStressTransferRatePct}%
              </span>
              <span className="text-[10px] text-red-400/80 mt-1">বাংলা প্রথম সিলেবলে জোর</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">মোরা ফ্ল্যাটেনিং রেট</span>
              <span className="text-2xl font-bold text-amber-400 mt-1">
                {telemetry.moraFlatteningRatePct}%
              </span>
              <span className="text-[10px] text-amber-400/80 mt-1">সুরের বিস্তারহীন ফ্ল্যাট টোন</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">চৌ-ওন দীর্ঘস্বর সংকোচন</span>
              <span className="text-2xl font-bold text-cyan-400 mt-1">
                {telemetry.chōonShorteningRatePct}%
              </span>
              <span className="text-[10px] text-cyan-400/80 mt-1">সময়ের অসঙ্গতি</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">হেইবান বনাম ওদাকা অনুপাত</span>
              <span className="text-2xl font-bold text-purple-400 mt-1">
                {telemetry.heibanVsOdakaErrorRatio}
              </span>
              <span className="text-[10px] text-purple-400/80 mt-1">ভুলের অনুপাত</span>
            </div>
          </div>

          {/* Phonetic Interference Hotspot Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  বাঙালি শিক্ষার্থীদের ফোনেটিক জটিলতা র‍্যাঙ্কিং (Heatmap)
                </h3>
                <span className="text-xs text-slate-500">ভুলের হার অনুযায়ী ক্রমানুসারে</span>
              </div>

              <div className="space-y-3">
                {telemetry.hotspots.map((hs) => {
                  const isSelected = selectedHotspot?.phoneticRuleId === hs.phoneticRuleId;
                  return (
                    <div
                      key={hs.phoneticRuleId}
                      onClick={() => setSelectedHotspot(hs)}
                      className={`p-4 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-100">
                              {hs.ruleNameBn}
                            </span>
                            {getSeverityBadge(hs.severity)}
                          </div>
                          <p className="text-xs text-slate-400 font-japanese mt-0.5">
                            {hs.ruleNameJa}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-white">
                          {hs.failureRatePct}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            hs.severity === 'critical'
                              ? 'bg-red-500'
                              : hs.severity === 'moderate'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, hs.failureRatePct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Hotspot Remediation Detail */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              {selectedHotspot ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      ইনস্টিটিউশনাল টিচিং গাইডলাইন
                    </span>
                    {getSeverityBadge(selectedHotspot.severity)}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {selectedHotspot.ruleNameBn}
                    </h4>
                    <p className="text-xs text-slate-400 font-japanese mt-1">
                      {selectedHotspot.ruleNameJa}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-xs text-slate-400 block">শিক্ষার্থীদের ভুলের হার</span>
                      <span className="text-xl font-bold text-red-400">
                        {selectedHotspot.failureRatePct}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-xs text-slate-400 block">গড় স্ট্রেস স্পাইক রেট</span>
                      <span className="text-xl font-bold text-amber-400">
                        {selectedHotspot.averageStressSpikeRate} dB
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> প্রতিকার ও সংশোধন নির্দেশিকা (Sensei Remediation)
                    </span>
                    <p className="text-xs leading-relaxed">
                      {selectedHotspot.remediationTipBn}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  বামপাশের কোনো ফোনেটিক রুলে ক্লিক করে বিস্তারিত প্রতিকার গাইড দেখুন।
                </div>
              )}

              {/* CEFR Speaking Tier Distribution */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  কোহর্ট স্পিকিং প্রস্তুতি স্তর বিভাজন
                </span>
                <div className="space-y-1.5">
                  {Object.entries(telemetry.tierDistribution).map(([tier, count]) => {
                    const total = Math.max(1, telemetry.totalVoiceAssessmentsSampled);
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={tier} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 w-44 truncate">{tier}</span>
                        <div className="flex-1 mx-3 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-slate-300 font-mono w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
