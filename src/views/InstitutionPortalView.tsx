import React, { useState } from 'react';
import {
  Building2,
  Users,
  Award,
  AlertTriangle,
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Download,
  Mail,
  ShieldCheck,
  Flame,
  ArrowRight,
  UserCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Sparkles,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { InstitutionService, DILS_INSTITUTION_LICENSE, DILS_STUDENT_ROSTER } from '../core/b2b/institutionService';
import { StudentSeat } from '../types/institution';

interface InstitutionPortalViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const InstitutionPortalView: React.FC<InstitutionPortalViewProps> = ({ onNavigate }) => {
  const [roster, setRoster] = useState<StudentSeat[]>(() => InstitutionService.getRoster());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'N5' | 'N4' | 'N3'>('ALL');
  const [isAddSeatModalOpen, setIsAddSeatModalOpen] = useState(false);

  // Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentLevel, setNewStudentLevel] = useState<'N5' | 'N4' | 'N3'>('N5');
  const [allocatedSuccessMsg, setAllocatedSuccessMsg] = useState<string | null>(null);

  const license = InstitutionService.getLicense();
  const analytics = InstitutionService.getAnalytics();

  const handleAllocateSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    const allocated = InstitutionService.allocateNewSeat(newStudentName, newStudentEmail, newStudentLevel);
    setRoster([...InstitutionService.getRoster()]);
    setIsAddSeatModalOpen(false);
    setNewStudentName('');
    setNewStudentEmail('');
    setAllocatedSuccessMsg(`Successfully allocated seat for ${allocated.studentName} (${allocated.studentId})!`);
    setTimeout(() => setAllocatedSuccessMsg(null), 4000);
  };

  const filteredRoster = roster.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesLevel = levelFilter === 'ALL' || s.currentLevel === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div
      id="institution-portal-root"
      className="bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-stone-900 min-h-screen pb-20 text-left font-sans antialiased selection:bg-red-500 selection:text-white transition-colors"
    >
      {/* Top Banner */}
      <div className="bg-stone-900 dark:bg-stone-950 sepia:bg-[#2b2118] text-white border-b border-stone-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                VERIFIED LANGUAGE ACADEMY PORTAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {license.institutionName}
            </h1>
            <p className="text-xs text-stone-400">
              Campus: {license.campusLocations.join(' • ')} • Status:{' '}
              <strong className="text-emerald-400 font-mono">ACTIVE (BIN: {license.mushakBinNumber})</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-open-allocate-seat-modal"
              type="button"
              onClick={() => setIsAddSeatModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Allocate Student Seat</span>
            </button>
            <button
              id="btn-institution-to-passport"
              type="button"
              onClick={() => onNavigate('passport')}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Verify 150h Passports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {allocatedSuccessMsg && (
          <div
            id="alert-seat-allocated-success"
            className="p-4 bg-emerald-50 dark:bg-emerald-950/60 sepia:bg-[#e8f5e9] border border-emerald-200 dark:border-emerald-800 sepia:border-emerald-300 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 sepia:text-emerald-950 font-bold flex items-center space-x-2 animate-in fade-in"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{allocatedSuccessMsg}</span>
          </div>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            id="stat-seats-utilized"
            className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-1"
          >
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
              Seats Utilized
            </span>
            <div className="text-2xl font-black text-stone-900 dark:text-white sepia:text-amber-950 font-mono">
              {license.allocatedSeatsCount} / {license.totalSeatsPurchased}
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              {analytics.totalSeatsRemaining} seats available
            </span>
          </div>

          <div
            id="stat-avg-hours"
            className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-1"
          >
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
              Average Study Hours
            </span>
            <div className="text-2xl font-black text-stone-900 dark:text-white sepia:text-amber-950">
              {analytics.averageStudyHours} Hours
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              150h Certified Benchmark
            </span>
          </div>

          <div
            id="stat-jlpt-readiness"
            className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-1"
          >
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
              JLPT Readiness Rate
            </span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 sepia:text-emerald-800">
              {analytics.jlptReadinessRate}%
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              Mock Simulation Pass Rate
            </span>
          </div>

          <div
            id="stat-inactive-alert"
            className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-1"
          >
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
              Inactive Learners Alert
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {analytics.inactiveLearnersCount}
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
              Over 7 days inactive
            </span>
          </div>
        </div>

        {/* Student Roster Section */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 sepia:border-[#d9cbaf] pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                Academy Student Roster &amp; Visa Status
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Live progress tracking and Tokyo Immigration COE file preparation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  id="input-roster-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student or ID..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <select
                id="select-roster-level"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl font-medium"
              >
                <option value="ALL">All Levels</option>
                <option value="N5">JLPT N5</option>
                <option value="N4">JLPT N4</option>
                <option value="N3">JLPT N3</option>
              </select>

              <select
                id="select-roster-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive (Alert)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] text-stone-400 dark:text-stone-500 uppercase text-[10px] tracking-wider font-mono">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Streak / Hours</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Visa Stage</th>
                  <th className="py-3 px-3 text-right">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 sepia:divide-[#ebdcc0] font-medium text-stone-800 dark:text-stone-200 sepia:text-stone-900">
                {filteredRoster.map((s) => (
                  <tr key={s.seatId} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 sepia:hover:bg-[#f5e9d0] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900 dark:text-white sepia:text-amber-950">{s.studentName}</div>
                      <div className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">{s.studentEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-stone-600 dark:text-stone-300">{s.studentId}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 sepia:bg-[#ebdcc0] text-stone-800 dark:text-stone-200 font-bold rounded text-[10px]">
                        {s.currentLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {s.streakDays > 0 ? (
                        <span className="text-red-600 dark:text-rose-400 font-bold">🔥 {s.streakDays}d</span>
                      ) : (
                        <span className="text-stone-400 dark:text-stone-500">0d</span>
                      )}{' '}
                      • {s.totalHours}h
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded border font-mono ${
                          s.visaStatus === 'VISA_APPROVED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : s.visaStatus === 'EMBASSY_SUBMITTED'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {s.visaStatus || 'COE_PREP'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={s.examReadinessScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                        {s.examReadinessScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Allocate Student Seat */}
      {isAddSeatModalOpen && (
        <div
          id="modal-allocate-student-seat"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] overflow-hidden p-6 sm:p-8 space-y-6 text-left">
            <div className="border-b border-stone-100 dark:border-stone-800 sepia:border-[#d9cbaf] pb-3">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Campus Seat Provisioning
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                Add New Student to Academy Roster
              </h3>
            </div>

            <form onSubmit={handleAllocateSeat} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Student Full Name</label>
                <input
                  id="input-seat-name"
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Tanvir Kabir"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Student Email Address</label>
                <input
                  id="input-seat-email"
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Target JLPT Level</label>
                <select
                  id="select-seat-level"
                  value={newStudentLevel}
                  onChange={(e) => setNewStudentLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-900 font-semibold"
                >
                  <option value="N5">JLPT N5 (Beginner)</option>
                  <option value="N4">JLPT N4 (Elementary)</option>
                  <option value="N3">JLPT N3 (Intermediate)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  id="btn-cancel-seat-modal"
                  type="button"
                  onClick={() => setIsAddSeatModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 sepia:bg-[#ebdcc0] hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-seat-modal"
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Provision Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
