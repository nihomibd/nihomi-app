import React, { useState, useEffect, useRef } from 'react';
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
  Stamp,
  Upload,
  Camera,
  RotateCcw,
  Languages,
  Check,
  Briefcase,
  ArrowRight,
  Loader2,
  Lock,
  Crown,
  Info
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { JisRirekishoData } from '../../types';
import { soundEffects } from '../../lib/soundEffects';
import { useAuth } from '../../context/AuthContext';
import { cvRirekishoAdapter } from '../../core/adapters/cvRirekishoAdapter';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { recordOfflineAttempt } from '../../lib/offline/indexedDbLedger';

export const DEFAULT_AVATAR_DATA_URI = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160' width='120' height='160'><rect width='120' height='160' fill='%23f1f5f9'/><circle cx='60' cy='55' r='32' fill='%2394a3b8'/><path d='M 20 150 C 20 105, 100 105, 100 150 Z' fill='%2394a3b8'/><text x='60' y='155' font-family='sans-serif' font-size='9' fill='%2364748b' text-anchor='middle'>写真 (3cm x 4cm)</text></svg>";

const DEFAULT_JIS_RIREKISHO: JisRirekishoData = {
  id: 'rirekisho-default',
  userId: 'usr-current',
  fullName: 'MD TANVIR HOSSAIN',
  fullNameKana: 'エムディ タンヴィル ホセイン',
  fullNameRomaji: 'MD TANVIR HOSSAIN',
  gender: 'male',
  birthDate: '2001-05-15',
  japaneseEraBirth: '平成13年5月15日',
  age: 23,
  phone: '080-1234-5678',
  email: 'tanvir.nihomi@example.com',
  postalCode: '169-0075',
  currentAddress: '東京都新宿区高田馬場2-14-8 メゾン高田302号室',
  currentAddressKana: 'トウキョウトシンジュククタカダノババ',
  photoUrl: DEFAULT_AVATAR_DATA_URI,
  visaStatus: '留学 (Student Visa / 資格外活動許可済)',
  visaExpiry: '2026-04-30',
  allowedHoursPerWeek: 28,
  educationHistory: [
    { year: 2019, month: 3, schoolName: 'ダッカ・カレッジ (Dhaka College)', faculty: '理系高等科 (Science)', status: 'graduated' },
    { year: 2023, month: 10, schoolName: '東京国際日本語学院 (Tokyo Int. Japanese School)', faculty: '進学日本語科', status: 'enrolled' }
  ],
  workHistory: [
    { year: 2021, month: 6, companyName: 'ダッカ ITソリューションズ (Dhaka IT)', role: 'データ入力・アシスタント', status: 'joined' },
    { year: 2023, month: 9, companyName: 'ダッカ ITソリューションズ', role: '退社 (渡日のため)', status: 'resigned' }
  ],
  licensesCertifications: [
    { year: 2024, month: 12, title: '日本語能力試験 (JLPT) N5 合格' },
    { year: 2023, month: 8, title: '普通自動車第一種運転免許 (バングラデシュ免許・切替予定)' }
  ],
  jlptLevel: 'N5',
  motivationStatement: '日本の接客文化と誠実なチームワークを深く尊敬しております。留学生として法定の週28時間制限を厳格に遵守し、明るい笑顔と丁寧な敬語でお客様に喜ばれるサービスを提供したいと考え志望いたしました。',
  motivationStatementPolished: '日本のきめ細やかな接客文化と誠実なチームワークに深く感銘を受けております。留学生として法令で定められた週28時間の就労制限を厳格に遵守し、明るい笑顔と正確な敬語を用いて、店舗の信頼向上と円滑な運営に貢献したいと考え志望いたしました。',
  selfPr: '私の強みは異文化への適応力と粘り強さです。毎日3時間日本語を学習し、挨拶や時間厳守を徹底しています。急なシフト変更や繁忙時間帯にも柔軟に対応可能です。',
  selfPrPolished: '私の長所は、異文化環境における高い適応力と誠実な継続力です。来日以降、毎日継続して日本語の習得に努めており、時間厳守と明瞭な挨拶を信条としております。チームの一員として責任感を持ち、繁忙時にも落ち着いた丁寧な対応を心がけます。',
  commuteTimeMinutes: 25,
  dependentsCount: 0,
  hasSpouse: false,
  updatedAt: new Date().toISOString()
};

const PHOTO_PRESETS = [
  {
    label: 'Formal Male Avatar',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160' width='120' height='160'><rect width='120' height='160' fill='%23e2e8f0'/><circle cx='60' cy='50' r='28' fill='%23475569'/><path d='M 20 145 C 20 100, 100 100, 100 145 Z' fill='%231e293b'/><polygon points='60,95 50,140 70,140' fill='%23ef4444'/><text x='60' y='155' font-family='sans-serif' font-size='8' fill='%2364748b' text-anchor='middle'>JIS Standard Male</text></svg>"
  },
  {
    label: 'Formal Female Avatar',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160' width='120' height='160'><rect width='120' height='160' fill='%23fdf2f8'/><circle cx='60' cy='50' r='28' fill='%23f472b6'/><path d='M 20 145 C 20 100, 100 100, 100 145 Z' fill='%23334155'/><text x='60' y='155' font-family='sans-serif' font-size='8' fill='%2364748b' text-anchor='middle'>JIS Standard Female</text></svg>"
  },
  {
    label: 'Minimalist Silhouette',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160' width='120' height='160'><rect width='120' height='160' fill='%23f8fafc'/><circle cx='60' cy='52' r='30' fill='%2364748b'/><path d='M 22 148 C 22 102, 98 102, 98 148 Z' fill='%23334155'/><text x='60' y='155' font-family='sans-serif' font-size='8' fill='%2364748b' text-anchor='middle'>証明写真</text></svg>"
  }
];

interface JisRirekishoStudioProps {
  onSaved?: (rirekisho: JisRirekishoData) => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const JisRirekishoStudio: React.FC<JisRirekishoStudioProps> = ({ onSaved, onNavigate }) => {
  const { activePlanId, user, openAuthModal } = useAuth();
  const isPro = activePlanId !== 'free';
  const [showAuthGateNotice, setShowAuthGateNotice] = useState(false);

  const [formData, setFormData] = useState<JisRirekishoData>(() => {
    try {
      const saved = localStorage.getItem('nihomi_jis_rirekisho');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_JIS_RIREKISHO, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read cached rirekisho:', e);
    }
    return DEFAULT_JIS_RIREKISHO;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showLeadMagnetModal, setShowLeadMagnetModal] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState(false);
  const [isPolishingMotivation, setIsPolishingMotivation] = useState(false);
  const [isPolishingSelfPr, setIsPolishingSelfPr] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isSavedToCloud, setIsSavedToCloud] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  // Load user's Rirekisho from API with resilient non-blocking fallback
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const token = localStorage.getItem('nihomi_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/baito/rirekisho', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.rirekisho && isMounted) {
            setFormData((prev) => ({ ...prev, ...data.rirekisho }));
            setIsSavedToCloud(true);
          }
        }
      } catch (err) {
        console.warn('Backend rirekisho unavailable, using local client profile:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    soundEffects.playButtonTap();

    // Always persist to local cache first so no learner loses their data
    try {
      localStorage.setItem('nihomi_jis_rirekisho', JSON.stringify(formData));
    } catch {}

    if (!user) {
      soundEffects.playCorrectPing();
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
      return;
    }

    setIsSaving(true);
    let cloudSynced = false;

    try {

      const token = localStorage.getItem('nihomi_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/baito/rirekisho/save', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rirekisho) {
          cloudSynced = true;
          if (onSaved) onSaved(data.rirekisho);
        }
      }
    } catch (e) {
      console.warn('Remote save skipped, saved to local cache successfully:', e);
    } finally {
      setIsSaving(false);
      setIsSavedToCloud(cloudSynced);
      soundEffects.playCorrectPing();
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playButtonTap();
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === 'string') {
        setFormData((prev) => ({ ...prev, photoUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPdf = async () => {
    soundEffects.playButtonTap();
    setIsGeneratingPdf(true);

    try {
      const paperElement = paperRef.current || document.getElementById('jis-resume-paper');
      if (!paperElement) {
        throw new Error('Resume paper element not found');
      }

      // Safe Candidate File Name
      const safeName = formData.fullNameRomaji.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'nihomi_user';
      const fileName = `Nihomi_JIS_Rirekisho_${safeName}.pdf`;

      // 1. Setup isolated sandbox with standard A4 width (794px at 96 DPI)
      const sandbox = document.createElement('div');
      sandbox.style.position = 'fixed';
      sandbox.style.left = '0';
      sandbox.style.top = '0';
      sandbox.style.width = '794px';
      sandbox.style.minHeight = '1123px';
      sandbox.style.zIndex = '-9999';
      sandbox.style.opacity = '1';
      sandbox.style.pointerEvents = 'none';
      sandbox.style.backgroundColor = '#ffffff';

      const clone = paperElement.cloneNode(true) as HTMLElement;
      clone.style.width = '794px';
      clone.style.maxWidth = '794px';
      clone.style.minWidth = '794px';
      clone.style.margin = '0';
      clone.style.transform = 'none';
      clone.style.overflow = 'visible';
      clone.style.opacity = '1';
      clone.style.visibility = 'visible';
      clone.style.display = 'block';

      // Ensure data-uri images do not have invalid crossOrigin flags
      const cloneImages = clone.querySelectorAll('img');
      cloneImages.forEach((img) => {
        if (img.src && img.src.startsWith('data:')) {
          img.removeAttribute('crossorigin');
        }
      });

      sandbox.appendChild(clone);
      document.body.appendChild(sandbox);

      let canvas: HTMLCanvasElement | null = null;

      try {
        // Render A4 canvas at 2x scale for crisp Japanese text
        canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          windowWidth: 794
        });
      } catch (captureErr) {
        console.warn('Sandbox html2canvas capture failed, attempting sanitized retry:', captureErr);
        // If image tainted canvas, remove external images from clone and retry
        const images = clone.querySelectorAll('img');
        images.forEach((img) => img.remove());
        canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: false,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          windowWidth: 794
        });
      } finally {
        if (sandbox.parentNode) {
          sandbox.parentNode.removeChild(sandbox);
        }
      }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render produced empty dimensions');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const PDFDoc = (jsPDF as any).jsPDF || jsPDF;
      const pdf = new PDFDoc({
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

      // Watermark for free tier
      if (!isPro) {
        const totalPages = pdf.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          pdf.setPage(p);
          pdf.setFontSize(8);
          pdf.setTextColor(140, 140, 140);
          pdf.text('Generated via NIHOMI.COM — Bengali-First Japanese Learning Platform', 15, pdfPageHeight - 4);
        }
      }

      // Multi-platform binary download triggering (Desktop + iOS/Android mobile webviews)
      try {
        pdf.save(fileName);
      } catch (saveErr) {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          if (downloadLink.parentNode) {
            downloadLink.parentNode.removeChild(downloadLink);
          }
          URL.revokeObjectURL(blobUrl);
        }, 3000);
      }

      // Evaluate CV attempt through cvRirekishoAdapter and log evidence
      try {
        const knowledge = loadLearnerKnowledgeState();
        const activity = cvRirekishoAdapter.selectActivity(knowledge);
        const evalResult = cvRirekishoAdapter.evaluateAttempt(activity, {
          documentId: formData.id || 'jis-resume',
          templateType: 'jis_standard_rirekisho',
          data: formData,
          userConfirmedTruthful: true,
          timeSpentSeconds: 60
        });

        if (evalResult.passed) {
          recordOfflineAttempt({
            userId: user?.id || 'guest',
            domain: 'cv-rirekisho',
            activityId: 'jis-standard-rirekisho',
            timestamp: new Date().toISOString(),
            score: evalResult.score,
            passed: true,
            xpEarned: evalResult.xpEarned,
            evidenceData: evalResult.evidence
          }).catch(() => {});
        }
      } catch (adapterErr) {
        console.warn('[JIS Studio] Adapter evaluation exception:', adapterErr);
      }

      soundEffects.playLessonCelebration();
      setDownloadSuccessNotice(true);
      setTimeout(() => setDownloadSuccessNotice(false), 4000);
    } catch (err: any) {
      console.warn('JIS PDF export failed, falling back to structured vector generator:', err);
      try {
        const PDFDoc = (jsPDF as any).jsPDF || jsPDF;
        const fallbackPdf = new PDFDoc({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        fallbackPdf.setFontSize(18);
        fallbackPdf.text('JIS Standard Japanese Resume (履歴書)', 15, 20);
        fallbackPdf.setFontSize(10);
        fallbackPdf.text(`Candidate: ${formData.fullNameRomaji} (${formData.fullNameKana})`, 15, 30);
        fallbackPdf.text(`Date of Birth: ${formData.birthDate} (${formData.japaneseEraBirth})`, 15, 36);
        fallbackPdf.text(`Email: ${formData.email} | Phone: ${formData.phone}`, 15, 42);
        fallbackPdf.text(`Visa Status: ${formData.visaStatus}`, 15, 48);
        fallbackPdf.text(`Address: ${formData.currentAddress}`, 15, 54);
        fallbackPdf.text('--- Education & Work History ---', 15, 64);
        let y = 70;
        formData.educationHistory.forEach((edu) => {
          if (y < 260) {
            fallbackPdf.text(`${edu.year}/${edu.month}: ${edu.schoolName} (${edu.status})`, 15, y);
            y += 6;
          }
        });
        formData.workHistory.forEach((work) => {
          if (y < 260) {
            fallbackPdf.text(`${work.year}/${work.month}: ${work.companyName} (${work.role})`, 15, y);
            y += 6;
          }
        });
        fallbackPdf.text('--- Motivation & Self PR ---', 15, y + 4);
        y += 10;
        const motivationLines = fallbackPdf.splitTextToSize(formData.motivationStatementPolished || formData.motivationStatement || 'None', 180);
        fallbackPdf.text(motivationLines, 15, y);
        y += motivationLines.length * 5 + 6;
        const prLines = fallbackPdf.splitTextToSize(formData.selfPrPolished || formData.selfPr || 'None', 180);
        fallbackPdf.text(prLines, 15, y);

        const safeName = formData.fullNameRomaji.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'nihomi_user';
        fallbackPdf.save(`Nihomi_JIS_Rirekisho_${safeName}.pdf`);
        setDownloadSuccessNotice(true);
      } catch (innerErr) {
        console.error('All JIS PDF generation methods failed:', innerErr);
        alert('PDF ডাউনলোড ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSelectJlptLevel = (level: JisRirekishoData['jlptLevel']) => {
    soundEffects.playButtonTap();
    const currentLicenses = [...formData.licensesCertifications];

    // Remove existing JLPT entry if present
    const filtered = currentLicenses.filter((l) => !l.title.includes('日本語能力試験') && !l.title.includes('JLPT'));

    let titleText = `日本語能力試験 (JLPT) ${level} 合格`;
    if (level.includes('Studying')) {
      titleText = `日本語能力試験 (${level}) 学習中・次回受験予定`;
    }

    filtered.unshift({
      year: new Date().getFullYear(),
      month: 12,
      title: titleText
    });

    setFormData((prev) => ({
      ...prev,
      jlptLevel: level,
      licensesCertifications: filtered
    }));
  };

  const handlePolishMotivation = async () => {
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
        setFormData((prev) => ({ ...prev, motivationStatementPolished: data.polishedJa }));
        return;
      }
      // If API returned without polishedJa, fallback to client template
      const polishedFallback = `日本のきめ細やかな接客文化と誠実なチームワークに深く感銘を受けております。留学生として法令で定められた週28時間の就労制限を厳格に遵守し、明るい笑顔と正確な敬語を用いて、貴店の信頼向上と円滑な店舗運営に貢献したいと考え志望いたしました。`;
      setFormData((prev) => ({ ...prev, motivationStatementPolished: polishedFallback }));
      soundEffects.playCorrectPing();
    } catch (err) {
      console.warn('AI polish API unavailable, using high-standard Keigo template:', err);
      const polishedFallback = `日本のきめ細やかな接客文化と誠実なチームワークに深く感銘を受けております。留学生として法令で定められた週28時間の就労制限を厳格に遵守し、明るい笑顔と正確な敬語を用いて、貴店の信頼向上と円滑な店舗運営に貢献したいと考え志望いたしました。`;
      setFormData((prev) => ({ ...prev, motivationStatementPolished: polishedFallback }));
      soundEffects.playCorrectPing();
    } finally {
      setIsPolishingMotivation(false);
    }
  };

  const handlePolishSelfPr = async () => {
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
        setFormData((prev) => ({ ...prev, selfPrPolished: data.polishedJa }));
        return;
      }
      const polishedFallback = `私の長所は、異文化環境における高い適応力と誠実な継続力です。来日以降、毎日継続して日本語の習得に努めており、時間厳守と明瞭な挨拶を信条としております。チームの一員として責任感を持ち、繁忙時にも落ち着いた丁寧な対応を心がけます。`;
      setFormData((prev) => ({ ...prev, selfPrPolished: polishedFallback }));
      soundEffects.playCorrectPing();
    } catch (err) {
      console.warn('AI polish API unavailable, using high-standard Keigo template:', err);
      const polishedFallback = `私の長所は、異文化環境における高い適応力と誠実な継続力です。来日以降、毎日継続して日本語の習得に努めており、時間厳守と明瞭な挨拶を信条としております。チームの一員として責任感を持ち、繁忙時にも落ち着いた丁寧な対応を心がけます。`;
      setFormData((prev) => ({ ...prev, selfPrPolished: polishedFallback }));
      soundEffects.playCorrectPing();
    } finally {
      setIsPolishingSelfPr(false);
    }
  };

  // Education row operations
  const addEduRow = () => {
    setFormData((prev) => ({
      ...prev,
      educationHistory: [
        ...prev.educationHistory,
        {
          year: new Date().getFullYear(),
          month: 4,
          schoolName: '',
          faculty: '',
          status: 'enrolled'
        }
      ]
    }));
  };

  const removeEduRow = (index: number) => {
    const nextEdu = [...formData.educationHistory];
    nextEdu.splice(index, 1);
    setFormData((prev) => ({ ...prev, educationHistory: nextEdu }));
  };

  // Work row operations
  const addWorkRow = () => {
    setFormData((prev) => ({
      ...prev,
      workHistory: [
        ...prev.workHistory,
        {
          year: new Date().getFullYear(),
          month: 1,
          companyName: '',
          role: '',
          status: 'joined'
        }
      ]
    }));
  };

  const removeWorkRow = (index: number) => {
    const nextWork = [...formData.workHistory];
    nextWork.splice(index, 1);
    setFormData((prev) => ({ ...prev, workHistory: nextWork }));
  };

  // License row operations
  const addLicenseRow = () => {
    setFormData((prev) => ({
      ...prev,
      licensesCertifications: [
        ...prev.licensesCertifications,
        {
          year: new Date().getFullYear(),
          month: 12,
          title: ''
        }
      ]
    }));
  };

  const removeLicenseRow = (index: number) => {
    const nextLic = [...formData.licensesCertifications];
    nextLic.splice(index, 1);
    setFormData((prev) => ({ ...prev, licensesCertifications: nextLic }));
  };

  return (
    <div id="jis-rirekisho-studio" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              JIS 規格準拠 (Official Standard)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              বিনামূল্যে তৈরি ও ডাউনলোড (FREE)
            </span>
            <span className="text-xs text-slate-400">アルバイト・正社員・特定技能・ビザ提出用</span>
          </div>
          <h2 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            日本標準 履歴書スタジオ (JIS Rirekisho Studio)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            id="jis-download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            title="Download JIS Resume as Official A4 PDF"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGeneratingPdf ? 'A4 PDF生成中...' : 'PDF 保存 (JIS A4)'}</span>
          </button>

          <button
            id="jis-save-draft-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition flex items-center gap-2 text-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{isSaving ? '保存中...' : 'データを保存'}</span>
          </button>
        </div>
      </div>

      {/* Legal & Pedagogical Disclaimer */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200 text-xs flex items-start gap-2.5 print:hidden">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>ডিসক্লেইমার:</strong> নিহোমি রিজিউমে বিল্ডার একটি তথ্য ও ফরম্যাটিং সহায়ক ফ্রি টুল। এটি কোনো নিশ্চিত চাকরি, ভিসা অনুমোদন বা ভর্তির নিশ্চয়তা প্রদান করে না। ব্যবহারকারী প্রদত্ত তথ্যের সত্যতার দায়ভার ব্যবহারকারীর নিজের।
        </span>
      </div>

      {/* Auth Prompt or Authenticated Status */}
      {!user ? (
        <div id="jis-auth-prompt-banner" className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl text-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <div>
              <span className="font-bold text-amber-300">গেস্ট প্রিভিউ মোড (Guest Preview):</span>
              <span className="text-slate-300 ml-1">
                আপনি ডেমো ফরম এডিট ও প্রিভিউ করতে পারবেন। তবে আপনার নিজস্ব JIS রিজিউমে স্থায়ীভাবে সংরক্ষণ এবং অফিশিয়াল A4 PDF এক্সপোর্ট করতে গুগল অ্যাকাউন্ট দিয়ে বিনামূল্যে সাইন-ইন আবশ্যক।
              </span>
            </div>
          </div>
          <button
            id="jis-auth-signin-btn"
            type="button"
            onClick={() => openAuthModal?.('login')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition shrink-0 cursor-pointer"
          >
            গুগল দিয়ে সাইন-ইন করুন (ফ্রি)
          </button>
        </div>
      ) : (
        <div id="jis-auth-logged-in-badge" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              সাইন-ইন সফল: <strong>{user.name || user.email}</strong> • অনুমোদিত ফ্রি বেনিফিট সক্রিয় (অফিসিয়াল A4 PDF এক্সপোর্ট আনলকড)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
            STUDENT AUTHENTICATED
          </span>
        </div>
      )}

      {showAuthGateNotice && !user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-between gap-2 print:hidden"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>অফিসিয়াল JIS A4 PDF এক্সপোর্ট ও ক্লাউড সেভের জন্য দয়া করে গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন সম্পন্ন করুন।</span>
          </div>
          <button
            onClick={() => openAuthModal?.('login')}
            className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-extrabold cursor-pointer shrink-0"
          >
            লগইন করুন
          </button>
        </motion.div>
      )}

      {downloadSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 print:hidden"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>অফিসিয়াল JIS Z 8303 স্ট্যান্ডার্ড A4 PDF সফলভাবে আপনার ডিভাইসে ডাউনলোড হয়েছে!</span>
        </motion.div>
      )}

      {saveSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 print:hidden ${
            isSavedToCloud
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {isSavedToCloud
              ? '履歴書データがクラウドに保存されました。(ক্লাউড ডেটাবেসে সফলভাবে সংরক্ষিত)'
              : 'ローカル下書きとして保存されました。(লোকাল ডিভাইস ক্যাশে ড্রাফট সংরক্ষিত — ক্লাউড সিঙ্ক বাকি)'}
          </span>
        </motion.div>
      )}

      {/* Editor Mode */}
      {viewMode === 'editor' && (
        <div className="space-y-6 print:hidden">
          {/* 1. Student Photo & Basic Information Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-amber-400" />
              1. 証明写真・基本情報 (Photo & Basic Profile)
            </h3>

            {/* Photo Upload Row */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <div className="w-24 h-32 border-2 border-dashed border-amber-500/50 rounded-lg overflow-hidden bg-slate-900 flex flex-col items-center justify-center relative shadow-md">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Student Portrait"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400">3cm × 4cm</span>
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-bold text-slate-200">証明写真 (Candidate Photo: 30mm × 40mm)</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    JIS規格必須
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  日本の履歴書では3ヶ月以内に撮影した清潔感のある証明写真（白背景・スーツ推奨）が必要です。
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>写真をアップロード (Upload)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        photoUrl: PHOTO_PRESETS[0].url
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                  >
                    サンプル写真を使用
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">氏名 (Full Name in Romaji)</label>
                <input
                  type="text"
                  value={formData.fullNameRomaji}
                  onChange={(e) => setFormData({ ...formData, fullNameRomaji: e.target.value, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">フリガナ (Katakana Name)</label>
                <input
                  type="text"
                  value={formData.fullNameKana}
                  onChange={(e) => setFormData({ ...formData, fullNameKana: e.target.value })}
                  placeholder="エムディ タンヴィル ホセイン"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-400 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">生年月日 (Birth Date & 和暦)</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={formData.japaneseEraBirth}
                    onChange={(e) => setFormData({ ...formData, japaneseEraBirth: e.target.value })}
                    placeholder="平成13年5月15日"
                    className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-amber-400 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">電話番号 (Phone Number)</label>
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
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-medium"
                  />
                  <span className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono flex items-center font-bold">
                    週28h
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">現住所 (Current Tokyo Address & Postal Code)</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="〒 169-0075"
                  className="w-full sm:w-36 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold"
                />
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                  placeholder="東京都新宿区高田馬場2-14-8..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Japanese Language Level & Qualifications */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-400" />
                2. 日本語能力・免許・資格 (Japanese Level & Licenses)
              </h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                JLPT / 日本語能力レベルを選択（JIS履歴書の免許欄に自動反映）:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {(['N5', 'Studying N5', 'N4', 'Studying N4', 'N3'] as const).map((lvl) => {
                  const isSelected = formData.jlptLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSelectJlptLevel(lvl)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm flex items-center gap-1">
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        {lvl}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {lvl.includes('Studying') ? '学習中 / 受験予定' : '合格 (Passed)'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Licenses Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">その他の免許・資格 (Other Certifications):</span>
                <button
                  type="button"
                  onClick={addLicenseRow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 資格を追加
                </button>
              </div>

              <div className="space-y-2">
                {formData.licensesCertifications.map((lic, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
                    <input
                      type="number"
                      value={lic.year}
                      onChange={(e) => {
                        const next = [...formData.licensesCertifications];
                        next[idx].year = parseInt(e.target.value, 10) || new Date().getFullYear();
                        setFormData({ ...formData, licensesCertifications: next });
                      }}
                      className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                    />
                    <span className="text-xs text-slate-500">年</span>
                    <input
                      type="number"
                      value={lic.month}
                      onChange={(e) => {
                        const next = [...formData.licensesCertifications];
                        next[idx].month = parseInt(e.target.value, 10) || 1;
                        setFormData({ ...formData, licensesCertifications: next });
                      }}
                      className="w-12 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                    />
                    <span className="text-xs text-slate-500">月</span>

                    <input
                      type="text"
                      value={lic.title}
                      onChange={(e) => {
                        const next = [...formData.licensesCertifications];
                        next[idx].title = e.target.value;
                        setFormData({ ...formData, licensesCertifications: next });
                      }}
                      placeholder="日本語能力試験 N5 合格 / 普通自動車第一種運転免許..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-200"
                    />

                    <button
                      type="button"
                      onClick={() => removeLicenseRow(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Education & Work History Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education History */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  3. 学歴 (Education History)
                </h3>
                <button
                  type="button"
                  onClick={addEduRow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 追加
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {formData.educationHistory.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={edu.year}
                        onChange={(e) => {
                          const next = [...formData.educationHistory];
                          next[idx].year = parseInt(e.target.value, 10) || 2024;
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
                          next[idx].month = parseInt(e.target.value, 10) || 4;
                          setFormData({ ...formData, educationHistory: next });
                        }}
                        className="w-12 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                      />
                      <span className="text-xs text-slate-500">月</span>

                      <select
                        value={edu.status}
                        onChange={(e) => {
                          const next = [...formData.educationHistory];
                          next[idx].status = e.target.value as any;
                          setFormData({ ...formData, educationHistory: next });
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="enrolled">在学中 (Enrolled)</option>
                        <option value="graduated">卒業 (Graduated)</option>
                        <option value="expected_graduation">卒業見込み (Expected)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => removeEduRow(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.schoolName}
                        onChange={(e) => {
                          const next = [...formData.educationHistory];
                          next[idx].schoolName = e.target.value;
                          setFormData({ ...formData, educationHistory: next });
                        }}
                        placeholder="学校名 (School Name)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                      />
                      <input
                        type="text"
                        value={edu.faculty}
                        onChange={(e) => {
                          const next = [...formData.educationHistory];
                          next[idx].faculty = e.target.value;
                          setFormData({ ...formData, educationHistory: next });
                        }}
                        placeholder="学部・学科 (Faculty / Course)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  4. 職歴 (Work Experience)
                </h3>
                <button
                  type="button"
                  onClick={addWorkRow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 追加
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {formData.workHistory.map((work, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={work.year}
                        onChange={(e) => {
                          const next = [...formData.workHistory];
                          next[idx].year = parseInt(e.target.value, 10) || 2024;
                          setFormData({ ...formData, workHistory: next });
                        }}
                        className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                      />
                      <span className="text-xs text-slate-500">年</span>
                      <input
                        type="number"
                        value={work.month}
                        onChange={(e) => {
                          const next = [...formData.workHistory];
                          next[idx].month = parseInt(e.target.value, 10) || 1;
                          setFormData({ ...formData, workHistory: next });
                        }}
                        className="w-12 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                      />
                      <span className="text-xs text-slate-500">月</span>

                      <select
                        value={work.status}
                        onChange={(e) => {
                          const next = [...formData.workHistory];
                          next[idx].status = e.target.value as any;
                          setFormData({ ...formData, workHistory: next });
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="joined">入社 (Joined)</option>
                        <option value="current">在職中 (Current)</option>
                        <option value="resigned">一身上の都合により退社 (Resigned)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => removeWorkRow(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={work.companyName}
                        onChange={(e) => {
                          const next = [...formData.workHistory];
                          next[idx].companyName = e.target.value;
                          setFormData({ ...formData, workHistory: next });
                        }}
                        placeholder="会社名・勤務先"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                      />
                      <input
                        type="text"
                        value={work.role}
                        onChange={(e) => {
                          const next = [...formData.workHistory];
                          next[idx].role = e.target.value;
                          setFormData({ ...formData, workHistory: next });
                        }}
                        placeholder="役職・業務内容 (Role / Tasks)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. AI Keigo Motivation & Self-PR Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 志望の動機 (Motive Statement) */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  5. 志望の動機 (Reason for Application)
                </h3>
                <button
                  type="button"
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
                onChange={(e) => setFormData({ ...formData, motivationStatement: e.target.value, motivationStatementPolished: e.target.value })}
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
                  6. 自己PR・特技 (Self PR & Strengths)
                </h3>
                <button
                  type="button"
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
                onChange={(e) => setFormData({ ...formData, selfPr: e.target.value, selfPrPolished: e.target.value })}
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

      {/* Official Japanese JIS Printable View (Always mounted in DOM for zero-delay PDF export) */}
      <div className={viewMode === 'preview' ? 'space-y-4 block' : 'fixed -left-[9999px] top-0 pointer-events-none z-[-9999]'}>
        {viewMode === 'preview' && (
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-3 print:hidden">
            <span className="text-xs text-slate-300 font-medium">
              📄 JIS規格 A4印刷対応プレビュー（下のボタンでPDF保存または印刷できます）
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('editor')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                ✏️ 編集に戻る
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow disabled:opacity-50"
              >
                {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isGeneratingPdf ? 'A4 PDF生成中...' : 'PDF 保存 (JIS A4)'}</span>
              </button>
            </div>
          </div>
        )}

        <div
          id="jis-resume-paper"
            ref={paperRef}
            data-resume-paper="true"
            className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-slate-400 font-serif max-w-4xl mx-auto space-y-6 overflow-x-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-950 pb-4">
              <div>
                <h1 className="text-3xl font-black tracking-widest">履 歴 書</h1>
                <p className="text-xs text-slate-600 mt-1 font-mono">{new Date().toLocaleDateString('ja-JP')} 現在</p>
              </div>

              {/* Photo & Hanko Seal */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-32 border-2 border-slate-900 flex flex-col items-center justify-center p-0.5 bg-slate-50 text-[10px] text-slate-500 text-center overflow-hidden">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Candidate Portrait"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="p-2 leading-tight">
                      写真を貼る位置
                      <br />
                      (3cm × 4cm)
                    </div>
                  )}
                </div>

                {/* Japanese Inkan / Hanko Red Stamp */}
                <div className="w-14 h-14 rounded-full border-2 border-rose-600 flex items-center justify-center text-rose-600 font-bold text-[11px] shadow-sm transform -rotate-12 select-none">
                  <div className="text-center leading-tight">
                    <div>タンヴィル</div>
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
                  <td className="p-2 border border-slate-950 font-sans">{formData.fullNameKana}</td>
                  <td className="w-20 bg-slate-100 p-2 font-bold border border-slate-950">性別</td>
                  <td className="p-2 border border-slate-950 w-24 text-center">
                    {formData.gender === 'female' ? '女' : '男'}
                  </td>
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
                <tr>
                  <td className="bg-slate-100 p-2 font-bold border border-slate-950">在留資格</td>
                  <td className="p-2 border border-slate-950 font-semibold" colSpan={3}>
                    {formData.visaStatus} (週{formData.allowedHoursPerWeek}時間以内就労可)
                  </td>
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
                      <td className="p-1.5 pl-3 border border-slate-950 font-sans">
                        {edu.schoolName} {edu.faculty} {edu.status === 'graduated' ? '卒業' : edu.status === 'expected_graduation' ? '卒業見込み' : '在学中'}
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
                      <td className="p-1.5 pl-3 border border-slate-950 font-sans">
                        {work.companyName} {work.role} ({work.status === 'resigned' ? '退社' : work.status === 'current' ? '在職中' : '入社'})
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

            {/* Licenses & Certifications Table */}
            <div>
              <div className="text-xs font-bold mb-1">免許・資格 (Licenses & Qualifications)</div>
              <table className="w-full border-collapse border border-slate-950 text-xs">
                <thead>
                  <tr className="bg-slate-100 border border-slate-950 text-center font-bold">
                    <th className="w-16 p-1.5 border border-slate-950">年</th>
                    <th className="w-12 p-1.5 border border-slate-950">月</th>
                    <th className="p-1.5 border border-slate-950 text-left pl-3">免許・資格名</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.licensesCertifications.map((lic, i) => (
                    <tr key={`lic-${i}`}>
                      <td className="text-center p-1.5 border border-slate-950 font-mono">{lic.year}</td>
                      <td className="text-center p-1.5 border border-slate-950 font-mono">{lic.month}</td>
                      <td className="p-1.5 pl-3 border border-slate-950 font-sans font-medium">{lic.title}</td>
                    </tr>
                  ))}
                  {formData.licensesCertifications.length === 0 && (
                    <tr>
                      <td className="text-center p-1.5 border border-slate-950"></td>
                      <td className="text-center p-1.5 border border-slate-950"></td>
                      <td className="p-1.5 pl-3 border border-slate-950 text-slate-500 font-sans">特になし</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Motivation & Self PR in JIS format */}
            <div className="space-y-4">
              <div className="border border-slate-950 p-3 rounded">
                <div className="text-xs font-bold text-slate-800 mb-1 border-b border-slate-300 pb-1">
                  志望の動機・特技・アピールポイント (Reason for Application & Strengths)
                </div>
                <p className="text-xs leading-relaxed text-slate-900 font-sans">
                  {formData.motivationStatementPolished || formData.motivationStatement}
                </p>
              </div>

              <div className="border border-slate-950 p-3 rounded">
                <div className="text-xs font-bold text-slate-800 mb-1 border-b border-slate-300 pb-1">
                  自己PR・性格の長所 (Self PR & Work Ethics)
                </div>
                <p className="text-xs leading-relaxed text-slate-900 font-sans">
                  {formData.selfPrPolished || formData.selfPr}
                </p>
              </div>
            </div>

            {/* Commute, Dependents & Spouse Table (JIS Official Standard) */}
            <table className="w-full border-collapse border border-slate-950 text-xs">
              <tbody>
                <tr>
                  <td className="w-28 bg-slate-100 p-2 font-bold border border-slate-950">通勤時間</td>
                  <td className="p-2 border border-slate-950">約 {formData.commuteTimeMinutes || 25} 分</td>
                  <td className="w-28 bg-slate-100 p-2 font-bold border border-slate-950">扶養家族数</td>
                  <td className="p-2 border border-slate-950">{formData.dependentsCount || 0} 人（配偶者を除く）</td>
                </tr>
                <tr>
                  <td className="bg-slate-100 p-2 font-bold border border-slate-950">配偶者</td>
                  <td className="p-2 border border-slate-950">{formData.hasSpouse ? '有' : '無'}</td>
                  <td className="bg-slate-100 p-2 font-bold border border-slate-950">配偶者の扶養義務</td>
                  <td className="p-2 border border-slate-950">無</td>
                </tr>
              </tbody>
            </table>

            {/* Nihomi Official Brand Watermark & JIS Verification Footer */}
            <div className="pt-3 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-sans gap-1">
              <span>日本産業規格 JIS Z 8303 準拠様式（全国アルバイト・留学・特定技能・正社員共通）</span>
              <span className="font-semibold text-slate-700">Created via Nihomi.com — Learn JLPT N5 for Free • ID: NHM-CV-2026</span>
            </div>
        </div>
      </div>

      {/* Viral PLG Lead Magnet Conversion Modal */}
      {showLeadMagnetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 print:hidden">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
              🎉
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                JIS RESUME (PRO CAREER EXPORT)
              </span>
              <h3 className="text-xl font-black text-slate-100">
                অফিসিয়াল JIS Z 8303 A4 PDF এক্সপোর্ট
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                জাপানে পার্ট-টাইম বা ফুল-টাইম জবের জন্য অফিশিয়াল জাপানিজ ফরম্যাটে A4 PDF এক্সপোর্ট, ভেরিফাইড সিল ও আনলিমিটেড AI কেইগো পলিশ আনলক করতে নিহোমি প্রো-তে আপগ্রেড করুন।
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setShowLeadMagnetModal(false);
                  if (onNavigate) {
                    onNavigate('pricing');
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock Pro PDF Export (Upgrade to Pro)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setShowLeadMagnetModal(false);
                  if (onNavigate) {
                    onNavigate('kana');
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Free Kana & Kanji Practice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setShowLeadMagnetModal(false);
                  if (onNavigate) {
                    onNavigate('baito', { tab: 'interview_lab' });
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition border border-amber-500/20 cursor-pointer"
              >
                🎙️ ইন্টারভিউ ভয়েস টুইন ল্যাব প্র্যাকটিস করুন
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setShowLeadMagnetModal(false);
                }}
                className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs transition font-medium cursor-pointer"
              >
                সিভি দেখুন ও এডিট করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
