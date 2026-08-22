import React, { useState } from 'react';
import {
  Plane,
  Train,
  Building2,
  Phone,
  ShieldCheck,
  Download,
  CheckCircle2,
  Luggage,
  MapPin,
  Clock,
  Sparkles,
  Printer,
  Volume2
} from 'lucide-react';
import jsPDF from 'jspdf';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext.js';

interface Day1BlueprintViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const Day1BlueprintView: React.FC<Day1BlueprintViewProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const studentName = profile?.displayName || 'Tanvir Kabir Biplob';

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(12, 24, 43);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, pageWidth, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('JAPAN DAY-1 ARRIVAL BLUEPRINT™', 20, 18);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Coordinated by Nihomi.com & bdTrip24.com Travel Wing', 20, 24);

    doc.setTextColor(24, 24, 27);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Passenger: ${studentName}`, 20, 50);
    doc.setFontSize(9);
    doc.text('Flight: Dhaka (DAC) -> Tokyo Narita (NRT) | Baggage: 46 KG Allowed', 20, 57);

    doc.setDrawColor(228, 228, 231);
    doc.line(20, 65, pageWidth - 20, 65);

    doc.setFontSize(10);
    doc.text('1. Narita Airport Arrival Steps:', 20, 75);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('• Step A: Hand over Passport and COE to Immigration Inspector.', 25, 82);
    doc.text('• Step B: Receive your Resident Card (在留カード) stamped with Part-time Work Permission.', 25, 88);
    doc.text('• Step C: Retrieve 2 check-in bags (23kg x 2) at Luggage Carousel.', 25, 94);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Shinjuku / Dormitory Transit & Pickup:', 20, 110);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('• bdTrip24 Driver Meet & Greet Point: Narita Terminal 1, Arrival Exit South 2.', 25, 117);
    doc.text('• Dormitory Address: Tokyo International Student House, Takadanobaba.', 25, 123);

    doc.save(`Japan-Day1-Blueprint-${studentName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="day1-blueprint-view">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold">
              <Plane className="w-3.5 h-3.5" />
              <span>Nihomi & bdTrip24.com &bull; First 24 Hours in Japan</span>
            </div>
            <h1 className="text-3xl font-extrabold font-serif tracking-tight">
              Japan Day-1 Arrival Blueprint™
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              নারিতা/হানেদা বিমানবন্দরে ল্যান্ড করার পর থেকে ডরমিটরিতে পৌঁছানো পর্যন্ত প্রথম ২৪ ঘণ্টার ব্যক্তিগত গাইড ও ইমিগ্রেশন ডিক্লারেশন পাস।
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Arrival Pass (PDF)</span>
          </button>
        </div>

        {/* 4 Interactive Day-1 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Airport Immigration */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Step 1: Narita Airport Immigration</span>
            </div>
            <h3 className="font-bold text-lg text-stone-900 font-serif">ইমিগ্রেশন কাউন্টার ডায়ালগ</h3>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <p className="font-serif font-bold text-stone-900 text-sm">「留学で来ました。資格外活動許可もお願いします。」</p>
                <button onClick={() => speakJapanese('留学で来ました。資格外活動許可もお願いします。')} className="text-stone-400 hover:text-red-600">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-stone-500 font-mono text-[11px]">Ryuugaku de kimashita. Shikakugai katsudou kyoka mo onegai shimasu.</p>
              <p className="text-emerald-800 font-semibold">বাংলা: "আমি পড়াশোনার জন্য এসেছি। পার্ট-টাইম কাজের অনুমতির সিলটিও দিয়ে দিন।"</p>
            </div>
          </div>

          {/* Card 2: Transit & Suica */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Train className="w-4 h-4" />
              <span>Step 2: Suica Card & Train Route</span>
            </div>
            <h3 className="font-bold text-lg text-stone-900 font-serif">ট্রেন ও সাবওয়ে নেভিগেশন</h3>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <p className="font-bold text-stone-900">Narita Airport Terminal 1 &rarr; Nippori &rarr; Takadanobaba</p>
              <p className="text-stone-600">রুট: Keisei Skyliner দিয়ে Nippori স্টেশন, এরপর JR Yamanote Line দিয়ে ডরমিটরি স্টেশন।</p>
            </div>
          </div>

          {/* Card 3: bdTrip24 Airport Pickup */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <Luggage className="w-4 h-4" />
              <span>Step 3: bdTrip24 Airport Meet & Greet</span>
            </div>
            <h3 className="font-bold text-lg text-stone-900 font-serif">এয়ারপোর্ট পিকআপ ভেরিফিকেশন</h3>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-emerald-950">
              <p className="font-bold">Booking Ref: BDT24-TOKYO-PICKUP</p>
              <p>ড্রাইভার আপনাকে টার্মিনাল এক্সিটে নিহোমির প্ল্যাকার্ড নিয়ে রিসিভ করবেন এবং ডরমিটরিতে ড্রপ করবেন।</p>
            </div>
          </div>

          {/* Card 4: Emergency Contacts */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
              <Phone className="w-4 h-4" />
              <span>Step 4: Emergency Contacts in Tokyo</span>
            </div>
            <h3 className="font-bold text-lg text-stone-900 font-serif">জরুরি হেল্পলাইন নম্বর</h3>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs text-stone-700 font-mono">
              <p>Police: 110 &bull; Ambulance: 119</p>
              <p>Nihomi Tokyo Desk: +81 80-XXXX-XXXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
