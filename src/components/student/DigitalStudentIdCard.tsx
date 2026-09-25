import React from 'react';
import { QrCode, ShieldCheck, Sparkles, Cpu, Award, Globe, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../../types/nihomi';

interface DigitalStudentIdCardProps {
  student: StudentProfile;
}

export const DigitalStudentIdCard: React.FC<DigitalStudentIdCardProps> = ({ student }) => {
  // Format clean display values
  const studentId = student.id || 'NHO-100234';
  const accountId = student.nihomiAccountId || 'ACC-8021';
  const cleanId = studentId.replace(/[^a-zA-Z0-9]/g, '');
  const cleanName = (student.name || 'STUDENT').replace(/[^a-zA-Z]/g, '<').toUpperCase();
  const mrzLine1 = `P<JPNNIHOMI<<${cleanName.slice(0, 20).padEnd(20, '<')}<<<<<<<<<<<`;
  const mrzLine2 = `${cleanId.padEnd(9, '0')}8JPN2609017M3012314<<<<<<<<<<<<<<02`;

  const levelTag = student.currentLevel || 'N5';
  const tierName = (student.tier || 'Starter').toUpperCase();

  return (
    <div className="w-full max-w-sm mx-auto group perspective-1000 select-none text-left">
      {/* Outer Passport Sleeve / Booklet Shell */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#0c1024] via-[#0f1730] to-[#070a16] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(245,158,11,0.12)] border border-amber-500/35 overflow-hidden transition-all duration-300 hover:shadow-[0_30px_70px_-10px_rgba(245,158,11,0.22)]">
        
        {/* Holographic Iridescent Layer & Watermark */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-cyan-400/5 pointer-events-none" />
        <div className="absolute -right-6 -bottom-10 opacity-[0.04] text-amber-200 text-[180px] font-black pointer-events-none leading-none select-none font-serif">
          日
        </div>

        {/* Security Guilloché Pattern Strip */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-500/30 via-red-500/20 to-amber-500/30 border-r border-amber-500/20 flex flex-col justify-between py-3 items-center">
          <div className="w-1 h-1 rounded-full bg-amber-400/60" />
          <div className="w-1 h-1 rounded-full bg-amber-400/60" />
          <div className="w-1 h-1 rounded-full bg-amber-400/60" />
        </div>

        <div className="pl-2">
          {/* 1. PASSPORT HEADER & CHRYSANTHEMUM CREST */}
          <div className="flex items-start justify-between border-b border-amber-500/25 pb-3.5 mb-4">
            <div className="flex items-center space-x-3">
              {/* Gold Embossed Crest */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/25 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0b0f22] rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-[15px] font-black text-amber-400 leading-none font-serif">日</span>
                  <span className="text-[7px] font-mono font-bold text-amber-300/90 leading-tight">本</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-black tracking-widest text-amber-300 uppercase font-mono flex items-center gap-1.5">
                  <span>JAPAN • 日本国</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[13px] font-extrabold text-white tracking-wide">
                  NIHOMI PASSPORT
                </div>
                <div className="text-[8px] font-mono text-slate-400 tracking-wider">
                  DIGITAL CITIZEN IDENTITY
                </div>
              </div>
            </div>

            {/* Smartcard Biometric IC Chip */}
            <div className="flex flex-col items-end space-y-1">
              <div 
                className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 p-0.5 shadow-inner flex items-center justify-center relative overflow-hidden"
                title="Biometric Smart IC Chip"
              >
                <div className="w-full h-full border border-amber-900/30 rounded-xs flex items-center justify-around px-0.5">
                  <div className="w-0.5 h-full bg-amber-800/40" />
                  <div className="w-1.5 h-2.5 rounded-xs border border-amber-800/40" />
                  <div className="w-0.5 h-full bg-amber-800/40" />
                </div>
              </div>
              <span className="text-[8px] font-mono font-bold text-amber-400/80">e-PASS</span>
            </div>
          </div>

          {/* 2. BIOMETRIC PHOTO & PRIMARY IDENTITY */}
          <div className="grid grid-cols-12 gap-3.5 items-center mb-4">
            {/* Biometric Photo Frame */}
            <div className="col-span-4 relative">
              <div className="w-full aspect-[4/5] rounded-2xl bg-slate-800 border-2 border-amber-500/60 overflow-hidden shadow-lg relative group-hover:border-amber-400 transition-colors">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 text-amber-300">
                    <span className="text-2xl font-black font-serif">{student.name.charAt(0)}</span>
                    <span className="text-[8px] font-mono text-slate-400 mt-1">PASSPORT</span>
                  </div>
                )}

                {/* Level Ribbon On Photo */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent py-1 px-1.5 text-center">
                  <span className="text-[9px] font-black text-amber-300 font-mono tracking-wider">
                    JLPT {levelTag}
                  </span>
                </div>
              </div>

              {/* Verified Hologram Stamp */}
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-md flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-stone-950 stroke-[3]" />
              </div>
            </div>

            {/* Identity Text Specs */}
            <div className="col-span-8 space-y-1.5">
              <div>
                <div className="text-[8px] font-mono text-slate-400 tracking-wider">
                  NAME / 氏名
                </div>
                <div className="text-sm font-black text-white tracking-tight truncate leading-tight">
                  {student.name}
                </div>
                <div className="text-[11px] text-amber-300/90 font-medium">
                  {student.nameJa || '日本語学習者'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div>
                  <div className="text-[7.5px] font-mono text-slate-400">PASSPORT NO.</div>
                  <div className="text-[11px] font-mono font-bold text-amber-300 truncate">
                    {studentId}
                  </div>
                </div>
                <div>
                  <div className="text-[7.5px] font-mono text-slate-400">ACCOUNT ID</div>
                  <div className="text-[11px] font-mono font-bold text-slate-200 truncate">
                    {accountId}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-mono font-bold rounded-md">
                  {tierName} TIER
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-bold rounded-md">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* 3. OFFICIAL ISSUANCE & TRACK DETAILS */}
          <div className="bg-[#080b18]/80 rounded-2xl p-3 border border-amber-500/20 mb-3 space-y-1.5 text-[10.5px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 text-[9px] font-mono">CURRICULUM TRACK:</span>
              <span className="font-semibold text-white font-mono">JLPT {levelTag} Continuous Acquisition</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 text-[9px] font-mono">ISSUING AUTHORITY:</span>
              <span className="text-amber-200/90 font-medium">Nihomi Academic Council • Tokyo</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 text-[9px] font-mono">DATE OF ISSUE:</span>
              <span className="text-slate-300 font-mono">{student.enrolledDate || '2026-01-01'}</span>
            </div>
          </div>

          {/* 4. VERIFICATION STRIP & QR TOKEN */}
          <div className="flex items-center justify-between py-2 border-t border-amber-500/20 mb-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0">
                <QrCode className="w-7 h-7 text-slate-950" />
              </div>
              <div className="text-[8.5px] leading-tight text-slate-400 font-mono">
                <div className="text-slate-200 font-bold">CRYPTO VERIFIED</div>
                <div>ID: nihomi.com/v/{cleanId.slice(0, 8)}</div>
              </div>
            </div>

            <div className="text-right text-[8px] font-mono text-amber-400/80">
              <div>ONE STUDENT • ONE IDENTITY</div>
              <div className="text-slate-400">UNBROKEN PROGRESSION</div>
            </div>
          </div>

          {/* 5. MACHINE READABLE ZONE (MRZ) */}
          <div className="bg-black/60 rounded-xl p-2 border border-slate-800/80 font-mono text-[8.5px] leading-tight text-amber-300/80 tracking-widest overflow-hidden text-center">
            <div className="truncate">{mrzLine1}</div>
            <div className="truncate">{mrzLine2}</div>
          </div>
        </div>
      </div>
    </div>
  );
};