import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Plane,
  Video,
  Bot,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Send,
  Ticket,
  Luggage,
  Award,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';

interface CoordinationHubViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CoordinationHubView: React.FC<CoordinationHubViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'3paths' | 'dhaka_school' | 'bdtrip24'>('3paths');

  // Dhaka School Visa Form State
  const [fullName, setFullName] = useState(profile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [educationBackground, setEducationBackground] = useState('HSC / Bachelor Completed');
  const [targetIntake, setTargetIntake] = useState('October 2026 Intake');
  const [targetCity, setTargetCity] = useState('Tokyo / Yokohama');
  const [currentJapaneseLevel, setCurrentJapaneseLevel] = useState(profile?.targetLevel || 'N5');
  const [notes, setNotes] = useState('');
  const [isSubmittingVisa, setIsSubmittingVisa] = useState(false);
  const [visaSuccessMessage, setVisaSuccessMessage] = useState<string | null>(null);

  // bdTrip24 Flight Ticket Verification Form State
  const [studentName, setStudentName] = useState(profile?.displayName || '');
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
          notes
        })
      });
      if (res.success) {
        setVisaSuccessMessage(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmittingVisa(false);
    }
  };

  const handleFlightVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingFlight(true);
    setFlightSuccessResult(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string; booking: any }>('/api/coordination/bdtrip24/verify-ticket', {
        method: 'POST',
        body: JSON.stringify({
          studentName,
          flightRoute,
          departureDate,
          passportNumber,
          airportPickupRequired
        })
      });
      if (res.success && res.booking) {
        setFlightSuccessResult(res.booking);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to verify ticket.');
    } finally {
      setIsVerifyingFlight(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="coordination-hub-page">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>Bangladesh's #1 Japanese Language & Relocation Coordination Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-stone-900 tracking-tight leading-tight">
            We Coordinate Japanese Learning & <br />
            <span className="text-red-600">Your Complete Pathway to Japan</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            “The student starts learning Japanese. Nihomi coordinates the rest.” — From online AI self-study to live mentorship, offline classroom mastery at Dhaka International Language School, COE documentation, student visa processing, and student air ticketing with airport pickup via bdTrip24.com.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="pt-4 flex flex-wrap gap-2 border-t border-stone-100">
            <button
              onClick={() => setActiveTab('3paths')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === '3paths'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3 Learning Pathways</span>
            </button>
            <button
              onClick={() => setActiveTab('dhaka_school')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dhaka_school'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Dhaka International Language School (COE & Visa)</span>
            </button>
            <button
              onClick={() => setActiveTab('bdtrip24')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'bdtrip24'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>bdTrip24 Air Ticketing & Airport Pickup</span>
            </button>
          </div>
        </div>

        {/* TAB 1: THE 3 LEARNING PATHWAYS */}
        {activeTab === '3paths' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h2 className="text-2xl font-bold font-serif text-stone-900">
                Choose How You Want to Master Japanese
              </h2>
              <p className="text-xs text-stone-500">
                Every pathway inherits the official Nihomi JLPT curriculum with unified progress tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pathway 1: NIHOMI AI */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-red-300 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-200 shadow-xs">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">Pathway 01</span>
                    <h3 className="text-xl font-bold text-stone-900 font-serif mt-0.5">NIHOMI AI</h3>
                    <p className="text-xs text-stone-500 font-serif">自己学習・AI専属コーチ</p>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    24/7 intelligent self-paced mastery with Gemini 3.7 Sensei. Real-time sentence correction, furigana breakdowns, voice chats, and camera OCR translation.
                  </p>
                  <div className="space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Speech feedback & voice audio notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Vision Sensei photo translation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Complete JLPT N5, N4, N3 banks</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('ai-coach')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Practice with Nihomi AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Pathway 2: NIHOMI LIVE */}
              <div className="bg-white border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-sm">
                  Recommended Cohort
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl border border-red-200 shadow-xs">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600">Pathway 02</span>
                    <h3 className="text-xl font-bold text-stone-900 font-serif mt-0.5">NIHOMI LIVE</h3>
                    <p className="text-xs text-stone-500 font-serif">創業者・日本人講師オンライン</p>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Live online cohort interactive classes with Founder Tanvir Kabir Biplob and experienced native Japanese instructors based in Tokyo.
                  </p>
                  <div className="space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Direct 1-on-1 pronunciation coaching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Small interactive cohorts (max 20)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                      <span>School interview preparation in Japan</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('dhaka_school')}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Enroll in Live Cohort</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Pathway 3: NIHOMI IN-PERSON */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl border border-emerald-200 shadow-xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">Pathway 03</span>
                    <h3 className="text-xl font-bold text-stone-900 font-serif mt-0.5">NIHOMI IN-PERSON</h3>
                    <p className="text-xs text-stone-500 font-serif">ダッカ対面校・留学サポート</p>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Physical classroom academy at Dhaka International Language School. Complete end-to-end Japan student visa, COE paper processing, and school admissions.
                  </p>
                  <div className="space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Physical Banani/Dhanmondi classrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full COE & VFS Visa Application Filing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Japan Airport Pickup via bdTrip24</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('dhaka_school')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Apply for Dhaka Campus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DHAKA INTERNATIONAL LANGUAGE SCHOOL VISA ROADMAP */}
        {activeTab === 'dhaka_school' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Dhaka International Language School &bull; Official Japan Wing
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-stone-900">
                    6-Stage Guaranteed Japan Coordination Workflow
                  </h2>
                  <p className="text-xs text-stone-500">
                    Everything coordinated under Founder Tanvir Kabir Biplob’s personal oversight.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-red-600">Stage 1: Language Mastery & JLPT Prep (Dhaka / Online)</span>
                    <p className="text-stone-600">Complete JLPT N5/N4 through Nihomi and pass the NAT-TEST or JLPT in Dhaka.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-red-600">Stage 2: Japanese Language School Selection (Tokyo, Osaka, Nagoya, Fukuoka)</span>
                    <p className="text-stone-600">Select accredited language institutes matching your academic goals.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-red-600">Stage 3: 1-on-1 Admission Interview Coaching</span>
                    <p className="text-stone-600">Simulate principal interviews using Nihomi Interview Lab™ to guarantee admission.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-red-600">Stage 4: Certificate of Eligibility (COE) Filing</span>
                    <p className="text-stone-600">Document preparation, bank solvency, and legal submission to Tokyo Immigration.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-red-600">Stage 5: VFS Global Bangladesh Visa Submission</span>
                    <p className="text-stone-600">Official embassy file preparation and visa stamping.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-950">
                    <span className="font-bold text-emerald-800">Stage 6: Flight Ticketing & Airport Pickup (via bdTrip24.com)</span>
                    <p>46 KG luggage student flight booking, pre-departure orientation, and Japan airport pickup.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 sticky top-24">
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  Apply for Japan Language School & Visa Intake
                </h3>
                {visaSuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{visaSuccessMessage}</span>
                  </div>
                )}
                <form onSubmit={handleVisaSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+880 17XXXXXXXXX"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Target Intake</label>
                      <select
                        value={targetIntake}
                        onChange={(e) => setTargetIntake(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                      >
                        <option value="October 2026 Intake">October 2026 Intake</option>
                        <option value="January 2027 Intake">January 2027 Intake</option>
                        <option value="April 2027 Intake">April 2027 Intake</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Current Level</label>
                      <select
                        value={currentJapaneseLevel}
                        onChange={(e) => setCurrentJapaneseLevel(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                      >
                        <option value="N5">JLPT N5</option>
                        <option value="N4">JLPT N4</option>
                        <option value="N3">JLPT N3</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Preferred City in Japan</label>
                    <input
                      type="text"
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingVisa}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingVisa ? 'Submitting...' : 'Submit Admission & Visa Request'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BDTRIP24.COM AIR TICKETING */}
        {activeTab === 'bdtrip24' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-stone-900 text-white space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-xs font-bold">
                <Plane className="w-3.5 h-3.5" />
                <span>Official Travel Wing &bull; bdTrip24.com</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                Student Air Ticket Verification & Japan Arrival Concierge
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Nihomi students receive guaranteed subsidized airline fares (Dhaka to Tokyo / Osaka) with 46KG student baggage allowances, pre-departure luggage orientation, and airport pickup in Japan directly coordinated by bdTrip24.com.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-serif">Verify & Lock Student Flight Ticket</h3>
              {flightSuccessResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Student Ticket Verified! Booking Ref: {flightSuccessResult.bookingRef}</span>
                </div>
              )}
              <form onSubmit={handleFlightVerify} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Student Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Route</label>
                    <select
                      value={flightRoute}
                      onChange={(e) => setFlightRoute(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    >
                      <option value="Dhaka (DAC) -> Tokyo Narita (NRT)">Dhaka &rarr; Tokyo Narita (NRT)</option>
                      <option value="Dhaka (DAC) -> Tokyo Haneda (HND)">Dhaka &rarr; Tokyo Haneda (HND)</option>
                      <option value="Dhaka (DAC) -> Osaka Kansai (KIX)">Dhaka &rarr; Osaka Kansai (KIX)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isVerifyingFlight}
                  className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {isVerifyingFlight ? 'Verifying with bdTrip24 GDS...' : 'Verify Student Fare & Airport Pickup'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
