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
      <div className="relative w-full max-w-[280px] aspect-[9/16] bg-primary border border-neutral-700 shadow-2xl overflow-hidden mx-auto">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent/40" aria-hidden="true" />
          <div className="text-[10px] text-light font-bold">@{CONTACT.instagramHandle}</div>
        </div>
        <div className="grid grid-cols-3 gap-[2px] p-[2px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-center">
          <div className="text-[9px] text-muted uppercase tracking-widest">Live feed preview</div>
        </div>
      </div>
    );
  }

  // variant === 'grid'
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <a
          key={index}
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel ? `${ariaLabel} — ${index + 1}` : `Instagram post ${index + 1}`}
          className="group relative overflow-hidden aspect-square bg-gradient-to-br from-secondary via-neutral-900 to-secondary border border-neutral-800 hover:border-accent/50 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Instagram size={48} className="text-muted/40 group-hover:text-accent transition-colors" />
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black p-2 rounded-full rtl:left-3 rtl:right-auto">
            <ArrowUpRight size={16} />
          </div>
        </a>
      ))}
    </div>
  );
};

export default InstagramFeed;
