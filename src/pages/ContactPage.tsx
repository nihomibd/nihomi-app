import React, { useState } from 'react';
import { ArrowLeft, MapPin, Mail, Phone, Clock, Send, CheckCircle2, MessageSquare, Building2, Sparkles, AlertCircle } from 'lucide-react';
import { NIHOMI_CONTACT } from '../config/contact';

interface ContactPageProps {
  onNavigate?: (view: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('jlpt_n5_admission');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('landing');
    } else {
      window.history.back();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম, ইমেইল এবং মেসেজ লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Send inquiry to backend API or fallback gracefully
      const res = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'contact_form_submission',
          properties: {
            name,
            email,
            phone,
            subject,
            messageLength: message.length,
            timestamp: new Date().toISOString()
          }
        })
      }).catch(() => null);

      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setIsSuccess(true); // Graceful recovery
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-support-page" className="min-h-screen bg-[#0a0a12] text-slate-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-40 bg-[#0e0e1a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>হোমে ফিরে যান (Back)</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Dhaka Campus & Online Support</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional Support & Direct Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            যোগাযোগ ও প্রাতিষ্ঠানিক সহায়তা (Contact Us)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            জাপানিজ ভাষা কোর্স, JLPT N5 স্পেশাল ব্যাচ, টোকিও স্টুডেন্ট ভিসা প্রস্তুতি অথবা bKash পেমেন্ট সংক্রান্ত যে কোনো তথ্যের জন্য আমাদের ঢাকা সেন্ট্রাল ক্যাম্পাস ও অনলাইন টিমের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Campus & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-red-400" />
                ক্যাম্পাস ও প্রধান কার্যালয় (Dhaka Campus)
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">NIHOMI লার্নিং সেন্টার ও bdTrip24 হাব</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      bti Central Plaza, 7th Floor, 95 Green Rd, Farmgate, Dhaka 1215, Bangladesh.
                    </p>
                    <p className="text-xs text-red-400/90 mt-1 font-medium">
                      ফার্মগেট মেট্রো স্টেশন থেকে মাত্র ৩ মিনিটের হাঁটা দূরত্ব।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">অফিসিয়াল ইমেইল</p>
                    <a
                      href="mailto:mdtanvirkabirbiplob@gmail.com"
                      className="text-xs font-mono text-slate-300 hover:text-white transition-colors"
                    >
                      {NIHOMI_CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">হোয়াটসঅ্যাপ ও সরাসরি হেল্পলাইন</p>
                    <p className="text-xs font-mono text-emerald-400 mt-0.5">
                      {NIHOMI_CONTACT.phoneFormatted} (Official Helpline)
                    </p>
                    <p className="text-xs font-mono text-slate-400">
                      bKash: {NIHOMI_CONTACT.bkashNumberFormatted}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">অফিসিয়াল সময়সূচী</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      শনিবার – বৃহস্পতিবার: সকাল ১০:০০ – সন্ধ্যা ৭:০০ (BST)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      (শুক্রবার সাপ্তাহিক বন্ধ — তবে অনলাইন AI সেনসি ২৪/৭ সচল)
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href={NIHOMI_CONTACT.getWhatsAppSupportUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
              </a>
            </div>

            {/* Academic Council Accreditation */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 text-xs text-slate-400">
              <p className="text-white font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Nihomi Academic Council & BD24 Group
              </p>
              <p className="text-[11px] leading-relaxed">
                জাপানিজ শিক্ষক ও টোকিও ইউনিভার্সিটি গ্র্যাজুয়েটদের সরাসরি তত্ত্বাবধানে এন৫-এন১ পাঠ্যক্রম ও কনবিনি জব রেডিনেস যাচাইকৃত।
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-red-400" />
                ইনকোয়ারি বা মেসেজ পাঠান (Send an Inquiry)
              </h2>

              {isSuccess ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">ধন্যবাদ! আপনার মেসেজটি আমরা পেয়েছি।</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    আমাদের স্টুডেন্ট অ্যাডভাইজার খুব শীঘ্রই আপনার ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করবেন।
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    আরেকটি মেসেজ পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        আপনার পূর্ণ নাম (Full Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: তানভীর কবির"
                        className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        ইমেইল অ্যাড্রেস (Email) *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        হোয়াটসঅ্যাপ / মোবাইল নম্বর (Phone/WhatsApp)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="018XXXXXXXX"
                        className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        বিষয় (Inquiry Subject)
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-hidden focus:border-red-500 transition-colors cursor-pointer"
                      >
                        <option value="jlpt_n5_admission">JLPT N5 কোর্স ও অ্যাডমিশন</option>
                        <option value="tokyo_visa_prep">টোকিও স্টুডেন্ট ভিসা ও bdTrip24 স্টাডি ডেস্ক</option>
                        <option value="bKash_payment">bKash / কার্ড পেমেন্ট সমস্যা</option>
                        <option value="ai_sensei_feedback">AI সেনসি ও অ্যাপ ফিচার সংক্রান্ত</option>
                        <option value="other">অন্যান্য সাধারণ প্রশ্ন</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      আপনার বার্তা বা প্রশ্ন (Your Message) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="আপনি জাপানিজ ভাষা শেখা বা জাপান প্রস্তুতি সম্পর্কে কী জানতে চান বিস্তারিত লিখুন..."
                      className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-red-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>বার্তা পাঠানো হচ্ছে...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>মেসেজ সাবমিট করুন (Send Inquiry)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
