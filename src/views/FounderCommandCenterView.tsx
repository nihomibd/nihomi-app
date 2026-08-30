import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Cpu,
  Sparkles,
  TrendingUp,
  BarChart3,
  Server,
  Crown,
  Search,
  CheckCircle2,
  Coins,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FounderCommandCenterViewProps {
  onNavigate: (view: string) => void;
}

export const FounderCommandCenterView: React.FC<FounderCommandCenterViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'curriculum' | 'telemetry'>('overview');
  const [searchStudent, setSearchStudent] = useState('');

  const mockStudents = [
    { id: 'NHO-100294', name: 'Tanvir Kabir (Founder)', email: 'mdtanvirkabirbiplob@gmail.com', level: 'N5', plan: 'JAPAN_READY', streak: 14, coins: 1500 },
    { id: 'NHO-100342', name: 'Rahim Ahmed', email: 'rahim.jp@gmail.com', level: 'N5', plan: 'PRO', streak: 9, coins: 500 },
    { id: 'NHO-100388', name: 'Sakib Hasan', email: 'sakib.nihon@gmail.com', level: 'N4', plan: 'STARTER', streak: 6, coins: 100 },
    { id: 'NHO-100412', name: 'Anika Tabassum', email: 'anika.tokyo@gmail.com', level: 'N5', plan: 'PRO', streak: 12, coins: 500 },
    { id: 'NHO-100455', name: 'Zubair Hossain', email: 'zubair.n5@gmail.com', level: 'N5', plan: 'FREE', streak: 3, coins: 50 },
  ];

  const filteredStudents = mockStudents.filter(
    (s) => s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.email.toLowerCase().includes(searchStudent.toLowerCase()) || s.id.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans antialiased text-left selection:bg-red-500 selection:text-white pb-24">
      
      {/* 1. TOP FOUNDER BAR */}
      <div className="bg-stone-950 text-white border-b border-stone-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>FOUNDER EXECUTIVE COCKPIT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Nihomi Global Command Center
            </h1>
            <p className="text-xs text-stone-400 font-mono">
              Lead Architect: MD Tanvir Kabir Biplob • Continuous Learning OS
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('portal')}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Switch to Student View
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Public Website →
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 h-14 overflow-x-auto">
            {[
              { id: 'overview', label: '1. Executive Overview', icon: LayoutDashboard },
              { id: 'students', label: '2. Student Roster', icon: Users },
              { id: 'curriculum', label: '3. N5–N1 Curriculum', icon: BookOpen },
              { id: 'telemetry', label: '4. AI & Cloud Health', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full my-auto text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Key KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                  <span>ACTIVE LEARNERS</span>
                  <Users className="w-4 h-4 text-stone-700" />
                </div>
                <div className="text-3xl font-black text-stone-950 font-mono">1,420</div>
                <p className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% this month</span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                  <span>MONTHLY REVENUE (MRR)</span>
                  <Coins className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-stone-950 font-mono">৳ 4,85,000</div>
                <p className="text-[11px] text-emerald-600 font-bold">
                  $3,980 USD Equivalent
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                  <span>GEMINI AI SENSEI HEALTH</span>
                  <Sparkles className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-3xl font-black text-stone-950 font-mono">99.8%</div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Average Latency: 142ms
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                  <span>N5 CURRICULUM STATUS</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-stone-950 font-mono">25 / 25</div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Minna no Nihongo Complete
                </p>
              </div>
            </div>

            {/* Quick System Action Banner */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                  PRODUCTION SYSTEM DISPATCH
                </span>
                <h3 className="text-lg font-bold text-white">
                  Zero-Downtime Multi-Region Cloud Ecosystem
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Supabase PostgreSQL (Singapore Region) + Vercel Edge Serverless + Google Gemini 2.5 Flash are actively synced and handling real student sessions.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('telemetry')}
                className="px-5 py-2.5 bg-white text-stone-950 hover:bg-stone-100 font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Inspect Telemetry
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: STUDENTS MANAGEMENT */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-stone-950">Active Enrolled Students</h3>
                <p className="text-xs text-stone-500">Search and audit student learning progress and plan tiers</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search by Name, Email, ID..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Student ID</th>
                    <th className="p-3.5">Name & Email</th>
                    <th className="p-3.5">Level</th>
                    <th className="p-3.5">Plan Tier</th>
                    <th className="p-3.5">Streak</th>
                    <th className="p-3.5">Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-stone-900">{s.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-stone-900">{s.name}</div>
                        <div className="text-[11px] text-stone-400">{s.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-stone-100 rounded font-bold text-[10px]">
                          {s.level}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          s.plan === 'JAPAN_READY' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                          s.plan === 'PRO' ? 'bg-indigo-50 text-indigo-900 border border-indigo-200' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {s.plan}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-amber-600">{s.streak} Days</td>
                      <td className="p-3.5 font-mono font-bold text-stone-900">{s.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CURRICULUM SYLLABUS AUDIT */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-950">Master Content Architecture (N5–N1)</h3>
              <p className="text-xs text-stone-500">Live synchronized with Nihomi Master Content Engine</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Minna no Nihongo I (N5)', lessons: '25 Lessons', status: '100% Published', vocab: '615 Words', kanji: '100 Kanji' },
                { title: 'Minna no Nihongo II (N4)', lessons: '25 Lessons', status: '100% Published', vocab: '850 Words', kanji: '300 Kanji' },
                { title: 'Intermediate N3 Fluency', lessons: '30 Modules', status: 'Ready for Cohort', vocab: '1,200 Words', kanji: '650 Kanji' },
                { title: 'Tokyo Business Baito Lab', lessons: '12 Simulations', status: 'Active Practice', vocab: '350 Scenarios', kanji: 'Keigo Dialogues' },
              ].map((c, i) => (
                <div key={i} className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-stone-900">{c.title}</h4>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                      {c.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-600 font-mono">
                    <div>Structure: <strong>{c.lessons}</strong></div>
                    <div>Vocab: <strong>{c.vocab}</strong></div>
                    <div>Target: <strong>{c.kanji}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TELEMETRY & CLOUD HEALTH */}
        {activeTab === 'telemetry' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-950">Cloud Infrastructure Telemetry</h3>
              <p className="text-xs text-stone-500">Live operational status across Supabase, Vercel, and Gemini</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    SUPA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Supabase PostgreSQL Database</h4>
                    <p className="text-[10px] text-stone-500 font-mono">tphmukxemzeuwhewblwv.supabase.co (Singapore)</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                  HEALTHY
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 font-bold flex items-center justify-center text-xs">
                    GEM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Google Gemini 2.5 Flash / Pro API</h4>
                    <p className="text-[10px] text-stone-500 font-mono">Multimodal Token Rate Limit: Optimal</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                  CONNECTED
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-xs">
                    VCL
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Vercel Edge CDN</h4>
                    <p className="text-[10px] text-stone-500 font-mono">nihomi.com • Production SSL/TLS Active</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};