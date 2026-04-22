import React from 'react';
import { Phone, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT, whatsappLink } from '../constants';

const FloatingActions: React.FC = () => {
  const { t } = useLanguage();
  const waHref = whatsappLink(t('whatsapp.default_message'));

  return (
    <div className="fixed bottom-32 left-6 z-50 flex flex-col gap-4">
      <a
        href={CONTACT.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg opacity-60 hover:opacity-100 hover:brightness-110 transition-all duration-300 hover:scale-110"
        aria-label="Follow on Instagram"
      >
        <Instagram size={28} />
      </a>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110"
        aria-label={t('whatsapp.chat')}
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.746.456 3.45 1.32 4.951L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.207h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.648-1.03-5.138-2.902-7.01A9.872 9.872 0 0012.04 2zm0 18.03h-.003a8.23 8.23 0 01-4.192-1.148l-.301-.179-3.117.818.833-3.04-.196-.312a8.19 8.19 0 01-1.257-4.36c0-4.537 3.692-8.23 8.234-8.23 2.197 0 4.263.857 5.816 2.41a8.177 8.177 0 012.413 5.822c-.002 4.537-3.695 8.23-8.23 8.23z"/>
        </svg>
      </a>

      <a
        href={CONTACT.phoneTel}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-lg opacity-60 hover:opacity-100 hover:bg-yellow-600 transition-all duration-300 hover:scale-110"
        aria-label="Call Now"
      >
        <Phone size={24} />
      </a>
    </div>
  );
};

export default FloatingActions;
