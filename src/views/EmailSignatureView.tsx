import React, { useState } from 'react';
import {
  Copy,
  Check,
  Mail,
  Smartphone,
  MapPin,
  Globe,
  Sparkles,
  ShieldCheck,
  User,
  Building2,
  ExternalLink,
  Code,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmailSignatureView: React.FC = () => {
  const { user } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<'founder' | 'academic' | 'admissions'>('founder');
  const [copiedRich, setCopiedRich] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Customization State
  const [customName, setCustomName] = useState('MD Tanvir Kabir Biplob');
  const [customNameJa, setCustomNameJa] = useState('タンビル・カビル・ビプロブ');
  const [customTitle, setCustomTitle] = useState('Founder & CEO, Nihomi Japanese Platform');
  const [customPhone, setCustomPhone] = useState('+880 17555-34997');
  const [customEmail, setCustomEmail] = useState('mdtanvirkabirbiplob@gmail.com');

  const getSignatureData = () => {
    switch (selectedPersona) {
      case 'academic':
        return {
          name: 'Sensei Md. Abdur Razzak',
          nameJa: 'アブドゥル・ラッザク 先生',
          title: 'Principal & Academic Director',
          org: 'Dhaka International Language School (ダッカ国際言語学校)',
          phone: '+880 1300-634046',
          email: 'care.dils2014@gmail.com',
          location: 'bti Central Plaza, 7th Floor, 95 Green Rd, Farmgate, Dhaka 1215',
        };
      case 'admissions':
        return {
          name: 'DILS Japan Admissions & Visa Desk',
          nameJa: '日本留学・ビザ相談窓口',
          title: 'Admissions & COE Processing Coordinator',
          org: 'Dhaka International Language School & Nihomi',
          phone: '+880 17555-34997',
          email: 'admissions@nihomi.com',
          location: 'House 42, Road 11, Block D, Banani & Farmgate, Dhaka',
        };
      default:
        return {
          name: customName || user?.name || 'MD Tanvir Kabir Biplob',
          nameJa: customNameJa,
          title: customTitle,
          org: 'Nihomi.com & BD24 Group',
          phone: customPhone || user?.phone || '+880 17555-34997',
          email: customEmail || user?.email || 'mdtanvirkabirbiplob@gmail.com',
          location: 'bti Central Plaza, 7th Floor, 95 Green Rd, Dhaka 1215, Bangladesh',
        };
    }
  };

  const sig = getSignatureData();

  const htmlSourceCode = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #1c1917; max-width: 560px;">
  <tr>
    <td style="padding-right: 16px; vertical-align: top; border-right: 2px solid #dc2626;">
      <div style="width: 46px; height: 46px; background-color: #0c0a09; border-radius: 10px; text-align: center; line-height: 46px; color: #ffffff; font-size: 22px; font-weight: bold;">
        日
      </div>
    </td>
    <td style="padding-left: 16px; vertical-align: top;">
      <div style="font-size: 15px; font-weight: 800; color: #0c0a09; margin-bottom: 2px; letter-spacing: -0.2px;">
        ${sig.name} <span style="font-weight: 500; font-size: 12px; color: #78716c;">【${sig.nameJa}】</span>
      </div>
      <div style="font-size: 12px; font-weight: 700; color: #dc2626; margin-bottom: 6px;">
        ${sig.title} <span style="font-weight: 500; color: #78716c;">• ${sig.org}</span>
      </div>
      <div style="font-size: 12px; color: #44403c; margin-bottom: 4px;">
        <strong>Phone:</strong> <a href="tel:${sig.phone.replace(/[^0-9+]/g, '')}" style="color: #0c0a09; text-decoration: none; font-weight: 600;">${sig.phone}</a> &nbsp;|&nbsp; <strong>Email:</strong> <a href="mailto:${sig.email}" style="color: #dc2626; text-decoration: none; font-weight: 600;">${sig.email}</a>
      </div>
      <div style="font-size: 11px; color: #78716c; margin-bottom: 8px;">
        <strong>Campus Desk:</strong> ${sig.location}
      </div>
      <div style="font-size: 11px; color: #0c0a09; font-weight: 700; border-top: 1px solid #e7e5e4; padding-top: 6px;">
        <span style="color: #dc2626;">●</span> NIHOMI™ Japanese Learning Ecosystem • <a href="https://nihomi.com" style="color: #0c0a09; text-decoration: none; font-weight: 700;">nihomi.com</a> &nbsp;|&nbsp; <a href="https://shop.nihomi.com" style="color: #78716c; text-decoration: none;">shop.nihomi.com</a>
      </div>
    </td>
  </tr>
</table>`;

  const copyRichText = () => {
    const el = document.getElementById('signature-rich-preview');
    if (!el) return;
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
    setCopiedRich(true);
    setTimeout(() => setCopiedRich(false), 2500);
  };

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(htmlSourceCode);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  return (
    <div
      id="email-signature-generator-root"
      className="bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-stone-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 dark:bg-rose-950/60 sepia:bg-[#f0e4cc] text-red-700 dark:text-rose-300 sepia:text-amber-900 text-xs font-bold rounded-full border border-red-200 dark:border-rose-900 sepia:border-[#d9cbaf]">
            <Sparkles className="w-3.5 h-3.5 text-red-500 dark:text-rose-400" />
            <span>OFFICIAL BRAND &amp; COMMUNICATION ASSET</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white sepia:text-amber-950">
            Professional Email Signature Generator
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 sepia:text-stone-700 max-w-2xl leading-relaxed">
            Standardized, responsive HTML signatures for Gmail, Outlook, Apple Mail, and mobile email clients with 1-click rich text copying.
          </p>

          {/* Persona Selector Tabs */}
          <div className="flex items-center space-x-2 pt-2 overflow-x-auto pb-1">
            {[
              { id: 'founder', label: '1. Founder & CEO (Tanvir Kabir)', icon: User },
              { id: 'academic', label: '2. Academic Director (Sensei Razzak)', icon: ShieldCheck },
              { id: 'admissions', label: '3. Admissions & Visa Desk', icon: Building2 },
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  id={`tab-persona-${p.id}`}
                  type="button"
                  onClick={() => setSelectedPersona(p.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-rose-600 sepia:bg-amber-900 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 sepia:bg-[#ebdcc0] hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 sepia:text-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customization Form (when founder persona selected) */}
        {selectedPersona === 'founder' && (
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-100 dark:border-stone-800 sepia:border-[#d9cbaf] pb-3">
              <Sliders className="w-4 h-4 text-red-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                Customize Executive Identity Parameters
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">Full Name (English)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">Japanese Name (Katakana)</label>
                <input
                  type="text"
                  value={customNameJa}
                  onChange={(e) => setCustomNameJa(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 rounded-xl font-japanese"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">Executive Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">Direct Phone / WhatsApp</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Visual Preview Box */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 sepia:border-[#d9cbaf] pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">Signature Visual Preview</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">How your signature renders in Gmail and Outlook message compose windows.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-copy-rich-text"
                type="button"
                onClick={copyRichText}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedRich ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRich ? 'Copied to Clipboard!' : '1-Click Copy for Gmail / Outlook'}</span>
              </button>

              <button
                id="btn-copy-html-code"
                type="button"
                onClick={copyHtmlCode}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#ebdcc0] text-stone-800 dark:text-stone-200 sepia:text-stone-900 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'HTML Copied!' : 'Copy HTML'}</span>
              </button>
            </div>
          </div>

          {/* Renderable HTML Container */}
          <div className="p-6 bg-white dark:bg-stone-950 sepia:bg-[#fff9ed] rounded-2xl border border-stone-200/80 dark:border-stone-800 sepia:border-[#d9cbaf] overflow-x-auto">
            <div id="signature-rich-preview" dangerouslySetInnerHTML={{ __html: htmlSourceCode }} />
          </div>
        </div>

        {/* Raw HTML Code Container */}
        <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Raw Table-Based HTML Source Code (Compatible with all mail clients)</span>
            <button
              id="btn-copy-raw-html-source"
              type="button"
              onClick={copyHtmlCode}
              className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedHtml ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 bg-stone-900/90 rounded-xl text-[11px] font-mono text-stone-300 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-56">
            {htmlSourceCode}
          </pre>
        </div>

      </div>
    </div>
  );
};
