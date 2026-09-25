import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Coins,
  Clock,
  UserCheck
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderApprovalsTab: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchApprovals = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/founder/approvals');
      if (res.success && Array.isArray(res.requests)) {
        setRequests(res.requests);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleDecision = async (id: string, status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED') => {
    setActingId(id);
    setFeedback(null);
    try {
      const decisionNote = status === 'APPROVED' ? 'Approved by Founder for execution' : status === 'REJECTED' ? 'Rejected by Founder' : 'Changes requested before reconsideration';
      const res = await apiRequest(`/api/founder/approvals/${id}/decision`, {
        method: 'POST',
        body: JSON.stringify({
          status,
          decision: decisionNote,
          notes: `Founder action executed at ${new Date().toISOString()}`
        })
      });

      if (res.success) {
        setFeedback(`Request ${id} marked as ${status}. Audit log updated.`);
        fetchApprovals();
      } else {
        setFeedback(`Error: ${res.error || 'Failed to update proposal'}`);
      }
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setActingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const resolvedRequests = requests.filter((r) => r.status !== 'PENDING');

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700">HIGH RISK</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-700">MEDIUM RISK</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-950">Founder Approval Queue (HITL)</h2>
          <p className="text-xs text-stone-500">
            Autonomous execution barrier: All financial expenditures, policy changes, and external campaigns require your cryptographic approval.
          </p>
        </div>

        <button
          onClick={fetchApprovals}
          disabled={isLoading}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 w-fit cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-stone-900 text-white rounded-2xl text-xs font-mono">
          {feedback}
        </div>
      )}

      {/* PENDING APPROVALS LIST */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
          <span>Pending Founder Decisions ({pendingRequests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800">Queue is Clear</h4>
            <p className="text-xs text-stone-500">
              No pending financial transfers or policy decisions require sign-off right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.request_id}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 hover:border-amber-400 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-xl">
                      {req.department}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      ID: {req.request_id}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getRiskBadge(req.risk)}
                    <span className="text-xs font-black font-mono text-stone-900 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      ৳{req.amount?.toLocaleString()} {req.currency}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-stone-950">{req.request}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Expected Outcome
                      </span>
                      <p className="text-xs text-stone-800 font-medium">
                        {req.expected_outcome}
                      </p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        AI Department Recommendation
                      </span>
                      <p className="text-xs text-stone-800 font-medium">
                        {req.AI_recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DECISION ACTION BUTTONS */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-400 font-mono">
                    Target Channel: {req.target_channel || 'Internal'}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      disabled={actingId === req.request_id}
                      onClick={() => handleDecision(req.request_id, 'REJECTED')}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-stone-200"
                    >
                      Reject
                    </button>
                    <button
                      disabled={actingId === req.request_id}
                      onClick={() => handleDecision(req.request_id, 'CHANGES_REQUESTED')}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-stone-200"
                    >
                      Hold / Request Changes
                    </button>
                    <button
                      disabled={actingId === req.request_id}
                      onClick={() => handleDecision(req.request_id, 'APPROVED')}
                      className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{actingId === req.request_id ? 'Recording...' : 'Approve & Release'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESOLVED AUDIT TRAIL */}
      {resolvedRequests.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-stone-200">
          <h3 className="text-sm font-bold text-stone-900">
            Resolved Historical Decisions ({resolvedRequests.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Department</th>
                  <th className="p-3">Request</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Decision</th>
                  <th className="p-3">Decided At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {resolvedRequests.map((r) => (
                  <tr key={r.request_id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-bold">{r.department}</td>
                    <td className="p-3">{r.request}</td>
                    <td className="p-3 font-mono">৳{r.amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-400 font-mono text-[10px]">
                      {r.decided_at ? new Date(r.decided_at).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
