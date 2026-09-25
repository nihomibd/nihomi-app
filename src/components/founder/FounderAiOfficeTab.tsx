import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderAiOfficeTab: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOfficeStatus = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/founder/ai-office');
      if (res.success && Array.isArray(res.departments)) {
        setDepartments(res.departments);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeStatus();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RUNNING</span>
          </span>
        );
      case 'NEEDS_APPROVAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>NEEDS APPROVAL</span>
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-200">
            <Clock className="w-3 h-3" />
            <span>PAUSED</span>
          </span>
        );
      case 'BLOCKED':
      case 'ERROR':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>BLOCKED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* 1. STATUS HEADER */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-white">AI Office & Virtual Department Status</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              GATE 2 READ-ONLY TELEMETRY
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            All 12 departments are reporting live telemetry. The Infinite Business Loop and uncontrolled autonomous actions remain locked until Gate 3.
          </p>
        </div>

        <button
          onClick={fetchOfficeStatus}
          disabled={isLoading}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shrink-0 cursor-pointer border border-stone-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Department Status</span>
        </button>
      </div>

      {/* 2. 12 DEPARTMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">
                  {dept.id.replace('dept-', '')}
                </span>
                {getStatusBadge(dept.status)}
              </div>

              <div>
                <h3 className="text-sm font-black text-stone-950">{dept.name}</h3>
                <p className="text-[11px] text-stone-500 line-clamp-1">{dept.lead}</p>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-100 space-y-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                  Active Mission / Task
                </span>
                <p className="text-xs font-medium text-stone-800 leading-snug">
                  {dept.current_task}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                  Last Documented Output
                </span>
                <p className="text-[11px] text-stone-600 line-clamp-2">
                  {dept.last_output}
                </p>
              </div>
            </div>

            {dept.statusDetails && (
              <div className="pt-2 border-t border-stone-100 text-[10px] text-amber-700 bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                ⚠️ {dept.statusDetails}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
