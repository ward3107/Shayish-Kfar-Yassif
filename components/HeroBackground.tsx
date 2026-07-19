import React, { useEffect, useMemo, useState } from 'react';
import type { MediaItem } from '../types/media';

/**
 * Rotating Cloudinary hero background.
 *
 *  - Fetches gallery via /api/media (already edge-cached 60s).
 *  - Picks up to N images, shuffles, cycles every 7s with 1500ms crossfade.
 *  - Each layer runs a slow Ken Burns zoom+pan so the still shots feel alive.
 *  - Falls back to the original Unsplash poster if API fails or returns empty.
 *  - Skips videos here; the reel lives on the Gallery page.
 */

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop';

const heroUrl = (publicId: string, w: number, h: number) =>
  CLOUD
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto:good,c_fill,g_auto,w_${w},h_${h}/${encodeURIComponent(publicId)}`
    : FALLBACK_POSTER;

const SLIDES = 5;
const INTERVAL_MS = 7000;
const FADE_MS = 1500;

const HeroBackground: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items: MediaItem[] }) => {
        if (!alive) return;
        // Images only, shuffled, capped at SLIDES.
        const imgs = (d.items ?? []).filter((i) => i.resourceType === 'image');
        const shuffled = [...imgs].sort(() => Math.random() - 0.5).slice(0, SLIDES);
        setItems(shuffled.length > 0 ? shuffled : []);
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

  // Fallback while loading or if API failed / empty.
  if (items === null || items.length === 0) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center hero-kenburns"
        style={{ backgroundImage: `url('${FALLBACK_POSTER}')` }}
        role="img"
        aria-label="Marble kitchen surface"
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
