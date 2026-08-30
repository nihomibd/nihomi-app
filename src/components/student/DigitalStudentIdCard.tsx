import React from 'react';
import { QrCode } from 'lucide-react';
import { StudentProfile } from '../../types/nihomi';

interface DigitalStudentIdCardProps {
  student: StudentProfile;
}

export const DigitalStudentIdCard: React.FC<DigitalStudentIdCardProps> = ({ student }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-700/80 relative overflow-hidden select-none text-left">
      {/* Background Watermark Pattern */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-5 text-white text-[130px] font-black pointer-events-none select-none">
        日
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white text-slate-950 font-bold flex items-center justify-center text-sm shadow">
            日
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-widest text-white uppercase">NIHOMI JAPAN</div>
            <div className="text-[9px] text-slate-400 font-medium">Digital Learning Passport</div>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded-full border border-amber-500/30">
          VERIFIED
        </span>
      </div>

      {/* Student Identity Grid */}
      <div className="flex space-x-4 items-center mb-5">
        {/* Google Profile Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-slate-700 border-2 border-red-500/80 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-md">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              student.name.charAt(0)
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
            {student.currentLevel}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-0.5 overflow-hidden">
          <h4 className="text-sm font-bold text-white leading-tight truncate">{student.name}</h4>
          <p className="text-[11px] text-slate-300 font-medium">{student.nameJa || '日本語学習者'}</p>
          <div className="pt-1 text-[10px] text-slate-400 font-mono">
            <div>ID: <span className="text-slate-200">{student.id}</span></div>
            <div>Acc: <span className="text-slate-200">{student.nihomiAccountId}</span></div>
          </div>
        </div>
      </div>

      {/* Program Info */}
      <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50 mb-4 space-y-1.5 text-[11px]">
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Track:</span>
          <span className="font-semibold text-white">JLPT {student.currentLevel} Continuous Track</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Council:</span>
          <span className="text-slate-200">Nihomi Academic Council</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Status:</span>
          <span className="text-emerald-400 font-semibold">Active Learner</span>
        </div>
      </div>

      {/* Footer & QR Verification Area */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white p-1 rounded-xl flex items-center justify-center">
            <QrCode className="w-8 h-8 text-slate-900" />
          </div>
          <div className="text-[9px] text-slate-400 leading-tight">
            <div className="text-slate-200 font-medium">Scan to Verify</div>
            <div>nihomi.com/verify</div>
          </div>
        </div>
        <div className="text-right text-[9px] text-slate-400">
          <div className="text-slate-300 font-semibold">One Student • One Account</div>
          <div>Continuous Identity</div>
        </div>
      </div>
    </div>
  );
};