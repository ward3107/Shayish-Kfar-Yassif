import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROCESS_STEPS } from '../constants';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Process page — vertical timeline.
 *
 * The previous horizontal cinema-scroll was clever but hard to read: users
 * lost track of which step they were on and couldn't skim. This version
 * ships a single, obvious vertical timeline instead:
 *   - One row per step, alternating image ↔ text on desktop.
 *   - A single connecting rail on the left (RTL: right) with a numbered
 *     badge at each step's row so the sequence is unambiguous.
 *   - Mobile: image on top, text below, badges lined up on the reading edge.
 *   - Works identically in LTR (en/ru) and RTL (he/ar) — the `start` /
 *     `end` logical properties flip automatically.
 */

// No hardcoded fallback cloud — if the env var isn't set we fall back to a
// gradient panel instead of silently pulling from an unrelated tenant.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const bg = (id: string, w: number, h: number) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto:good,c_fill,g_auto,w_${w},h_${h}/shayish/materials/${id}`
    : '';

type StepImage = { key: string; id: string };
const STEP_IMAGES: StepImage[] = [
  { key: 'consultation', id: 'nero-marquina'          },
  { key: 'design',       id: 'calacatta'              },
  { key: 'measurements', id: 'verde-alpi'             },
  { key: 'production',   id: 'emperador'              },
  { key: 'installation', id: 'porcelain-large-format' },
  { key: 'warranty',     id: 'porcelain-wood-look'    },
];
const imageForStep = (key: string): string =>
  STEP_IMAGES.find((s) => s.key === key)?.id ?? 'calacatta';

const StepImage: React.FC<{ imgId: string; alt: string; eager: boolean }> = ({ imgId, alt, eager }) => {
  const [failed, setFailed] = useState(!CLOUD);
  const showImg = !failed && CLOUD;
  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm border border-divider bg-secondary">
      {showImg ? (
        <img
          src={bg(imgId, 1200, 800)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-secondary" />
      )}
      {/* Subtle vignette so text sitting near the image still reads clearly */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
    </div>
  );
};

const Process: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('process.title')} | ${t('meta.brand')}`;
  }, [t]);

  return (
    <div className="bg-primary text-light min-h-screen transition-colors duration-300">
      {/* Intro banner */}
      <section className="pt-32 pb-16 md:pb-24 border-b border-divider">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-accent mb-4">{t('nav.process')}</div>
          <h1 className="text-5xl md:text-7xl font-serif text-light mb-6">{t('process.title')}</h1>
          <p className="text-muted font-light text-lg">{t('process.subtitle')}</p>
        </div>
      </section>

      {/* Vertical timeline ------------------------------------------------ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* The timeline itself is a relative container with a vertical rail.
              Rail sits on the reading-order start (start-6 = left in LTR,
              right in RTL) on mobile, and centered on md+ where rows
              alternate side-to-side. */}
          <ol className="relative">
            {/* Vertical rail */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 start-6 md:start-1/2 md:-translate-x-px w-px bg-divider"
            />

            {PROCESS_STEPS.map((step, i) => {
              const number = String(i + 1).padStart(2, '0');
              const isEven = i % 2 === 0;
              return (
                <li
                  key={step.key}
                  className="relative ps-16 md:ps-0 pb-16 md:pb-24 last:pb-0"
                >
                  {/* Numbered badge on the rail */}
                  <div
                    className="absolute top-0 start-6 md:start-1/2 -translate-x-1/2 rtl:translate-x-1/2 md:-translate-x-1/2 md:rtl:translate-x-1/2 z-10"
                    aria-hidden="true"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary border-2 border-accent text-accent font-serif text-lg">
                      {number}
                    </div>
                  </div>

                  {/* Row: image + text, alternating sides on md+ */}
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${
                      isEven ? '' : 'md:[direction:rtl]'
                    }`}
                  >
                    {/* Image column */}
                    <div className={`md:pt-2 ${isEven ? 'md:pe-8 lg:pe-16' : 'md:ps-8 lg:ps-16 md:[direction:ltr] rtl:md:[direction:rtl]'}`}>
                      <StepImage
                        imgId={imageForStep(step.key)}
                        alt={t(`process.steps.${step.key}.title`)}
                        eager={i < 2}
                      />
                    </div>

                    {/* Text column */}
                    <div className={`${isEven ? 'md:ps-8 lg:ps-16' : 'md:pe-8 lg:pe-16 md:[direction:ltr] rtl:md:[direction:rtl]'}`}>
                      <div className="text-accent mb-4">
                        <step.Icon size={36} strokeWidth={1.25} />
                      </div>
                      <div className="text-xs uppercase tracking-widest text-muted mb-3">
                        {t('process.step_prefix')} · {number} / {String(PROCESS_STEPS.length).padStart(2, '0')}
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-light mb-5 leading-tight">
                        {t(`process.steps.${step.key}.title`)}
                      </h2>
                      <p className="text-muted text-base md:text-lg font-light leading-relaxed">
                        {t(`process.steps.${step.key}.description`)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-24 md:py-32 text-center bg-secondary border-t border-divider transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-light">
            {t('process.start_project')}
          </h2>
          <p className="text-muted mb-10 font-light">{t('process.subtitle')}</p>
          <Link to="/contact">
            <Button size="lg" variant="gold">
              {t('process.book_consultation')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Process;
