import { Testimonial } from './types';
import { Ruler, PenTool, Hammer, Truck, ShieldCheck, Phone } from 'lucide-react';

// ============================================================================
// TODO — REAL VALUES NEEDED BEFORE PRODUCTION
// ----------------------------------------------------------------------------
// Every field marked PLACEHOLDER below is fake data. The site renders it, but
// visitors will see nonsense phone numbers, a fake Instagram handle, and
// (until TESTIMONIALS_ENABLED is flipped) no customer reviews at all.
//
// Fake testimonials on a live commercial site can constitute misleading
// advertising under Israeli consumer protection law — keep TESTIMONIALS_ENABLED
// = false until real, attributed reviews exist.
// ============================================================================

// PLACEHOLDER — no real Instagram account yet. Change this ONE line and every
// icon / link / handle text across the site updates automatically.
const INSTAGRAM_HANDLE = 'shayish_kfar_yassif';

// Optional: once the real Instagram account exists, sign up at lightwidget.com
// (free tier: 200 views/day, no auth required), create a widget for the account,
// and paste the widget ID here. When set, the Home & Gallery pages render a
// live-updating Instagram feed instead of the placeholder tiles/mock. Leave
// empty to keep the current placeholder look.
export const INSTAGRAM_LIGHTWIDGET_ID = '';

export const CONTACT = {
  // PLACEHOLDER — replace with the real WhatsApp number (country code, digits only, no +).
  whatsappNumber: '972500000000',
  // PLACEHOLDER — display format shown to visitors.
  phoneDisplay: '050-000-0000',
  // PLACEHOLDER — tel: link format (E.164).
  phoneTel: '+972500000000',
  instagramHandle: INSTAGRAM_HANDLE,
  instagramUrl: `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
};

// Flip to true once TESTIMONIALS below are replaced with real, attributed reviews.
export const TESTIMONIALS_ENABLED = false;

// Ambient background tracks for the floating music player. Placeholders point
// at SoundHelix (free, CC-licensed demo tracks) — they play reliably but are
// generic algorithmic tunes, not curated marble/showroom ambience. Replace
// the URLs with self-hosted MP3s once the owner picks the real soundtrack.
export const MUSIC_TRACKS: Array<{ title: string; src: string }> = [
  { title: 'Ambient Track 1', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Ambient Track 2', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { title: 'Ambient Track 3', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
];
// Default starting volume — 0.16 was the last value the previous player shipped with.
export const MUSIC_DEFAULT_VOLUME = 0.16;

// Showroom opening hours — used by the header status pill to show a live
// open/closed indicator. Times are 24h in Asia/Jerusalem.
// TODO: replace with the real showroom hours. Empty array = closed that day.
// dayOfWeek: 0=Sunday, 1=Monday ... 5=Friday, 6=Saturday
export const BUSINESS_HOURS: Array<{ dayOfWeek: number; open: string; close: string } | null> = [
  { dayOfWeek: 0, open: '08:00', close: '18:00' }, // Sunday
  { dayOfWeek: 1, open: '08:00', close: '18:00' }, // Monday
  { dayOfWeek: 2, open: '08:00', close: '18:00' }, // Tuesday
  { dayOfWeek: 3, open: '08:00', close: '18:00' }, // Wednesday
  { dayOfWeek: 4, open: '08:00', close: '18:00' }, // Thursday
  { dayOfWeek: 5, open: '08:00', close: '13:00' }, // Friday (short day)
  null,                                             // Saturday (closed)
];
export const BUSINESS_TIMEZONE = 'Asia/Jerusalem';

export const whatsappLink = (message: string) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;

// PLACEHOLDERS — the names, cities, and text below are fabricated. Do NOT
// display these on a public site. Replace with real, attributed customer
// testimonials (with permission), then set TESTIMONIALS_ENABLED = true above.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Cohen",
    location: "Tel Aviv",
    text: "Absolutely in love with my new kitchen! The team was professional from the first design meeting to the final installation. The quality is unmatched.",
    rating: 5
  },
  {
    id: 2,
    name: "David Levi",
    location: "Rishon LeTsiyon",
    text: "We visited many showrooms, but the personal attention and the factory-direct pricing here won us over. Highly recommended.",
    rating: 5
  },
  {
    id: 3,
    name: "Michal Golan",
    location: "Haifa",
    text: "The process was so smooth. They finished ahead of schedule and the kitchen looks exactly like the 3D render.",
    rating: 5
  }
];

export const PROCESS_STEPS = [
  {
    title: "Consultation",
    description: "We meet to discuss your vision, needs, and budget.",
    Icon: Phone
  },
  {
    title: "Design & Plan",
    description: "Our designers create a custom 3D plan for your space.",
    Icon: PenTool
  },
  {
    title: "Measurements",
    description: "Precise laser measurements are taken at your home.",
    Icon: Ruler
  },
  {
    title: "Production",
    description: "Your kitchen is crafted in our advanced factory.",
    Icon: Hammer
  },
  {
    title: "Installation",
    description: "Professional delivery and installation by our expert team.",
    Icon: Truck
  },
  {
    title: "Warranty",
    description: "Enjoy your kitchen with our full support and warranty.",
    Icon: ShieldCheck
  }
];
