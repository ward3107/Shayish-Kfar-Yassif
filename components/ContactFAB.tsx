import React, { useState, useEffect, useRef } from 'react';
import { Phone, Instagram, Share2, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT, whatsappLink } from '../constants';

/**
 * Consolidated contact FAB. One button, tap to expand into Instagram /
 * WhatsApp / Call / Share. Replaces the old always-open stack of three
 * separate floating icons — cleaner, less cluttered, especially on mobile.
 *
 * Placement mirrors correctly in RTL/LTR. Closes on outside-click and Esc.
 */
const ContactFAB: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const waHref = whatsappLink(t('whatsapp.default_message'));

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Share the site — native share sheet where available (mobile), else
  // fall back to a WhatsApp "share this link" message (desktop).
  const handleShare = async () => {
    const shareData = {
      title: 'Shayish Kfar Yassif',
      text: t('fab.share_text'),
      url: 'https://shayish-yasif.co.il/',
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
    } catch {
      // user cancelled the share sheet — nothing to do
    }
    setOpen(false);
  };

  const actions = [
    {
      key: 'instagram',
      label: t('fab.instagram'),
      href: CONTACT.instagramUrl,
      className: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
      icon: <Instagram size={22} />,
    },
    {
      key: 'whatsapp',
      label: t('fab.whatsapp'),
      href: waHref,
      className: 'bg-[#25D366] text-white',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.746.456 3.45 1.32 4.951L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.207h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.648-1.03-5.138-2.902-7.01A9.872 9.872 0 0012.04 2z"/>
        </svg>
      ),
    },
    {
      key: 'phone',
      label: t('fab.call'),
      href: CONTACT.phoneTel,
      className: 'bg-accent text-white',
      icon: <Phone size={20} />,
    },
  ];

  return (
    <div
      ref={rootRef}
      className="fixed bottom-24 end-4 md:bottom-28 md:end-6 z-50 flex flex-col items-center gap-2 md:gap-3"
    >
      {/* Action buttons — revealed above the main FAB when open */}
      <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {actions.map((a) => (
          <a
            key={a.key}
            href={a.href}
            target={a.key === 'phone' ? undefined : '_blank'}
            rel={a.key === 'phone' ? undefined : 'noopener noreferrer'}
            aria-label={a.label}
            title={a.label}
            onClick={() => setOpen(false)}
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:scale-110 transition-transform ${a.className}`}
          >
            {a.icon}
          </a>
        ))}
        {/* Share the site */}
        <button
          type="button"
          onClick={handleShare}
          aria-label={t('fab.share')}
          title={t('fab.share')}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:scale-110 transition-transform bg-secondary text-light border border-divider"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Main toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t('fab.close') : t('fab.open')}
        title={open ? t('fab.close') : t('fab.open')}
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent text-white shadow-xl hover:brightness-110 transition-all"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ContactFAB;
