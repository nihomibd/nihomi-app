import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Globe,
  Activity,
  Command,
  Search,
  X,
  Keyboard
} from 'lucide-react';
import { JLPTLevel } from '../../types/nihomi';
import { PDFIngestionStudio } from './content-engine/PDFIngestionStudio';
import { ReviewQueueStudio } from './content-engine/ReviewQueueStudio';
import { ContentGapStudio } from './content-engine/ContentGapStudio';
import { InfiniteConceptStudio } from './content-engine/InfiniteConceptStudio';
import { SEOSocialMetaEditor } from './content-engine/SEOSocialMetaEditor';
import { ContentHealthSummary } from './content-engine/ContentHealthSummary';
import { LevelCoverageWidget } from './content-engine/LevelCoverageWidget';
import { ContentIngestionService } from '../../core/content-engine/contentIngestionService';
import { ContentGapService } from '../../core/content-engine/contentGapService';

export type MasterStudioTab = 'ingestion' | 'review' | 'gaps' | 'infinite' | 'seo' | 'health';

export const MasterContentStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MasterStudioTab>('ingestion');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  const allObjects = ContentIngestionService.getKnowledgeObjects();
  const pendingReviewCount = allObjects.filter((o) => o.lifecycleStage === 'HUMAN_REVIEW_REQUIRED').length;
  const publishedCount = allObjects.filter((o) => o.status === 'PUBLISHED' || o.lifecycleStage === 'PUBLISHED').length;
  const gaps = ContentGapService.getContentGaps();
  const openGapsCount = gaps.filter((g) => g.status === 'OPEN').length;

  const studioTabs = [
    {
      id: 'ingestion' as MasterStudioTab,
      shortcut: '1',
      keyHint: 'I',
      label: '1. Multi-PDF Ingestion',
      sub: 'Batch OCR & Extraction Queue',
      icon: Upload,
      badge: null
    },
    {
      id: 'review' as MasterStudioTab,
      shortcut: '2',
      keyHint: 'R',
      label: '2. Human Review Queue',
      sub: '23-Point Quality Gate & Diffs',
      icon: ShieldCheck,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} require audit` : null,
      badgeColor: 'bg-amber-500 text-stone-950'
    },
    {
      id: 'gaps' as MasterStudioTab,
      shortcut: '3',
      keyHint: 'G',
      label: '3. Content Gaps Radar',
      sub: 'Coverage Matrix & AI Auto-Fix',
      icon: BarChart3,
      badge: openGapsCount > 0 ? `${openGapsCount} gaps` : null,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'infinite' as MasterStudioTab,
      shortcut: '4',
      keyHint: 'M',
      label: '4. Infinite Matrix™',
      sub: '15 Dynamic Learning Formats',
      icon: Sparkles,
      badge: '15 Formats',
      badgeColor: 'bg-emerald-500 text-stone-950'
    },
    {
      id: 'seo' as MasterStudioTab,
      shortcut: '5',
      keyHint: 'S',
      label: '5. SEO & Social Meta',
      sub: 'OpenGraph & JSON-LD Structured',
      icon: Globe,
      badge: 'OG + Schema',
      badgeColor: 'bg-blue-500 text-white'
    },
    {
      id: 'health' as MasterStudioTab,
      shortcut: '6',
      keyHint: 'H',
      label: '6. Content Health Scan',
      sub: 'Orphans & Traceability Audit',
      icon: Activity,
      badge: null
    }
  ];

  // Global Keyboard Shortcut Listener (Ctrl+K, Cmd+K, and numeric 1-6 keys when not in an input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape closes command palette
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
        return;
      }

      // If user is currently typing in an input or textarea, don't trigger number keys
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      // Direct hotkeys 1 to 6
      if (e.key === '1') setActiveTab('ingestion');
      if (e.key === '2') setActiveTab('review');
      if (e.key === '3') setActiveTab('gaps');
      if (e.key === '4') setActiveTab('infinite');
      if (e.key === '5') setActiveTab('seo');
      if (e.key === '6') setActiveTab('health');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  const filteredCommands = studioTabs.filter((tab) =>
    tab.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
    tab.sub.toLowerCase().includes(commandSearch.toLowerCase()) ||
    tab.id.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div id="master-content-studio" className="space-y-8 text-left max-w-7xl mx-auto">
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
            <button
              id="open-command-palette-btn"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white font-mono text-[10px] rounded border border-stone-700 cursor-pointer flex items-center space-x-1"
              title="Open Command Palette (Ctrl+K / Cmd+K)"
            >
              <Command className="w-3 h-3 text-amber-400" />
              <span>Ctrl+K</span>
            </button>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Master Content Studio & Quality Gate
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            Multi-PDF textbook batch ingestion pipeline, non-negotiable 23-point NIHOMI STANDARD™ human review queue, version diff snapshot engine, 15-format Infinite Learning Matrix™, SEO meta editor, and database health scan.
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

      {/* Main Studio Navigation Tabs (6 Comprehensive Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {studioTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer space-y-1.5 ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span className="text-[9px] font-mono text-stone-500 font-bold px-1 rounded bg-stone-900 border border-stone-800">
                  [{tab.shortcut}]
                </span>
              </div>
              <strong className={`block text-xs font-bold truncate ${isActive ? 'text-white' : 'text-stone-300'}`}>
                {tab.label}
              </strong>
              <span className="text-[10px] text-stone-500 block leading-tight font-mono truncate">
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ctrl+K Command Palette Modal */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-stone-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            id="command-palette-modal"
            className="w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-left font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Command className="w-4 h-4" />
                <span>Master Studio Command Bar (Ctrl+K)</span>
              </div>
              <button
                onClick={() => setIsCommandPaletteOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="command-palette-search-input"
                type="text"
                autoFocus
                placeholder="Jump to studio view (Ingestion, Review, Gaps, Infinite, SEO, Health)..."
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 pl-10 pr-4 py-2.5 rounded-xl text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredCommands.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsCommandPaletteOpen(false);
                      setCommandSearch('');
                    }}
                    className="w-full p-2.5 rounded-xl bg-stone-950/60 hover:bg-amber-500/10 hover:border-amber-500/40 border border-stone-800/80 flex items-center justify-between text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-stone-900 rounded-lg text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block text-xs">{tab.label}</strong>
                        <span className="text-[10px] text-stone-500">{tab.sub}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-stone-900 text-stone-400 text-[10px] rounded font-bold">
                      Key: {tab.shortcut}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] text-stone-500 border-t border-stone-800 pt-2 flex justify-between items-center">
              <span>Press <strong>1–6</strong> anywhere outside inputs to quickly switch views</span>
              <span><strong>ESC</strong> to close</span>
            </div>
          </div>
        </div>
      )}

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

        {activeTab === 'seo' && <SEOSocialMetaEditor />}

        {activeTab === 'health' && (
          <ContentHealthSummary
            onNavigateToReview={() => setActiveTab('review')}
          />
        )}
      </div>
    </div>
  );
};
