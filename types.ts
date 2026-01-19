export interface Project {
  id: number;
  title: string;
  category: 'Modern' | 'Classic' | 'Luxury';
  image: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}
