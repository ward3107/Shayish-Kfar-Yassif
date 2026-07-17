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
 * Four hand-crafted marble textures — pure CSS, no image files. Each tile
 * evokes a different real stone the workshop actually works with, so the
 * Home page shows range and craft instead of four identical grey squares.
 * The Instagram icon still surfaces on hover to keep the click destination
 * obvious.
 */
const MARBLE_TILES: Array<{ name: string; className: string; style: React.CSSProperties }> = [
  {
    name: 'Calacatta',
    // Warm white with bold grey veins running diagonally.
    className: 'bg-[#f5f2ec]',
    style: {
      backgroundImage: [
        'linear-gradient(135deg, transparent 0%, rgba(120,110,95,0.35) 40%, transparent 42%, transparent 55%, rgba(90,80,70,0.25) 58%, transparent 62%)',
        'linear-gradient(115deg, transparent 20%, rgba(180,165,140,0.35) 40%, transparent 45%)',
        'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 55%)',
        'linear-gradient(135deg, #f8f5ef 0%, #eae4d8 100%)',
      ].join(', '),
    },
  },
  {
    name: 'Nero Marquina',
    // Deep black with thin white veining.
    className: 'bg-[#0f0f10]',
    style: {
      backgroundImage: [
        'linear-gradient(125deg, transparent 0%, rgba(240,240,240,0.55) 45%, transparent 47%)',
        'linear-gradient(155deg, transparent 30%, rgba(220,220,220,0.35) 55%, transparent 58%)',
        'radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 45%)',
        'linear-gradient(140deg, #14141a 0%, #050508 100%)',
      ].join(', '),
    },
  },
  {
    name: 'Emperador',
    // Warm brown/tan with lighter tan veins.
    className: 'bg-[#4a3524]',
    style: {
      backgroundImage: [
        'linear-gradient(120deg, transparent 0%, rgba(220,190,150,0.35) 45%, transparent 48%)',
        'linear-gradient(160deg, transparent 30%, rgba(180,140,100,0.4) 55%, transparent 60%)',
        'radial-gradient(ellipse at 25% 60%, rgba(255,220,180,0.3) 0%, transparent 55%)',
        'linear-gradient(135deg, #5a4130 0%, #382518 100%)',
      ].join(', '),
    },
  },
  {
    name: 'Verde Alpi',
    // Deep green marble with lighter jade veining.
    className: 'bg-[#1c3028]',
    style: {
      backgroundImage: [
        'linear-gradient(130deg, transparent 0%, rgba(180,220,190,0.35) 45%, transparent 48%)',
        'linear-gradient(155deg, transparent 30%, rgba(140,190,160,0.35) 55%, transparent 60%)',
        'radial-gradient(ellipse at 75% 30%, rgba(190,220,200,0.25) 0%, transparent 55%)',
        'linear-gradient(140deg, #253d33 0%, #12241d 100%)',
      ].join(', '),
    },
  },
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
              <div
                key={i}
                className={`aspect-square relative overflow-hidden ${tile.className}`}
                style={tile.style}
                aria-hidden="true"
              />
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
          className={`group relative overflow-hidden aspect-square border border-divider hover:border-accent transition-colors ${tile.className}`}
          style={tile.style}
        >
          {/* Subtle sheen that comes to life on hover, like polish catching light */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-colors duration-500" />

          {/* Bottom-left stone name — always visible, small */}
          <div className="absolute bottom-3 start-3 text-[10px] uppercase tracking-widest text-white/70 mix-blend-difference font-medium pointer-events-none">
            {tile.name}
          </div>

          {/* Instagram overlay — appears on hover to keep the CTA clear */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
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
