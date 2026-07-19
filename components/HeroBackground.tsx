import React, { useEffect, useMemo, useState } from 'react';
import type { MediaItem } from '../types/media';

/**
 * Rotating Cloudinary hero background.
 *
 *  - Fetches gallery via /api/media (already edge-cached 60s).
 *  - Picks up to N images, shuffles, cycles every 7s with 1500ms crossfade.
 *  - Each layer runs a slow Ken Burns zoom+pan so the still shots feel alive.
 *  - On repeat visits (same session) items paint instantly from sessionStorage.
 *  - While loading (or if API is empty/errors) we render a solid dark backdrop
 *    instead of a stock photo — deliberately: a mismatched fallback flashing
 *    before the real work reads as a bug, not a design choice.
 *  - Skips videos here; the reel lives on the Gallery page.
 */

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const CACHE_KEY = 'shayish.media.cache';
const CACHE_MAX_AGE = 60_000;

const heroUrl = (publicId: string, w: number, h: number) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto:good,c_fill,g_auto,w_${w},h_${h}/${encodeURIComponent(publicId)}`
    : '';

const SLIDES = 5;
const INTERVAL_MS = 7000;
const FADE_MS = 1500;

const pickHeroImages = (items: MediaItem[]): MediaItem[] => {
  const imgs = items.filter((i) => i.resourceType === 'image');
  return [...imgs].sort(() => Math.random() - 0.5).slice(0, SLIDES);
};

const readCache = (): MediaItem[] | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; items: MediaItem[] };
    if (Date.now() - parsed.ts > CACHE_MAX_AGE) return null;
    return parsed.items;
  } catch {
    return null;
  }
};

const HeroBackground: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  // Seed from the same session cache GalleryGrid writes so repeat visits skip
  // the loading state entirely.
  const [items, setItems] = useState<MediaItem[] | null>(() => {
    const cached = readCache();
    return cached ? pickHeroImages(cached) : null;
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items: MediaItem[] }) => {
        if (!alive) return;
        const all = d.items ?? [];
        setItems(pickHeroImages(all));
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items: all }));
        } catch { /* quota / private mode */ }
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Cycle
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [items]);

  const sized = useMemo(() => {
    // Serve smaller res on mobile — half the bytes.
    return isMobile ? { w: 900, h: 1400 } : { w: 1920, h: 1080 };
  }, [isMobile]);

  // Loading / empty / error: dark backdrop only. No stock photo — an unrelated
  // image flashing in for 1s before the real gallery reads as broken. The rest
  // of the hero (headline, CTAs, gradient overlay) stays legible against the
  // solid color, and repeat visits paint from sessionStorage anyway.
  if (items === null || items.length === 0) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary via-secondary to-primary"
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      {items.map((item, i) => {
        const src = heroUrl(item.publicId, sized.w, sized.h);
        const isActive = i === active;
        return (
          <div
            key={item.publicId}
            aria-hidden={!isActive}
            className={`absolute inset-0 w-full h-full transition-opacity ease-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            <div
              className="w-full h-full bg-cover bg-center hero-kenburns"
              style={{ backgroundImage: `url('${src}')` }}
            />
          </div>
        );
      })}
    </>
  );
};

export default HeroBackground;
