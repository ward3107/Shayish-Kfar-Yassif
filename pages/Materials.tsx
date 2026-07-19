import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Box, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Three.js is heavy (~800 kB with fiber + drei). The explorer chunk only
// downloads when the user actually clicks "Launch 3D Viewer" below —
// visitors who don't engage pay nothing.
const MarbleExplorer = lazy(() => import('../components/MarbleExplorer'));

const CLOUD = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'dst5uru0';
const img = (id: string, w = 800, h = 1000) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_${w},h_${h}/shayish/materials/${id}`;

const Materials: React.FC = () => {
  const { t } = useLanguage();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    document.title = `${t('materials.title')} | ${t('meta.brand')}`;
  }, [t]);

  const stoneGridRef  = useScrollAnimation({ type: 'slabStagger', stagger: 0.15 });
  const typesGridRef  = useScrollAnimation({ type: 'slabStagger', stagger: 0.12 });
  const finishGridRef = useScrollAnimation({ type: 'slabStagger', stagger: 0.10 });
  const trendsGridRef = useScrollAnimation({ type: 'slabStagger', stagger: 0.12 });

  const [explorerLaunched, setExplorerLaunched] = useState(false);

  // Porcelain granite types — sourced from Cloudinary shayish/materials.
  const types = [
    { key: 'fullbody',    id: 'porcelain-full-body'    },
    { key: 'halfbody',    id: 'porcelain-large-format' },
    { key: 'glazed',      id: 'porcelain-glazed'       },
    { key: 'designmimic', id: 'porcelain-wood-look'    },
  ];

  // Six surface finishes — each demonstrated on a real marble/porcelain image.
  const finishes = [
    { key: 'polished', id: 'calacatta'            },
    { key: 'matte',    id: 'nero-marquina'        },
    { key: 'lappato',  id: 'emperador'            },
    { key: 'honed',    id: 'verde-alpi'           },
    { key: 'concrete', id: 'porcelain-large-format' },
    { key: 'antislip', id: 'porcelain-full-body'  },
  ];

  // Design trends currently seen in the workshop.
  const trends = [
    { key: 'large',    id: 'porcelain-large-format' },
    { key: 'wood',     id: 'porcelain-wood-look'    },
    { key: 'marble',   id: 'calacatta'              },
    { key: 'concrete', id: 'porcelain-glazed'       },
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

        {/* Section 1: Core stone materials */}
        <div className="mb-32">
          <div className="flex items-end justify-between border-b border-divider pb-4 mb-12">
            <h2 className="text-3xl font-serif">{t('materials.section_stone')}</h2>
            <span className="text-accent text-xs uppercase tracking-widest">01</span>
          </div>
          <div ref={stoneGridRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-divider/50">
              <h3 className="font-serif text-2xl mb-4 text-light">{t('materials.porcelain_title')}</h3>
              <p className="text-muted text-sm font-light leading-relaxed">{t('materials.porcelain_desc')}</p>
            </div>
            <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-divider/50">
              <h3 className="font-serif text-2xl mb-4 text-light">{t('materials.caesarstone_title')}</h3>
              <p className="text-muted text-sm font-light leading-relaxed">{t('materials.caesarstone_desc')}</p>
            </div>
            <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-divider/50">
              <h3 className="font-serif text-2xl mb-4 text-light">{t('materials.marble_title')}</h3>
              <p className="text-muted text-sm font-light leading-relaxed">{t('materials.marble_desc')}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Types of porcelain granite */}
        <div className="mb-32">
          <div className="flex items-end justify-between border-b border-divider pb-4 mb-6">
            <h2 className="text-3xl font-serif">{t('materials.section_types')}</h2>
            <span className="text-accent text-xs uppercase tracking-widest">02</span>
          </div>
          <p className="text-muted font-light max-w-2xl mb-12">{t('materials.types_intro')}</p>
          <div ref={typesGridRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {types.map((t2) => (
              <div key={t2.key} className="group">
                <div className="overflow-hidden aspect-[4/5] mb-5 border border-divider/50">
                  <img
                    src={img(t2.id, 700, 900)}
                    alt={t(`materials.type_${t2.key}`)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-xl mb-2 text-light group-hover:text-accent transition-colors">
                  {t(`materials.type_${t2.key}`)}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {t(`materials.type_${t2.key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Surface finishes */}
        <div className="mb-32">
          <div className="flex items-end justify-between border-b border-divider pb-4 mb-12">
            <h2 className="text-3xl font-serif">{t('materials.section_finishes')}</h2>
            <span className="text-accent text-xs uppercase tracking-widest">03</span>
          </div>
          <div ref={finishGridRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {finishes.map((f) => (
              <div key={f.key} className="group cursor-pointer">
                <div className="overflow-hidden aspect-square mb-4 border border-divider/50">
                  <img
                    src={img(f.id, 600, 600)}
                    alt={t(`materials.finish_${f.key}`)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-light group-hover:text-accent transition-colors">
                  {t(`materials.finish_${f.key}`)}
                </h3>
                <p className="text-muted text-xs mt-1 leading-relaxed">
                  {t(`materials.finish_${f.key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Design trends */}
        <div className="mb-32">
          <div className="flex items-end justify-between border-b border-divider pb-4 mb-6">
            <h2 className="text-3xl font-serif">{t('materials.section_trends')}</h2>
            <span className="text-accent text-xs uppercase tracking-widest">04</span>
          </div>
          <p className="text-muted font-light max-w-2xl mb-12">{t('materials.trends_intro')}</p>
          <div ref={trendsGridRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.map((t3) => (
              <div key={t3.key} className="group relative overflow-hidden aspect-[4/3] border border-divider/50">
                <img
                  src={img(t3.id, 1200, 900)}
                  alt={t(`materials.trend_${t3.key}`)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-6 start-6 end-6">
                  <h3 className="font-serif text-2xl text-white mb-2">{t(`materials.trend_${t3.key}`)}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed max-w-md">
                    {t(`materials.trend_${t3.key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Interactive 3D Explorer — lazy-loaded. */}
        <div className="mb-8">
          <div className="flex items-end justify-between border-b border-divider pb-4 mb-8">
            <h2 className="text-3xl font-serif">{t('explorer.section_title')}</h2>
            <span className="text-accent text-xs uppercase tracking-widest">05</span>
          </div>
          <p className="text-muted font-light max-w-2xl mb-8">{t('explorer.section_desc')}</p>

          {explorerLaunched ? (
            <Suspense
              fallback={
                <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-neutral-900 border border-divider rounded-sm">
                  <Loader2 size={32} className="text-accent animate-spin" aria-label={t('explorer.loading')} />
                </div>
              }
            >
              <MarbleExplorer />
            </Suspense>
          ) : (
            <button
              type="button"
              onClick={() => setExplorerLaunched(true)}
              className="w-full h-[280px] md:h-[360px] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-secondary via-neutral-900 to-secondary border border-divider hover:border-accent transition-colors group"
              aria-label={t('explorer.launch')}
            >
              <Box size={64} className="text-muted group-hover:text-accent transition-colors" />
              <div className="text-lg font-serif text-light">{t('explorer.launch')}</div>
              <div className="text-xs uppercase tracking-widest text-muted">{t('explorer.launch_hint')}</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Materials;
