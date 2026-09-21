// src/components/cloud/CloudJapanLockerView.tsx
// Nihomi Cloud V1 — Japan Readiness Document Locker (Encrypted Personal Vault)

import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  UploadCloud,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { CloudFile, JapanLockerSection } from '../../types/cloud';
import { CloudFileCard } from './CloudFileCard';

interface CloudJapanLockerViewProps {
  files: CloudFile[];
  onUploadSection: (section: JapanLockerSection) => void;
  onDownload: (file: CloudFile) => void;
  onShare: (file: CloudFile) => void;
  onAskAi: (file: CloudFile) => void;
  onToggleFavorite: (file: CloudFile) => void;
  onRename: (file: CloudFile) => void;
  onMove: (file: CloudFile) => void;
  onTrash: (file: CloudFile) => void;
}

interface LockerCategoryConfig {
  id: JapanLockerSection;
  title: string;
  titleJa: string;
  description: string;
  icon: string;
  badge: string;
}

const LOCKER_SECTIONS: LockerCategoryConfig[] = [
  {
    id: 'passport',
    title: 'Passport & Identification',
    titleJa: '旅券・身元証明書',
    description: 'Current and previous passports, national ID, birth certificates.',
    icon: '🛂',
    badge: 'Critical Identification',
  },
  {
    id: 'coe',
    title: 'Certificate of Eligibility (COE)',
    titleJa: '在留資格認定証明書',
    description: 'Official Immigration Services Agency of Japan (出入国在留管理庁) document.',
    icon: '📑',
    badge: 'Immigration Essential',
  },
  {
    id: 'visa',
    title: 'Visa & Residence Card (Zairyu)',
    titleJa: '査証・在留カード',
    description: 'Japanese embassy visa sticker, Zairyu Card front & back scans.',
    icon: '🪪',
    badge: 'Legal Residency',
  },
  {
    id: 'school',
    title: 'School / University Admission',
    titleJa: '入学許可書・合格通知書',
    description: 'Letter of acceptance, tuition payment slips, academic transcripts.',
    icon: '🏫',
    badge: 'Education',
  },
  {
    id: 'certificates',
    title: 'JLPT & Official Certificates',
    titleJa: '日本語能力試験・資格証明書',
    description: 'JLPT score reports, Nihomi readiness certs, NAT-TEST, J-TEST.',
    icon: '🏅',
    badge: 'Proficiency',
  },
  {
    id: 'housing',
    title: 'Housing & Dormitory Lease',
    titleJa: '賃貸契約・保証人書類',
    description: 'Apartment contracts, guarantor documents, dormitory confirmations.',
    icon: '🏠',
    badge: 'Relocation',
  },
  {
    id: 'employment',
    title: 'Employment Offer & Contracts',
    titleJa: '雇用契約書・採用通知書',
    description: 'SSW, TITP, or Engineering job offers, wage breakdowns, sponsor agreements.',
    icon: '👔',
    badge: 'Career / SSW',
  },
  {
    id: 'career',
    title: 'Rirekisho & Career Portfolio',
    titleJa: '履歴書・職務経歴書',
    description: 'Standard JIS Japanese resume format, Shokumu Keirekisho, GitHub/Design portfolio.',
    icon: '💼',
    badge: 'Work Readiness',
  },
];

export const CloudJapanLockerView: React.FC<CloudJapanLockerViewProps> = ({
  files,
  onUploadSection,
  onDownload,
  onShare,
  onAskAi,
  onToggleFavorite,
  onRename,
  onMove,
  onTrash,
}) => {
  return (
    <div id="cloud-japan-locker-view" className="space-y-6">
      {/* Security Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-purple-500/10 border border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Japan Readiness Document Locker
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <Lock className="w-2.5 h-2.5" />
                  Private by Default
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Centralized, military-grade storage for immigration, university, and employment procedures in Japan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Locker Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LOCKER_SECTIONS.map((sec) => {
          const sectionFiles = files.filter((f) => f.japanLockerSection === sec.id);

          return (
            <div
              key={sec.id}
              id={`japan-locker-section-${sec.id}`}
              className="p-5 rounded-3xl bg-white dark:bg-[#12121e] border border-stone-200 dark:border-stone-800/80 flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{sec.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {sec.title}
                      </h4>
                      <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        {sec.titleJa}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {sec.badge}
                  </span>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                  {sec.description}
                </p>

                {/* File items inside this section */}
                {sectionFiles.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {sectionFiles.map((file) => (
                      <CloudFileCard
                        key={file.id}
                        file={file}
                        isGrid={false}
                        onDownload={onDownload}
                        onShare={onShare}
                        onAskAi={onAskAi}
                        onToggleFavorite={onToggleFavorite}
                        onRename={onRename}
                        onMove={onMove}
                        onTrash={onTrash}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 mb-4 text-center">
                    <FolderOpen className="w-5 h-5 mx-auto text-stone-400 mb-1" />
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      No documents stored in this section
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onUploadSection(sec.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800/80 hover:bg-amber-500/10 text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload to {sec.title.split('&')[0]}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
