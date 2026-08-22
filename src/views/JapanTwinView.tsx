import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  Plane,
  Building2,
  Store,
  Train,
  Hospital,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext.js';
import { JapanReadinessRadar } from '../components/JapanReadinessRadar.js';

interface JapanTwinViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JapanTwinView: React.FC<JapanTwinViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [twinData, setTwinData] = useState<any | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTwin() {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ success: boolean; japanTwin: any }>('/api/japan-twin/profile');
        if (res.success && res.japanTwin) {
          setTwinData(res.japanTwin);
        }
      } catch (err) {
        console.error('Failed to load JapanTwin:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTwin();
  }, []);

  const handleRunDaySimulation = async (dayNumber: number) => {
    setActiveDay(dayNumber);
    setIsSimulating(true);
    try {
      const res = await apiRequest<{ success: boolean; dayResult: any }>('/api/japan-twin/simulate-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber, userActionResponse: userSpeechInput })
      });
      if (res.success && res.dayResult) {
        setSimulationResult(res.dayResult);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    handleRunDaySimulation(1);
  }, []);

  const daysList = [
    { day: 1, title: 'Day 1: Narita Airport & Immigration', icon: Plane },
    { day: 2, title: 'Day 2: Yamanote Subway & Suica Card', icon: Train },
    { day: 3, title: 'Day 3: Language School First Day', icon: Building2 },
    { day: 4, title: 'Day 4: 7-Eleven Conbini Ordering', icon: Store },
    { day: 5, title: 'Day 5: Shinjuku City Hall Registration', icon: Compass },
    { day: 6, title: 'Day 6: Baito First Shift Rush', icon: Sparkles },
    { day: 7, title: 'Day 7: Emergency Clinic & Pharmacy', icon: Hospital }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="japan-twin-view">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nihomi JapanTwin™ &bull; Flagship Purple Cow Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
            “Your Japanese Self, Before You Meet Japan.”
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            নিহোমি শুধু আপনাকে গ্রামার শেখায় না—বরং বিমানে ওঠার আগেই জাপানের প্রথম ৭ দিনের বাস্তব জীবনকে সিমুলেট করে আপনার ভবিষ্যৎ সম্ভাব্য ভুলগুলোকে আগে থেকেই প্রতিরোধ করে।
          </p>
        </div>

        {/* Japan Readiness Radar Matrix */}
        {twinData && (
          <JapanReadinessRadar
            metrics={twinData.metrics}
            overallScore={twinData.readinessScore}
            daysToJapan={twinData.daysToJapan}
          />
        )}

        {/* 7-Day Future Tokyo Simulator Player */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Interactive Scenario Player
              </span>
              <h3 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                Simulate Your First 7 Days in Tokyo
              </h3>
            </div>
            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-xl">
              Tokyo Takadanobaba Environment
            </span>
          </div>

          {/* Day Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {daysList.map((d) => {
              const Icon = d.icon;
              const isActive = activeDay === d.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => handleRunDaySimulation(d.day)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[85px] ${
                    isActive
                      ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-600'}`} />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase block opacity-80">Day 0{d.day}</span>
                    <span className="text-xs font-bold truncate block">{d.title.split(':')[1] || d.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Simulation Stage */}
          {simulationResult && (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Day {simulationResult.day} &bull; {simulationResult.titleJa}
                  </span>
                  <h4 className="text-xl font-bold font-serif text-stone-900 mt-1">
                    {simulationResult.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">{simulationResult.situation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(simulationResult.npcPrompt)}
                  className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:text-red-600 shadow-sm transition-colors cursor-pointer"
                  title="Listen to Japanese prompt"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Japanese Dialogue Box */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
                <p className="text-base font-serif font-bold text-stone-900 leading-relaxed">
                  {simulationResult.npcPrompt}
                </p>
                <p className="text-stone-500 font-mono text-[11px]">{simulationResult.romaji}</p>
                <p className="text-emerald-800 font-semibold text-xs pt-1 border-t border-stone-100">
                  বাংলা: {simulationResult.bangla}
                </p>
              </div>

              {/* Feedback Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You Survived Japan Day {simulationResult.day}!</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  <strong>Sensei Analysis:</strong> {simulationResult.evaluation}
                </p>
                <p className="text-red-700 text-[11px] font-semibold pt-1">
                  Weakness Flagged: {simulationResult.weakSkillDetected} (Added to Learning Memory™)
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleRunDaySimulation(Math.max(1, activeDay - 1))}
                  disabled={activeDay === 1}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-40 cursor-pointer"
                >
                  Previous Day
                </button>
                <button
                  onClick={() => handleRunDaySimulation(Math.min(7, activeDay + 1))}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{activeDay === 7 ? 'Complete Simulation' : `Proceed to Day ${activeDay + 1}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
