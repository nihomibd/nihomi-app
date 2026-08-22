// src/views/InstructorDashboardView.tsx
import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface InstructorDashboardViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const InstructorDashboardView: React.FC<InstructorDashboardViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'cohorts' | 'submissions' | 'curriculum'>('cohorts');

  const cohorts = [
    {
      id: 'coh-tokyo-2026-a',
      title: 'JLPT N5 Intensive Spring 2026 Batch',
      studentsCount: 28,
      avgProgress: '74%',
      activeModule: 'Te-Form Conjugation & Kanji Bank 3',
      nextLiveClass: 'Saturday 7:00 PM BST'
    },
    {
      id: 'coh-osaka-2026-b',
      title: 'JLPT N4 & Business Keigo Fast-Track',
      studentsCount: 19,
      avgProgress: '62%',
      activeModule: 'Honorific vs Humble Speech',
      nextLiveClass: 'Sunday 8:00 PM BST'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="instructor-dashboard-view">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              <GraduationCap className="w-4 h-4" />
              <span>Nihomi Sensei Portal &bull; Instructor Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-2">
              Instructor Cohort & Student Progress Terminal
            </h1>
            <p className="text-xs text-stone-500">
              Manage student cohorts, track memory error rates, review mock interviews, and schedule live drills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Switch to Student View
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-3xl font-extrabold font-serif text-stone-900">47</div>
            <p className="text-[11px] text-stone-500">Across 2 JLPT Cohorts</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
              <span>Cohort Pass Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold font-serif text-stone-900">96.4%</div>
            <p className="text-[11px] text-emerald-600 font-semibold">Official Mock Exam Benchmark</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
              <span>Oral Interviews Evaluated</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold font-serif text-stone-900">112</div>
            <p className="text-[11px] text-stone-500">Tokyo Principal Simulations</p>
          </div>
        </div>

        {/* Cohorts Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-stone-900">Active Teaching Cohorts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cohorts.map((c) => (
              <div key={c.id} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-stone-900 font-serif">{c.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {c.studentsCount} Students
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Curriculum Progress</span>
                    <span className="font-bold text-stone-900">{c.avgProgress}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: c.avgProgress }} />
                  </div>
                  <p className="text-stone-600 pt-1">
                    <strong>Current Focus:</strong> {c.activeModule}
                  </p>
                  <p className="text-stone-500">
                    <strong>Next Live Drill:</strong> {c.nextLiveClass}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('courses')}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Open Cohort Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
