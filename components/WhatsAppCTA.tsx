import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT, whatsappLink } from '../constants';

interface WhatsAppCTAProps {
  variant?: 'card' | 'inline';
}

const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({ variant = 'card' }) => {
  const { t, dir } = useLanguage();
  const href = whatsappLink(t('whatsapp.default_message'));

  if (variant === 'inline') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 text-sm uppercase tracking-widest font-medium border border-[#25D366] hover:bg-transparent hover:text-[#25D366] transition-all duration-500"
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span>{t('whatsapp.chat')}</span>
      </a>
    );
  }

  return (
    <div className="bg-secondary p-8 md:p-12 border border-neutral-800 relative overflow-hidden transition-colors duration-300">
      <div className={`absolute top-0 w-[1px] h-20 bg-accent ${dir === 'rtl' ? 'right-12' : 'left-12'}`}></div>

      <h3 className="text-3xl font-serif text-light mb-2">{t('whatsapp.title')}</h3>
      <p className="text-muted mb-10 text-sm tracking-wide leading-relaxed">
        {t('whatsapp.description')}
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 text-sm uppercase tracking-widest font-medium border border-[#25D366] hover:bg-transparent hover:text-[#25D366] transition-all duration-500"
        aria-label={t('whatsapp.chat')}
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span>{t('whatsapp.chat')}</span>
      </a>

      <div className="mt-10 pt-8 border-t border-neutral-800 text-center">
        <div className="text-xs uppercase tracking-widest text-muted mb-3">
          {t('whatsapp.or_call')}
        </div>
        <a
          href={CONTACT.phoneTel}
          className="text-2xl font-serif text-light hover:text-accent transition-colors"
          dir="ltr"
        >
          {CONTACT.phoneDisplay}
        </a>
      </div>
    </div>
  );
};

export default WhatsAppCTA;
