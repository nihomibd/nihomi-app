/**
 * NIHOMI.COM — Centralized Contact & Ecosystem Configuration
 * Official bKash MFS & WhatsApp Verification Gateway
 */

export const NIHOMI_CONTACT = {
  // Official Contact Numbers
  phone: '+880 1834-348966',
  phoneFormatted: '+880 1834-348966',
  phoneRaw: '+8801834348966',
  
  // Official bKash Payment Details
  bkashNumber: '01834348966',
  bkashNumberFormatted: '+8801834-348966',
  bkashAccountType: 'Personal / Merchant Send Money',
  
  // Official WhatsApp Business Bridge
  whatsappNumber: '8801834348966',
  whatsappFormatted: '+880 1834-348966',
  
  // Emails
  email: 'support@nihomi.com',
  admissionsEmail: 'admissions@nihomi.com',
  corporateEmail: 'b2b@nihomi.com',
  
  // Locations & Ecosystem
  locationBn: 'বনানী রোড ১১, ঢাকা, বাংলাদেশ এবং শিঞ্জুকু, টোকিও, জাপান',
  locationEn: 'Banani Road 11, Dhaka, Bangladesh & Shinjuku, Tokyo, Japan',
  partnerEcosystem: 'bdTrip24 Ecosystem',
  
  // 1-Click WhatsApp Verification Generator
  getWhatsAppTrxVerificationUrl: (trxId: string, planName: string = 'Pro'): string => {
    const cleanTrx = trxId ? trxId.trim().toUpperCase() : '[USER_TRXID]';
    return `https://wa.me/8801834348966?text=Hello%20Nihomi%2C%20I%20have%20paid%20via%20bKash.%20My%20TrxID%20is:%20${encodeURIComponent(cleanTrx)}`;
  },

  // General Support URL
  getWhatsAppSupportUrl: (customMessage?: string): string => {
    const message = customMessage || 'Hello Nihomi Sensei, I want to learn Japanese and prepare for JLPT N5!';
    return `https://wa.me/8801834348966?text=${encodeURIComponent(message)}`;
  }
};

export default NIHOMI_CONTACT;
