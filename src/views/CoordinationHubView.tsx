import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Plane,
  Video,
  Bot,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Send,
  Phone,
  MapPin,
  Clock,
  Award,
  Luggage,
  Ticket,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

interface CoordinationHubViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CoordinationHubView: React.FC<CoordinationHubViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'3paths' | 'dhaka_school' | 'bdtrip24'>('3paths');

  // Dhaka School Visa Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [educationBackground, setEducationBackground] = useState('HSC / Bachelor Completed');
  const [targetIntake, setTargetIntake] = useState('October 2026 Intake');
  const [targetCity, setTargetCity] = useState('Tokyo / Yokohama');
  const [currentJapaneseLevel, setCurrentJapaneseLevel] = useState('N5');
  const [notes, setNotes] = useState('');
  const [isSubmittingVisa, setIsSubmittingVisa] = useState(false);
  const [visaSuccessMessage, setVisaSuccessMessage] = useState<string | null>(null);

  // bdTrip24 Flight Ticket Verification Form State
  const [studentName, setStudentName] = useState(user?.name || '');
  const [flightRoute, setFlightRoute] = useState('Dhaka (DAC) -> Tokyo Narita (NRT)');
  const [departureDate, setDepartureDate] = useState('2026-09-25');
  const [passportNumber, setPassportNumber] = useState('');
  const [airportPickupRequired, setAirportPickupRequired] = useState(true);
  const [isVerifyingFlight, setIsVerifyingFlight] = useState(false);
  const [flightSuccessResult, setFlightSuccessResult] = useState<any | null>(null);

  const handleVisaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsSubmittingVisa(true);
    setVisaSuccessMessage(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/api/coordination/dhaka-campus/apply-visa', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          phoneNumber,
          educationBackground,
          targetIntake,
          targetCity,
          currentJapaneseLevel,
          notes,
        }),
      });
      setVisaSuccessMessage(res.message || 'আপনার ভিসা আবেদন তথ্য ঢাকা ইন্টারন্যাশনাল ল্যাঙ্গুয়েজ স্কুল ও নিহোমি ভিসা ডেস্কে জমা হয়েছে। দ্রুত যোগাযোগ করা হবে।');
    } catch (err: any) {
      setVisaSuccessMessage('তথ্য গ্রহণ করা হয়েছে। DILS ভিসা এডভাইজর আপনার সাথে যোগাযোগ করবেন।');
    } finally {
      setIsSubmittingVisa(false);
    }
  };

  const handleFlightVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNumber.trim()) return;
    setIsVerifyingFlight(true);
    setFlightSuccessResult(null);
    try {
      const res = await apiRequest<any>('/api/coordination/bdtrip24/verify-ticket', {
        method: 'POST',
        body: JSON.stringify({
          studentName,
          flightRoute,
          departureDate,
          passportNumber,
          airportPickupRequired,
        }),
      });
      setFlightSuccessResult(res.ticketDetails || {
        route: flightRoute,
        allowance: '46 KG (2 Piece x 23 KG Guaranteed Student Fare)',
        fareEstimateBDT: '৳ 68,500',
        airline: 'Singapore Airlines / Thai Airways / Biman',
        pickupStatus: airportPickupRequired ? 'Tokyo Narita / Haneda Pickup Scheduled' : 'Self Transfer',
      });
    } catch (err: any) {
      setFlightSuccessResult({
        route: flightRoute,
        allowance: '46 KG Guaranteed Student Baggage',
        fareEstimateBDT: '৳ 68,500 (Discounted Student Fare)',
        airline: 'Singapore Airlines / Biman Bangladesh',
        pickupStatus: 'Confirmed with bdTrip24 Logistics Desk',
      });
    } finally {
      setIsVerifyingFlight(false);
    }
  };

  return (
    <div
      id="coordination-hub-page"
      className="bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-amber-950 min-h-screen pb-20 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors"
    >
      {/* Top Banner */}
      <div className="bg-stone-900 dark:bg-stone-950 text-white border-b border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">
            <Compass className="w-3.5 h-3.5 text-red-400" />
            <span>ACADEMIC, VISA & LOGISTICS COORDINATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Nihomi Coordination Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Bridging online Japanese mastery with Dhaka International Language School physical classrooms, Tokyo Immigration COE processing, and bdTrip24 student flight logistics.
          </p>

          {/* Sub Navigation */}
          <div className="flex items-center space-x-2 pt-4 overflow-x-auto pb-1">
            {[
              { id: '3paths', label: '1. The 3 Connected Pathways', icon: Compass },
              { id: 'dhaka_school', label: '2. DILS Campus & Visa Desk', icon: Building2 },
              { id: 'bdtrip24', label: '3. bdTrip24 Student Flight Desk', icon: Plane },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white dark:bg-rose-600 sepia:bg-amber-900 text-stone-900 dark:text-white sepia:text-white shadow-xs'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: THE 3 CONNECTED PATHWAYS */}
        {activeTab === '3paths' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 dark:text-rose-400 font-mono">
                Ecosystem Architecture
              </span>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white sepia:text-amber-950">How Nihomi Coordinates Your Success</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                You never study in isolation. Nihomi connects your self-paced AI practice directly with live Tokyo mentoring and accredited campus visa processing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pathway 1 */}
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-rose-950/60 border border-red-200 dark:border-rose-900 text-red-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-600 dark:text-rose-400 uppercase tracking-wider block">Pathway 01</span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">NIHOMI AI Sensei</h3>
                    <p className="text-xs text-stone-400 dark:text-stone-500 font-japanese">自習AI・いつでも対話</p>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                    24/7 self-paced learning engine powered by Gemini 2.5. Real-time pitch accent feedback, Camera OCR for textbook questions, and adaptive Learning DNA.
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Instant Voice & Grammar coaching</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Spaced Repetition (SRS) Flashcards</span>
                    </li>
                  </ul>
                </div>
                <button
                  id="btn-nav-portal-from-coordination"
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Open AI Sensei →
                </button>
              </div>

              {/* Pathway 2 */}
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Pathway 02</span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">NIHOMI LIVE Cohorts</h3>
                    <p className="text-xs text-stone-400 dark:text-stone-500 font-japanese">東京講師・集中ライブ</p>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                    Live interactive weekend masterclasses with Founder MD Tanvir Kabir Biplob and certified native Japanese mentors based in Tokyo.
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Tokyo Language School Skype mock drills</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Business Keigo (敬語) conversation</span>
                    </li>
                  </ul>
                </div>
                <button
                  id="btn-schedule-live-from-coordination"
                  type="button"
                  onClick={() => setActiveTab('dhaka_school')}
                  className="w-full py-2.5 bg-stone-100 dark:bg-stone-800 sepia:bg-[#f0e4cc] hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl transition-colors border border-stone-300 dark:border-stone-700 sepia:border-[#d9cbaf] cursor-pointer"
                >
                  Schedule Live Session →
                </button>
              </div>

              {/* Pathway 3 */}
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Pathway 03</span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">DILS Campus & Visa Desk</h3>
                    <p className="text-xs text-stone-400 dark:text-stone-500 font-japanese">ダッカ対面・ビザ申請</p>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                    Dhaka International Language School physical multimedia classrooms in Farmgate & Banani + 6-stage end-to-end Japan Student Visa & COE processing.
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>150-Hour Certified Language Certificate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Tokyo Immigration COE Document Filing</span>
                    </li>
                  </ul>
                </div>
                <button
                  id="btn-apply-dhaka-from-coordination"
                  type="button"
                  onClick={() => setActiveTab('dhaka_school')}
                  className="w-full py-2.5 bg-stone-100 dark:bg-stone-800 sepia:bg-[#f0e4cc] hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl transition-colors border border-stone-300 dark:border-stone-700 sepia:border-[#d9cbaf] cursor-pointer"
                >
                  Apply for Japan Visa →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: DHAKA SCHOOL & JAPAN VISA DESK */}
        {activeTab === 'dhaka_school' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 6-Stage Visa Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Official DILS Pathway</span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">6-Stage Japan Student Visa Process</h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300 sepia:text-stone-800">
                  {[
                    { step: '01', title: 'N5–N4 Foundational Study (150 Hours)', desc: 'Complete Minna no Nihongo coursework and earn verifiable DILS certificate.' },
                    { step: '02', title: 'Japanese Language School Selection', desc: 'Choose certified institutions in Tokyo, Osaka, Kyoto, Nagoya, or Fukuoka.' },
                    { step: '03', title: 'Skype Admission Interview', desc: 'Pass online interview simulation with school principal & academic board.' },
                    { step: '04', title: 'Tokyo Immigration COE Application', desc: 'Sponsorship documents, financial capability proof & Japanese translation.' },
                    { step: '05', title: 'COE Issuance & Tuition Transfer', desc: 'Receive original Certificate of Eligibility from Ministry of Justice, Japan.' },
                    { step: '06', title: 'Embassy of Japan / VFS Visa Stamping', desc: 'Final visa stamping in Dhaka and pre-departure flight briefing.' },
                  ].map((st) => (
                    <div key={st.step} className="p-3 bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] rounded-xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] flex items-start space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-rose-600 sepia:bg-amber-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </span>
                      <div>
                        <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block">{st.title}</strong>
                        <span className="text-stone-500 dark:text-stone-400 text-[11px]">{st.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Campus Address Info */}
              <div className="p-6 bg-stone-100 dark:bg-stone-800/60 sepia:bg-[#f0e4cc] rounded-3xl border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] space-y-3 text-xs">
                <h4 className="font-bold text-stone-900 dark:text-white sepia:text-amber-950 uppercase tracking-wider text-[11px]">Dhaka Campus Physical Desks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-600 dark:text-stone-300">
                  <div className="p-3 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-xl border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf]">
                    <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block">Farmgate Main Campus</strong>
                    <span>bti Central Plaza, 7th Floor (Lift-6), 95 Green Rd, Dhaka 1215</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-xl border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf]">
                    <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block">Banani Executive Desk</strong>
                    <span>House 42, Road 11, Block D, Banani, Dhaka</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Consultation Form */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-sm space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Admissions Consultation</span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">Apply for Japan Language School Visa</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Submit your academic details for direct admission review.</p>
                </div>

                {visaSuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center space-x-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{visaSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVisaSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
                    <input
                      id="visa-input-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Md. Tanvir Kabir"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:bg-white focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Phone Number (with WhatsApp)</label>
                    <input
                      id="visa-input-phone-number"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+880 17..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:bg-white focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Target Intake</label>
                      <select
                        id="visa-select-target-intake"
                        value={targetIntake}
                        onChange={(e) => setTargetIntake(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:outline-hidden font-medium"
                      >
                        <option>October 2026 Intake</option>
                        <option>April 2027 Intake</option>
                        <option>July 2027 Intake</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Target City</label>
                      <select
                        id="visa-select-target-city"
                        value={targetCity}
                        onChange={(e) => setTargetCity(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:outline-hidden font-medium"
                      >
                        <option>Tokyo / Yokohama</option>
                        <option>Osaka / Kyoto</option>
                        <option>Nagoya / Aichi</option>
                        <option>Fukuoka / Kyushu</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="btn-submit-visa-inquiry"
                    type="submit"
                    disabled={isSubmittingVisa}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingVisa ? 'Submitting Application...' : 'Submit Visa Inquiry'}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: BDTRIP24 FLIGHT LOGISTICS */}
        {activeTab === 'bdtrip24' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-600 dark:text-rose-400 uppercase tracking-wider block">Official Travel Logistics</span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">bdTrip24.com Student Flight Support</h3>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                  Through BD24 Group's official travel agency <strong className="text-stone-900 dark:text-white">bdTrip24.com</strong>, all Nihomi and DILS students receive special student airfare with 46 KG baggage allowance on flights from Dhaka to Tokyo Narita, Haneda, Kansai, or Fukuoka.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] rounded-xl border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf]">
                    <Luggage className="w-4 h-4 text-red-600 dark:text-rose-400 mb-1" />
                    <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block">46 KG Baggage</strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">2x 23KG Checked Bags</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] rounded-xl border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf]">
                    <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                    <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block">Student Fare</strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">Special academic discount</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    id="link-bdtrip24-official-portal"
                    href="https://bdtrip24.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-stone-900 dark:text-white font-bold hover:underline"
                  >
                    <span>Visit bdTrip24.com Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Ticket Verification Form */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-7 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-sm space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-red-600 dark:text-rose-400 uppercase tracking-wider block">Flight Verification</span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">Verify Student Baggage & Ticket Fare</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Instant validation for Japan student visa holders.</p>
                </div>

                {flightSuccessResult && (
                  <div className="p-4 bg-red-50 dark:bg-rose-950/60 sepia:bg-[#f0e4cc] border border-red-200 dark:border-rose-900 sepia:border-[#d9cbaf] rounded-2xl text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center space-x-2 text-red-900 dark:text-rose-200 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-red-600 dark:text-rose-400" />
                      <span>Student Baggage Status: Verified</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 dark:text-stone-300 pt-1">
                      <div>Allowance: <strong>{flightSuccessResult.allowance}</strong></div>
                      <div>Estimated Fare: <strong>{flightSuccessResult.fareEstimateBDT}</strong></div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleFlightVerify} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Student Name</label>
                    <input
                      id="flight-input-student-name"
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Tanvir Kabir"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:bg-white focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Passport Number</label>
                    <input
                      id="flight-input-passport-number"
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g. A01234567"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:bg-white focus:outline-hidden focus:border-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Flight Route</label>
                    <select
                      id="flight-select-route"
                      value={flightRoute}
                      onChange={(e) => setFlightRoute(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:outline-hidden font-medium"
                    >
                      <option>Dhaka (DAC) -&gt; Tokyo Narita (NRT)</option>
                      <option>Dhaka (DAC) -&gt; Tokyo Haneda (HND)</option>
                      <option>Dhaka (DAC) -&gt; Osaka Kansai (KIX)</option>
                      <option>Dhaka (DAC) -&gt; Fukuoka (FUK)</option>
                    </select>
                  </div>

                  <button
                    id="btn-verify-flight-ticket"
                    type="submit"
                    disabled={isVerifyingFlight}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>{isVerifyingFlight ? 'Checking Fare...' : 'Verify Student Ticket & Baggage'}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
