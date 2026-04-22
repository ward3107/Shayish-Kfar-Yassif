import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Materials: React.FC = () => {
  const { t } = useLanguage();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    document.title = `${t('materials.title')} - Materials | שיש כפר יאסיף - Shayish Kfar Yassif`;
  }, []);

  const finishes = [
    { title: t('materials.finish_polished'), desc: t('materials.finish_polished_desc'), img: "https://picsum.photos/seed/m1/400/300" },
    { title: t('materials.finish_matte'), desc: t('materials.finish_matte_desc'), img: "https://picsum.photos/seed/m2/400/300" },
    { title: t('materials.finish_concrete'), desc: t('materials.finish_concrete_desc'), img: "https://picsum.photos/seed/m3/400/300" },
    { title: t('materials.finish_honed'), desc: t('materials.finish_honed_desc'), img: "https://picsum.photos/seed/m4/400/300" }
  ];

  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen text-light transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-light mb-6">{t('materials.title')}</h1>
          <p className="text-muted font-light max-w-2xl mx-auto">
            {t('materials.subtitle')}
          </p>
        </div>

        {/* Section 1: Stone */}
        <div className="mb-32">
            <div className="flex items-end justify-between border-b border-neutral-800 pb-4 mb-12">
                <h2 className="text-3xl font-serif">{t('materials.section_stone')}</h2>
                <span className="text-accent text-xs uppercase tracking-widest">01</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                 <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-neutral-900/50">
                     <h3 className="font-serif text-2xl mb-4 text-light">{t('materials.porcelain_title')}</h3>
                     <p className="text-muted text-sm font-light leading-relaxed">{t('materials.porcelain_desc')}</p>
                 </div>
                 <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-neutral-900/50">
                     <h3 className="font-serif text-2xl mb-4 text-light">{t('materials.caesarstone_title')}</h3>
                     <p className="text-muted text-sm font-light leading-relaxed">{t('materials.caesarstone_desc')}</p>
                 </div>
                 <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-neutral-900/50">
                     <h3 className="font-serif text-2xl mb-4 text-light">{t('materials.marble_title')}</h3>
                     <p className="text-muted text-sm font-light leading-relaxed">{t('materials.marble_desc')}</p>
                 </div>
            </div>
        </div>

        {/* Section 2: Finishes */}
        <div className="mb-32">
            <div className="flex items-end justify-between border-b border-neutral-800 pb-4 mb-12">
                <h2 className="text-3xl font-serif">{t('materials.section_finishes')}</h2>
                <span className="text-accent text-xs uppercase tracking-widest">02</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {finishes.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="overflow-hidden aspect-[4/5] mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                            <img src={item.img} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform group-hover:scale-110"/>
                        </div>
                        <h3 className="font-serif text-xl mb-2 text-light group-hover:text-accent transition-colors">{item.title}</h3>
                        <p className="text-muted text-xs tracking-wide">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
