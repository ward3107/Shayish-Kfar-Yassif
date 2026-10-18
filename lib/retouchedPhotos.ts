import photoAssets from '../retouched-photo-assets.json' with { type: 'json' };
import homePhotoAssets from '../public-photo-assets.json' with { type: 'json' };
import slabSources from '../gallery-slab-sources.json' with { type: 'json' };

export type RetouchedPhoto = {
  src: string;
  width: number;
  height: number;
  variants: { src: string; width: number; height: number }[];
  editedWithAI: boolean;
};

const assets = photoAssets as Record<string, RetouchedPhoto>;
const homePhotos = homePhotoAssets as Record<string, {
  src: string; srcSet: string; width: number; height: number;
}>;

// Share the homepage exports so future slab replacements reach every gallery size.
const slabAssets: Record<string, RetouchedPhoto> = {};
for (const [publicId, slabId] of Object.entries(slabSources)) {
  const photo = homePhotos[`/stone-slabs/edited/${slabId}.jpeg`];
  if (!photo) continue;
  slabAssets[publicId] = {
    src: photo.src,
    width: photo.width,
    height: photo.height,
    editedWithAI: true,
    variants: photo.srcSet.split(', ').map(entry => {
      const [src, descriptor] = entry.split(' ');
      const width = Number.parseInt(descriptor, 10);
      return { src, width, height: Math.round(photo.height * width / photo.width) };
    }),
  };
}

export const retouchedPhoto = (publicId: string): RetouchedPhoto | undefined => slabAssets[publicId] || assets[publicId];

/** Select real exported pixels; never advertise the original's larger size. */
export function retouchedPhotoUrl(publicId: string, width: number): string | undefined {
  const asset = retouchedPhoto(publicId);
  if (!asset) return undefined;
  const requested = Number.isFinite(width) && width > 0 ? Math.min(width, asset.width) : asset.width;
  return asset.variants.find(variant => variant.width >= requested)?.src || asset.src;
}

export function retouchedPhotoSrcSet(publicId: string, widths: readonly number[]): string | undefined {
  const asset = retouchedPhoto(publicId);
  if (!asset) return undefined;
  const selected = new Map<number, string>();
  for (const width of widths) {
    if (!Number.isFinite(width) || width <= 0) continue;
    const variant = asset.variants.find(item => item.width >= Math.min(width, asset.width))
      || asset.variants[asset.variants.length - 1];
    if (variant) selected.set(variant.width, variant.src);
  }
  return [...selected].sort(([a], [b]) => a - b).map(([width, src]) => `${src} ${width}w`).join(', ');
}
