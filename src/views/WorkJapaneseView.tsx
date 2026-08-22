import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api.js';
import { WorkJapaneseItem } from '../types.js';
import { speakJapanese } from '../lib/tts.js';
import {
  Briefcase,
  Volume2,
  ArrowRight,
  Sparkles,
  Building,
  Mail,
  Phone,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

interface WorkJapaneseViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const WorkJapaneseView: React.FC<WorkJapaneseViewProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const query = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
        const res = await apiRequest<{ categories: string[]; items: any[] }>(`/api/work-japanese${query}`);
        setCategories(res.categories || []);
        setItems(res.items || []);
      } catch (err) {
        console.error('Failed to load Work Japanese items:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  return (
    <div id="nihomi-work-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bento Hero Header */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              Professional Module
            </span>
            <span className="text-xs font-semibold text-stone-500">
              Japanese for Work & Business Culture
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Japanese for Work (ビジネス日本語)
            </h1>
            <p className="text-sm font-serif text-red-600">
              敬語・ビジネス会話・メール・電話対応・報連相
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
            Move beyond everyday conversational drills. Master honorifics (Sonkeigo), humble expressions (Kenjougo), standard corporate email templates, telephone greetings, and workplace norms like Hou-Ren-So (報連相).
          </p>

          {/* Quick Pillar Chips in Bento Format */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-red-700 font-bold text-xs">
                <Building className="w-3.5 h-3.5" />
                <span>Keigo System</span>
              </div>
              <p className="text-[11px] text-stone-500">Sonkeigo vs. Kenjougo distinctions</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-blue-700 font-bold text-xs">
                <Mail className="w-3.5 h-3.5" />
                <span>Business Emails</span>
              </div>
              <p className="text-[11px] text-stone-500">Subject lines, greetings & sign-offs</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                <Phone className="w-3.5 h-3.5" />
                <span>Telephone & Calls</span>
              </div>
              <p className="text-[11px] text-stone-500">Taking messages, transferring calls</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-700 font-bold text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>Office Protocol</span>
              </div>
              <p className="text-[11px] text-stone-500">Hou-Ren-So, Meishi exchange & meetings</p>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === 'All'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            All Work Scenarios ({items.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Work Scenarios Bento Grid */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-stone-500">Loading business modules...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('work-detail', { id: item.id })}
                className="bg-white border border-stone-200 hover:border-red-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-400">
                      Level: {item.level}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-serif text-red-600 mt-0.5">{item.titleJa}</p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-stone-500 text-[11px]">
                    <span>{item.phraseCount || 4} Key Phrases</span>
                    <span>&bull;</span>
                    <span>{item.dialogueCount || 2} Dialogues</span>
                  </div>

                  <span className="text-xs font-bold text-red-600 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                    <span>Study Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
