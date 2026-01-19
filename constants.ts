import { Project, Testimonial, FaqItem, ProcessStep } from './types';
import { Ruler, PenTool, Hammer, Truck, ShieldCheck, Phone } from 'lucide-react';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Minimalist Matte Black",
    category: "Modern",
    image: "https://picsum.photos/seed/k1/800/600",
    description: "Sleek handleless design with nano-tech matte finish."
  },
  {
    id: 2,
    title: "Provence White Oak",
    category: "Classic",
    image: "https://picsum.photos/seed/k2/800/600",
    description: "Timeless classic design with natural oak elements."
  },
  {
    id: 3,
    title: "Gold & Marble Fusion",
    category: "Luxury",
    image: "https://picsum.photos/seed/k3/800/600",
    description: "Premium Italian marble countertops paired with brass accents."
  },
  {
    id: 4,
    title: "Urban Industrial",
    category: "Modern",
    image: "https://picsum.photos/seed/k4/800/600",
    description: "Concrete textures and open shelving for a loft vibe."
  },
  {
    id: 5,
    title: "Country Farmhouse",
    category: "Classic",
    image: "https://picsum.photos/seed/k5/800/600",
    description: "Warm tones, shaker doors, and a spacious island."
  },
  {
    id: 6,
    title: "Penthouse Suite",
    category: "Luxury",
    image: "https://picsum.photos/seed/k6/800/600",
    description: "High-gloss finish with integrated smart appliances."
  }
];

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

export const FAQS: FaqItem[] = [
  {
    question: "Do you offer a warranty?",
    answer: "Yes, we offer a comprehensive 10-year warranty on all our cabinets and hardware, ensuring peace of mind for years to come."
  },
  {
    question: "What is the typical production time?",
    answer: "Our standard production time is between 6 to 8 weeks from the final measurement, depending on the complexity of the design and materials selected."
  },
  {
    question: "Do you provide 3D designs?",
    answer: "Absolutely! Our design consultation includes a detailed 3D rendering of your future kitchen so you can visualize every detail before production begins."
  },
  {
    question: "Do you serve all of Israel?",
    answer: "Yes, we install kitchens nationwide, from the north to the south."
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
