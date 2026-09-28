import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import WhatsAppCTA from '../components/WhatsAppCTA';
import GalleryGrid from '../components/GalleryGrid';
import { CONTACT, whatsappLink } from '../constants';
import { HERO_PUBLIC_ID, heroUrl, imgUrl, imgSrcSet } from '../lib/galleryData';
import { ArrowLeft, FileText, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CATALOG_URL = '/catalog/shayish-kfar-yassif-catalog.pdf';
// A single, intentional statement image (real project — kitchen island).
const STATEMENT_ID = 'shayish/gallery/IMG-20260718-WA0017';

const Home: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') document.title = t('meta.home_title');
  }, [location.pathname, t]);

  const scrollToGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('gallery');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const Arrow = dir === 'rtl' ? ArrowLeft : (props: React.ComponentProps<typeof ArrowLeft>) => <ArrowLeft {...props} style={{ transform: 'rotate(180deg)' }} />;

  return (
    <div className="flex flex-col">
      {/* ── Hero — short, one fixed real project image, minimal copy ── */}
      <section className="relative h-[62svh] min-h-[440px] max-h-[760px] flex items-center justify-center overflow-hidden">
        <img
          src={heroUrl(HERO_PUBLIC_ID, 1920, 1080)}
          srcSet={`${heroUrl(HERO_PUBLIC_ID, 800, 700)} 800w, ${heroUrl(HERO_PUBLIC_ID, 1280, 800)} 1280w, ${heroUrl(HERO_PUBLIC_ID, 1920, 1080)} 1920w, ${heroUrl(HERO_PUBLIC_ID, 2400, 1300)} 2400w`}
          sizes="100vw"
          alt={t('hero.image_alt')}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" aria-hidden />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-5 border border-white/30 px-4 py-1 rounded-full backdrop-blur-sm">
            <span className="text-[11px] uppercase tracking-widest text-gray-200">{t('hero.est')}</span>
          </div>

          <h1 className="mb-4 flex flex-col items-center">
            <span className="text-4xl md:text-6xl font-serif text-white tracking-wide">שיש כפר יאסיף</span>
            <span className="text-xs md:text-sm text-gray-300 uppercase tracking-[0.3em] mt-2">Shayish Kfar Yassif</span>
          </h1>

          <p className="text-base md:text-xl text-gray-100 mb-9 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#gallery" onClick={scrollToGallery}>
              <Button variant="gold" size="lg">{t('hero.view_works')}</Button>
            </a>
            <a href={whatsappLink(t('whatsapp.default_message'))} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">{t('whatsapp.chat')}</Button>
            </a>
          </div>
        </div>

        <a
          href="#gallery"
          onClick={scrollToGallery}
          aria-label={t('hero.view_works')}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/80 to-transparent mx-auto" />
        </a>
      </section>

      {/* ── The gallery — the star of the page, immediately after the hero ── */}
      <section id="gallery" className="py-16 md:py-24 bg-primary scroll-mt-24 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <header className="mb-8 md:mb-12 border-b border-divider pb-6">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">{t('gallery.eyebrow')}</div>
            <h2 className="text-3xl md:text-5xl font-serif text-light leading-tight">{t('gallery.title')}</h2>
            <p className="text-muted font-light mt-3 max-w-2xl">{t('gallery.subtitle')}</p>
          </header>
          <GalleryGrid />
        </div>
      </section>

      {/* ── Quiet studio statement + catalog ── */}
      <section className="py-16 md:py-24 bg-secondary transition-colors duration-300">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className={dir === 'rtl' ? 'md:order-1' : 'md:order-2'}>
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-divider">
              <img
                src={imgUrl(STATEMENT_ID, 800)}
                srcSet={imgSrcSet(STATEMENT_ID, [500, 800, 1100])}
                sizes="(min-width:768px) 45vw, 90vw"
                alt={t('home.statement_img_alt')}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className={dir === 'rtl' ? 'md:order-2' : 'md:order-1'}>
            <h2 className="text-3xl md:text-5xl font-serif text-light mb-5 leading-tight">{t('home.art_title')}</h2>
            <p className="text-muted leading-relaxed mb-8 font-light">{t('home.art_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={CATALOG_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="gold" fullWidth>
                  <span className="inline-flex items-center gap-2">
                    <FileText size={18} /> {t('home.view_catalog')}
                  </span>
                </Button>
              </a>
              <a href="#gallery" onClick={scrollToGallery}>
                <Button variant="soft" fullWidth>{t('home.view_all')}</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact — WhatsApp is the primary channel ── */}
      <section className="bg-surface transition-colors duration-300">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent mb-3">{t('whatsapp.title')}</div>
              <h2 className="text-3xl md:text-4xl font-serif text-light mb-4 leading-tight">{t('home.visit_title')}</h2>
              <p className="text-muted font-light mb-6 max-w-md">{t('whatsapp.description')}</p>
              <p className="text-muted text-sm mb-8">{t('home.visit_loc')}</p>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm uppercase tracking-widest"
              >
                <Instagram size={16} />
                <span>@{CONTACT.instagramHandle}</span>
                <Arrow size={14} />
              </a>
            </div>
            <div>
              <WhatsAppCTA />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
