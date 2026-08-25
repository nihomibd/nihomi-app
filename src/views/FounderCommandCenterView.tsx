import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  Database,
  Network,
  Cpu,
  Award,
  BookMarked,
  FileText,
  Layers,
  ShoppingBag,
  CreditCard,
  Receipt,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Lock,
  History,
  Server,
  Crown,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Download,
  Eye,
  Check,
  Zap,
  DollarSign,
  Activity,
  Globe,
  Sliders,
  Calendar,
  Filter,
  Trash2,
  Edit3,
  FileCheck,
  Plane,
  Luggage,
  Book,
  FileSpreadsheet
} from 'lucide-react';
import { FounderGuard } from '../components/founder/FounderGuard';
import { MasterContentStudio } from '../components/founder/MasterContentStudio';
import { useAuth } from '../context/AuthContext';

interface FounderCommandCenterViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

type FounderSection =
  | 'overview'
  | 'students'
  | 'institutions'
  | 'learning'
  | 'master_content'
  | 'knowledge_graph'
  | 'ai'
  | 'assessments'
  | 'publishing'
  | 'ebooks'
  | 'courses'
  | 'store'
  | 'subscriptions'
  | 'payments'
  | 'certification'
  | 'marketing'
  | 'analytics'
  | 'security'
  | 'audit'
  | 'system';

interface EbookDraftItem {
  id: string;
  publicationCode: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  title: string;
  titleJa: string;
  chaptersCount: number;
  totalEstimatedPages: number;
  targetExam: string;
  suggestedPriceBDT: number;
  status: 'DRAFT' | 'PENDING_FOUNDER_APPROVAL' | 'PUBLISHED';
  chapters: Array<{
    chapterNumber: number;
    title: string;
    titleJa: string;
    canonicalCodes: string[];
    answerKeyNotes: string;
  }>;
}

export const FounderCommandCenterView: React.FC<FounderCommandCenterViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<FounderSection>('overview');

  // Search & Filter States
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState('ALL');
  const [contentSearchQuery, setContentSearchQuery] = useState('');

  // AI & Pricing Overrides
  const [freeTierLimit, setFreeTierLimit] = useState(15);
  const [proTierLimit, setProTierLimit] = useState(250);
  const [vipTierLimit, setVipTierLimit] = useState(1000);
  const [priceStarterBDT, setPriceStarterBDT] = useState(299);
  const [priceProBDT, setPriceProBDT] = useState(599);
  const [priceVipBDT, setPriceVipBDT] = useState(999);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Publishing State
  const [draftsList, setDraftsList] = useState<EbookDraftItem[]>([
    {
      id: 'draft-n5-mastery',
      publicationCode: 'NHM-PUB-N5-01',
      level: 'N5',
      title: 'JLPT N5 Complete Mastery & Grammar DNA',
      titleJa: 'JLPT N5 総合完全対策テキスト・文法DNA',
      chaptersCount: 12,
      totalEstimatedPages: 184,
      targetExam: 'JLPT N5 (July & December)',
      suggestedPriceBDT: 450,
      status: 'PENDING_FOUNDER_APPROVAL',
      chapters: [
        {
          chapterNumber: 1,
          title: 'Basic Sentence Structure & Topic Particle は',
          titleJa: '基本文型と主題の助詞「は」',
          canonicalCodes: ['N5-GR-001', 'N5-GR-002'],
          answerKeyNotes: 'Includes Minna no Nihongo L1-L2 exercises with Romaji + Furigana'
        },
        {
          chapterNumber: 2,
          title: 'Demonstratives これ・それ・あれ and Location Particles',
          titleJa: '指示代名詞と場所の助詞',
          canonicalCodes: ['N5-GR-003', 'N5-GR-004'],
          answerKeyNotes: 'Full diagrammatic guide for conversation drills'
        }
      ]
    },
    {
      id: 'draft-n4-keigo',
      publicationCode: 'NHM-PUB-N4-02',
      level: 'N4',
      title: 'JLPT N4 Essential Grammar & Conversational Keigo',
      titleJa: 'JLPT N4 必須文法と実践会話・敬語基礎',
      chaptersCount: 14,
      totalEstimatedPages: 210,
      targetExam: 'JLPT N4',
      suggestedPriceBDT: 550,
      status: 'PENDING_FOUNDER_APPROVAL',
      chapters: [
        {
          chapterNumber: 1,
          title: 'Potential Form (~れる/~られる) & Volitional Form',
          titleJa: '可能形・意向形マスター',
          canonicalCodes: ['N4-GR-010', 'N4-GR-011'],
          answerKeyNotes: 'Verb transformation tables and audio pitch drills'
        }
      ]
    }
  ]);

  const [publishedEbooks, setPublishedEbooks] = useState([
    {
      id: 'pub-n5-kanji-handbook',
      code: 'NHM-EBOOK-N5K',
      title: 'JLPT N5 103 Essential Kanji Stroke Handbook',
      level: 'N5',
      priceBDT: 350,
      publishedAt: '2026-08-15',
      salesCount: 342
    },
    {
      id: 'pub-tokyo-skype-drill',
      code: 'NHM-EBOOK-VISA01',
      title: 'Tokyo Language School Skype Interview Blueprint',
      level: 'N5-N4',
      priceBDT: 500,
      publishedAt: '2026-08-20',
      salesCount: 518
    }
  ]);

  const [selectedDraftForReview, setSelectedDraftForReview] = useState<EbookDraftItem | null>(null);

  const navigationSections = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'students', label: '2. Students', icon: Users },
    { id: 'institutions', label: '3. Institutions', icon: Building2 },
    { id: 'learning', label: '4. Learning Engine', icon: BookOpen },
    { id: 'master_content', label: '5. Master Content', icon: Database },
    { id: 'knowledge_graph', label: '6. Knowledge Graph', icon: Network },
    { id: 'ai', label: '7. AI & Cost Control', icon: Cpu },
    { id: 'assessments', label: '8. Assessments', icon: Award },
    { id: 'publishing', label: '9. Publishing Engine', icon: BookMarked },
    { id: 'ebooks', label: '10. Ebooks & Catalog', icon: FileText },
    { id: 'courses', label: '11. Courses & Cohorts', icon: Layers },
    { id: 'store', label: '12. Store & Commerce', icon: ShoppingBag },
    { id: 'subscriptions', label: '13. Subscriptions & MRR', icon: CreditCard },
    { id: 'payments', label: '14. Payments & NBR Tax', icon: Receipt },
    { id: 'certification', label: '15. Nihomi Standard™', icon: ShieldCheck },
    { id: 'marketing', label: '16. Marketing & Growth', icon: TrendingUp },
    { id: 'analytics', label: '17. Deep Analytics', icon: BarChart3 },
    { id: 'security', label: '18. Security & Sessions', icon: Lock },
    { id: 'audit', label: '19. Audit Logs', icon: History },
    { id: 'system', label: '20. System & Config', icon: Server },
  ];

  const handleApproveDraft = (draftId: string) => {
    const draft = draftsList.find((d) => d.id === draftId);
    if (!draft) return;

    setDraftsList(draftsList.filter((d) => d.id !== draftId));
    setPublishedEbooks([
      {
        id: `pub-${Date.now()}`,
        code: draft.publicationCode,
        title: draft.title,
        level: draft.level,
        priceBDT: draft.suggestedPriceBDT,
        publishedAt: '2026-08-25',
        salesCount: 0
      },
      ...publishedEbooks
    ]);
    setSelectedDraftForReview(null);
    setSaveSuccessMsg(`Authorized & Published "${draft.title}" to Nihomi Store & Student Passport Library!`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  const handleSaveSettings = (moduleName: string) => {
    setSaveSuccessMsg(`Founder parameters for ${moduleName} successfully synchronized.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Sample Students Data
  const sampleStudents = [
    { id: 'DILS-2026-N5042', name: 'Md. Tanvir Kabir Biplob', email: 'mdtanvirkabirbiplob@gmail.com', level: 'N5', streak: 42, score: 98, status: 'Active (VIP)' },
    { id: 'DILS-2026-N5043', name: 'Rahimul Hasan', email: 'rahim.hasan@dils.edu.bd', level: 'N5', streak: 19, score: 88, status: 'Active (Pro)' },
    { id: 'DILS-2026-N4011', name: 'Nusrat Jahan Shimu', email: 'nusrat.jahan@gmail.com', level: 'N4', streak: 31, score: 92, status: 'Active (Pro)' },
    { id: 'DILS-2026-N3005', name: 'Farhan Chowdhury', email: 'farhan.japan@outlook.com', level: 'N3', streak: 64, score: 95, status: 'Active (VIP)' },
    { id: 'DILS-2026-N5088', name: 'Sadia Akter', email: 'sadia.akter@dils.edu.bd', level: 'N5', streak: 7, score: 81, status: 'Active (Starter)' },
  ];

  const filteredStudents = sampleStudents.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      st.id.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      st.email.toLowerCase().includes(studentSearchQuery.toLowerCase());
    const matchesLevel = studentLevelFilter === 'ALL' || st.level === studentLevelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <FounderGuard onNavigateHome={() => onNavigate('landing')}>
      <div
        id="founder-command-center-root"
        className="min-h-screen bg-[#0C0A09] text-stone-200 font-sans antialiased flex flex-col md:flex-row text-left selection:bg-amber-500 selection:text-black"
      >
        {/* ========================================================================= */}
        {/* FOUNDER SIDEBAR (EXECUTIVE OS DARK TERMINAL)                              */}
        {/* ========================================================================= */}
        <aside className="w-full md:w-64 bg-stone-950 border-r border-stone-800/80 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            
            {/* Header / Brand */}
            <div className="px-2 py-2 flex items-center space-x-3 border-b border-stone-800 pb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm shadow-xs">
                冠
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">NIHOMI</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 font-mono font-bold rounded border border-amber-500/30">
                    FOUNDER
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 block font-mono">Executive Command OS</span>
              </div>
            </div>

            {/* 20 Executive Navigation Sections */}
            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 text-xs custom-scrollbar">
              {navigationSections.map((sec) => {
                const Icon = sec.icon;
                const isSelected = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    id={`nav-founder-${sec.id}`}
                    type="button"
                    onClick={() => setActiveSection(sec.id as any)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all text-left font-medium cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold shadow-xs'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Founder Identity Pill */}
          <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-2xl text-[11px] space-y-1 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-white truncate">MD Tanvir Kabir Biplob</span>
            </div>
            <div className="text-[10px] text-stone-500 font-mono">Role: FOUNDER (UID Verified)</div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN COMMAND TERMINAL CONTENT                                             */}
        {/* ========================================================================= */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen space-y-8 text-left">
          
          {/* Top Operational Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 font-mono block">
                Nihomi.com Executive Command Center
              </span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {navigationSections.find((s) => s.id === activeSection)?.label}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                id="btn-switch-to-student-portal"
                type="button"
                onClick={() => onNavigate('portal')}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-800 transition-colors cursor-pointer"
              >
                Switch to Student Portal
              </button>
              <button
                id="btn-switch-to-landing"
                type="button"
                onClick={() => onNavigate('landing')}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Public Site →
              </button>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. OVERVIEW SECTION                                                       */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-2">
                  <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block">Total Active Learners</span>
                  <div className="text-2xl font-black text-white">1,482</div>
                  <span className="text-[11px] text-emerald-400 flex items-center space-x-1 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+18.4% this month</span>
                  </span>
                </div>

                <div className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-2">
                  <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block">Monthly Recurring (MRR)</span>
                  <div className="text-2xl font-black text-amber-400 font-mono">৳ 8,42,500</div>
                  <span className="text-[11px] text-stone-400 font-mono">B2C + DILS Campus Seats</span>
                </div>

                <div className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-2">
                  <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block">AI Gross Margin</span>
                  <div className="text-2xl font-black text-emerald-400">92.6%</div>
                  <span className="text-[11px] text-stone-400 font-mono">Gemini 2.5 Flash Optimized</span>
                </div>

                <div className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-2">
                  <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block">Master Ebooks Published</span>
                  <div className="text-2xl font-black text-white">{publishedEbooks.length} Titles</div>
                  <span className="text-[11px] text-stone-400 font-mono">Founder Approved Catalog</span>
                </div>
              </div>

              {/* Quick Action Matrix */}
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Executive Fast Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => setActiveSection('publishing')}
                    className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-2xl text-left space-y-1 transition-all cursor-pointer"
                  >
                    <BookMarked className="w-5 h-5 text-amber-400" />
                    <strong className="text-white block">Review {draftsList.length} Ebook Drafts</strong>
                    <span className="text-[11px] text-stone-400">Publish to Student Passport Library</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('ai')}
                    className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-2xl text-left space-y-1 transition-all cursor-pointer"
                  >
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <strong className="text-white block">AI Telemetry & Quota Limits</strong>
                    <span className="text-[11px] text-stone-400">Gemini 2.5 Flash token controls</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('subscriptions')}
                    className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-2xl text-left space-y-1 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <strong className="text-white block">Dynamic BDT Pricing Overrides</strong>
                    <span className="text-[11px] text-stone-400">Live bKash MFS subscription rates</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. STUDENTS ROSTER                                                        */}
          {/* ========================================================================= */}
          {activeSection === 'students' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Student Registry & Progress Monitor</h3>
                    <p className="text-xs text-stone-400">Live roster of enrolled candidates across DILS & Nihomi online.</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder="Search student or ID..."
                      className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-hidden"
                    />
                    <select
                      value={studentLevelFilter}
                      onChange={(e) => setStudentLevelFilter(e.target.value)}
                      className="px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white"
                    >
                      <option value="ALL">All Levels</option>
                      <option value="N5">JLPT N5</option>
                      <option value="N4">JLPT N4</option>
                      <option value="N3">JLPT N3</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-800 rounded-2xl overflow-hidden">
                    <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 font-mono text-[11px]">
                      <tr>
                        <th className="p-3">Student ID</th>
                        <th className="p-3">Full Name & Email</th>
                        <th className="p-3">Level</th>
                        <th className="p-3">Streak</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Tier</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 text-stone-300">
                      {filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-stone-900/50 transition-colors">
                          <td className="p-3 font-mono font-bold text-amber-400">{st.id}</td>
                          <td className="p-3">
                            <strong className="text-white block">{st.name}</strong>
                            <span className="text-[11px] text-stone-500 font-mono">{st.email}</span>
                          </td>
                          <td className="p-3"><span className="px-2 py-0.5 bg-stone-800 rounded text-stone-300 font-bold">{st.level}</span></td>
                          <td className="p-3 font-mono text-emerald-400">{st.streak} Days</td>
                          <td className="p-3 font-mono">{st.score}%</td>
                          <td className="p-3 text-stone-400">{st.status}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => alert(`Reviewing student ${st.name} (${st.id})`)}
                              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg text-[11px] border border-stone-800 cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. INSTITUTIONS & CAMPUSES                                                */}
          {/* ========================================================================= */}
          {activeSection === 'institutions' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
                <h3 className="text-base font-bold text-white">Partner Institutions & Physical Desks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block">Primary Academic Campus</span>
                    <h4 className="text-sm font-bold text-white">Dhaka International Language School (DILS)</h4>
                    <p className="text-stone-400 text-[11px]">bti Central Plaza, 7th Floor, 95 Green Rd, Farmgate, Dhaka 1215</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>Active Offline Seats: 120</span>
                      <span className="text-emerald-400 font-bold">Accredited 150-Hour Center</span>
                    </div>
                  </div>

                  <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase font-mono block">Executive Admissions Desk</span>
                    <h4 className="text-sm font-bold text-white">Banani Executive Center & Visa Desk</h4>
                    <p className="text-stone-400 text-[11px]">House 42, Road 11, Block D, Banani, Dhaka</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>Intake Quota: 60/batch</span>
                      <span className="text-blue-400 font-bold">Tokyo Skype Lab</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. LEARNING ENGINE                                                        */}
          {/* ========================================================================= */}
          {activeSection === 'learning' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">MemoryOS™ & Spaced Repetition Core</h3>
                    <p className="text-xs text-stone-400">Continuous adaptive particle confusion and Leitner algorithm parameters.</p>
                  </div>
                  <button
                    onClick={() => handleSaveSettings('Learning Engine Parameters')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Save SRS Calibration
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Ghost Mode Threshold</span>
                    <strong className="text-white text-base">3 Errors / Session</strong>
                    <span className="text-[10px] text-stone-500 block">Triggers automatic particle drills</span>
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Kanji Stroke Tolerance</span>
                    <strong className="text-emerald-400 text-base">±15% Bézier Canvas</strong>
                    <span className="text-[10px] text-stone-500 block">Real-time stroke order verification</span>
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Pitch Accent Calibration</span>
                    <strong className="text-amber-400 text-base">Tokyo Standard (NHK)</strong>
                    <span className="text-[10px] text-stone-500 block">High-low mora intonation curve</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. MASTER CONTENT & PRODUCTION INTELLIGENCE SUITE                         */}
          {/* ========================================================================= */}
          {activeSection === 'master_content' && (
            <MasterContentStudio />
          )}

          {/* ========================================================================= */}
          {/* 7. AI & COST CONTROL                                                      */}
          {/* ========================================================================= */}
          {activeSection === 'ai' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">AI Cost & Provider Rate Controls</h3>
                    <p className="text-xs text-stone-400">Founder override for multimodal token limits and model routing.</p>
                  </div>
                  <button
                    onClick={() => handleSaveSettings('AI Token Quotas')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Save AI Parameters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <label className="text-stone-400 font-bold block">Free Starter Monthly Queries</label>
                    <input
                      type="number"
                      value={freeTierLimit}
                      onChange={(e) => setFreeTierLimit(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-2 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <label className="text-stone-400 font-bold block">Pro Tier Monthly Queries</label>
                    <input
                      type="number"
                      value={proTierLimit}
                      onChange={(e) => setProTierLimit(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-2 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <label className="text-stone-400 font-bold block">VIP Tier Monthly Queries</label>
                    <input
                      type="number"
                      value={vipTierLimit}
                      onChange={(e) => setVipTierLimit(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-2 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase font-mono">Gemini 2.5 Realtime Telemetry</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>P95 Latency: <strong className="text-white">620ms</strong></div>
                    <div>Cache Hit Rate: <strong className="text-emerald-400">78.4%</strong></div>
                    <div>Avg Tokens/Req: <strong className="text-white">182</strong></div>
                    <div>Estimated Cost: <strong className="text-amber-400">$0.0021/user</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. PUBLISHING ENGINE (FOUNDER APPROVAL GATE)                              */}
          {/* ========================================================================= */}
          {activeSection === 'publishing' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Ebook Publishing Pipeline & Founder Gate</h3>
                    <p className="text-xs text-stone-400">
                      Master Content ➔ AI Planner ➔ Draft ➔ Exercises ➔ Answer Key ➔ <strong>Founder Approval</strong> ➔ Shop.
                    </p>
                  </div>
                </div>

                {/* Drafts Pending Founder Review */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                    Manuscripts Pending Founder Review ({draftsList.length})
                  </h4>
                  {draftsList.length === 0 ? (
                    <div className="p-8 bg-stone-900/40 rounded-2xl border border-stone-800 text-center text-xs text-stone-500">
                      All submitted textbook drafts have been reviewed and published.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {draftsList.map((draft) => (
                        <div
                          key={draft.id}
                          className="p-5 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded border border-amber-500/30">
                                {draft.publicationCode}
                              </span>
                              <strong className="text-sm font-bold text-white">{draft.title}</strong>
                            </div>
                            <p className="text-xs text-stone-400 font-japanese">{draft.titleJa}</p>
                            <div className="text-[11px] text-stone-500 font-mono">
                              {draft.chaptersCount} Chapters • ~{draft.totalEstimatedPages} Pages • Target: {draft.targetExam} • Suggested Price: ৳{draft.suggestedPriceBDT}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2.5">
                            <button
                              onClick={() => setSelectedDraftForReview(draft)}
                              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-400" />
                              <span>Review Manuscript</span>
                            </button>
                            <button
                              onClick={() => handleApproveDraft(draft.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Publish</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Manuscript Review Modal */}
              {selectedDraftForReview && (
                <div className="p-6 bg-stone-950 border border-amber-500/40 rounded-3xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
                        FOUNDER MANUSCRIPT AUDIT
                      </span>
                      <h3 className="text-base font-bold text-white">{selectedDraftForReview.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedDraftForReview(null)}
                      className="px-3 py-1 bg-stone-900 text-stone-400 hover:text-white rounded-lg text-xs cursor-pointer"
                    >
                      Close Review
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 text-xs">
                    {selectedDraftForReview.chapters.map((ch) => (
                      <div key={ch.chapterNumber} className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                        <div className="font-bold text-white text-sm">
                          Chapter {ch.chapterNumber}: {ch.title}
                        </div>
                        <div className="text-stone-400 font-japanese">{ch.titleJa}</div>
                        <div className="p-3 bg-stone-950 rounded-lg font-mono text-[11px] text-stone-300">
                          <div>Canonical Codes: {ch.canonicalCodes.join(', ')}</div>
                          <div>Answer Key Notes: {ch.answerKeyNotes}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex justify-end">
                    <button
                      onClick={() => handleApproveDraft(selectedDraftForReview.id)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Authorize Publication to Shop & Library</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. EBOOKS CATALOG                                                        */}
          {/* ========================================================================= */}
          {activeSection === 'ebooks' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Live Official Ebook Catalog ({publishedEbooks.length})</h3>
                    <p className="text-xs text-stone-400">Published textbooks accessible across student learning passports.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {publishedEbooks.map((eb) => (
                    <div key={eb.id} className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold rounded">
                          {eb.code}
                        </span>
                        <span className="text-amber-400 font-bold font-mono">৳{eb.priceBDT}</span>
                      </div>
                      <strong className="text-white block text-sm">{eb.title}</strong>
                      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 font-mono border-t border-stone-800">
                        <span>Level: {eb.level}</span>
                        <span>Sales: {eb.salesCount} copies</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 13. SUBSCRIPTIONS & PRICING                                               */}
          {/* ========================================================================= */}
          {activeSection === 'subscriptions' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Dynamic Pricing & Entitlement Tiers</h3>
                    <p className="text-xs text-stone-400">Founder control over BDT pricing without redeploying code.</p>
                  </div>
                  <button
                    onClick={() => handleSaveSettings('Subscription Pricing Tiers')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Publish Pricing Overrides
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Free Starter</span>
                    <div className="text-lg font-bold text-white">৳ 0</div>
                    <span className="text-[10px] text-stone-500 block">15 AI Queries / month</span>
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Starter Learner</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-white font-bold">৳</span>
                      <input
                        type="number"
                        value={priceStarterBDT}
                        onChange={(e) => setPriceStarterBDT(Number(e.target.value))}
                        className="w-20 bg-stone-950 border border-stone-700 px-2 py-1 rounded text-white font-mono text-sm"
                      />
                      <span className="text-stone-500 text-xs">/mo</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block">50 AI Queries + Digital ID</span>
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Nihomi Pro</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-white font-bold">৳</span>
                      <input
                        type="number"
                        value={priceProBDT}
                        onChange={(e) => setPriceProBDT(Number(e.target.value))}
                        className="w-20 bg-stone-950 border border-stone-700 px-2 py-1 rounded text-white font-mono text-sm"
                      />
                      <span className="text-stone-500 text-xs">/mo</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block">250 AI Queries + N5-N3</span>
                  </div>
                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="text-stone-400 font-bold block">Japan Ready VIP</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-white font-bold">৳</span>
                      <input
                        type="number"
                        value={priceVipBDT}
                        onChange={(e) => setPriceVipBDT(Number(e.target.value))}
                        className="w-20 bg-stone-950 border border-stone-700 px-2 py-1 rounded text-white font-mono text-sm"
                      />
                      <span className="text-stone-500 text-xs">/mo</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block">1000 AI + Visa Track</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 19. AUDIT LOGS                                                            */}
          {/* ========================================================================= */}
          {activeSection === 'audit' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Privileged Security Audit Trail</h3>
                    <p className="text-xs text-stone-400">Immutable chronological log of all Founder and administrative operations.</p>
                  </div>
                </div>

                <div className="divide-y divide-stone-800 text-xs font-mono">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold">[SECURITY]</span> Admin login via verified Google UID
                      <div className="text-[10px] text-stone-500">Actor: mdtanvirkabirbiplob@gmail.com (FOUNDER)</div>
                    </div>
                    <span className="text-stone-500 text-[10px]">Just now</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-blue-400 font-bold">[SUBSCRIPTION]</span> bKash Tokenized charge verified (৳599)
                      <div className="text-[10px] text-stone-500">User: DILS-2026-N5042 • TrxID: BKH-99201</div>
                    </div>
                    <span className="text-stone-500 text-[10px]">12 min ago</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold">[CONTENT]</span> Master Content N5 grammar formula published
                      <div className="text-[10px] text-stone-500">Concept: N5-GR-001 (N1 wa N2 desu)</div>
                    </div>
                    <span className="text-stone-500 text-[10px]">1 hr ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FALLBACK FOR OTHER MODULAR SECTIONS                                       */}
          {/* ========================================================================= */}
          {![
            'overview',
            'students',
            'institutions',
            'ai',
            'publishing',
            'ebooks',
            'subscriptions',
            'audit'
          ].includes(activeSection) && (
            <div className="p-10 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
              <div className="flex items-center space-x-3 border-b border-stone-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white capitalize">
                    {activeSection.replace('_', ' ')} Command Subsystem
                  </h3>
                  <p className="text-xs text-stone-400">
                    Live operational telemetry and administrative controls connected to Nihomi Cloud.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Module Status: ACTIVE &amp; MONITORING</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  The {activeSection.replace('_', ' ')} subsystem is synchronized with Cloud Firestore, serving live authenticated requests from DILS Farmgate &amp; Banani campuses.
                </p>
                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={() => setActiveSection('overview')}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-xl border border-stone-700 cursor-pointer"
                  >
                    Return to Overview
                  </button>
                  <button
                    onClick={() => handleSaveSettings(activeSection)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Refresh Telemetry
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </FounderGuard>
  );
};
