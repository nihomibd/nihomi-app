/**
 * NIHOMI.COM — OFFICIAL PRODUCTION CONTACT CONFIGURATION
 * Single Source of Truth for all contact, support, and founder credentials.
 * LOCKED BY FOUNDER: Tanvir Kabir Biplob
 */

export const NIHOMI_CONTACT = {
  phone: {
    raw: "+8801834-348966",
    display: "+880 1834-348966",
    tel: "+8801834348966",
  },
  whatsapp: {
    number: "+8801834-348966",
    cleanNumber: "8801834348966",
    url: "https://wa.me/8801834348966",
    supportUrl: "https://wa.me/8801834348966?text=Hello%20Nihomi%20Support%2C%20I%20need%20assistance",
    cohortUrl: "https://wa.me/8801834348966?text=Hello%20Nihomi%2C%20I%20want%20to%20join%20the%20N5%20Cohort",
  },
  supportEmail: "nihomibd@gmail.com",
  supportMailto: "mailto:nihomibd@gmail.com",
  founderEmail: "mdtanvirkabirbiplob@gmail.com",
  founderMailto: "mailto:mdtanvirkabirbiplob@gmail.com",
  brand: {
    name: "NIHOMI.COM",
    legalName: "Nihomi Japanese Learning Platform",
    parentEcosystem: "bdTrip24.com",
    address: "Dhaka, Bangladesh",
    supportHours: "24/7 Student & WhatsApp Helpdesk",
  }
} as const;

export default NIHOMI_CONTACT;
