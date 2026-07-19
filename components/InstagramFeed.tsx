import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { CONTACT, INSTAGRAM_LIGHTWIDGET_ID } from '../constants';

interface InstagramFeedProps {
  // "grid" = 4-tile row used on the home page.
  // "phone" = vertical phone-mock preview used on the gallery page.
  variant: 'grid' | 'phone';
  ariaLabel?: string;
}

/**
 * Four real marble textures served from Cloudinary. Each tile shows the
 * actual look of the stone the workshop cuts and installs, so the Home
 * page reads as a genuine material showcase instead of a gradient mockup.
 *
 * Assets live at cloudinary://shayish/materials/<id>. Cloudinary applies
 * f_auto,q_auto and c_fill so we get WebP/AVIF at correct crop for the
 * viewer's device.
 */
const CLOUD = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'dst5uru0';
const marbleUrl = (id: string, w = 800) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_${w},h_${w}/shayish/materials/${id}`;

const MARBLE_TILES: Array<{ name: string; id: string; textColor: string }> = [
  { name: 'Calacatta',     id: 'calacatta',     textColor: 'text-black/70' },
  { name: 'Nero Marquina', id: 'nero-marquina', textColor: 'text-white/85' },
  { name: 'Emperador',     id: 'emperador',     textColor: 'text-white/85' },
  { name: 'Verde Alpi',    id: 'verde-alpi',    textColor: 'text-white/85' },
];

/**
 * Renders the Instagram section content. When INSTAGRAM_LIGHTWIDGET_ID is set
 * in constants.ts, this becomes a real live-updating iframe from LightWidget.
 * When empty (placeholder state), it renders a designed fallback that still
 * links to the Instagram profile — no broken iframe, no missing content.
 */
const InstagramFeed: React.FC<InstagramFeedProps> = ({ variant, ariaLabel }) => {
  const hasLiveFeed = Boolean(INSTAGRAM_LIGHTWIDGET_ID);

  if (hasLiveFeed) {
    // Live feed via LightWidget — free tier, no auth needed. The iframe pulls
    // the account's latest posts and renders them with its own layout.
    const src = `https://cdn.lightwidget.com/widgets/${INSTAGRAM_LIGHTWIDGET_ID}.html`;
    const height = variant === 'phone' ? '520' : '320';
    return (
      <iframe
        src={src}
        title={ariaLabel ?? `Instagram feed for @${CONTACT.instagramHandle}`}
        allowTransparency
        className="w-full border-0"
        style={{ height: `${height}px` }}
        loading="lazy"
        scrolling="no"
      />
    );
  }

  // Placeholder mode — no live account yet. Still gives a strong visual and
  // still funnels visitors to the Instagram profile.
  if (variant === 'phone') {
    return (
      <div className="relative w-full max-w-[280px] aspect-[9/16] bg-primary border border-divider shadow-2xl overflow-hidden mx-auto">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-divider">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent/40" aria-hidden="true" />
          <div className="text-[10px] text-light font-bold">@{CONTACT.instagramHandle}</div>
        </div>
        {/* Phone preview grid — reuse the 4 marble textures + repeat softly */}
        <div className="grid grid-cols-3 gap-[2px] p-[2px]">
          {Array.from({ length: 9 }).map((_, i) => {
            const tile = MARBLE_TILES[i % MARBLE_TILES.length];
            return (
              <div key={i} className="aspect-square relative overflow-hidden bg-secondary" aria-hidden="true">
                <img src={marbleUrl(tile.id, 200)} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-center">
          <div className="text-[9px] text-muted uppercase tracking-widest">Live feed preview</div>
        </div>
      </div>
    );
  }

  // variant === 'grid' — home page 4-tile marble showcase
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {MARBLE_TILES.map((tile, index) => (
        <a
          key={tile.name}
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel ? `${ariaLabel} — ${tile.name}` : `Instagram post ${index + 1}`}
          className="group relative overflow-hidden aspect-square border border-divider hover:border-accent transition-colors bg-secondary"
        >
          {/* Real marble texture from Cloudinary */}
          <img
            src={marbleUrl(tile.id, 700)}
            alt={`${tile.name} marble sample`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Subtle sheen that comes to life on hover, like polish catching light */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-colors duration-500" />

          {/* Bottom-left stone name — always visible, with per-tile contrast */}
          <div className={`absolute bottom-3 start-3 text-[11px] uppercase tracking-widest font-semibold pointer-events-none drop-shadow ${tile.textColor}`}>
            {tile.name}
          </div>

          {/* Instagram overlay — appears on hover to keep the CTA clear */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/45 backdrop-blur-sm">
            <Instagram size={40} className="text-white" />
          </div>

          {/* Corner arrow — subtle indicator this is a link */}
          <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black p-1.5 rounded-full">
            <ArrowUpRight size={14} />
          </div>
        </a>
      ))}
    </div>
  );
};

export default InstagramFeed;
