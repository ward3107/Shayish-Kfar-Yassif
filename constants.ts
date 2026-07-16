import { Testimonial } from './types';
import { Ruler, PenTool, Hammer, Truck, ShieldCheck, Phone } from 'lucide-react';

// TODO: replace placeholders below with the owner's real handles once the accounts exist.
// The whole site reads from this file — a single change here propagates everywhere.
const INSTAGRAM_HANDLE = 'shayish_kfar_yassif';

export const CONTACT = {
  whatsappNumber: '972500000000',
  phoneDisplay: '050-000-0000',
  phoneTel: '+972500000000',
  instagramHandle: INSTAGRAM_HANDLE,
  instagramUrl: `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;

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
