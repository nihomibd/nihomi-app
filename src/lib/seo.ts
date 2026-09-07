// src/lib/seo.ts
// Dynamic OpenGraph, Twitter Cards & Google JSON-LD Structured Data Engine for NIHOMI.COM

export interface SeoMetaOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  keywords?: string[];
  type?: string;
}

/**
 * Dynamically updates or inserts document head meta tags for SEO and Social Sharing (FB, WhatsApp, LinkedIn, X)
 */
export function updatePageMetaTags(options: SeoMetaOptions): void {
  if (typeof document === 'undefined') return;

  const defaultTitle = 'NIHOMI (ニホミ) — Japanese Learning Operating System | JLPT N5–N1 & Japan Readiness';
  const defaultDesc =
    'From your first ひらがな to real Japanese fluency. Master JLPT N5–N1 with 24/7 Multimodal Gemini 2.5 AI Sensei, live Tokyo cohorts, and verified digital credentials.';
  const defaultImage = 'https://nihomi.com/assets/og-nihomi-banner.png';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://nihomi.com';

  const title = options.title || defaultTitle;
  const description = options.description || defaultDesc;
  const ogTitle = options.ogTitle || title;
  const ogDescription = options.ogDescription || description;
  const ogImage = options.ogImage || defaultImage;
  const ogUrl = options.ogUrl || options.canonicalUrl || currentUrl;

  // 1. Title
  document.title = title;

  // Helper to create or update meta tag
  const setMeta = (attributeName: string, attributeValue: string, content: string) => {
    let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, attributeValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to create or update link tag
  const setLink = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // Standard Meta Tags
  setMeta('name', 'description', description);
  if (options.keywords && options.keywords.length > 0) {
    setMeta('name', 'keywords', options.keywords.join(', '));
  }

  // Open Graph / Facebook / WhatsApp / LinkedIn
  setMeta('property', 'og:type', options.type || 'website');
  setMeta('property', 'og:title', ogTitle);
  setMeta('property', 'og:description', ogDescription);
  setMeta('property', 'og:image', ogImage);
  setMeta('property', 'og:url', ogUrl);
  setMeta('property', 'og:site_name', 'NIHOMI (ニホミ)');

  // Twitter Cards
  setMeta('name', 'twitter:card', options.twitterCard || 'summary_large_image');
  setMeta('name', 'twitter:title', ogTitle);
  setMeta('name', 'twitter:description', ogDescription);
  setMeta('name', 'twitter:image', ogImage);

  // Canonical Link
  setLink('canonical', options.canonicalUrl || ogUrl);
}

/**
 * Dynamically injects or replaces JSON-LD structured data in document head
 */
export function injectJsonLd(schemaId: string, schemaData: object): void {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = schemaId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaData, null, 2);
}

/**
 * Generates structured data for a certified Japanese course (Minna no Nihongo / JLPT N5)
 */
export function getCourseJsonLd(course: {
  id: string;
  name: string;
  description: string;
  level: string;
  durationHours?: number;
  inLanguage?: string[];
  priceBdt?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `https://nihomi.com/courses/${course.id}`,
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'NIHOMI (ニホミ) Japanese Learning Platform',
      url: 'https://nihomi.com'
    },
    educationalLevel: course.level,
    inLanguage: course.inLanguage || ['ja', 'bn', 'en'],
    timeRequired: `PT${course.durationHours || 120}H`,
    offers: {
      '@type': 'Offer',
      price: course.priceBdt ? `${course.priceBdt}` : '0',
      priceCurrency: 'BDT',
      category: 'Course Subscription',
      availability: 'https://schema.org/InStock',
      url: 'https://nihomi.com'
    }
  };
}

/**
 * Generates verified educational credential schema for student certificates
 */
export function getCertificateJsonLd(cert: {
  certificateId: string;
  studentName: string;
  studentId: string;
  level: string;
  issuedAt: string;
  issuerName?: string;
  verificationUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    '@id': `https://nihomi.com/verify?certId=${cert.certificateId}`,
    name: `JLPT ${cert.level} Speaking & Interview Readiness Certificate`,
    credentialCategory: 'Certificate',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: cert.issuerName || 'NIHOMI Academy & Academic Council',
      url: 'https://nihomi.com'
    },
    about: {
      '@type': 'Course',
      name: `JLPT ${cert.level} Comprehensive Speaking & Japanese Readiness`
    },
    recipient: {
      '@type': 'Person',
      name: cert.studentName,
      identifier: cert.studentId
    },
    dateCreated: cert.issuedAt,
    url: cert.verificationUrl || `https://nihomi.com/verify?certId=${cert.certificateId}`
  };
}
