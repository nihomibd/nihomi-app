/**
 * NIHOMI.COM — Centralized Contact & Ecosystem Configuration
 * Official bKash MFS & WhatsApp Verification Gateway
 */

export interface ContactConfig {
  phone: string;
  phoneFormatted: string;
  phoneRaw: string;
  helpline: string;
  bkashNumber: string;
  bkashNumberFormatted: string;
  bkashAccountType: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  whatsappDefaultMessage: string;
  email: string;
  admissionsEmail: string;
  corporateEmail: string;
  officeLocationBn: string;
  officeLocationEn: string;
  locationBn: string;
  locationEn: string;
  partnerEcosystem: string;
  getWhatsAppTrxVerificationUrl: (trxId?: string, planName?: string) => string;
  getWhatsAppSupportUrl: (customMessage?: string) => string;
}

export const NIHOMI_CONTACT: ContactConfig = {
  // Official Contact Numbers & 24/7 Helpline
  phone: '+880 1800-644664',
  phoneFormatted: '+880 1800-644664',
  phoneRaw: '01800644664',
  helpline: '01800644664',
  
  // Official bKash Payment Details
  bkashNumber: '01800644664',
  bkashNumberFormatted: '+880 1800-644664',
  bkashAccountType: 'Personal / Merchant Send Money',
  
  // Official WhatsApp Business Bridge
  whatsappNumber: '8801800644664',
  whatsappFormatted: '+880 1800-644664',
  whatsappDefaultMessage: 'হ্যালো নিহোমি! আমি JLPT N5 কোর্সে ভর্তি হতে চাই / পেমেন্ট সংক্রান্ত তথ্য জানতে চাই।',
  
  // Emails
  email: 'support@nihomi.com',
  admissionsEmail: 'admissions@nihomi.com',
  corporateEmail: 'b2b@nihomi.com',
  
  // Locations & Ecosystem
  officeLocationBn: 'বিটিআই সেন্ট্রাল প্লাজা, ফার্মগেট, ঢাকা - ১২১৫',
  officeLocationEn: 'BTI Central Plaza, Farmgate, Dhaka - 1215',
  locationBn: 'বিটিআই সেন্ট্রাল প্লাজা, ফার্মগেট, ঢাকা এবং শিঞ্জুকু, টোকিও, জাপান',
  locationEn: 'BTI Central Plaza, Farmgate, Dhaka & Shinjuku, Tokyo, Japan',
  partnerEcosystem: 'Nihomi Japan Learning Ecosystem',
  
  // 1-Click WhatsApp Verification Generator
  getWhatsAppTrxVerificationUrl: (trxId?: string, _planName: string = 'Pro'): string => {
    const cleanTrx = trxId && typeof trxId === 'string' ? trxId.trim().toUpperCase() : '[USER_TRXID]';
    return `https://wa.me/8801800644664?text=Hello%20Nihomi%2C%20I%20have%20paid%20via%20bKash.%20My%20TrxID%20is:%20${encodeURIComponent(cleanTrx)}`;
  },

  // General Support URL
  getWhatsAppSupportUrl: (customMessage?: string): string => {
    const message = customMessage || 'হ্যালো নিহোমি! আমি JLPT N5 কোর্সে ভর্তি হতে চাই / পেমেন্ট সংক্রান্ত তথ্য জানতে চাই।';
    return `https://wa.me/8801800644664?text=${encodeURIComponent(message)}`;
  }
};

export default NIHOMI_CONTACT;
