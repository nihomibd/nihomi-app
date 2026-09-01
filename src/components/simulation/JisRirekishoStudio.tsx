import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  MapPin,
  Clock,
  Stamp
} from 'lucide-react';
import { JisRirekishoData } from '../../types';
import { soundEffects } from '../../lib/soundEffects';

interface JisRirekishoStudioProps {
  onSaved?: (rirekisho: JisRirekishoData) => void;
}

export const JisRirekishoStudio: React.FC<JisRirekishoStudioProps> = ({ onSaved }) => {
  const [formData, setFormData] = useState<JisRirekishoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPolishingMotivation, setIsPolishingMotivation] = useState(false);
  const [isPolishingSelfPr, setIsPolishingSelfPr] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  // Load user's Rirekisho from API
  useEffect(() => {
    fetch('/api/baito/rirekisho')
      .then((res) => res.json())
      .then((data) => {
        if (data.rirekisho) {
          setFormData(data.rirekisho);
        }
      })
      .catch((err) => console.error('Failed to load rirekisho:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    soundEffects.playButtonTap();

    try {
      const res = await fetch('/api/baito/rirekisho/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        soundEffects.playCorrectPing();
        setSaveSuccessNotice(true);
        setTimeout(() => setSaveSuccessNotice(false), 3000);
        if (onSaved) onSaved(data.rirekisho);
      }
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePolishMotivation = async () => {
    if (!formData) return;
    setIsPolishingMotivation(true);
    soundEffects.playButtonTap();

    try {
      const res = await fetch('/api/baito/rirekisho/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.motivationStatement,
          fieldType: 'motivation'
        })
      });
      const data = await res.json();
      if (data.success && data.polishedJa) {
        soundEffects.playCorrectPing();
        setFormData((prev) => (prev ? { ...prev, motivationStatementPolished: data.polishedJa } : null));
      }
    } catch (err) {
      console.error('Polish error:', err);
    } finally {
      setIsPolishingMotivation(false);
    }
  };

  const handlePolishSelfPr = async () => {
    if (!formData) return;
    setIsPolishingSelfPr(true);
    soundEffects.playButtonTap();

    try {
      const res = await fetch('/api/baito/rirekisho/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.selfPr,
          fieldType: 'selfPr'
        })
      });
      const data = await res.json();
      if (data.success && data.polishedJa) {
        soundEffects.playCorrectPing();
        setFormData((prev) => (prev ? { ...prev, selfPrPolished: data.polishedJa } : null));
      }
    } catch (err) {
      console.error('Polish error:', err);
    } finally {
      setIsPolishingSelfPr(false);
    }
  };

  // Education row operations
  const addEduRow = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      educationHistory: [
        ...formData.educationHistory,
        {
          year: new Date().getFullYear(),
          month: 4,
          schoolName: '',
          faculty: '',
          status: 'enrolled'
        }
      ]
    });
  };

  const removeEduRow = (index: number) => {
    if (!formData) return;
    const nextEdu = [...formData.educationHistory];
    nextEdu.splice(index, 1);
    setFormData({ ...formData, educationHistory: nextEdu });
  };

  // Work row operations
  const addWorkRow = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      workHistory: [
        ...formData.workHistory,
        {
          year: new Date().getFullYear(),
          month: 1,
          companyName: '',
          role: '',
          status: 'joined'
        }
      ]
    });
  };

  const removeWorkRow = (index: number) => {
    if (!formData) return;
    const nextWork = [...formData.workHistory];
    nextWork.splice(index, 1);
    setFormData({ ...formData, workHistory: nextWork });
  };

  // License row operations
  const addLicenseRow = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      licensesCertifications: [
        ...formData.licensesCertifications,
        {
          year: new Date().getFullYear(),
          month: 12,
          title: ''
        }
      ]
    });
  };

  const removeLicenseRow = (index: number) => {
    if (!formData) return;
    const nextLic = [...formData.licensesCertifications];
    nextLic.splice(index, 1);
    setFormData({ ...formData, licensesCertifications: nextLic });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !formData) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-400" />
        <p>JIS規格履歴書スタジオを読み込み中... (Loading Japanese Rirekisho Studio)</p>
      </div>
    );
  }

  return (
    <div id="jis-rirekisho-studio" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              JIS 規格準拠 (Official Standard)
            </span>
            <span className="text-xs text-slate-400">アルバイト・正社員・ビザ提出用</span>
          </div>
          <h2 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            日本標準 履歴書 (Rirekisho Studio & Keigo Polisher)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              viewMode === 'preview'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {viewMode === 'preview' ? '📝 編集モードに戻る' : '👁️ JIS様式プレビュー'}
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title="印刷 / PDF保存 (Print or Save PDF)"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? '保存中...' : '履歴書を保存'}</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>履歴書データが正常に保存されました。(Saved to Nihomi Cloud)</span>
        </motion.div>
      )}

      {/* Editor Mode */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          {/* 1. Basic Information Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-amber-400" />
              基本情報 (Basic Profile)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">氏名 (Full Name in English/Romaji)</label>
                <input
                  type="text"
                  value={formData.fullNameRomaji}
                  onChange={(e) => setFormData({ ...formData, fullNameRomaji: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">フリガナ (Katakana Name)</label>
                <input
                  type="text"
                  value={formData.fullNameKana}
                  onChange={(e) => setFormData({ ...formData, fullNameKana: e.target.value })}
                  placeholder="エムディ タンヴィル"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">生年月日 (Birth Date & 和暦)</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={formData.japaneseEraBirth}
                    onChange={(e) => setFormData({ ...formData, japaneseEraBirth: e.target.value })}
                    placeholder="平成12年10月1日"
                    className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">電話番号 (Phone Number in Japan)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="080-1234-5678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">メールアドレス (Email)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">在留資格 (Visa Status & Hours)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.visaStatus}
                    onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                  />
                  <span className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono flex items-center">
                    週28h
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">現住所 (Current Tokyo Address & Post Code)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="〒 169-0075"
                  className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono"
                />
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                  placeholder="東京都新宿区高田馬場 2-14-8..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Education & Work History Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education History */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  学歴 (Education History)
                </h3>
                <button
                  onClick={addEduRow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 追加
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {formData.educationHistory.map((edu, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
                    <input
                      type="number"
                      value={edu.year}
                      onChange={(e) => {
                        const next = [...formData.educationHistory];
                        next[idx].year = parseInt(e.target.value, 10);
                        setFormData({ ...formData, educationHistory: next });
                      }}
                      className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                    />
                    <span className="text-xs text-slate-500">年</span>
                    <input
                      type="number"
                      value={edu.month}
                      onChange={(e) => {
                        const next = [...formData.educationHistory];
                        next[idx].month = parseInt(e.target.value, 10);
                        setFormData({ ...formData, educationHistory: next });
                      }}
                      className="w-12 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                    />
                    <span className="text-xs text-slate-500">月</span>

                    <input
                      type="text"
                      value={edu.schoolName}
                      onChange={(e) => {
                        const next = [...formData.educationHistory];
                        next[idx].schoolName = e.target.value;
                        setFormData({ ...formData, educationHistory: next });
                      }}
                      placeholder="学校名 (School Name)"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                    />

                    <button
                      onClick={() => removeEduRow(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  職歴 (Work Experience)
                </h3>
                <button
                  onClick={addWorkRow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 追加
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {formData.workHistory.map((work, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
                    <input
                      type="number"
                      value={work.year}
                      onChange={(e) => {
                        const next = [...formData.workHistory];
                        next[idx].year = parseInt(e.target.value, 10);
                        setFormData({ ...formData, workHistory: next });
                      }}
                      className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                    />
                    <span className="text-xs text-slate-500">年</span>

                    <input
                      type="text"
                      value={work.companyName}
                      onChange={(e) => {
                        const next = [...formData.workHistory];
                        next[idx].companyName = e.target.value;
                        setFormData({ ...formData, workHistory: next });
                      }}
                      placeholder="会社名・勤務先"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                    />

                    <button
                      onClick={() => removeWorkRow(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. AI Keigo Motivation & Self-PR Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 志望の動機 (Motive Statement) */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  志望の動機 (Reason for Application)
                </h3>
                <button
                  disabled={isPolishingMotivation}
                  onClick={handlePolishMotivation}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-md disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPolishingMotivation ? 'AI推敲中...' : 'AI敬語ポリッシャー'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={formData.motivationStatementPolished || formData.motivationStatement}
                onChange={(e) => setFormData({ ...formData, motivationStatement: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed font-medium"
                placeholder="志望理由を入力してください..."
              />
              <div className="text-[11px] text-amber-400/80">
                💡 留学生の週28時間制限遵守や、責任感ある接客意欲を明記すると採用率が大幅に向上します。
              </div>
            </div>

            {/* 自己PR (Self PR) */}
            <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  自己PR・特技 (Self PR & Strengths)
                </h3>
                <button
                  disabled={isPolishingSelfPr}
                  onClick={handlePolishSelfPr}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-md disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPolishingSelfPr ? 'AI推敲中...' : 'AI敬語ポリッシャー'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={formData.selfPrPolished || formData.selfPr}
                onChange={(e) => setFormData({ ...formData, selfPr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed font-medium"
                placeholder="自己PRを入力してください..."
              />
              <div className="text-[11px] text-cyan-400/80">
                💡 異文化適応力、挨拶の明るさ、継続した学習姿勢を具体例とともにアピールしましょう。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Japanese JIS Printable View */}
      {viewMode === 'preview' && (
        <div className="bg-white text-slate-950 p-8 rounded-3xl shadow-2xl border-4 border-slate-300 font-serif max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-950 pb-4">
            <div>
              <h1 className="text-3xl font-black tracking-widest">履 歴 書</h1>
              <p className="text-xs text-slate-600 mt-1 font-mono">{new Date().toLocaleDateString('ja-JP')} 現在</p>
            </div>

            {/* Photo & Hanko Seal */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-32 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center p-1 bg-slate-50 text-[10px] text-slate-500 text-center">
                <img
                  src={formData.photoUrl}
                  alt="Candidate Photo"
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Japanese Inkan / Hanko Red Stamp */}
              <div className="w-14 h-14 rounded-full border-2 border-rose-600 flex items-center justify-center text-rose-600 font-bold text-[11px] shadow-sm transform -rotate-12">
                <div className="text-center leading-tight">
                  <div>カビル</div>
                  <div className="text-[9px]">印</div>
                </div>
              </div>
            </div>
          </div>

          {/* Name & Basic Info Box */}
          <table className="w-full border-collapse border border-slate-950 text-xs">
            <tbody>
              <tr>
                <td className="w-24 bg-slate-100 p-2 font-bold border border-slate-950">フリガナ</td>
                <td className="p-2 border border-slate-950 font-mono">{formData.fullNameKana}</td>
                <td className="w-20 bg-slate-100 p-2 font-bold border border-slate-950">性別</td>
                <td className="p-2 border border-slate-950 w-24 text-center">男</td>
              </tr>
              <tr>
                <td className="bg-slate-100 p-2 font-bold border border-slate-950">氏 名</td>
                <td className="p-2 border border-slate-950 text-base font-bold tracking-wider" colSpan={3}>
                  {formData.fullNameRomaji}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 p-2 font-bold border border-slate-950">生年月日</td>
                <td className="p-2 border border-slate-950" colSpan={3}>
                  {formData.japaneseEraBirth} ({formData.birthDate}生・満 {formData.age}歳)
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 p-2 font-bold border border-slate-950">現住所</td>
                <td className="p-2 border border-slate-950" colSpan={3}>
                  <div className="text-[10px] text-slate-600">〒 {formData.postalCode}</div>
                  <div className="font-semibold">{formData.currentAddress}</div>
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 p-2 font-bold border border-slate-950">連絡先 (TEL)</td>
                <td className="p-2 border border-slate-950 font-mono">{formData.phone}</td>
                <td className="bg-slate-100 p-2 font-bold border border-slate-950">Email</td>
                <td className="p-2 border border-slate-950 font-mono">{formData.email}</td>
              </tr>
            </tbody>
          </table>

          {/* Education & Work Table */}
          <div>
            <div className="text-xs font-bold mb-1">学歴・職歴 (Education & Work Experience)</div>
            <table className="w-full border-collapse border border-slate-950 text-xs">
              <thead>
                <tr className="bg-slate-100 border border-slate-950 text-center font-bold">
                  <th className="w-16 p-1.5 border border-slate-950">年</th>
                  <th className="w-12 p-1.5 border border-slate-950">月</th>
                  <th className="p-1.5 border border-slate-950 text-left pl-3">学歴・職歴（各別にまとめて書く）</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center font-bold bg-slate-50">
                  <td colSpan={3} className="p-1 border border-slate-950">学 歴</td>
                </tr>
                {formData.educationHistory.map((edu, i) => (
                  <tr key={`edu-${i}`}>
                    <td className="text-center p-1.5 border border-slate-950 font-mono">{edu.year}</td>
                    <td className="text-center p-1.5 border border-slate-950 font-mono">{edu.month}</td>
                    <td className="p-1.5 pl-3 border border-slate-950">
                      {edu.schoolName} {edu.faculty} {edu.status === 'graduated' ? '卒業' : '在学中'}
                    </td>
                  </tr>
                ))}

                <tr className="text-center font-bold bg-slate-50">
                  <td colSpan={3} className="p-1 border border-slate-950">職 歴</td>
                </tr>
                {formData.workHistory.map((work, i) => (
                  <tr key={`work-${i}`}>
                    <td className="text-center p-1.5 border border-slate-950 font-mono">{work.year}</td>
                    <td className="text-center p-1.5 border border-slate-950 font-mono">{work.month}</td>
                    <td className="p-1.5 pl-3 border border-slate-950">
                      {work.companyName} {work.role} (入社)
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="text-center p-1.5 border border-slate-950"></td>
                  <td className="text-center p-1.5 border border-slate-950"></td>
                  <td className="p-1.5 pl-3 border border-slate-950 text-right pr-6 font-bold">以 上</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Motivation & Self PR in JIS format */}
          <div className="space-y-4">
            <div className="border border-slate-950 p-3 rounded">
              <div className="text-xs font-bold text-slate-800 mb-1 border-b border-slate-300 pb-1">
                志望の動機・特技・アピールポイント
              </div>
              <p className="text-xs leading-relaxed text-slate-900 font-sans">
                {formData.motivationStatementPolished || formData.motivationStatement}
              </p>
            </div>

            <div className="border border-slate-950 p-3 rounded">
              <div className="text-xs font-bold text-slate-800 mb-1 border-b border-slate-300 pb-1">
                自己PR・性格の長所
              </div>
              <p className="text-xs leading-relaxed text-slate-900 font-sans">
                {formData.selfPrPolished || formData.selfPr}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
