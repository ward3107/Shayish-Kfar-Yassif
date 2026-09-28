import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import type { MediaItem } from '../types/media';
import { useLanguage } from '../contexts/LanguageContext';
import {
  CATEGORIES,
  type Category,
  type EnrichedItem,
  enrichAll,
  sortForDisplay,
  imgUrl,
  imgSrcSet,
  videoUrl,
  videoPoster,
} from '../lib/galleryData';

/**
 * Full project gallery.
 *
 * Design intent:
 *   1. One masonry column layout (CSS columns) that keeps every photo at its
 *      native aspect ratio — 108 of 126 shots are portrait, so a fixed-crop
 *      grid would cut the work in half. c_limit on Cloudinary never crops.
 *   2. Every asset is shown. Progressive loading is handled by native
 *      loading="lazy" (the browser only fetches tiles near the viewport) —
 *      never pagination or a "load more" wall.
 *   3. Category tabs filter in place; the count reflects what's on screen.
 *   4. Accessible lightbox: focus moves in on open and returns on close,
 *      Escape / ← / → work, arrows wrap, neighbours preload.
 */

type FilterCategory = Category | 'all';
const RESPONSIVE_WIDTHS = [280, 380, 500, 700, 900];
const TILE_SIZES = '(min-width:1024px) 23vw, (min-width:640px) 31vw, 48vw';
const EAGER_TILES = 4; // first tiles load eagerly for a fast first paint

const CACHE_KEY = 'shayish.media.cache';
const CACHE_MAX_AGE = 60_000;

const GalleryGrid: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<EnrichedItem[] | null>(null);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<FilterCategory>('all');
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let alive = true;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; items: MediaItem[] };
        if (Date.now() - parsed.ts < CACHE_MAX_AGE) setItems(enrichAll(parsed.items));
      }
    } catch {
      /* ignore */
    }

    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items: MediaItem[] }) => {
        if (!alive) return;
        const raw = d.items ?? [];
        setItems(enrichAll(raw));
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items: raw }));
        } catch {
          /* quota / private mode */
        }
      })
      .catch(() => {
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const displayItems = useMemo(() => {
    if (!items) return null;
    const filtered = category === 'all' ? items : items.filter((i) => i.category === category);
    return sortForDisplay(filtered);
  }, [items, category]);

  // Only offer tabs for categories that actually have photos, in canonical order.
  const availableCategories = useMemo(() => {
    if (!items) return [] as Category[];
    const present = new Set(items.map((i) => i.category).filter(Boolean));
    return CATEGORIES.filter((c) => present.has(c));
  }, [items]);

  const close = useCallback(() => {
    setActiveIndex(null);
    // Return focus to the tile that opened the lightbox (WCAG 2.4.3).
    triggerRef.current?.focus();
  }, []);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null || !displayItems ? i : (i + 1) % displayItems.length));
  }, [displayItems]);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null || !displayItems ? i : (i - 1 + displayItems.length) % displayItems.length));
  }, [displayItems]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog so keyboard + screen-reader users land there.
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, next, prev]);

  // Preload lightbox neighbours so Next/Prev paints instantly.
  useEffect(() => {
    if (activeIndex === null || !displayItems || displayItems.length <= 1) return;
    [displayItems[(activeIndex + 1) % displayItems.length], displayItems[(activeIndex - 1 + displayItems.length) % displayItems.length]].forEach(
      (n) => {
        if (n.resourceType !== 'image') return;
        const img = new Image();
        img.src = imgUrl(n.publicId, 1400);
      }
    );
  }, [activeIndex, displayItems]);

  if (error) {
    return (
      <div className="text-muted text-sm py-10 border border-dashed border-divider rounded-sm text-center">
        {t('gallery.load_error')}
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="mb-3 md:mb-4 bg-secondary border border-divider rounded-sm animate-pulse"
            style={{ height: `${180 + (i % 3) * 70}px` }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  const openItem = (index: number, el: HTMLElement) => {
    triggerRef.current = el;
    setActiveIndex(index);
  };

  const active = activeIndex !== null && displayItems ? displayItems[activeIndex] : null;

  return (
    <div className="space-y-6">
      {/* Category filter tabs — wrap on desktop, horizontal-scroll on mobile. */}
      {availableCategories.length > 0 && (
        <div
          className="flex items-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1 flex-nowrap md:flex-wrap"
          role="group"
          aria-label={t('gallery.filter_label')}
        >
          {(['all', ...availableCategories] as FilterCategory[]).map((c) => {
            const isActive = category === c;
            const label = t(`gallery.cat.${c}`);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={isActive}
                className={`shrink-0 px-4 py-2.5 text-xs md:text-sm rounded-full border transition-colors whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? 'bg-accent text-primary border-accent font-semibold'
                    : 'bg-transparent text-muted border-divider hover:text-light hover:border-accent'
                }`}
              >
                {label.startsWith('gallery.cat.') ? c : label}
              </button>
            );
          })}
        </div>
      )}

      {/* Live count */}
      <div className="flex items-baseline justify-between border-b border-divider pb-3">
        <span className="text-xs uppercase tracking-widest text-muted">{t('gallery.projects')}</span>
        <span className="text-xs text-muted" aria-live="polite">
          {displayItems?.length ?? 0} {t('gallery.pieces')}
        </span>
      </div>

      {/* Masonry — CSS columns keep native aspect ratios (no crop). */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4">
        {displayItems?.map((item, i) => {
          const isVideo = item.resourceType === 'video';
          return (
            <button
              key={item.publicId}
              type="button"
              onClick={(e) => openItem(i, e.currentTarget)}
              className="group relative block w-full mb-3 md:mb-4 overflow-hidden bg-secondary border border-divider rounded-sm break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={item.caption ? `${item.caption} — ${t('gallery.open')}` : t('gallery.open')}
            >
              <img
                src={isVideo ? videoPoster(item.publicId, 500) : imgUrl(item.publicId, 500)}
                srcSet={isVideo ? undefined : imgSrcSet(item.publicId, RESPONSIVE_WIDTHS)}
                sizes={isVideo ? undefined : TILE_SIZES}
                width={item.width || undefined}
                height={item.height || undefined}
                alt={item.caption || t('gallery.untitled')}
                loading={i < EAGER_TILES ? 'eager' : 'lazy'}
                decoding="async"
                style={{ aspectRatio: item.aspect || undefined }}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {isVideo && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                  <span className="bg-accent/90 text-primary rounded-full p-4">
                    <Play size={22} />
                  </span>
                </span>
              )}
              {item.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <span className="text-white text-xs md:text-sm font-light leading-snug block text-start">{item.caption}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || t('gallery.lightbox_label')}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label={t('gallery.close')}
            className="absolute top-3 end-3 md:top-5 md:end-5 text-white/80 hover:text-white p-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={28} />
          </button>
          {(displayItems?.length ?? 0) > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label={t('gallery.prev')}
                className="absolute start-1 md:start-6 text-white/80 hover:text-white p-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label={t('gallery.next')}
                className="absolute end-1 md:end-6 text-white/80 hover:text-white p-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}
          <div
            className="max-w-[95vw] max-h-[90vh] flex flex-col items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {active.resourceType === 'image' ? (
              <img
                key={active.publicId}
                src={imgUrl(active.publicId, 1400)}
                srcSet={imgSrcSet(active.publicId, [700, 1000, 1400, 1800])}
                sizes="95vw"
                alt={active.caption || t('gallery.untitled')}
                decoding="async"
                fetchPriority="high"
                className="max-w-full max-h-[82vh] w-auto h-auto object-contain"
              />
            ) : (
              <video
                key={active.publicId}
                src={videoUrl(active.publicId)}
                poster={videoPoster(active.publicId, 1400)}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[82vh]"
              />
            )}
            <div className="text-center">
              {active.caption && <div className="text-white/90 text-sm font-light mb-1 max-w-2xl">{active.caption}</div>}
              <div className="text-white/50 text-xs" dir="ltr">
                {(activeIndex ?? 0) + 1} / {displayItems?.length ?? 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
