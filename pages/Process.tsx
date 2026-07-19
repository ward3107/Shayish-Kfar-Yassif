import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STEPS } from '../constants';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const CLOUD = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'dst5uru0';
const bg = (id: string, w: number, h: number) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto:good,c_fill,g_auto,w_${w},h_${h}/shayish/materials/${id}`;

/**
 * "Cinema-scroll" Process page.
 *   - Desktop: the entire process pins to the viewport and translates
 *     horizontally as the visitor scrolls vertically. Every step is a
 *     full-viewport panel — one continuous factory line.
 *   - Mobile: the pinning gets in the way of touch scroll, so we degrade
 *     gracefully to a stacked vertical layout.
 *   - Photography per step is drawn from Cloudinary; owners can later swap
 *     the `img` id per step for a real workshop photo without touching code
 *     structure.
 */

type StepImage = { key: string; id: string };
const STEP_IMAGES: StepImage[] = [
  { key: 'consultation', id: 'nero-marquina'         },
  { key: 'design',       id: 'calacatta'             },
  { key: 'measurements', id: 'verde-alpi'            },
  { key: 'production',   id: 'emperador'             },
  { key: 'installation', id: 'porcelain-large-format' },
  { key: 'warranty',     id: 'porcelain-wood-look'   },
];
const imageForStep = (key: string): string =>
  STEP_IMAGES.find((s) => s.key === key)?.id ?? 'calacatta';

const Process: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${t('process.title')} | ${t('meta.brand')}`;
  }, [t]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!container || !track) return;

    // Cinema scroll only on md+ — mobile keeps a natural stacked scroll.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const panels = track.querySelectorAll('.process-panel');
      const count = panels.length;
      const totalScroll = window.innerWidth * (count - 1);

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) progress.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      }, container);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

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

      {/* Cinema scroll ------------------------------------------------ */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Progress line at bottom of viewport */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] bg-divider z-30">
          <div ref={progressRef} className="h-full bg-accent origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row md:h-full md:w-max"
        >
          {PROCESS_STEPS.map((step, i) => {
            const isEven = i % 2 === 0;
            const imgId = imageForStep(step.key);
            return (
              <section
                key={step.key}
                className={`process-panel relative flex-shrink-0 w-screen md:h-screen flex ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col`}
              >
                {/* Image side */}
                <div className="relative md:w-1/2 h-[45vh] md:h-full overflow-hidden">
                  <img
                    src={bg(imgId, 1400, 1200)}
                    alt={t(`process.steps.${step.key}.title`)}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/40" />
                  {/* Step number, subtle over the image */}
                  <div className="absolute top-6 md:top-10 start-6 md:start-10 text-white/90">
                    <div className="text-xs uppercase tracking-widest opacity-80 mb-1">
                      {t('process.step_prefix')}
                    </div>
                    <div className="font-serif text-6xl md:text-8xl leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Text side */}
                <div className="md:w-1/2 h-[55vh] md:h-full flex items-center bg-secondary">
                  <div className="px-8 md:px-16 lg:px-24 py-10 md:py-0 w-full max-w-2xl mx-auto">
                    <div className="mb-6 text-accent">
                      <step.Icon size={40} strokeWidth={1.25} />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted mb-3">
                      {String(i + 1).padStart(2, '0')} / {String(PROCESS_STEPS.length).padStart(2, '0')}
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-light mb-6 leading-tight">
                      {t(`process.steps.${step.key}.title`)}
                    </h2>
                    <p className="text-muted text-base md:text-lg font-light leading-relaxed">
                      {t(`process.steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* CTA banner */}
      <section className="py-24 md:py-32 text-center bg-primary">
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
