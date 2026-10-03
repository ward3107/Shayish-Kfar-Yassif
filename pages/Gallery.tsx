import React, { useEffect } from 'react';
import { Instagram, ArrowUpRight, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT } from '../constants';
import WhatsAppCTA from '../components/WhatsAppCTA';
import GalleryGrid from '../components/GalleryGrid';

const CATALOG_URL = '/catalog/shayish-kfar-yassif-catalog-v2.pdf';

const Gallery: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('gallery.title')} | ${t('meta.brand')}`;
  }, [t]);

  return (
    <div className="pt-28 md:pt-32 pb-20 bg-primary min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-6">
        <header className="mb-10 md:mb-14 border-b border-divider pb-8">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">{t('gallery.eyebrow')}</div>
          <h1 className="text-4xl md:text-6xl font-serif text-light mb-4">{t('gallery.title')}</h1>
          <p className="text-muted font-light max-w-2xl">{t('gallery.subtitle')}</p>
        </header>

        {/* Owner-curated project media, powered by Cloudinary. */}
        <section className="mb-16">
          <GalleryGrid />
        </section>

        {/* Secondary actions — WhatsApp (primary), catalog, and a real
            Instagram link. No phone-mock, no fabricated content. */}
        <section className="border-t border-divider pt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent mb-2">{t('whatsapp.title')}</div>
            <p className="text-light text-lg md:text-xl font-serif max-w-xl mb-6">{t('whatsapp.description')}</p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={CATALOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm uppercase tracking-widest"
              >
                <FileText size={16} />
                <span>{t('home.view_catalog')}</span>
              </a>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm uppercase tracking-widest"
              >
                <Instagram size={16} />
                <span>@{CONTACT.instagramHandle}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <div>
            <WhatsAppCTA />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gallery;
