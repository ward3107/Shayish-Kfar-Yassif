import React, { useEffect } from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT } from '../constants';

const Gallery: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('gallery.title')} | שיש כפר יאסיף - Shayish Kfar Yassif`;
  }, [t]);

  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-6">
        <header className="mb-16 border-b border-neutral-800 pb-8">
          <h1 className="text-5xl md:text-7xl font-serif text-light mb-4">{t('gallery.title')}</h1>
          <p className="text-muted font-light max-w-2xl">{t('gallery.subtitle')}</p>
        </header>

        {/* Instagram hero card — the whole page's single call to action. */}
        <section className="relative overflow-hidden rounded-sm border border-neutral-800 bg-gradient-to-br from-secondary via-primary to-secondary">
          {/* Soft accent glow */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: message */}
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest mb-6">
                <Instagram size={16} />
                <span>Instagram</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-light leading-tight mb-6">
                {t('gallery.subtitle')}
              </h2>
              <p className="text-muted font-light mb-10">
                {t('gallery.handle_note')}
              </p>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 self-start bg-accent text-primary px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-light transition-colors"
              >
                <Instagram size={18} />
                <span>{t('gallery.instagram_cta')}</span>
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Right: visual — Instagram phone-mock preview.
                Once the real account exists, swap this block for a live feed embed
                (e.g. LightWidget iframe, or Instagram oEmbed of a pinned reel). */}
            <div className="relative min-h-[320px] md:min-h-[520px] flex items-center justify-center p-10 border-t md:border-t-0 md:border-s border-neutral-800">
              <div className="relative w-full max-w-[280px] aspect-[9/16] bg-primary border border-neutral-700 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent/40" aria-hidden="true" />
                  <div className="text-[10px] text-light font-bold">@{CONTACT.instagramHandle}</div>
                </div>
                <div className="grid grid-cols-3 gap-[2px] p-[2px]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent" />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="text-[9px] text-muted uppercase tracking-widest">Live feed preview</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary CTA — mobile-friendly big button at the bottom */}
        <div className="mt-12 text-center">
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm uppercase tracking-widest"
          >
            <span>@{CONTACT.instagramHandle}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
