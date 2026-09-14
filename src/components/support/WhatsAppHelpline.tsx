import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  MapPin,
  X,
  ExternalLink,
  Clock,
  Building2,
  Copy,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NIHOMI_CONTACT } from '../../config/contact';

interface WhatsAppHelplineProps {
  className?: string;
}

export const WhatsAppHelpline: React.FC<WhatsAppHelplineProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [copiedLocation, setCopiedLocation] = useState(false);

  // Safe defensive defaults for all contact fields
  const safePhoneRaw = NIHOMI_CONTACT?.phoneRaw || NIHOMI_CONTACT?.helpline || '01800644664';
  const safePhoneDisplay = NIHOMI_CONTACT?.phoneFormatted || NIHOMI_CONTACT?.phone || '01800-644664';
  const safeWhatsappNumber = NIHOMI_CONTACT?.whatsappNumber || '8801800644664';
  const safeAddressBn = NIHOMI_CONTACT?.officeLocationBn || 'বিটিআই সেন্ট্রাল প্লাজা, ফার্মগেট, ঢাকা - ১২১৫';
  const safeAddressEn = NIHOMI_CONTACT?.officeLocationEn || 'BTI Central Plaza, Farmgate, Dhaka - 1215';
  const defaultMessage = NIHOMI_CONTACT?.whatsappDefaultMessage || 'হ্যালো নিহোমি! আমি JLPT N5 কোর্সে ভর্তি হতে চাই / পেমেন্ট সংক্রান্ত তথ্য জানতে চাই।';

  const phoneCallUrl = `tel:${safePhoneRaw.startsWith('+') ? safePhoneRaw : `+88${safePhoneRaw}`}`;

  const quickPrompts = [
    { label: 'ভর্তি ও কোর্স ফি', msg: 'হ্যালো নিহোমি! আমি JLPT N5 কোর্সে ভর্তির ফি ও ডিসকাউন্ট অফার সম্পর্কে জানতে চাই।' },
    { label: 'বিকাশ পেমেন্ট', msg: 'হ্যালো নিহোমি! আমি bKash / Nagad এর মাধ্যমে ফি পরিশোধ করেছি, ভেরিফিকেশন চাই।' },
    { label: 'অফিস ভিজিট', msg: `হ্যালো নিহোমি! আমি ${safeAddressBn} অফিসে সরাসরি এসে কথা বলতে চাই।` },
    { label: 'AI সেনসি ডেমো', msg: 'হ্যালো নিহোমি! ২৪/৭ AI সেনসি এবং লিসেনিং অডিও ল্যাব কীভাবে কাজ করে?' }
  ];

  const handleCopyLocation = () => {
    try {
      navigator.clipboard?.writeText(safeAddressEn);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2000);
    } catch {
      setCopiedLocation(false);
    }
  };

  const handleOpenWhatsApp = (customMsg?: string) => {
    const text = customMsg || defaultMessage;
    const url = `https://wa.me/${safeWhatsappNumber}?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id="nihomi-whatsapp-helpline-container"
      className={`fixed bottom-[96px] md:bottom-24 right-5 sm:right-6 z-40 select-none ${className}`}
    >
      {/* Floating Minimized Widget Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            id="btn-open-whatsapp-helpline"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Nihomi WhatsApp & Helpline Support"
            className="flex items-center space-x-2.5 px-3.5 sm:px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer active:scale-95 border-2 border-emerald-400/40"
          >
            {/* Pulsing indicator & WhatsApp Icon */}
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-white/30 animate-ping" />
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
            </div>

            {/* Label and Japanese Kanji Badge */}
            <div className="text-left leading-tight hidden xs:block sm:block pr-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold font-sans">হেল্পলাইন</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-800/70 text-emerald-100 rounded-md font-japanese font-semibold">
                  サポート
                </span>
              </div>
              <span className="text-[10px] text-emerald-100 font-mono tracking-tight block">
                {safePhoneDisplay}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Interactive Support Modal Card */}
      {isOpen && (
        <div
          id="card-whatsapp-helpline-expanded"
          className="w-[330px] sm:w-[380px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100 animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center font-bold shadow-md">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-emerald-700 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-sm">নিহোমি স্টুডেন্ট সাপোর্ট</h3>
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/20 rounded font-japanese font-medium">
                      相談デスク
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                    অনলাইন রেসপন্স • ৯ AM – ১১ PM
                  </p>
                </div>
              </div>

              <button
                id="btn-close-whatsapp-helpline"
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close helpline window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 max-h-[440px] overflow-y-auto">
            {/* Welcome message box */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                কোন্ বিষয়ে জানতে চান?
              </p>
              ভর্তি, বিকাশ পেমেন্ট বা ফার্মগেট অফিসে কাউন্সেলিংয়ের জন্য সরাসরি আমাদের অফিশিয়াল হোয়াটসঅ্যাপ বা হটলাইনে যুক্ত হোন।
            </div>

            {/* Quick Prompts */}
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                দ্রুত বার্তা পাঠান (Quick Questions)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenWhatsApp(item.msg)}
                    className="p-2 text-left bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700/80 hover:border-emerald-400 rounded-xl text-[11px] text-stone-700 dark:text-stone-200 font-medium transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="truncate">{item.label}</span>
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="btn-action-start-whatsapp"
                type="button"
                onClick={() => handleOpenWhatsApp()}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-95 group"
              >
                <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>WhatsApp এ সরাসরি চ্যাট করুন</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-75" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={phoneCallUrl}
                  className="py-2.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                  <span>কল: {safePhoneDisplay}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowLocationDetails(!showLocationDetails)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer border ${
                    showLocationDetails
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200'
                      : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>অফিস লোকেশন</span>
                </button>
              </div>
            </div>

            {/* Office Location Drawer / Panel */}
            {showLocationDetails && (
              <div
                id="panel-office-location"
                className="p-3.5 bg-amber-50/70 dark:bg-stone-800/90 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-300 font-bold text-xs">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>ঢাকা অফিস হেডকোয়ার্টার</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLocation}
                    className="inline-flex items-center space-x-1 text-[10px] font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 bg-white dark:bg-stone-900 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700 transition cursor-pointer"
                  >
                    {copiedLocation ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                  {safeAddressBn}
                </p>
                <p className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  শনিবার – বৃহস্পতিবার: সকাল ১০টা থেকে সন্ধ্যা ৭টা
                </p>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <span>NIHOMI OFFICIAL HELPLINE</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">SECURE & DIRECT</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppHelpline;
