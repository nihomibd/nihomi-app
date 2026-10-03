import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Sparkles,
  Save,
  Printer,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  Award,
  User,
  Clock,
  Layers,
  Code2,
  Briefcase,
  ArrowRight,
  Loader2,
  Lock,
  Crown,
  Eye,
  Edit3,
  Copy,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ShokumuKeirekishoData, ShokumuProjectItem } from '../../types';
import { soundEffects } from '../../lib/soundEffects';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_SHOKUMU_KEIREKISHO: ShokumuKeirekishoData = {
  id: 'keirekisho-default',
  userId: 'usr-current',
  fullName: 'MD TANVIR HOSSAIN',
  submissionDate: '2026年10月3日',
  careerSummary: '大学卒業後、フロントエンドエンジニアおよびデータアシスタントとしてWebアプリケーション開発とデータ処理業務に従事。TypeScript/Reactを用いたUI設計、チーム内の報連相、アジャイル開発の実務経験を有します。現在、東京の日本語学校にてビジネス日本語と日本企業の商習慣を習得中。',
  careerSummaryPolished: 'これまでの実務において、フロントエンド開発およびデータ処理を中心に品質向上とチームの課題解決に努めてまいりました。異文化環境においても円滑なコミュニケーションを保ち、業務の効率化と組織の成果創出に主体的に寄与してまいります。',
  technicalSkills: [
    {
      category: '語学・日本語力 (Languages)',
      skills: ['日本語 (JLPT N5合格・N4学習中)', '英語 (ビジネスレベル / IELTS 7.5)', 'ベンガル語 (母国語)'],
      yearsOfExperience: '学習歴2年'
    },
    {
      category: 'プログラミング・技術 (Technical Skills)',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'React', 'HTML5 / CSS3', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      yearsOfExperience: '実務2年'
    },
    {
      category: 'ツール・開発環境 (Tools & Environment)',
      skills: ['Git / GitHub', 'VS Code', 'Figma', 'Docker (Basic)', 'Slack', 'Notion'],
      yearsOfExperience: '実務2年'
    }
  ],
  certifications: [
    { date: '2025年12月', title: '日本語能力試験 (JLPT) N5 合格' },
    { date: '2026年03月', title: 'IELTS Academic Overall Band 7.5' },
    { date: '2022年10月', title: 'ダッカ大学 コンピュータサイエンス学士 (B.Sc in CSE)' }
  ],
  projects: [
    {
      id: 'proj-1',
      startDate: '2023年1月',
      endDate: '2024年2月',
      companyName: 'Tech Innovations Ltd. (ダッカ)',
      department: '開発部 フロントエンドチーム',
      role: 'ジュニアフロントエンドエンジニア',
      businessSummary: '中小企業向けクラウドERPおよびECプラットフォームの受託開発',
      responsibilities: [
        'React / TypeScriptを用いたレスポンシブWeb管理画面のコンポーネント実装',
        'RESTful APIとの非同期通信連携及びエラーハンドリング実装',
        'UI/UXデザイナーと連携したアクセシビリティ向上と表示速度の改善'
      ],
      achievements: [
        '注文管理ダッシュボードの描画パフォーマンスを30%改善',
        '再利用可能なUIコンポーネントライブラリを20種以上構築しチームの開発工数を削減'
      ],
      technologiesUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Git', 'REST API']
    }
  ],
  selfPr: '私の強みは「異文化への高い適応力」と「課題に対する粘り強さ」です。未経験の技術や異文化の職場環境にも素早く順応し、常に時間厳守と誠実なコミュニケーションを心がけています。日本のものづくり精神と品質に対する高いこだわりに深く共感しており、即戦力として貴社チームに貢献いたします。',
  selfPrPolished: '私の最大の長所は、異文化環境における高い適応力と誠実な継続力です。時間厳守と明瞭な挨拶を信条とし、何事にも責任感を持って粘り強く取り組みます。チームの一員として協調性を発揮し、円滑な業務遂行に貢献いたします。',
  updatedAt: new Date().toISOString()
};

interface ShokumuKeirekishoStudioProps {
  onSaved?: (data: ShokumuKeirekishoData) => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const ShokumuKeirekishoStudio: React.FC<ShokumuKeirekishoStudioProps> = ({ onSaved, onNavigate }) => {
  const { user, activePlanId } = useAuth();
  const isPro = activePlanId !== 'free';

  const [formData, setFormData] = useState<ShokumuKeirekishoData>(() => {
    try {
      const saved = localStorage.getItem('nihomi_shokumu_keirekisho');
      if (saved) {
        return { ...DEFAULT_SHOKUMU_KEIREKISHO, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read cached keirekisho:', e);
    }
    return DEFAULT_SHOKUMU_KEIREKISHO;
  });

  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPolishingSummary, setIsPolishingSummary] = useState(false);
  const [isPolishingSelfPr, setIsPolishingSelfPr] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [showProGateModal, setShowProGateModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Load from API with fallback
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const token = localStorage.getItem('nihomi_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/baito/keirekisho', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.keirekisho && isMounted) {
            setFormData((prev) => ({ ...prev, ...data.keirekisho }));
          }
        }
      } catch (err) {
        console.warn('Backend keirekisho unavailable, using local client profile:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    soundEffects.playButtonTap();

    try {
      localStorage.setItem('nihomi_shokumu_keirekisho', JSON.stringify(formData));

      const token = localStorage.getItem('nihomi_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/baito/keirekisho/save', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.keirekisho && onSaved) onSaved(data.keirekisho);
      }
    } catch (e) {
      console.warn('Remote save skipped, cached locally:', e);
    } finally {
      setIsSaving(false);
      soundEffects.playCorrectPing();
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3000);
    }
  };

  const handleDownloadPdf = async () => {
    soundEffects.playButtonTap();

    // Tier Gating: Free users can view web version, Pro users export official PDF
    if (!isPro) {
      setShowProGateModal(true);
      return;
    }

    setIsGeneratingPdf(true);
    try {
      if (viewMode !== 'preview') {
        setViewMode('preview');
        await new Promise((r) => setTimeout(r, 350));
      }

      const element = document.getElementById('shokumu-paper');
      if (!element) {
        window.print();
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfPageWidth, imgHeight);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfPageWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }

      const safeName = formData.fullName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'candidate';
      pdf.save(`Nihomi_Shokumu_Keirekisho_${safeName}.pdf`);
      soundEffects.playLessonCelebration();
    } catch (err) {
      console.warn('PDF export fallback:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePolishField = async (fieldType: 'career_summary' | 'selfPr') => {
    soundEffects.playButtonTap();
    if (fieldType === 'career_summary') setIsPolishingSummary(true);
    else setIsPolishingSelfPr(true);

    try {
      const rawText = fieldType === 'career_summary' ? formData.careerSummary : formData.selfPr;
      const res = await fetch('/api/baito/rirekisho/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          fieldType,
          targetRole: 'Japanese IT / Engineering / Business Professional'
        })
      });

      const data = await res.json();
      if (data.success && data.polishedJa) {
        soundEffects.playCorrectPing();
        if (fieldType === 'career_summary') {
          setFormData((p) => ({ ...p, careerSummaryPolished: data.polishedJa }));
        } else {
          setFormData((p) => ({ ...p, selfPrPolished: data.polishedJa }));
        }
      }
    } catch (err) {
      console.warn('AI Keigo polish error:', err);
    } finally {
      setIsPolishingSummary(false);
      setIsPolishingSelfPr(false);
    }
  };

  const handleAddProject = () => {
    soundEffects.playButtonTap();
    const newProj: ShokumuProjectItem = {
      id: `proj-${Date.now()}`,
      startDate: '2024年4月',
      endDate: '現在',
      companyName: '株式会社サンプル (Tokyo / Remote)',
      department: '開発事業部',
      role: 'エンジニア / Web開発',
      businessSummary: 'Webサービスおよびモバイルアプリのフロントエンド・バックエンド開発',
      responsibilities: ['業務要件の整理及びコンポーネント実装', 'コードレビュー及びテストコード作成'],
      achievements: ['ページ表示速度の20%高速化', '開発ドキュメント整備によるオンボーディング短縮'],
      technologiesUsed: ['TypeScript', 'React', 'Node.js', 'PostgreSQL']
    };
    setFormData((p) => ({ ...p, projects: [newProj, ...p.projects] }));
  };

  const handleRemoveProject = (id: string) => {
    soundEffects.playButtonTap();
    setFormData((p) => ({ ...p, projects: p.projects.filter((pr) => pr.id !== id) }));
  };

  const handleCopyText = () => {
    soundEffects.playButtonTap();
    const textToCopy = `【職務経歴書】\n氏名: ${formData.fullName}\n提出日: ${formData.submissionDate}\n\n■ 職務要約\n${formData.careerSummaryPolished || formData.careerSummary}\n\n■ 自己PR\n${formData.selfPrPolished || formData.selfPr}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Studio Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                職務経歴書スタジオ (Shokumu Keirekisho)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                JAPAN PRO STANDARD
              </span>
            </div>
            <p className="text-xs text-slate-400">
              জাপানে আইটি ও ক্যারিয়ার জবের জন্য অফিশিয়াল ক্যারিয়ার শিট ও এআই কেইগো পলিশার
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Editor / Preview Mode Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => {
                soundEffects.playButtonTap();
                setViewMode('editor');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'editor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>এডিটর</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playButtonTap();
                setViewMode('preview');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'preview' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>A4 পেপার প্রিভিউ</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেভ করুন'}</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : !isPro ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{!isPro ? 'PDF ডাউনলোড (Pro)' : 'A4 PDF ডাউনলোড'}</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>আপনার 職務経歴書 (Shokumu Keirekisho) সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {copiedNotification && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>ক্লিপবোর্ডে কপি করা হয়েছে!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE EDITOR                                                */}
      {/* ========================================================================= */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          {/* Candidate Bio Header */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>আবেদনকারীর তথ্য (Applicant Overview)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  পূর্ণ নাম (Full Name - Roman / English)
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  জমা দেওয়ার তারিখ (Japanese Submission Date)
                </label>
                <input
                  type="text"
                  value={formData.submissionDate}
                  onChange={(e) => setFormData((p) => ({ ...p, submissionDate: e.target.value }))}
                  placeholder="2026年10月3日 現在"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 1: 職務要約 (Career Summary) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>1. 職務要約 (Career Summary & Overview)</span>
              </h3>
              <button
                type="button"
                onClick={() => handlePolishField('career_summary')}
                disabled={isPolishingSummary}
                className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPolishingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>AI কেইগো পলিশ করুন</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.careerSummaryPolished || formData.careerSummary}
              onChange={(e) => setFormData((p) => ({ ...p, careerSummary: e.target.value, careerSummaryPolished: undefined }))}
              placeholder="আপনার সামগ্রিক কাজের অভিজ্ঞতা, দায়িত্ব ও জাপানে লক্ষ্য লিখুন..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:border-amber-500 focus:outline-hidden font-sans"
            />
            {formData.careerSummaryPolished && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Gemini Executive Business Keigo ফরম্যাটে প্রস্তুত</span>
              </span>
            )}
          </div>

          {/* Section 2: 活かせる経験・知識・技術 (Skills Breakdown) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>2. 活かせる経験・知識・技術 (Core Competencies & Skills)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.technicalSkills.map((cat, cIdx) => (
                <div key={cIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-bold text-slate-200">{cat.category}</span>
                    <span className="text-[10px] text-amber-400/80 font-mono">{cat.yearsOfExperience}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/60 text-slate-300 text-[11px] font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 職務経歴詳細 (Projects & Experience History) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>3. 職務経歴詳細 (Work & Project Detailed History)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন প্রজেক্ট / অভিজ্ঞতা যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-mono font-bold flex items-center justify-center">
                        {pIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{proj.companyName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({proj.startDate} 〜 {proj.endDate})</span>
                    </div>
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(proj.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">পদবী ও বিভাগ (Role & Dept):</span>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((p) => ({
                            ...p,
                            projects: p.projects.map((item) => (item.id === proj.id ? { ...item, role: val } : item))
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">ব্যবসার বিবরণ (Business Domain):</span>
                      <input
                        type="text"
                        value={proj.businessSummary}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((p) => ({
                            ...p,
                            projects: p.projects.map((item) => (item.id === proj.id ? { ...item, businessSummary: val } : item))
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">担当業務 (Key Responsibilities):</span>
                    <div className="space-y-1">
                      {proj.responsibilities.map((resp, rIdx) => (
                        <div key={rIdx} className="text-xs text-slate-300 flex items-start gap-1.5 font-sans">
                          <span className="text-amber-400 shrink-0">•</span>
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">実績・成果 (Key Achievements):</span>
                    <div className="space-y-1">
                      {proj.achievements.map((ach, aIdx) => (
                        <div key={aIdx} className="text-xs text-emerald-400/90 flex items-start gap-1.5 font-sans">
                          <span className="text-emerald-400 shrink-0">✓</span>
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/80">
                    {proj.technologiesUsed.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 自己PR (Self PR) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>4. 自己PR (Professional Pitch & Cultural Strengths)</span>
              </h3>
              <button
                type="button"
                onClick={() => handlePolishField('selfPr')}
                disabled={isPolishingSelfPr}
                className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPolishingSelfPr ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>AI কেইগো পলিশ করুন</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={formData.selfPrPolished || formData.selfPr}
              onChange={(e) => setFormData((p) => ({ ...p, selfPr: e.target.value, selfPrPolished: undefined }))}
              placeholder="জাপানি কোম্পানিতে আপনার কাজের একাগ্রতা, সময়ানুবর্তিতা ও দলের সাথে একাত্মতা প্রকাশ করুন..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:border-amber-500 focus:outline-hidden font-sans"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: OFFICIAL JAPANESE A4 PAPER PREVIEW                                */}
      {/* ========================================================================= */}
      {viewMode === 'preview' && (
        <div className="flex justify-center p-2 sm:p-6 bg-slate-950/90 rounded-2xl border border-slate-800 overflow-x-auto">
          <div
            id="shokumu-paper"
            className="w-[210mm] min-h-[297mm] bg-white text-slate-950 p-[18mm] shadow-2xl font-serif text-[11px] leading-relaxed flex flex-col justify-between shrink-0"
            style={{ fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif' }}
          >
            <div className="space-y-5">
              {/* Paper Header */}
              <div className="flex justify-between items-end border-b-2 border-slate-950 pb-2">
                <div>
                  <h1 className="text-xl font-bold tracking-[0.25em] text-slate-950">
                    職 務 経 歴 書
                  </h1>
                </div>
                <div className="text-right text-[10px] space-y-0.5 text-slate-800">
                  <p>{formData.submissionDate}</p>
                  <p className="font-bold text-xs">{formData.fullName}</p>
                </div>
              </div>

              {/* 1. 職務要約 */}
              <div>
                <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2">
                  【 職 務 要 約 】
                </h2>
                <p className="text-justify indent-4 text-[10.5px] leading-relaxed text-slate-900 font-sans">
                  {formData.careerSummaryPolished || formData.careerSummary}
                </p>
              </div>

              {/* 2. 活かせる経験・知識・技術 */}
              <div>
                <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2">
                  【 活かせる経験・知識・技術 】
                </h2>
                <table className="w-full border-collapse border border-slate-950 text-[10px] font-sans">
                  <tbody>
                    {formData.technicalSkills.map((cat, idx) => (
                      <tr key={idx} className="border-b border-slate-300">
                        <td className="w-48 bg-slate-50 p-2 font-bold border-r border-slate-950 align-top">
                          {cat.category}
                        </td>
                        <td className="p-2">
                          <p className="font-medium text-slate-900">{cat.skills.join(' / ')}</p>
                          {cat.yearsOfExperience && (
                            <p className="text-[9px] text-slate-600 mt-0.5">（実務経験・学習歴: {cat.yearsOfExperience}）</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3. 資格・免許 */}
              <div>
                <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2">
                  【 免 許 ・ 資 格 】
                </h2>
                <table className="w-full border-collapse border border-slate-950 text-[10px] font-sans">
                  <tbody>
                    {formData.certifications.map((cert, idx) => (
                      <tr key={idx} className="border-b border-slate-300">
                        <td className="w-28 p-1.5 text-center border-r border-slate-950 font-mono">
                          {cert.date}
                        </td>
                        <td className="p-1.5 pl-3 font-medium">
                          {cert.title}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4. 職務経歴詳細 */}
              <div>
                <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2">
                  【 職 務 経 歴 詳 細 】
                </h2>
                <div className="space-y-3 font-sans">
                  {formData.projects.map((proj, idx) => (
                    <div key={idx} className="border border-slate-950 p-3 space-y-2 text-[10px]">
                      <div className="flex justify-between items-center border-b border-slate-300 pb-1 font-bold">
                        <span className="text-xs">{proj.companyName}（{proj.department}）</span>
                        <span className="font-mono text-[9px]">{proj.startDate} 〜 {proj.endDate}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-700">
                        <span className="font-bold">事業内容:</span> {proj.businessSummary} | <span className="font-bold">役職:</span> {proj.role}
                      </p>

                      <div className="space-y-0.5">
                        <span className="font-bold block text-[9.5px]">【主な担当業務】</span>
                        {proj.responsibilities.map((r, rIdx) => (
                          <div key={rIdx} className="text-slate-800 pl-2">
                            ・{r}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-0.5">
                        <span className="font-bold block text-[9.5px]">【成果・取り組み】</span>
                        {proj.achievements.map((a, aIdx) => (
                          <div key={aIdx} className="text-slate-800 pl-2">
                            ・{a}
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 text-[9px] text-slate-600 border-t border-slate-200">
                        <span className="font-bold">使用技術:</span> {proj.technologiesUsed.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. 自己PR */}
              <div>
                <h2 className="text-xs font-bold bg-slate-100 border-l-4 border-slate-900 px-2 py-1 mb-2">
                  【 自 己 P R 】
                </h2>
                <p className="text-justify indent-4 text-[10.5px] leading-relaxed text-slate-900 font-sans">
                  {formData.selfPrPolished || formData.selfPr}
                </p>
              </div>

              {/* Footer Stamp */}
              <div className="text-right text-[10px] font-sans font-bold pt-2">
                以上
              </div>
            </div>

            {/* Official Nihomi Brand Verification Watermark */}
            <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-400 font-sans">
              <span>日本企業中途採用・エンジニア応募標準書式準拠</span>
              <span>Generated via NIHOMI.COM Career Companion • Verification ID: NHM-SKR-2026</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRO TIER GATE MODAL: FREE WEB CV vs PRO JIS/SHOKUMU PDF EXPORT            */}
      {/* ========================================================================= */}
      {showProGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                PRO CAREER TIER FEATURE
              </span>
              <h3 className="text-xl font-black text-slate-100">
                অফিসিয়াল A4 職務経歴書 ও JIS 履歴書 এক্সপোর্ট আনলক করুন
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ফ্রি টিয়ারে আপনি যে কোনো সময় ওয়েব ফরম্যাট দেখে টেক্সট কপি করতে পারবেন। জাপানিজ স্ট্যান্ডার্ড A4 হাই-রেজুল্যুশন PDF, ভেরিফাইড সিল ও আনলিমিটেড AI কেইগো পলিশের জন্য নিহোমি প্রো আনলক করুন।
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setShowProGateModal(false);
                  if (onNavigate) {
                    onNavigate('pricing');
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Nihomi Pro (৳৪৯৯)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopyText();
                  setShowProGateModal(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>ফ্রি টেক্সট কপি করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setShowProGateModal(false);
                }}
                className="w-full py-2 text-slate-500 hover:text-slate-300 text-xs transition font-medium cursor-pointer"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
