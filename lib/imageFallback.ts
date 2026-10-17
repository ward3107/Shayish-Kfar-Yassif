import type { SyntheticEvent } from 'react';

/** The original is always usable if an optional CDN correction fails. */
export function originalOnError(event: SyntheticEvent<HTMLImageElement>, original: string): void {
  const image = event.currentTarget;
  if (!original || (image.getAttribute('src') === original && !image.getAttribute('srcset'))) return;
  image.removeAttribute('srcset');
  image.src = original;
}
