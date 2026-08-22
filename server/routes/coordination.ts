// server/routes/coordination.ts
import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';

export const coordinationRouter = Router();

// ==========================================
// 1. NIHOMI LIVE (ONLINE CLASSES WITH FOUNDER & NATIVE SENSEI)
// ==========================================
coordinationRouter.get('/live-cohorts', optionalAuth, (req: AuthenticatedRequest, res) => {
  const cohorts = [
    {
      id: 'cohort-live-n5-01',
      title: 'JLPT N5 Weekend Live Masterclass',
      titleJa: 'JLPT N5 週末ライブ集中講座',
      instructor: 'Tanvir Kabir Biplob (Founder) & Sato Sensei (Tokyo)',
      schedule: 'Every Friday & Saturday, 8:30 PM - 10:00 PM (BST)',
      durationWeeks: 12,
      totalLiveHours: 36,
      seatsTotal: 25,
      seatsEnrolled: 19,
      level: 'N5',
      platform: 'Nihomi Live Interactive Video Engine',
      features: [
        'Direct speech correction by Founder & Native Tokyo Mentor',
        'Live interactive Kanji stroke & pronunciation drills',
        'Weekly recorded lecture archive with lifetime access',
        'Private Telegram & Discord coordination group',
        'Direct admission credit for Dhaka International Language School'
      ],
      priceBDT: 3490,
      proDiscountBDT: 2490
    },
    {
      id: 'cohort-live-n4-01',
      title: 'JLPT N4 Conversational & Grammar Accelerator',
      titleJa: 'JLPT N4 会話・文法総合ライブ',
      instructor: 'Kenji Tanaka (Senior Instructor, Waseda Univ. Alum)',
      schedule: 'Every Sunday & Tuesday, 9:00 PM - 10:30 PM (BST)',
      durationWeeks: 14,
      totalLiveHours: 42,
      seatsTotal: 20,
      seatsEnrolled: 14,
      level: 'N4',
      platform: 'Nihomi Live Interactive Video Engine',
      features: [
        'Focus on Giving/Receiving verbs, Conditionals, and Keigo',
        'Mock oral interview simulations for Japanese Language Institutes',
        'JLPT N4 simulated speed drill tests with error analysis'
      ],
      priceBDT: 4490,
      proDiscountBDT: 3490
    }
  ];
  return res.json({ success: true, cohorts });
});

// ==========================================
// 2. DHAKA INTERNATIONAL LANGUAGE SCHOOL (CLASSROOM & VISA/COE)
// ==========================================
coordinationRouter.get('/dhaka-campus/programs', optionalAuth, (req: AuthenticatedRequest, res) => {
  const programs = {
    campusName: 'Dhaka International Language School (Official Bangladesh Partner of Nihomi)',
    address: 'House 42, Road 11, Block E, Banani / Dhanmondi Campus, Dhaka, Bangladesh',
    contactPhone: '+880 1700-NIHOMI / +880 1800-DILS',
    admissionStatus: 'Open for July & October Intake Sessions',
    programs: [
      {
        id: 'prog-offline-n5-n4',
        name: 'Intensive Physical Classroom Course (N5 & N4)',
        nameJa: 'ダッカ対面集中日本語コース',
        duration: '4 Months (Sunday to Thursday, 2 Hours/Day)',
        classroomFeatures: [
          'Air-conditioned multimedia classrooms with native audio acoustic equipment',
          'Physical textbooks, character grids, and vocabulary flashcard kits',
          'Weekly physical JLPT mock examinations under exam conditions',
          'Direct mentorship by certified Japanese language graduates'
        ],
        tuitionFeeBDT: 14500,
        includesOnlineProSubscription: true
      },
      {
        id: 'prog-japan-visa-pathway',
        name: 'Complete Japan Student Visa & COE Coordination Package',
        nameJa: '日本留学・在留資格認定証明書 (COE) 総合サポート',
        targetIntakes: ['April Intake', 'July Intake', 'October Intake', 'January Intake'],
        scope: [
          'Stage 1: JLPT / NAT-TEST preparation and exam registration in Dhaka',
          'Stage 2: Japanese Language School & University Selection across Tokyo, Osaka, Nagoya, Fukuoka',
          'Stage 3: 1-on-1 Interview Coaching for Japanese School Admissions Interviews',
          'Stage 4: Complete Document Verification, Translation, and Certificate of Eligibility (COE) Submission to Tokyo Immigration',
          'Stage 5: VFS Global Bangladesh Visa Application file preparation & embassy submission',
          'Stage 6: Visa Grant & Delivery under Founder Tanvir Kabir Biplob’s personal supervision'
        ],
        coordinationFeeBDT: 'Transparent Consultation & Zero Hidden Markups'
      }
    ]
  };
  return res.json({ success: true, programs });
});

// Submit COE / Student Visa Coordination Inquiry
coordinationRouter.post('/dhaka-campus/apply-visa', requireAuth, (req: AuthenticatedRequest, res) => {
  const {
    fullName,
    phoneNumber,
    educationBackground,
    targetIntake,
    targetCity,
    currentJapaneseLevel,
    passportNumber,
    notes
  } = req.body;

  const applicationRecord = {
    id: `coe-app-${Date.now()}`,
    userId: req.user!.id,
    userEmail: req.user!.email,
    fullName: fullName || req.user!.email,
    phoneNumber,
    educationBackground,
    targetIntake: targetIntake || 'October Intake',
    targetCity: targetCity || 'Tokyo',
    currentJapaneseLevel: currentJapaneseLevel || 'N5 Studying',
    passportNumber,
    notes,
    status: 'application_received',
    coordinationDesk: 'Dhaka International Language School - Japan Visa Wing',
    assignedCounselor: 'Tanvir Kabir Biplob (Founder Lead Desk)',
    createdAt: new Date().toISOString()
  };

  return res.json({
    success: true,
    message: 'Your Japan Language School & Student Visa application has been received! Our senior counselor at Dhaka International Language School will contact you within 24 hours.',
    application: applicationRecord
  });
});

// ==========================================
// 3. BDTRIP24.COM (STUDENT AIR TICKETING & AIRPORT PICKUP)
// ==========================================
coordinationRouter.get('/bdtrip24/japan-flights', optionalAuth, (req: AuthenticatedRequest, res) => {
  const routes = [
    {
      id: 'flight-dac-nrt-01',
      airline: 'Biman Bangladesh Airlines / Singapore Airlines / Thai Airways',
      origin: 'Dhaka (DAC) - Hazrat Shahjalal International Airport',
      destination: 'Tokyo Narita (NRT) / Tokyo Haneda (HND)',
      studentLuggageAllowance: '46 KG (2 Pieces x 23 KG) + 7 KG Cabin',
      standardFareBDT: 82000,
      nihomiStudentSpecialFareBDT: 68500,
      partnerEngine: 'bdTrip24.com (Official Travel Partner of Nihomi)',
      features: [
        'Special Student Luggage Waiver Assistance',
        'Direct ticket verification on bdTrip24.com portal',
        'Emergency flight rescheduling support for visa delay',
        'Tokyo Narita / Haneda Airport Meet & Greet coordination'
      ]
    },
    {
      id: 'flight-dac-kix-01',
      airline: 'Cathay Pacific / Malaysia Airlines',
      origin: 'Dhaka (DAC)',
      destination: 'Osaka Kansai (KIX) / Nagoya Chubu (NGO)',
      studentLuggageAllowance: '46 KG + 7 KG Cabin',
      standardFareBDT: 85000,
      nihomiStudentSpecialFareBDT: 71000,
      partnerEngine: 'bdTrip24.com',
      features: [
        'Kansai Airport Pickup & Direct Dormitory Transfer Coordination'
      ]
    }
  ];
  return res.json({ success: true, routes });
});

// Verify / Book Flight via bdTrip24
coordinationRouter.post('/bdtrip24/verify-ticket', requireAuth, (req: AuthenticatedRequest, res) => {
  const { studentName, flightRoute, departureDate, passportNumber, airportPickupRequired, japanDormitoryAddress } = req.body;
  
  const bookingTicket = {
    bookingRef: `BDT24-NIH-${Math.floor(100000 + Math.random() * 900000)}`,
    studentId: req.user!.id,
    studentName,
    flightRoute: flightRoute || 'Dhaka (DAC) -> Tokyo Narita (NRT)',
    departureDate: departureDate || '2026-09-25',
    passportNumber,
    airportPickupRequired: airportPickupRequired ?? true,
    japanDormitoryAddress: japanDormitoryAddress || 'Tokyo International Student House, Shinjuku-ku, Tokyo',
    status: 'verified_discount_locked',
    verificationPortal: 'https://bdtrip24.com/verify-student-ticket',
    managedBy: 'bdTrip24.com Corporate Air Ticketing Wing (Under Founder Supervision)',
    createdAt: new Date().toISOString()
  };

  return res.json({
    success: true,
    message: 'Flight quotation verified with bdTrip24 student discount. Airport pickup logistics logged.',
    booking: bookingTicket
  });
});
