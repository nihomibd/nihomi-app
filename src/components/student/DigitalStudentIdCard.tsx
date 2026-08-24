import React from 'react';
import { ShieldCheck, QrCode, Award, Download, CheckCircle2, Calendar, Building2 } from 'lucide-react';
import { StudentProfile } from '../../types/nihomi';

interface DigitalStudentIdCardProps {
  student: Partial<StudentProfile>;
  className?: string;
}

export const DigitalStudentIdCard: React.FC<DigitalStudentIdCardProps> = ({ student, className = '' }) => {
  const name = student.name || 'Md. Tanvir Kabir Biplob';
  const nameJa = student.nameJa || 'タンビル・カビル・ビプロブ';
  const id = student.id || 'DILS-2026-N5042';
  const accountId = student.nihomiAccountId || 'NHM-880-9972';
  const level = student.currentLevel || 'N5';
  const enrolledDate = student.enrolledDate || '2026-01-10';
  const status = student.status || 'ACTIVE';

  return (
    <div className={`w-full max-w-lg mx-auto bg-white rounded-3xl border-2 border-slate-900 shadow-2xl overflow-hidden text-slate-900 ${className}`}>
      {/* Header Band */}
      <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl text-white shadow-md">
            日
          </div>
          <div>
            <div className="font-extrabold text-base tracking-wider flex items-center gap-1.5">
              <span>NIHOMI ACADEMY</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-red-200">日本語</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium tracking-wide">
              Official Student ID & Institutional Passport
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>VERIFIED</span>
          </span>
        </div>
      </div>

      {/* Main ID Body */}
      <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-start gap-4">
          {/* Avatar / Photo */}
          <div className="w-24 h-28 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex flex-col items-center justify-center border-2 border-red-500/50 shadow-md flex-shrink-0 relative overflow-hidden">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <>
                <span className="text-3xl font-black text-white">{name.charAt(0)}</span>
                <span className="text-[9px] text-red-300 font-mono mt-1 font-bold">NIHOMI</span>
              </>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-red-600/90 text-white text-[8px] font-bold text-center py-0.5">
              STUDENT
            </div>
          </div>

          {/* Student Details */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div>
              <div className="text-base font-extrabold text-slate-900 truncate">{name}</div>
              <div className="text-xs text-slate-500 font-medium">{nameJa}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Student ID</span>
                <span className="font-mono text-xs font-bold text-slate-800">{id}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Nihomi ID</span>
                <span className="font-mono text-xs font-bold text-red-600">{accountId}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">JLPT Track</span>
                <span className="text-xs font-bold text-slate-900 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200 inline-block">
                  Level {level}
                </span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Enrolled Since</span>
                <span className="text-xs font-semibold text-slate-700">{enrolledDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Band with QR */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-red-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dhaka International Language School</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Academic Partner & Official JLPT Testing Preparation
            </div>
            <div className="text-[9px] font-mono text-slate-500">
              HASH: NHM-VERIFIED-2026-X992
            </div>
          </div>

          <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shadow-inner">
            <QrCode className="w-12 h-12 text-slate-900" />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
          <span className="text-[10px] text-slate-400">Authorized Academic Digital Pass</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>আইডি কার্ড প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
