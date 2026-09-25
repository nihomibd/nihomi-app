import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  User,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderAuditLogTab: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/founder/audit-logs?limit=200');
      if (res.success && Array.isArray(res.logs)) {
        setLogs(res.logs);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.target?.toLowerCase().includes(q) ||
      log.reason?.toLowerCase().includes(q) ||
      log.actorEmail?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-950">Founder Strategic Audit Trail</h2>
          <p className="text-xs text-stone-500">
            Immutable, server-recorded ledger of all strategic decisions, target changes, and approval resolutions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 w-fit cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Ledger</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit logs by action, target, or keyword..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-stone-900"
        />
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target / Entity</th>
                <th className="p-3.5">Reason & Details</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/50">
                  <td className="p-3.5 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900">
                    <div>{log.actor}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{log.actorEmail}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-stone-100 text-stone-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium max-w-xs truncate" title={log.target}>
                    {log.target}
                  </td>
                  <td className="p-3.5 text-stone-600 max-w-sm truncate" title={log.reason}>
                    {log.reason}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{log.result}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
