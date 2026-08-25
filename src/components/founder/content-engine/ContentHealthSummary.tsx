import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  FileText,
  Link2Off,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import { ContentIngestionService } from '../../../core/content-engine/contentIngestionService';
import { NihomiStandardService } from '../../../core/content-engine/nihomiStandardService';
import { KnowledgeObject, NihomiStandardEvaluationViolation } from '../../../core/content-engine/types';

interface HealthScanIssue {
  id: string;
  objectId: string;
  objectCode: string;
  level: string;
  type: 'ORPHAN_PREREQUISITE' | 'BROKEN_SOURCE_TRACE' | 'TRILINGUAL_DEFICIT' | 'LOW_QUALITY_SCORE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  suggestedFix: string;
}

export const ContentHealthSummary: React.FC<{ onNavigateToReview?: () => void }> = ({ onNavigateToReview }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedAt, setLastScannedAt] = useState<string>(() => new Date().toLocaleTimeString());
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const objects = ContentIngestionService.getKnowledgeObjects();
  const allCodes = new Set(objects.map((o) => o.code));

  // Run comprehensive health scan over all KnowledgeObjects
  const runScan = () => {
    const issues: HealthScanIssue[] = [];

    objects.forEach((obj) => {
      // 1. Orphaned KnowledgeObject check (prerequisites referencing non-existent codes)
      if (obj.prerequisites && obj.prerequisites.length > 0) {
        obj.prerequisites.forEach((reqCode) => {
          if (!allCodes.has(reqCode)) {
            issues.push({
              id: `issue-orphan-${obj.id}-${reqCode}`,
              objectId: obj.id,
              objectCode: obj.code,
              level: obj.level,
              type: 'ORPHAN_PREREQUISITE',
              severity: 'CRITICAL',
              message: `Orphaned prerequisite reference: "${reqCode}" does not exist in active knowledge base.`,
              suggestedFix: `Create missing prerequisite object "${reqCode}" or update dependency graph.`
            });
          }
        });
      }

      // 2. Broken Source Traceability checks
      if (!obj.sourceTraceability || !obj.sourceTraceability.sourceDocumentTitle) {
        issues.push({
          id: `issue-source-${obj.id}-title`,
          objectId: obj.id,
          objectCode: obj.code,
          level: obj.level,
          type: 'BROKEN_SOURCE_TRACE',
          severity: 'WARNING',
          message: 'Missing canonical textbook citation or source document title.',
          suggestedFix: 'Attach canonical citation (e.g. Minna no Nihongo Shokyu Lesson & Page).'
        });
      } else if (!obj.sourceTraceability.sourceHash || obj.sourceTraceability.sourceHash.length < 16) {
        issues.push({
          id: `issue-source-${obj.id}-hash`,
          objectId: obj.id,
          objectCode: obj.code,
          level: obj.level,
          type: 'BROKEN_SOURCE_TRACE',
          severity: 'INFO',
          message: 'Source sha256 checksum signature is missing or short.',
          suggestedFix: 'Re-generate sha256 artifact hash from source PDF page.'
        });
      }

      // 3. Trilingual Data Deficit checks
      if (!obj.trilingual?.bn?.meaning || obj.trilingual.bn.meaning.trim() === '') {
        issues.push({
          id: `issue-trilingual-${obj.id}-bn`,
          objectId: obj.id,
          objectCode: obj.code,
          level: obj.level,
          type: 'TRILINGUAL_DEFICIT',
          severity: 'CRITICAL',
          message: 'Bengali native meaning is empty or missing.',
          suggestedFix: 'Author culturally calibrated Bengali translation.'
        });
      }

      // 4. Low Quality Score / Violations from 23-Dimension standard
      const evaluation = obj.qualityEvaluation || NihomiStandardService.evaluateKnowledgeObject(obj);
      if (evaluation.overallScore < 90) {
        issues.push({
          id: `issue-score-${obj.id}`,
          objectId: obj.id,
          objectCode: obj.code,
          level: obj.level,
          type: 'LOW_QUALITY_SCORE',
          severity: 'WARNING',
          message: `Quality evaluation score is below 90 (${evaluation.overallScore}/100).`,
          suggestedFix: 'Review and address dimension warnings in Human Review Queue.'
        });
      }
    });

    return issues;
  };

  const [scanIssues, setScanIssues] = useState<HealthScanIssue[]>(() => runScan());

  const handlePerformScan = async () => {
    setIsScanning(true);
    await new Promise((r) => setTimeout(r, 600));
    const results = runScan();
    setScanIssues(results);
    setLastScannedAt(new Date().toLocaleTimeString());
    setIsScanning(false);
    setToastMessage(`✓ Database Health Scan complete: Scanned ${objects.length} KnowledgeObjects across 23 dimensions.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredIssues = scanIssues.filter((i) => {
    if (filterSeverity !== 'ALL' && i.severity !== filterSeverity) return false;
    return true;
  });

  const criticalCount = scanIssues.filter((i) => i.severity === 'CRITICAL').length;
  const warningCount = scanIssues.filter((i) => i.severity === 'WARNING').length;
  const infoCount = scanIssues.filter((i) => i.severity === 'INFO').length;

  const totalObjects = objects.length || 1;
  const healthyObjectsCount = objects.filter((o) => (o.qualityEvaluation?.overallScore ?? 95) >= 90 && !scanIssues.some((i) => i.objectId === o.id && i.severity === 'CRITICAL')).length;
  const healthPercent = Math.round((healthyObjectsCount / totalObjects) * 100);

  return (
    <div id="content-health-summary" className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold rounded-lg border border-emerald-500/20">
              NIHOMI SYSTEM AUDITOR
            </span>
            <span className="text-xs text-stone-400 font-mono">1-Click Full DB Integrity Engine</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Database Content Health & Traceability Summary
          </h3>
          <p className="text-xs text-stone-400">
            Real-time audit flagging orphaned prerequisite graphs, broken PDF source citations, missing Bengali trilingual values, and quality score deficits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono text-stone-500 hidden sm:inline">
            Last scan: {lastScannedAt}
          </span>
          <button
            id="perform-db-scan-btn"
            onClick={handlePerformScan}
            disabled={isScanning}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning DB...' : '1-Click Health Scan'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 font-mono uppercase block">Overall Health Score</span>
          <div className="flex items-baseline space-x-2">
            <strong className={`text-2xl font-mono font-extrabold ${healthPercent >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {healthPercent}%
            </strong>
            <span className="text-[10px] text-stone-500 font-mono">Integrity</span>
          </div>
        </div>

        <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 font-mono uppercase block">Critical Blockers</span>
          <div className="flex items-baseline space-x-2">
            <strong className={`text-2xl font-mono font-extrabold ${criticalCount > 0 ? 'text-red-400' : 'text-stone-400'}`}>
              {criticalCount}
            </strong>
            <span className="text-[10px] text-stone-500 font-mono">Requires Fix</span>
          </div>
        </div>

        <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 font-mono uppercase block">Warnings / Deficits</span>
          <div className="flex items-baseline space-x-2">
            <strong className="text-2xl font-mono font-extrabold text-amber-400">
              {warningCount}
            </strong>
            <span className="text-[10px] text-stone-500 font-mono">Advisories</span>
          </div>
        </div>

        <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 font-mono uppercase block">Total Objects Audited</span>
          <div className="flex items-baseline space-x-2">
            <strong className="text-2xl font-mono font-extrabold text-white">
              {objects.length}
            </strong>
            <span className="text-[10px] text-stone-500 font-mono">Knowledge Units</span>
          </div>
        </div>
      </div>

      {/* Filter Chips & Issues List */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Flagged Issues & Integrity Anomalies ({filteredIssues.length})</span>
            </h4>
            <p className="text-[11px] text-stone-500">Traceability defects, orphan dependencies, and quality threshold alerts</p>
          </div>

          <div className="flex items-center space-x-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                  filterSeverity === sev ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Cards */}
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-2xl">
              ✓ Pristine: No health anomalies detected for severity "{filterSeverity}".
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 bg-stone-900/80 border border-stone-800 hover:border-stone-700 rounded-2xl transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold">{issue.objectCode}</span>
                    <span className="px-2 py-0.5 bg-stone-800 text-stone-300 font-mono text-[10px] rounded">
                      JLPT {issue.level}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-extrabold ${
                      issue.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : issue.severity === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {issue.severity}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      [{issue.type}]
                    </span>
                  </div>

                  {onNavigateToReview && (
                    <button
                      onClick={onNavigateToReview}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Fix in Review Queue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <p className="text-white text-xs font-medium">{issue.message}</p>
                <div className="text-emerald-400 text-[11px] font-mono">
                  Suggested Action: {issue.suggestedFix}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
