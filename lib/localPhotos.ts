import assets from '../public-photo-assets.json';

type Asset = { src: string; srcSet: string; width: number; height: number };
const photos = assets as Record<string, Asset>;

export function localPhoto(original: string): string {
  return photos[original]?.src || original;
}

export function localPhotoSrcSet(original: string): string | undefined {
  return photos[original]?.srcSet;
}
