import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { MediaItem } from '../types/media';
import { useLanguage } from '../contexts/LanguageContext';
import { enrichAll, sortForDisplay, imgUrl, imgSrcSet, type EnrichedItem } from '../lib/galleryData';

/**
 * Home-page highlights: a curated preview of ~10 project photos (featured
 * first) that drives visitors to the full collection at /gallery. The home
 * page deliberately does NOT render all 126 images — that's the collection's
 * job. Tiles keep native aspect ratio (c_limit, no crop).
 */

const PREVIEW_COUNT = 10;
const CACHE_KEY = 'shayish.media.cache';
const CACHE_MAX_AGE = 60_000;
const WIDTHS = [280, 380, 500, 700];
const TILE_SIZES = '(min-width:1024px) 24vw, (min-width:640px) 31vw, 48vw';

const HomeGalleryPreview: React.FC = () => {
  const { t, dir } = useLanguage();
  const [items, setItems] = useState<EnrichedItem[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; items: MediaItem[] };
        if (Date.now() - parsed.ts < CACHE_MAX_AGE) {
          const imgs = sortForDisplay(enrichAll(parsed.items)).filter((i) => i.resourceType === 'image');
          setItems(imgs.slice(0, PREVIEW_COUNT));
          setTotal(imgs.length);
        }
      }
    } catch {
      /* ignore */
    }

    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items: MediaItem[] }) => {
        if (!alive) return;
        const raw = d.items ?? [];
        const imgs = sortForDisplay(enrichAll(raw)).filter((i) => i.resourceType === 'image');
        setItems(imgs.slice(0, PREVIEW_COUNT));
        setTotal(imgs.length);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items: raw }));
        } catch {
          /* quota / private mode */
        }
      })
      .catch(() => {
        if (alive && items === null) setItems([]);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Arrow = dir === 'rtl' ? ArrowLeft : (props: React.ComponentProps<typeof ArrowLeft>) => <ArrowLeft {...props} style={{ transform: 'rotate(180deg)' }} />;

  return (
    <div>
      <header className="mb-8 md:mb-12 border-b border-divider pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent mb-2">{t('gallery.eyebrow')}</div>
          <h2 className="text-3xl md:text-5xl font-serif text-light leading-tight">{t('home.selected_title')}</h2>
          <p className="text-muted font-light mt-3 max-w-2xl">{t('home.selected_subtitle')}</p>
        </div>
        <Link
          to="/gallery"
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <span>{t('home.view_all')}</span>
          <Arrow size={14} />
        </Link>
      </header>

      {/* Highlights — masonry keeps native aspect ratios. Whole strip links to the collection. */}
      {items === null ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4" aria-hidden>
          {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
            <div key={i} className="mb-3 md:mb-4 bg-secondary border border-divider rounded-sm animate-pulse" style={{ height: `${190 + (i % 3) * 60}px` }} />
          ))}
        </div>
      ) : items.length === 0 ? null : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4">
          {items.map((item) => (
            <Link
              key={item.publicId}
              to="/gallery"
              className="group relative block w-full mb-3 md:mb-4 overflow-hidden bg-secondary border border-divider rounded-sm break-inside-avoid hover:border-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={item.caption ? `${item.caption} — ${t('home.view_all')}` : t('home.view_all')}
            >
              <img
                src={imgUrl(item.publicId, 500)}
                srcSet={imgSrcSet(item.publicId, WIDTHS)}
                sizes={TILE_SIZES}
                width={item.width || undefined}
                height={item.height || undefined}
                alt={item.caption || t('gallery.untitled')}
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: item.aspect || undefined }}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </Link>
          ))}
        </div>
      )}

      {/* Big CTA into the full collection */}
      <div className="mt-10 md:mt-14 text-center">
        <Link
          to="/gallery"
          className="group inline-flex items-center justify-center gap-3 bg-accent text-white px-10 md:px-14 py-5 text-sm md:text-base font-bold uppercase tracking-widest border border-accent hover:bg-transparent hover:text-accent transition-all duration-500 rounded-none w-full sm:w-auto"
        >
          <span>{t('home.view_all_works')}</span>
          <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        {total !== null && total > 0 && (
          <div className="mt-4 text-xs uppercase tracking-widest text-muted">
            {total} {t('gallery.projects')}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeGalleryPreview;
