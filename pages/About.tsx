import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Decorative section imagery — served from the client's own Cloudinary account.
// No stock photos: every image on this page is a real material sample.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const materialImg = (id: string, w = 2000) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_${w}/shayish/materials/${id}`
    : '';

const About: React.FC = () => {
  const { t, dir } = useLanguage();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    document.title = `${t('meta.about_title')} | ${t('meta.brand')}`;
  }, [t]);
  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen text-light transition-colors duration-300">
      {/* Hero */}
      <div className="container mx-auto px-6 mb-32">
        <h1 className="text-5xl md:text-8xl font-serif text-light mb-12 leading-none">
          {t('about.title_line1')} <br/> <span className="text-accent">{t('about.title_line2')}</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
                <p className="text-muted text-lg leading-relaxed font-light">
                   {t('about.desc')}
                </p>
            </div>
            <div className="md:col-span-8">
              {CLOUD ? (
                <img
                  src={materialImg('verde-alpi', 2070)}
                  alt="Verde Alpi marble sample"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[500px] object-cover grayscale opacity-80"
                />
              ) : (
                <div className="w-full h-[500px] bg-gradient-to-br from-secondary via-primary to-secondary opacity-80" />
              )}
            </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-divider py-16 mb-32">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl md:text-5xl font-serif text-light mb-2">15<span className="text-accent">+</span></div>
            <div className="text-muted text-xs uppercase tracking-widest">{t('about.years')}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-serif text-light mb-2">2.5k</div>
            <div className="text-muted text-xs uppercase tracking-widest">{t('about.projects')}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-serif text-light mb-2">1k<span className="text-sm align-top">sqm</span></div>
            <div className="text-muted text-xs uppercase tracking-widest">{t('about.size')}</div>
          </div>
           <div>
            <div className="text-4xl md:text-5xl font-serif text-light mb-2">100<span className="text-sm align-top">%</span></div>
            <div className="text-muted text-xs uppercase tracking-widest">{t('about.made_in')}</div>
          </div>
        </div>
      </div>

      {/* The Team / Story */}
      <div className="container mx-auto px-6 mb-20">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className={`absolute -top-4 w-20 h-20 border-t border-accent ${dir === 'rtl' ? '-right-4 border-r' : '-left-4 border-l'}`}></div>
               {CLOUD ? (
                 <img
                   src={materialImg('emperador', 1974)}
                   alt="Emperador marble sample"
                   loading="lazy"
                   decoding="async"
                   className="w-full grayscale contrast-125"
                 />
               ) : (
                 <div className="w-full aspect-[4/3] bg-gradient-to-br from-secondary via-primary to-secondary" />
               )}
            </div>
            <div>
               <h3 className="text-3xl font-serif mb-6 text-light">{t('about.family_title')}</h3>
               <p className="text-muted mb-6 leading-relaxed font-light">
                 {t('about.family_desc1')}
               </p>
               <p className="text-muted mb-6 leading-relaxed font-light">
                 {t('about.family_desc2')}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default About;