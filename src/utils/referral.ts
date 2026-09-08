/**
 * NIHOMI VIRAL REFERRAL ENGINE
 * Handles client-side referral capture, storage, sharing, and attribution.
 */

const REFERRAL_STORAGE_KEY = 'nihomi_referral_code_v1';

/**
 * Parses current URL search params for ?ref=... or ?referral=... and saves to localStorage.
 */
export function captureReferralFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('referral') || params.get('invite');

    if (ref && ref.trim().length > 0) {
      const sanitized = ref.trim().slice(0, 50);
      localStorage.setItem(REFERRAL_STORAGE_KEY, sanitized);
      return sanitized;
    }
  } catch (err) {
    console.warn('[Referral] Failed to capture referral from URL:', err);
  }

  return getStoredReferralCode();
}

/**
 * Returns currently stored referral code or null.
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(REFERRAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Clears referral code after successful claim/attribution.
 */
export function clearStoredReferralCode(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {}
}

/**
 * Generates the student's unique public referral link.
 */
export function generateReferralLink(studentIdOrCode: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com';
  return `${origin}?ref=${encodeURIComponent(studentIdOrCode)}`;
}

/**
 * Formats trilingual WhatsApp sharing message with referral link.
 */
export function generateWhatsAppShareUrl(studentIdOrCode: string, studentName?: string): string {
  const link = generateReferralLink(studentIdOrCode);
  const nameStr = studentName ? `${studentName} invites you to ` : '';
  const text = `🎌 ${nameStr}Join NIHOMI — Bangladesh's premier Japanese Learning Platform!\n\n` +
    `Master Minna no Nihongo JLPT N5–N1 with 24/7 AI Sensei & Tokyo Native Faculty.\n` +
    `🎁 Use my invite link to get 7 Days FREE Pro Access + 50 AI Practice Coins:\n${link}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Generates Facebook share link.
 */
export function generateFacebookShareUrl(studentIdOrCode: string): string {
  const link = generateReferralLink(studentIdOrCode);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
}

/**
 * Sends referral attribution to backend API.
 */
export async function claimReferralReward(
  referralCode: string,
  userId?: string
): Promise<{ success: boolean; message: string; coinsGranted?: number; proDaysGranted?: number }> {
  try {
    const res = await fetch('/api/referral/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode,
        userId
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data.error || 'Referral attribution failed' };
    }

    const data = await res.json();
    clearStoredReferralCode();
    return {
      success: true,
      message: data.message || '7 Days Pro & 50 AI Coins granted!',
      coinsGranted: data.coinsGranted,
      proDaysGranted: data.proDaysGranted
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error claiming referral' };
  }
}
