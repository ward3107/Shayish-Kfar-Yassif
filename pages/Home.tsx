import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import WhatsAppCTA from '../components/WhatsAppCTA';
import InstagramFeed from '../components/InstagramFeed';
import HeroBackground from '../components/HeroBackground';
import { CONTACT, TESTIMONIALS, TESTIMONIALS_ENABLED } from '../constants';
import { ArrowRight, Star, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Decorative section imagery — served from the client's own Cloudinary account
// under `shayish/materials/`. No stock photos: every image on this page is
// either a real project or a real material sample the workshop stocks.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const materialImg = (id: string, w = 2000) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_${w}/shayish/materials/${id}`
    : '';

const Home: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const location = useLocation();

  // Mobile users don't get the 15MB hero video — poster image only.
  // Desktop-first default so SSR / first paint doesn't flash the wrong thing.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    if (location.pathname === '/') {
      document.title = t('meta.home_title');
    }
  }, [location.pathname, t]);

  const ArrowIcon = dir === 'rtl' ?  (props: any) => <ArrowRight {...props} style={{transform: 'rotate(180deg)'}} /> : ArrowRight;

  // Scroll animation refs
  const introRef = useScrollAnimation({ type: 'fadeInUp', delay: 0.2 });
  const collectionsRef = useScrollAnimation({ type: 'fadeInUp', delay: 0.1 });
  const gridRef = useRef<HTMLDivElement>(null);
  // Slab reveal on the art section — it IS a marble image, so a heavy drop
  // reads more literally on brand than a generic fadeInUp.
  const artSectionRef = useScrollAnimation({ type: 'slab' });
  const testimonialsRef = useScrollAnimation({ type: 'stagger', stagger: 0.2 });
  const contactRef = useRef<HTMLDivElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);

  // Stagger animation for project cards
  const gridItemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Scope every GSAP animation + ScrollTrigger below to this component so
    // ctx.revert() only kills our triggers on unmount — not global ones from
    // other pages/components.
    const ctx = gsap.context(() => {
    // Animate project cards with stagger
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    // Parallax effect for the image in art section
    const artImage = document.querySelector('.art-image');
    if (artImage) {
      gsap.to(artImage, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: artImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // Parallax break section
    const parallaxSection = document.querySelector('.parallax-break');
    if (parallaxSection) {
      gsap.to(parallaxSection, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Lightning splash animation - triggered on scroll
      const lightningFlash = document.querySelector('.lightning-flash');
      const lightningSplash = document.querySelector('.lightning-splash');

      ScrollTrigger.create({
        trigger: parallaxSection,
        start: 'top 70%',
        onEnter: () => {
          // Activate lightning flash
          if (lightningFlash) {
            lightningFlash.classList.add('active');
          }
          // Activate splash glow
          if (lightningSplash) {
            setTimeout(() => {
              lightningSplash.classList.add('active');
            }, 200);
          }
        },
        onLeaveBack: () => {
          // Reset when scrolling back up (so it can play again)
          if (lightningFlash) {
            lightningFlash.classList.remove('active');
          }
          if (lightningSplash) {
            lightningSplash.classList.remove('active');
          }
        },
        once: false // Allow animation to replay when scrolling back
      });
    }

    // Contact section image parallax
    const contactImage = document.querySelector('.contact-image');
    if (contactImage) {
      gsap.to(contactImage, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: contactImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Contact info box - staggered fade in from bottom
      const contactBox = document.querySelector('.contact-info-box');
      const contactTitle = document.querySelector('.contact-title');
      const contactLocation = document.querySelector('.contact-location');

      if (contactBox && contactTitle && contactLocation) {
        gsap.fromTo(
          [contactBox, contactTitle, contactLocation],
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contactImage,
              start: 'top 60%',
            },
          }
        );
      }
    }

    // Hero buttons fade in from both sides
    if (heroButtonsRef.current) {
      const buttons = heroButtonsRef.current.children;
      gsap.fromTo(
        buttons,
        { opacity: 0, x: (index) => index === 0 ? -60 : 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.5,
          ease: 'power3.out',
        }
      );
    }

    // Word-by-word soft flow animation for intro quote
    const quoteWords = document.querySelectorAll('.word-flow');
    if (quoteWords.length > 0) {
      gsap.fromTo(
        quoteWords,
        {
          opacity: 0,
          y: 20,
          filter: 'blur(8px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section — rotating Cloudinary photos with Ken Burns motion.
          Zero external CDN dependency; images come from the owner's own
          uploads via /admin. */}
      <section className="relative h-[100svh] min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <HeroBackground isMobile={!isDesktop} />
            {/* Dark scrim over media for readable text */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/75"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-6 border border-white/30 px-4 py-1 rounded-full backdrop-blur-sm">
             <span className="text-xs uppercase tracking-widest text-gray-300">{t('hero.est')}</span>
          </div>

          {/* Company Name Display */}
          <div className="mb-4 flex flex-col items-center justify-center">
            {language === 'he' ? (
                <>
                    <span className="text-3xl md:text-4xl font-serif text-white tracking-wide">שיש כפר יאסיף</span>
                    <span className="text-sm md:text-base text-gray-400 uppercase tracking-widest mt-1">Shayish Kfar Yassif</span>
                </>
            ) : (
                <>
                    <span className="text-3xl md:text-4xl font-serif text-white uppercase tracking-wide">Shayish Kfar Yassif</span>
                    <span className="text-lg md:text-xl text-gray-400 font-serif mt-1">שיש כפר יאסיף</span>
                </>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 tracking-tight leading-none animate-slide-in-right">
            {t('hero.title_line1')} <br/> <span className="text-accent italic">{t('hero.title_line2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div ref={heroButtonsRef} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/gallery">
              <Button variant="outline" size="lg" magnetic>{t('hero.explore')}</Button>
            </Link>
            <Link to="/contact">
              <Button variant="gold" size="lg" magnetic>{t('hero.book')}</Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
           <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Intro Statement - Word by Word Animation */}
      <section className="py-32 bg-primary text-center transition-colors duration-300">
          <div className="container mx-auto px-6 max-w-4xl">
              <h2 ref={introRef as React.RefObject<HTMLHeadingElement>} className="text-2xl md:text-4xl font-serif leading-normal text-light">
                 {t('intro.quote').split(' ').map((word, index) => (
                     <span key={index} className="inline-block word-flow">
                         {word}&nbsp;
                     </span>
                 ))}
              </h2>
          </div>
      </section>

      {/* Instagram Section — the site's live portfolio lives on the owner's Instagram.
          This section drives visitors there. Once a real handle exists in constants.ts,
          the four tiles can be replaced with a live embed. */}
      <section ref={collectionsRef as React.RefObject<HTMLElement>} className="py-20 bg-primary transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16 border-b border-divider pb-6">
            <div>
              <div className="flex items-center gap-3 text-accent text-xs uppercase tracking-widest mb-3">
                <Instagram size={16} />
                <span>@{CONTACT.instagramHandle}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-light mb-2">{t('home.instagram_title')}</h2>
              <p className="text-muted font-light tracking-wide max-w-xl">{t('home.instagram_subtitle')}</p>
            </div>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center text-accent uppercase text-xs tracking-widest hover:text-light transition-colors"
            >
              {t('home.instagram_cta')} <ArrowIcon size={16} className="mx-2" />
            </a>
          </div>

          <div ref={gridRef}>
            <InstagramFeed variant="grid" ariaLabel={t('home.instagram_cta')} />
          </div>

          {/* Dual CTA — Instagram for browsing, WhatsApp for direct contact.
              Many visitors won't leave the site for Instagram but will DM on WhatsApp. */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-stretch">
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial md:hidden"
            >
              <Button variant="outline" fullWidth>{t('home.instagram_cta')}</Button>
            </a>
            <WhatsAppCTA variant="inline" />
          </div>
        </div>
      </section>

      {/* The Stone (Shayish) Highlight */}
      <section ref={artSectionRef as React.RefObject<HTMLElement>} className="py-32 bg-secondary relative transition-colors duration-300">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
             <div className="order-2 md:order-1">
                 <h2 className="text-4xl md:text-6xl font-serif text-light mb-6 leading-tight">
                    {t('home.art_title')}
                 </h2>
                 <p className="text-muted leading-relaxed mb-8 font-light">
                     {t('home.art_desc')}
                 </p>
                 <Link to="/materials">
                    <Button variant="gold">{t('home.discover')}</Button>
                 </Link>
             </div>
             <div className="order-1 md:order-2 relative h-[500px] w-full art-image">
                 <div className="absolute inset-0 border border-divider transform translate-x-4 translate-y-4 rtl:-translate-x-4"></div>
                 {CLOUD ? (
                   <img
                      src={materialImg('calacatta', 2000)}
                      alt="Calacatta marble sample"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale contrast-125"
                   />
                 ) : (
                   // Cloudinary not configured — dark stone-tone panel so we
                   // never render an unrelated stock photo.
                   <div className="w-full h-full bg-gradient-to-br from-secondary via-primary to-secondary" />
                 )}
             </div>
         </div>
      </section>

      {/* PARALLAX BREAK SECTION */}
      <section
        className="parallax-break relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat md:bg-fixed flex items-center justify-center overflow-hidden"
        style={{
          // Fall back to a solid dark gradient when Cloudinary isn't configured
          // so we never show a random stock photo.
          backgroundImage: CLOUD
            ? `url('${materialImg('nero-marquina', 2000)}')`
            : 'linear-gradient(135deg, var(--tw-color-secondary, #111), var(--tw-color-primary, #050505))',
        }}
      >
         {/* Soft Lightning Splash Overlay */}
         <div className="absolute inset-0 bg-black/40 lightning-splash"></div>
         <div className="lightning-flash"></div>
         <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-wide mb-6">
              {language === 'he' ? 'דיוק בכל פרט' : (language === 'ar' ? 'الدقة في كل التفاصيل' : 'Precision in Every Detail')}
            </h2>
            <p className="text-gray-200 text-lg md:text-xl font-light tracking-widest uppercase">
              {language === 'he' ? 'איכות ללא פשרות' : (language === 'ar' ? 'جودة لا مثيل لها' : 'Uncompromising Quality')}
            </p>
         </div>
      </section>

      {/* Testimonials — hidden until real, attributed reviews replace the placeholder
          data in constants.ts (see TESTIMONIALS_ENABLED). */}
      {TESTIMONIALS_ENABLED && (
        <section ref={testimonialsRef as React.RefObject<HTMLElement>} className="py-32 bg-primary transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {TESTIMONIALS.map((review) => (
                        <div key={review.id} className="text-center">
                            <div className="flex justify-center gap-1 text-accent mb-6">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            <p className="text-muted mb-8 font-serif italic text-lg leading-relaxed">"{review.text}"</p>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-light">{review.name}</div>
                                <div className="text-xs text-muted mt-1">{review.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* Contact Section */}
      <section ref={contactRef as React.RefObject<HTMLElement>} className="relative py-24 bg-surface transition-colors duration-300">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-0">
                <div
                  className="contact-image lg:w-1/2 bg-cover bg-center bg-no-repeat md:bg-fixed min-h-[400px] lg:min-h-full relative"
                  style={{
                    backgroundImage: CLOUD
                      ? `url('${materialImg('emperador', 2000)}')`
                      : 'linear-gradient(135deg, #1a1a1a, #050505)',
                  }}
                >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="contact-info-box text-center p-8 border border-white/20 backdrop-blur-sm bg-black/30">
                            <h3 className="contact-title text-3xl font-serif text-white mb-2">{t('home.visit_title')}</h3>
                            <p className="contact-location text-gray-300">{t('home.visit_loc')}</p>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 w-full">
                    <WhatsAppCTA />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;