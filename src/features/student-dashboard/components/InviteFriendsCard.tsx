import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Share2, Award, Sparkles } from 'lucide-react';
import {
  generateReferralLink,
  generateWhatsAppShareUrl,
  generateFacebookShareUrl
} from '../../../utils/referral';

interface InviteFriendsCardProps {
  studentId?: string;
  studentName?: string;
  nihomiAccountId?: string;
}

export const InviteFriendsCard: React.FC<InviteFriendsCardProps> = ({
  studentId,
  studentName,
  nihomiAccountId
}) => {
  const referralCode = nihomiAccountId || studentId || 'NIHOMI-PRO';
  const referralLink = generateReferralLink(referralCode);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ totalReferred: number; coinsEarned: number; proDaysEarned: number }>({
    totalReferred: 0,
    coinsEarned: 0,
    proDaysEarned: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!studentId) return;
      try {
        const res = await fetch(`/api/referral/stats?userId=${encodeURIComponent(studentId)}`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalReferred: data.totalReferred || 0,
            coinsEarned: data.coinsEarned || 0,
            proDaysEarned: data.proDaysEarned || 0
          });
        }
      } catch {}
    }
    fetchStats();
  }, [studentId]);

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = generateWhatsAppShareUrl(referralCode, studentName);
  const facebookUrl = generateFacebookShareUrl(referralCode);

  return (
    <div
      id="nihomi-invite-friends-card"
      className="bg-gradient-to-br from-stone-900 via-stone-900 to-red-950 text-white rounded-2xl p-5 border border-red-500/20 shadow-lg relative overflow-hidden space-y-4"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight text-white">
                সহপাঠীকে ইনভাইট করুন (Invite Friends)
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 uppercase tracking-wider">
                7 Days Free
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Get 7 Days Pro + 50 Nihomi AI Coins for every friend who joins!
            </p>
          </div>
        </div>
      </div>

      {/* Stats row if user has referrals */}
      {stats.totalReferred > 0 && (
        <div className="grid grid-cols-3 gap-2 bg-white/5 rounded-xl p-2.5 border border-white/10 text-center relative z-10">
          <div>
            <div className="text-base font-bold text-white">{stats.totalReferred}</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">Friends Joined</div>
          </div>
          <div>
            <div className="text-base font-bold text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{stats.coinsEarned}</span>
            </div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">Coins Earned</div>
          </div>
          <div>
            <div className="text-base font-bold text-red-400 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>+{stats.proDaysEarned}d</span>
            </div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">Pro Days</div>
          </div>
        </div>
      )}

      {/* Copy link input bar */}
      <div className="space-y-1.5 relative z-10">
        <label className="text-[11px] font-semibold text-stone-300 block">
          Your Personal Invite Link
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-black/40 border border-stone-700 text-stone-200 text-xs px-3 py-2 rounded-xl focus:outline-hidden font-mono select-all truncate"
          />
          <button
            id="btn-copy-referral-link"
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-600 transition-all shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-300" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1-Click Social Share Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
        <a
          id="btn-share-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 rounded-xl text-xs font-bold transition-colors text-center"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp Share</span>
        </a>

        <a
          id="btn-share-facebook"
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] border border-[#1877F2]/30 rounded-xl text-xs font-bold transition-colors text-center"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Facebook Share</span>
        </a>
      </div>
    </div>
  );
};
