import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Layers,
  BarChart3,
  Flame,
  CheckCircle2,
  Database,
  ArrowRight
} from 'lucide-react';
import { JLPTLevel } from '../../types/nihomi';
import { PDFIngestionStudio } from './content-engine/PDFIngestionStudio';
import { ReviewQueueStudio } from './content-engine/ReviewQueueStudio';
import { ContentGapStudio } from './content-engine/ContentGapStudio';
import { InfiniteConceptStudio } from './content-engine/InfiniteConceptStudio';
import { ContentIngestionService } from '../../core/content-engine/contentIngestionService';
import { ContentGapService } from '../../core/content-engine/contentGapService';

export const MasterContentStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ingestion' | 'review' | 'gaps' | 'infinite'>('ingestion');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');

  const allObjects = ContentIngestionService.getKnowledgeObjects();
  const pendingReviewCount = allObjects.filter((o) => o.lifecycleStage === 'HUMAN_REVIEW_REQUIRED').length;
  const publishedCount = allObjects.filter((o) => o.status === 'PUBLISHED' || o.lifecycleStage === 'PUBLISHED').length;
  const gaps = ContentGapService.getContentGaps();
  const openGapsCount = gaps.filter((g) => g.status === 'OPEN').length;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold rounded-lg border border-amber-500/20">
              NIHOMI CONTENT ENGINE™
            </span>
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 font-mono text-[10px] rounded">
              23-Dimension Standard
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Master Content Studio & Quality Gate
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            Multi-PDF textbook batch ingestion pipeline, non-negotiable 23-point NIHOMI STANDARD™ human review queue, version diff snapshot engine, and 15-format Infinite Learning Matrix™.
          </p>
        </div>

        {/* Top Metric Pills */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl">
            <span className="text-[10px] text-stone-500 block uppercase">Published</span>
            <strong className="text-emerald-400 text-sm">{publishedCount} Objects</strong>
          </div>
          <div className="px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl">
            <span className="text-[10px] text-stone-500 block uppercase">Human Review</span>
            <strong className="text-amber-400 text-sm">{pendingReviewCount} Pending</strong>
          </div>
          <div className="px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl">
            <span className="text-[10px] text-stone-500 block uppercase">Open Gaps</span>
            <strong className="text-red-400 text-sm">{openGapsCount} Deficits</strong>
          </div>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            id: 'ingestion',
            label: '1. Multi-PDF Ingestion',
            sub: 'Batch OCR & Extraction Queue',
            icon: Upload,
            badge: null
          },
          {
            id: 'review',
            label: '2. Human Review Queue',
            sub: '23-Point Quality Gate & Diffs',
            icon: ShieldCheck,
            badge: pendingReviewCount > 0 ? `${pendingReviewCount} require audit` : null,
            badgeColor: 'bg-amber-500 text-stone-950'
          },
          {
            id: 'gaps',
            label: '3. Content Gaps Radar',
            sub: 'Coverage Matrix & AI Auto-Fix',
            icon: BarChart3,
            badge: openGapsCount > 0 ? `${openGapsCount} gaps` : null,
            badgeColor: 'bg-red-500 text-white'
          },
          {
            id: 'infinite',
            label: '4. Infinite Matrix™',
            sub: '15 Dynamic Learning Formats',
            icon: Sparkles,
            badge: '15 Formats',
            badgeColor: 'bg-emerald-500 text-stone-950'
          }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer space-y-1.5 ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <strong className={`block text-xs font-bold ${isActive ? 'text-white' : 'text-stone-300'}`}>
                {tab.label}
              </strong>
              <span className="text-[10px] text-stone-500 block leading-tight font-mono">
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Active Studio Sub-view */}
      <div>
        {activeTab === 'ingestion' && (
          <PDFIngestionStudio
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            onNavigateToReview={() => setActiveTab('review')}
          />
        )}

        {activeTab === 'review' && <ReviewQueueStudio />}

        {activeTab === 'gaps' && (
          <ContentGapStudio
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />
        )}

        {activeTab === 'infinite' && <InfiniteConceptStudio />}
      </div>
    </div>
  );
};
