import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Coins,
  Shield,
  GraduationCap
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderStudentsTab: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/api/founder/students${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (res.success && Array.isArray(res.students)) {
        setStudents(res.students);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-950">Authoritative Student Roster</h2>
          <p className="text-xs text-stone-500">
            Real registered student accounts from Supabase / SQLite database with verified subscription tiers.
          </p>
        </div>

        <button
          onClick={fetchStudents}
          disabled={isLoading}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 w-fit cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Students</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, email, or user ID..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-stone-900"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Name & Email</th>
                <th className="p-3.5">JLPT Level</th>
                <th className="p-3.5">Subscription Tier</th>
                <th className="p-3.5">Streak</th>
                <th className="p-3.5">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-stone-50/50">
                  <td className="p-3.5 font-mono text-[11px] text-stone-500">
                    {st.id.slice(0, 12)}...
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{st.name}</div>
                    <div className="text-[11px] text-stone-400">{st.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                      {st.level || 'N5'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        st.planStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {st.plan?.toUpperCase()} ({st.planStatus})
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-stone-700">
                    🔥 {st.streak || 0}d
                  </td>
                  <td className="p-3.5 text-stone-400 font-mono text-[10px]">
                    {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'N/A'}
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
