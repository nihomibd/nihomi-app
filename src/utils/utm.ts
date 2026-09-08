/**
 * NIHOMI MARKETING UTM ATTRIBUTION & AD CAMPAIGN TRACKER
 * Captures, persists, and links UTM campaign parameters for Bangladesh learner acquisition.
 * Designed for Facebook Ads, Instagram Reels, TikTok, and DILS partner referrals.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  capturedAt?: string;
  landingPage?: string;
}

const UTM_SESSION_STORAGE_KEY = 'nihomi_utm_params_session';
const UTM_LOCAL_STORAGE_KEY = 'nihomi_utm_params_v1';

/**
 * Extracts UTM and ad tracking parameters from the current URL query string.
 * Persists to sessionStorage and localStorage for attribution across the entire registration funnel.
 */
export function captureUtmFromUrl(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    const utmTerm = urlParams.get('utm_term');
    const fbclid = urlParams.get('fbclid');
    const gclid = urlParams.get('gclid');

    // Only record if at least one campaign/ad attribution parameter exists
    if (utmSource || utmCampaign || fbclid || gclid) {
      const utmObj: UtmParams = {
        utm_source: utmSource ? utmSource.trim().slice(0, 80) : (fbclid ? 'facebook' : undefined),
        utm_medium: utmMedium ? utmMedium.trim().slice(0, 80) : (fbclid ? 'cpc' : undefined),
        utm_campaign: utmCampaign ? utmCampaign.trim().slice(0, 80) : 'direct_ad',
        utm_content: utmContent ? utmContent.trim().slice(0, 80) : undefined,
        utm_term: utmTerm ? utmTerm.trim().slice(0, 80) : undefined,
        fbclid: fbclid ? fbclid.trim().slice(0, 100) : undefined,
        gclid: gclid ? gclid.trim().slice(0, 100) : undefined,
        capturedAt: new Date().toISOString(),
        landingPage: window.location.pathname + window.location.search
      };

      const serialized = JSON.stringify(utmObj);
      sessionStorage.setItem(UTM_SESSION_STORAGE_KEY, serialized);
      localStorage.setItem(UTM_LOCAL_STORAGE_KEY, serialized);

      return utmObj;
    }
  } catch (err) {
    console.warn('[UTM Tracker] Failed to capture UTM parameters:', err);
  }

  return getStoredUtm();
}

/**
 * Retrieves the currently active UTM parameters from storage.
 */
export function getStoredUtm(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = sessionStorage.getItem(UTM_SESSION_STORAGE_KEY);
    if (sessionData) {
      return JSON.parse(sessionData) as UtmParams;
    }
    const localData = localStorage.getItem(UTM_LOCAL_STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData) as UtmParams;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Merges stored UTM attribution properties into any telemetry or analytics payload.
 */
export function appendUtmToPayload<T extends Record<string, any>>(payload: T): T & { utm?: UtmParams } {
  const utm = getStoredUtm();
  if (!utm) return payload;

  return {
    ...payload,
    utm: {
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      landingPage: utm.landingPage
    }
  };
}

/**
 * Clears stored UTM parameters (e.g., after final checkout or account setup).
 */
export function clearStoredUtm(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(UTM_SESSION_STORAGE_KEY);
    localStorage.removeItem(UTM_LOCAL_STORAGE_KEY);
  } catch {}
}

/**
 * Generates an ad campaign link with standardized Nihomi UTM tags.
 */
export function generateCampaignUrl(params: {
  baseUrl?: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  ref?: string;
}): string {
  const origin = params.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com');
  const url = new URL('/start', origin);

  url.searchParams.set('utm_source', params.source);
  url.searchParams.set('utm_medium', params.medium);
  url.searchParams.set('utm_campaign', params.campaign);
  if (params.content) url.searchParams.set('utm_content', params.content);
  if (params.term) url.searchParams.set('utm_term', params.term);
  if (params.ref) url.searchParams.set('ref', params.ref);

  return url.toString();
}
