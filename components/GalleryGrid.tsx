import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Volume2, VolumeX } from 'lucide-react';
import type { MediaItem } from '../types/media';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Editorial mosaic gallery.
 *
 * Design intent:
 *   1. If a video exists, it plays muted+looped as a full-width HERO — it
 *      sells motion better than a still ever could.
 *   2. The rest of the media flows into a 6-column mosaic with a 12-tile
 *      repeating pattern of varied col/row spans, so tall photos, wide
 *      landscapes and detail shots all get room to breathe.
 *   3. Cloudinary serves each tile a crop matched to the tile's aspect
 *      ratio (c_fill,g_auto) — no square-cropping information off portrait
 *      shots the way a naive grid does.
 *   4. Mobile falls back to a clean 2-col grid; the mosaic requires ≥md.
 */

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

const imageAt = (publicId: string, w: number, h: number) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_${w},h_${h}/${encodeURIComponent(publicId)}`
    : '';

const videoUrl = (publicId: string) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,w_1600/${encodeURIComponent(publicId)}.mp4`
    : '';

const videoPoster = (publicId: string, w: number, h: number) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,c_fill,g_auto,w_${w},h_${h},so_0/${encodeURIComponent(publicId)}.jpg`
    : '';

// 12-tile repeating pattern. Each entry is a Tailwind class string so JIT
// picks up the literal utilities. Row height is set on the grid container.
// grid-auto-flow: dense packs the mosaic tightly when a span leaves a gap.
const PATTERN: string[] = [
  'md:col-span-4 md:row-span-2', // big feature
  'md:col-span-2 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-3 md:row-span-2', // tall
  'md:col-span-3 md:row-span-1',
  'md:col-span-3 md:row-span-1',
  'md:col-span-6 md:row-span-2', // wide banner
  'md:col-span-2 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-3 md:row-span-1',
  'md:col-span-3 md:row-span-1',
];

// Approx aspect ratio per pattern entry (for choosing Cloudinary crop dims).
const ASPECTS: Array<{ w: number; h: number }> = [
  { w: 1200, h: 900 },
  { w: 600, h: 450 },
  { w: 600, h: 450 },
  { w: 800, h: 1100 },
  { w: 800, h: 500 },
  { w: 800, h: 500 },
  { w: 1600, h: 900 },
  { w: 500, h: 500 },
  { w: 500, h: 500 },
  { w: 500, h: 500 },
  { w: 700, h: 500 },
  { w: 700, h: 500 },
];

const GalleryGrid: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [heroMuted, setHeroMuted] = useState(true);

  useEffect(() => {
    let alive = true;
    // Show cached items instantly on repeat visits within the same tab,
    // then revalidate against /api/media. Cache lifetime matches the 60s
    // edge cache on the API so we don't paint truly stale content.
    const CACHE_KEY = 'shayish.media.cache';
    const CACHE_MAX_AGE = 60_000;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; items: MediaItem[] };
        if (Date.now() - parsed.ts < CACHE_MAX_AGE) setItems(parsed.items);
      }
    } catch { /* ignore */ }

    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items: MediaItem[] }) => {
        if (!alive) return;
        const items = d.items ?? [];
        setItems(items);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
        } catch { /* quota / private mode */ }
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Split: first video (if any) → hero. Everything else → mosaic.
  const { hero, mosaic } = useMemo(() => {
    if (!items) return { hero: null, mosaic: [] as MediaItem[] };
    const firstVideoIdx = items.findIndex((i) => i.resourceType === 'video');
    if (firstVideoIdx === -1) return { hero: null, mosaic: items };
    return {
      hero: items[firstVideoIdx],
      mosaic: [...items.slice(0, firstVideoIdx), ...items.slice(firstVideoIdx + 1)],
    };
  }, [items]);

  // Lightbox controls
  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null || items === null ? i : (i + 1) % items.length));
  }, [items]);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null || items === null ? i : (i - 1 + items.length) % items.length));
  }, [items]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, next, prev]);

  // Preload the neighbours of the currently-open lightbox image so pressing
  // Next / Prev paints instantly instead of waiting on a Cloudinary round-trip.
  // The browser HTTP cache then keeps them cached for the rest of the session.
  useEffect(() => {
    if (activeIndex === null || items === null || items.length <= 1) return;
    const neighbours = [
      items[(activeIndex + 1) % items.length],
      items[(activeIndex - 1 + items.length) % items.length],
    ];
    neighbours.forEach((n) => {
      if (n.resourceType !== 'image') return;
      const preload = new Image();
      preload.src = imageAt(n.publicId, 1600, 1200);
    });
  }, [activeIndex, items]);

  if (error) {
    return (
      <div className="text-muted text-sm py-8 border border-dashed border-divider rounded-sm text-center">
        {t('gallery.load_error')}
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="space-y-4">
        <div className="w-full aspect-[16/9] bg-secondary border border-divider rounded-sm animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-secondary border border-divider rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  const openItemByPublicId = (publicId: string) => {
    if (!items) return;
    const idx = items.findIndex((i) => i.publicId === publicId);
    if (idx >= 0) setActiveIndex(idx);
  };

  const active = activeIndex !== null && items ? items[activeIndex] : null;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero video */}
      {hero && (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm border border-divider bg-black group">
          <video
            key={hero.publicId}
            src={videoUrl(hero.publicId)}
            poster={videoPoster(hero.publicId, 1600, 700)}
            autoPlay
            loop
            muted={heroMuted}
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
          <div className="absolute bottom-6 start-6 end-6 flex items-end justify-between gap-4 pointer-events-none">
            <div className="pointer-events-auto">
              <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{t('gallery.reel_eyebrow')}</div>
              <div className="text-white font-serif text-2xl md:text-3xl">{t('gallery.reel_title')}</div>
            </div>
            <div className="pointer-events-auto flex gap-2">
              <button
                type="button"
                onClick={() => setHeroMuted((m) => !m)}
                className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                aria-label={heroMuted ? t('gallery.unmute') : t('gallery.mute')}
              >
                {heroMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                type="button"
                onClick={() => openItemByPublicId(hero.publicId)}
                className="bg-accent text-primary px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-light transition-colors flex items-center gap-2"
              >
                <Play size={14} /> {t('gallery.watch')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Count + subtle header */}
      <div className="flex items-baseline justify-between border-b border-divider pb-3">
        <h3 className="text-xs uppercase tracking-widest text-muted">{t('gallery.projects')}</h3>
        <span className="text-xs text-muted">{items.length} {t('gallery.pieces')}</span>
      </div>

      {/* Mosaic */}
      <div
        className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 md:auto-rows-[140px] lg:auto-rows-[180px]"
        style={{ gridAutoFlow: 'dense' }}
      >
        {mosaic.map((item, i) => {
          const patternIdx = i % PATTERN.length;
          const spanClasses = PATTERN[patternIdx];
          const size = ASPECTS[patternIdx];
          const thumb =
            item.resourceType === 'image'
              ? imageAt(item.publicId, size.w, size.h)
              : videoPoster(item.publicId, size.w, size.h);
          return (
            <button
              key={item.publicId}
              type="button"
              onClick={() => openItemByPublicId(item.publicId)}
              className={`group relative overflow-hidden bg-secondary border border-divider rounded-sm aspect-square md:aspect-auto ${spanClasses} focus:outline-none focus:ring-2 focus:ring-accent`}
              aria-label={item.context.alt || item.publicId}
            >
              {/* Solid tile bg is the "placeholder" — we dropped the per-tile
                  Cloudinary blur image because at ~500 items it doubled the
                  request count for a barely visible flash. */}
              <img
                src={thumb}
                alt={item.context.alt || ''}
                loading="lazy"
                className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {item.resourceType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                  <div className="bg-accent/90 text-primary rounded-full p-3">
                    <Play size={20} />
                  </div>
                </div>
              )}
              {/* subtle bottom shade on hover */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.lightbox_label')}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label={t('gallery.close')}
            className="absolute top-4 end-4 text-white/80 hover:text-white p-2"
          >
            <X size={28} />
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label={t('gallery.prev')}
                className="absolute start-2 md:start-6 text-white/80 hover:text-white p-2"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label={t('gallery.next')}
                className="absolute end-2 md:end-6 text-white/80 hover:text-white p-2"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}
          <div className="max-w-[95vw] max-h-[90vh] flex flex-col items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            {active.resourceType === 'image' ? (
              <img
                key={active.publicId}
                src={imageAt(active.publicId, 1600, 1200)}
                alt={active.context.alt || ''}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="max-w-full max-h-[85vh] object-contain"
              />
            ) : (
              <video
                key={active.publicId}
                src={videoUrl(active.publicId)}
                poster={videoPoster(active.publicId, 1600, 900)}
                controls
                autoPlay
                className="max-w-full max-h-[85vh]"
              />
            )}
            <div className="text-white/50 text-xs">
              {(activeIndex ?? 0) + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
