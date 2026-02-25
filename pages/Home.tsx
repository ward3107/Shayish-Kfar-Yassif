import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import ContactForm from '../components/ContactForm';
import { PROJECTS, TESTIMONIALS } from '../constants';
import { ArrowRight, Star, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const location = useLocation();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    if (location.pathname === '/') {
      document.title = 'שיש כפר יאסיף - Shayish Kfar Yassif | משטחי שיש וקרמיקה בהתאמה אישית';
    }
  }, [location.pathname]);

  const ArrowIcon = dir === 'rtl' ?  (props: any) => <ArrowRight {...props} style={{transform: 'rotate(180deg)'}} /> : ArrowRight;

  // Scroll animation refs
  const introRef = useScrollAnimation({ type: 'fadeInUp', delay: 0.2 });
  const collectionsRef = useScrollAnimation({ type: 'fadeInUp', delay: 0.1 });
  const gridRef = useRef<HTMLDivElement>(null);
  const artSectionRef = useScrollAnimation({ type: 'fadeInUp' });
  const testimonialsRef = useScrollAnimation({ type: 'stagger', stagger: 0.2 });
  const contactRef = useRef<HTMLDivElement>(null);

  // Stagger animation for project cards
  const gridItemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
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
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Text remains white due to video background */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
            <video 
                autoPlay 
                loop 
                muted
                playsInline 
                preload="auto"
                disablePictureInPicture
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            >
                {/* Optimized HD Video of Carpentry/Kitchen Making */}
                <source src="https://videos.pexels.com/video-files/7578552/7578552-hd_1920_1080_30fps.mp4" type="video/mp4" />
            </video>
            {/* Dark Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
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
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/gallery">
              <Button variant="white" size="lg">{t('hero.explore')}</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">{t('hero.book')}</Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
           <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Intro Statement */}
      <section ref={introRef as React.RefObject<HTMLElement>} className="py-32 bg-primary text-center transition-colors duration-300">
          <div className="container mx-auto px-6 max-w-4xl">
              <h2 className="text-2xl md:text-4xl font-serif leading-normal text-light">
                 {t('intro.quote')}
              </h2>
          </div>
      </section>

      {/* Collections / Grid */}
      <section ref={collectionsRef as React.RefObject<HTMLElement>} className="py-20 bg-primary transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16 border-b border-neutral-800 pb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-light mb-2">{t('home.selected_works')}</h2>
              <p className="text-muted font-light tracking-wide">{t('home.curated')}</p>
            </div>
            <Link to="/gallery" className="hidden md:flex items-center text-accent uppercase text-xs tracking-widest hover:text-light transition-colors">
              {t('home.view_all')} <ArrowIcon size={16} className="mx-2" />
            </Link>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PROJECTS.slice(0, 4).map((project, index) => (
              <Link to="/gallery" key={project.id} className={`group relative overflow-hidden h-[400px] md:h-[600px] ${index === 1 || index === 2 ? 'md:h-[500px]' : ''}`}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-8 left-8 right-8 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                   <div className="text-accent text-xs uppercase tracking-widest mb-2">{project.category}</div>
                   <h3 className="text-3xl font-serif text-white">{project.title}</h3>
                   <div className="h-[1px] w-0 bg-accent mt-4 transition-all duration-500 group-hover:w-full"></div>
                </div>
                
                <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white text-black p-2 rounded-full rtl:left-8 rtl:right-auto">
                    <ArrowUpRight size={20} />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/gallery">
              <Button variant="outline" fullWidth>{t('home.view_all')}</Button>
            </Link>
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
                 <div className="absolute inset-0 border border-neutral-700 transform translate-x-4 translate-y-4 rtl:-translate-x-4"></div>
                 <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                    alt="Marble Texture"
                    className="w-full h-full object-cover grayscale contrast-125"
                 />
             </div>
         </div>
      </section>

      {/* PARALLAX BREAK SECTION */}
      <section
        className="parallax-break relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat md:bg-fixed flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616489953121-2e21b7e0964b?q=80&w=2070&auto=format&fit=crop')" }}
      >
         <div className="absolute inset-0 bg-black/40"></div>
         <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-wide mb-6">
              {language === 'he' ? 'דיוק בכל פרט' : (language === 'ar' ? 'الدقة في كل التفاصيل' : 'Precision in Every Detail')}
            </h2>
            <p className="text-gray-200 text-lg md:text-xl font-light tracking-widest uppercase">
              {language === 'he' ? 'איכות ללא פשרות' : (language === 'ar' ? 'جودة لا مثيل لها' : 'Uncompromising Quality')}
            </p>
         </div>
      </section>

      {/* Testimonials - Minimal */}
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

      {/* Contact Section */}
      <section ref={contactRef as React.RefObject<HTMLElement>} className="relative py-24 bg-surface transition-colors duration-300">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-0">
                <div className="contact-image lg:w-1/2 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat md:bg-fixed min-h-[400px] lg:min-h-full relative">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center p-8 border border-white/20 backdrop-blur-sm bg-black/30">
                            <h3 className="text-3xl font-serif text-white mb-2">{t('home.visit_title')}</h3>
                            <p className="text-gray-300">{t('home.visit_loc')}</p>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 w-full">
                    <ContactForm />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;