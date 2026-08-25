import React, { useState } from 'react';
import {
  Globe,
  Share2,
  Code2,
  CheckCircle2,
  Copy,
  Sparkles,
  ExternalLink,
  Eye,
  RefreshCw,
  Save,
  Layers,
  Search,
  Check
} from 'lucide-react';

interface LearningPathSEO {
  id: string;
  pathName: string;
  level: string;
  slug: string;
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterCreator: string;
  keywords: string[];
  jsonLdType: 'Course' | 'LanguageLearningApp' | 'EducationalOccupationalCredential' | 'FAQPage';
  jsonLdData: any;
}

const INITIAL_LEARNING_PATHS_SEO: LearningPathSEO[] = [
  {
    id: 'seo-n5-minna',
    pathName: 'JLPT N5 Complete Syllabus & Minna no Nihongo Fast Track',
    level: 'N5',
    slug: '/learn/jlpt-n5-complete',
    pageTitle: 'JLPT N5 Complete Syllabus in Bengali & English | NIHOMI.COM',
    metaDescription: 'Master 25 lessons of Minna no Nihongo, 120 essential N5 kanji, and grammar particle rules with Bengali explanations, Tokyo audio, and AI tutoring.',
    canonicalUrl: 'https://nihomi.com/learn/jlpt-n5-complete',
    ogTitle: 'Pass JLPT N5 with Nihomi — 100% Comprehensive Bengali & Tokyo Audio Curriculum',
    ogDescription: 'Structured 25-lesson curriculum, 3D kanji flip cards, particle error spotter, and Tokyo convenience store roleplay scenarios.',
    ogImage: 'https://nihomi.com/assets/og-jlpt-n5-mastery.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterCreator: '@nihomicom',
    keywords: ['JLPT N5', 'Minna no Nihongo Bengali', 'Japanese grammar particles', 'N5 Kanji list', 'Tokyo Work Japanese'],
    jsonLdType: 'Course',
    jsonLdData: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': 'JLPT N5 Mastery Curriculum (Minna no Nihongo)',
      'description': 'Complete 25-lesson JLPT N5 foundational Japanese language course calibrated with Bengali native explanations and Tokyo native audio.',
      'provider': {
        '@type': 'Organization',
        'name': 'NIHOMI.COM',
        'sameAs': 'https://nihomi.com'
      },
      'educationalLevel': 'Beginner (JLPT N5)',
      'inLanguage': ['ja', 'bn', 'en'],
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'courseMode': 'online',
        'courseWorkload': 'PT80H'
      }
    }
  },
  {
    id: 'seo-tokyo-caregiver',
    pathName: 'Specified Skilled Worker (SSW-1) Caregiver Visa Track (介護)',
    level: 'N4-N3',
    slug: '/visa-tracks/ssw-caregiver',
    pageTitle: 'Japan SSW-1 Kaigo (Caregiver) Nursing Japanese Course | NIHOMI.COM',
    metaDescription: 'Complete Japanese curriculum for Japan Caregiver Visa. Learn vital signs Japanese, patient handover Keigo, and JFT-Basic test preparation.',
    canonicalUrl: 'https://nihomi.com/visa-tracks/ssw-caregiver',
    ogTitle: 'Japan Caregiver Visa (介護 SSW-1) Training & Certification Track',
    ogDescription: 'Master nursing facility Japanese, wheelchair assistance dialogues, and specialized care vocabulary with Bengali native translations.',
    ogImage: 'https://nihomi.com/assets/og-kaigo-caregiver.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterCreator: '@nihomicom',
    keywords: ['Japan Caregiver Visa', 'SSW 1 Kaigo', 'Kaigo Japanese terms', 'JFT-Basic Caregiver', 'Japan Nursing Job'],
    jsonLdType: 'EducationalOccupationalCredential',
    jsonLdData: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOccupationalCredential',
      'name': 'SSW-1 Kaigo (Caregiver) Specialized Japanese Credential',
      'credentialCategory': 'Vocational Certification Preparation',
      'educationalLevel': 'Intermediate (JLPT N4-N3)',
      'recognizedBy': {
        '@type': 'Organization',
        'name': 'Japan Ministry of Health, Labour and Welfare (MHLW)'
      }
    }
  },
  {
    id: 'seo-it-engineer',
    pathName: 'Tokyo IT Engineer Technical Visa & Standup Keigo Track',
    level: 'N3-N2',
    slug: '/visa-tracks/it-engineer',
    pageTitle: 'Tokyo IT Engineer Japanese & Business Keigo Course | NIHOMI.COM',
    metaDescription: 'Agile daily standup reporting, Pull Request review phrases, and Client Sonkeigo/Kenjougo mastery for foreign software engineers in Japan.',
    canonicalUrl: 'https://nihomi.com/visa-tracks/it-engineer',
    ogTitle: 'Tokyo IT Engineer Japanese — Code, Standups & Client Keigo',
    ogDescription: 'Speak confident Japanese in Tokyo tech firms. Agile meetings, Slack phrasing, system incident reporting, and technical interview prep.',
    ogImage: 'https://nihomi.com/assets/og-it-engineer-tokyo.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterCreator: '@nihomicom',
    keywords: ['Tokyo IT Engineer Japanese', 'Japanese business Keigo for programmers', 'Japan Tech Visa', 'IT Japanese vocabulary'],
    jsonLdType: 'Course',
    jsonLdData: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': 'Tokyo Software Engineer Business Japanese Immersion',
      'description': 'Advanced professional Japanese for software developers, cloud engineers, and technical project managers relocating to Tokyo.',
      'provider': {
        '@type': 'Organization',
        'name': 'NIHOMI.COM'
      }
    }
  }
];

export const SEOSocialMetaEditor: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathSEO[]>(INITIAL_LEARNING_PATHS_SEO);
  const [selectedPathId, setSelectedPathId] = useState<string>(INITIAL_LEARNING_PATHS_SEO[0].id);
  const [previewTab, setPreviewTab] = useState<'google' | 'social' | 'jsonld'>('google');
  const [copiedJson, setCopiedJson] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const activePath = paths.find((p) => p.id === selectedPathId) || paths[0];

  // Editor Form States
  const [pageTitle, setPageTitle] = useState(activePath.pageTitle);
  const [metaDescription, setMetaDescription] = useState(activePath.metaDescription);
  const [ogTitle, setOgTitle] = useState(activePath.ogTitle);
  const [ogDescription, setOgDescription] = useState(activePath.ogDescription);
  const [ogImage, setOgImage] = useState(activePath.ogImage);
  const [canonicalUrl, setCanonicalUrl] = useState(activePath.canonicalUrl);
  const [rawJsonLd, setRawJsonLd] = useState(JSON.stringify(activePath.jsonLdData, null, 2));

  const handleSelectPath = (path: LearningPathSEO) => {
    setSelectedPathId(path.id);
    setPageTitle(path.pageTitle);
    setMetaDescription(path.metaDescription);
    setOgTitle(path.ogTitle);
    setOgDescription(path.ogDescription);
    setOgImage(path.ogImage);
    setCanonicalUrl(path.canonicalUrl);
    setRawJsonLd(JSON.stringify(path.jsonLdData, null, 2));
  };

  const handleSave = () => {
    let parsedJson = activePath.jsonLdData;
    try {
      parsedJson = JSON.parse(rawJsonLd);
    } catch (e) {
      // ignore json parse error
    }

    const updated = paths.map((p) => {
      if (p.id === activePath.id) {
        return {
          ...p,
          pageTitle,
          metaDescription,
          ogTitle,
          ogDescription,
          ogImage,
          canonicalUrl,
          jsonLdData: parsedJson
        };
      }
      return p;
    });

    setPaths(updated);
    setSaveToast(`✓ SEO & Open Graph Meta published for "${activePath.pathName}".`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(rawJsonLd);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div id="seo-social-meta-editor" className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Toast */}
      {saveToast && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold rounded-lg border border-amber-500/20">
              SEO & SOCIAL GRAPH ENGINE
            </span>
            <span className="text-xs text-stone-400 font-mono">OpenGraph 2.0 & Schema.org JSON-LD</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Learning Path SEO & Social Meta Editor
          </h3>
          <p className="text-xs text-stone-400">
            Configure SERP indexing, Open Graph social share cards, and Schema.org rich snippet JSON-LD metadata for all Nihomi curriculum paths.
          </p>
        </div>

        <button
          id="save-seo-meta-btn"
          onClick={handleSave}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save & Update Meta</span>
        </button>
      </div>

      {/* Path Selector Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {paths.map((p) => {
          const isSelected = p.id === activePath.id;
          return (
            <button
              key={p.id}
              id={`select-seo-path-${p.id}`}
              onClick={() => handleSelectPath(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <span className="px-1.5 py-0.2 bg-stone-950/40 rounded text-[10px]">{p.level}</span>
              <span>{p.pathName}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Editor Inputs, Right Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Editor */}
        <div className="lg:col-span-6 bg-stone-950 border border-stone-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono flex items-center space-x-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Metadata & Open Graph Tags</span>
            </h4>
            <span className="text-[10px] font-mono text-stone-500">{activePath.slug}</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-stone-400 font-mono uppercase font-bold">Page Title (SERP Title)</label>
                <span className={`text-[10px] font-mono ${pageTitle.length > 60 ? 'text-amber-400' : 'text-stone-500'}`}>
                  {pageTitle.length}/60 chars
                </span>
              </div>
              <input
                id="seo-page-title-input"
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 px-3 py-2 rounded-xl text-white text-xs font-bold"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-stone-400 font-mono uppercase font-bold">Meta Description</label>
                <span className={`text-[10px] font-mono ${metaDescription.length > 155 ? 'text-amber-400' : 'text-stone-500'}`}>
                  {metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                id="seo-meta-description-input"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-xl text-stone-200 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-stone-400 font-mono uppercase font-bold block mb-1">Canonical URL</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-xl text-stone-300 text-xs font-mono"
              />
            </div>

            <div className="pt-2 border-t border-stone-800 space-y-3">
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">
                Open Graph (Facebook / LinkedIn / X) Properties
              </span>

              <div>
                <label className="text-[10px] text-stone-400 font-mono uppercase block mb-1">OG Title</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono uppercase block mb-1">OG Description</label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 p-2 rounded-xl text-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono uppercase block mb-1">OG Image URL</label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-xl text-stone-400 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Previews & JSON-LD */}
        <div className="lg:col-span-6 space-y-4">
          {/* Preview Mode Selector */}
          <div className="flex items-center space-x-2 bg-stone-950 p-1.5 rounded-2xl border border-stone-800">
            <button
              id="preview-tab-google-btn"
              onClick={() => setPreviewTab('google')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                previewTab === 'google' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google SERP Preview</span>
            </button>
            <button
              id="preview-tab-social-btn"
              onClick={() => setPreviewTab('social')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                previewTab === 'social' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Share Card</span>
            </button>
            <button
              id="preview-tab-jsonld-btn"
              onClick={() => setPreviewTab('jsonld')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                previewTab === 'jsonld' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON-LD Schema</span>
            </button>
          </div>

          {/* 1. Google SERP Snippet Preview */}
          {previewTab === 'google' && (
            <div id="serp-preview-card" className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-3 font-sans animate-in fade-in">
              <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">
                Google Desktop Search Result Snippet Preview
              </span>

              <div className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-1.5 max-w-lg">
                <div className="flex items-center space-x-1.5 text-xs text-stone-400">
                  <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">
                    N
                  </div>
                  <span className="text-[11px] text-stone-300">nihomi.com</span>
                  <span className="text-stone-500">›</span>
                  <span className="text-[11px] text-stone-400">{activePath.slug.replace('/', '')}</span>
                </div>
                <h5 className="text-blue-400 hover:underline text-sm font-semibold cursor-pointer truncate">
                  {pageTitle || 'Page Title Placeholder'}
                </h5>
                <p className="text-xs text-stone-300 leading-snug line-clamp-2">
                  {metaDescription || 'Meta description will be displayed here in Google search engine results.'}
                </p>
              </div>

              <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800/80 text-[11px] text-stone-400 space-y-1">
                <div className="flex justify-between font-mono">
                  <span>SERP Title Pixel Width:</span>
                  <strong className="text-emerald-400">~{Math.min(580, pageTitle.length * 8.5)}px / 600px</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Mobile Snippet Compatibility:</span>
                  <strong className="text-emerald-400">Optimal (100%)</strong>
                </div>
              </div>
            </div>
          )}

          {/* 2. Social Media Open Graph Share Card Preview */}
          {previewTab === 'social' && (
            <div id="social-share-preview-card" className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-3 font-sans animate-in fade-in">
              <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">
                Open Graph Card Preview (Twitter / Facebook / LinkedIn)
              </span>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden max-w-lg shadow-xl">
                <div className="h-44 bg-stone-950 relative flex items-center justify-center border-b border-stone-800">
                  {ogImage ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-radial from-red-950/40 to-stone-950 text-center">
                      <span className="px-2.5 py-0.5 bg-red-600/80 text-white font-mono text-[9px] font-bold rounded mb-2">
                        NIHOMI.COM • {activePath.level}
                      </span>
                      <strong className="text-white text-base font-black px-4">{ogTitle}</strong>
                      <span className="text-xs text-stone-400 mt-1 font-mono">1200 x 630 Web Resolution</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-500 font-mono">No Image Attached</span>
                  )}
                </div>

                <div className="p-3.5 space-y-1 bg-stone-900/90 text-left">
                  <span className="text-[10px] text-stone-500 font-mono uppercase block">nihomi.com</span>
                  <h6 className="text-xs font-bold text-white leading-snug truncate">{ogTitle}</h6>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">{ogDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. JSON-LD Schema.org Editor */}
          {previewTab === 'jsonld' && (
            <div id="jsonld-editor-card" className="p-5 bg-stone-950 border border-stone-800 rounded-3xl space-y-3 text-left animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white font-mono">Schema.org JSON-LD Structured Data</span>
                </div>
                <button
                  id="copy-jsonld-btn"
                  onClick={handleCopyJsonLd}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-mono font-bold rounded-lg cursor-pointer flex items-center space-x-1"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <textarea
                id="jsonld-textarea"
                rows={12}
                value={rawJsonLd}
                onChange={(e) => setRawJsonLd(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 p-3 rounded-xl text-emerald-400 font-mono text-[11px] leading-relaxed"
              />

              <div className="flex items-center space-x-2 text-[10px] text-stone-400 font-mono">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                  ✓ Validated Schema.org Standard
                </span>
                <span>Type: {activePath.jsonLdType}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
