// src/components/cloud/CloudAiModal.tsx
// Nihomi Cloud V1 — Document Intelligence & Japanese AI Sensei Modal

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Languages,
  HelpCircle,
  Table,
  CheckCircle2,
  Copy,
  Clock,
  Send,
  Loader2,
  FileText,
} from 'lucide-react';
import { CloudFile, AiJobType, CloudAiJob } from '../../types/cloud';
import { cloudApi } from '../../lib/cloudApi';

interface CloudAiModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
}

const AI_ACTIONS: {
  type: AiJobType;
  label: string;
  labelBn: string;
  icon: any;
  description: string;
}[] = [
  {
    type: 'summarize',
    label: 'Summarize Document',
    labelBn: 'সারসংক্ষেপ (বাংলা ও জাপানি)',
    icon: FileText,
    description: 'Executive summary in Bengali with key Japanese points and advice.',
  },
  {
    type: 'translate',
    label: 'Japanese-Bengali Translation',
    labelBn: 'নির্ভুল অনুবাদ',
    icon: Languages,
    description: 'High-fidelity translation maintaining polite Keigo register.',
  },
  {
    type: 'explain_bn',
    label: 'Linguistic & Cultural Explanation',
    labelBn: 'ব্যাকরণ ও সাংস্কৃতিক ব্যাখ্যা',
    icon: BookOpen,
    description: 'Detailed breakdown of grammar nuances and cultural etiquette.',
  },
  {
    type: 'vocabulary',
    label: 'Extract JLPT Vocabulary Table',
    labelBn: 'শব্দভাণ্ডার ও লেভেল টেবিল',
    icon: Table,
    description: 'JLPT N5/N4/N3 vocabulary table with Kana, Romaji, and Bangla meaning.',
  },
  {
    type: 'kanji',
    label: 'Extract Kanji Breakdown',
    labelBn: 'কাঞ্জি বিশ্লেষণ',
    icon: Table,
    description: 'Kanji characters, On/Kun readings, stroke counts, and JLPT levels.',
  },
  {
    type: 'quiz',
    label: 'Generate Practice Quiz',
    labelBn: 'কুইজ তৈরি করুন',
    icon: HelpCircle,
    description: '5 multiple-choice questions with Bengali explanations.',
  },
];

export const CloudAiModal: React.FC<CloudAiModalProps> = ({
  file,
  isOpen,
  onClose,
}) => {
  const [selectedAction, setSelectedAction] = useState<AiJobType>('summarize');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeJob, setActiveJob] = useState<CloudAiJob | null>(null);
  const [previousJobs, setPreviousJobs] = useState<CloudAiJob[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      loadJobs();
    }
  }, [isOpen, file]);

  const loadJobs = async () => {
    if (!file) return;
    try {
      const jobs = await cloudApi.getAiJobs(file.id);
      setPreviousJobs(jobs);
      if (jobs.length > 0 && !activeJob) {
        setActiveJob(jobs[0]);
      }
    } catch {
      // Ignored
    }
  };

  if (!isOpen || !file) return null;

  const handleRunAi = async (actionType: AiJobType) => {
    setIsLoading(true);
    try {
      const job = await cloudApi.dispatchAiJob(
        file.id,
        actionType,
        actionType === 'ask_ai' ? customPrompt : undefined
      );
      setActiveJob(job);
      setPreviousJobs((prev) => [job, ...prev.filter((j) => j.id !== job.id)]);
      if (actionType === 'ask_ai') {
        setCustomPrompt('');
      }
    } catch (err: any) {
      alert(err.message || 'AI processing failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!activeJob?.result) return;
    navigator.clipboard.writeText(activeJob.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="cloud-ai-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="cloud-ai-modal"
        className="w-full max-w-4xl bg-white dark:bg-[#0e0e18] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Nihomi AI Document Sensei
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-md">
                Analyzing: <span className="font-semibold text-stone-700 dark:text-stone-300">{file.name}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two column workspace */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-800">
          {/* Left panel: Actions */}
          <div className="p-4 space-y-2 bg-stone-50/50 dark:bg-stone-950/30">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1 mb-2">
              Intelligence Actions
            </p>

            {AI_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isSelected = selectedAction === action.type;
              return (
                <button
                  key={action.type}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setSelectedAction(action.type);
                    handleRunAi(action.type);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'bg-white dark:bg-[#12121e] border-stone-200 dark:border-stone-800/80 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold truncate">{action.label}</span>
                  </div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    {action.labelBn}
                  </p>
                </button>
              );
            })}

            {/* Custom Question input */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                Custom Sensei Question
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. এই ফাইলের প্রধান নিয়মগুলো কি?"
                  className="flex-1 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-2.5 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  disabled={!customPrompt.trim() || isLoading}
                  onClick={() => {
                    setSelectedAction('ask_ai');
                    handleRunAi('ask_ai');
                  }}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Output */}
          <div className="md:col-span-2 p-5 flex flex-col justify-between bg-white dark:bg-[#0e0e18] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  AI Sensei is reading and analyzing your file...
                </h4>
                <p className="text-xs text-stone-400 mt-1 max-w-sm">
                  Extracting vocabulary, cultural nuances, and JLPT grammar constructs.
                </p>
              </div>
            ) : activeJob?.result ? (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Result: {activeJob.jobType.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed font-sans text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
                  {activeJob.result}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-stone-400">
                <Sparkles className="w-8 h-8 text-amber-500/40 mb-2" />
                <p className="text-xs font-medium">
                  Select an action on the left to begin AI analysis of this document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
