import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { MediaItem } from '../types/media';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Compact Cloudinary-backed preview grid for the Home page.
 *  - 8 latest project photos in an 8-column / 4-column responsive grid.
 *  - Each tile is a link to /gallery so the click keeps momentum toward the
 *    full editorial mosaic instead of trapping visitors in a lightbox.
 *  - Videos are skipped (the reel plays on the Gallery page itself).
 */

const CLOUD = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'dst5uru0';
const thumb = (publicId: string) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_500,h_500/${encodeURIComponent(publicId)}`;

const HomeGalleryPreview: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<MediaItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items: MediaItem[] }) => {
        if (!alive) return;
        setItems((d.items ?? []).filter((i) => i.resourceType === 'image').slice(0, 8));
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-primary transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-divider pb-4 mb-8 md:mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent mb-2">
              {t('gallery.projects')}
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-light leading-tight">
              {t('gallery.title')}
            </h2>
          </div>
          <Link
            to="/gallery"
            className="group hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            <span>{t('home.view_all')}</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid */}
        {items === null ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-secondary border border-divider rounded-sm animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? null : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((item) => (
              <Link
                key={item.publicId}
                to="/gallery"
                className="group relative aspect-square overflow-hidden border border-divider bg-secondary rounded-sm hover:border-accent transition-colors"
                aria-label={item.context.alt || item.publicId}
              >
                <img
                  src={thumb(item.publicId)}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA — the desktop link sits in the header row */}
        <div className="md:hidden mt-8 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 border border-accent text-accent px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors"
          >
            <span>{t('home.view_all')}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeGalleryPreview;
