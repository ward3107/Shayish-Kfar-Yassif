import React from 'react';
import { Phone, MessageCircle, Instagram } from 'lucide-react';

const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-32 left-6 z-50 flex flex-col gap-4">
      {/* Instagram Button */}
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg opacity-50 hover:opacity-100 hover:brightness-110 transition-all duration-300 hover:scale-110"
        aria-label="Follow on Instagram"
      >
        <Instagram size={28} />
      </a>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/972500000000"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg opacity-50 hover:opacity-100 hover:bg-green-600 transition-all duration-300 hover:scale-110"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Call Button (Mobile mostly, but useful on desktop too) */}
      <a
        href="tel:+972500000000"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-lg opacity-50 hover:opacity-100 hover:bg-yellow-600 transition-all duration-300 hover:scale-110"
        aria-label="Call Now"
      >
        <Phone size={24} />
      </a>
    </div>
  );
};

export default FloatingActions;
