import type { MediaItem } from '../types/media';
import curationData from '../gallery-curation.json';
import photoMetadata from '../photo-metadata.json';
import { retouchedPhoto, retouchedPhotoUrl, retouchedPhotoSrcSet } from './retouchedPhotos';
import { buildPhotoUrl, buildPhotoSrcSet, buildCroppedPhotoSrcSet, type PhotoOptions } from './photoDelivery';

/**
 * Client-side gallery data layer.
 *
 * The gallery is powered by Cloudinary (fetched via /api/media). This module
 * layers an owner-editable curation file on top of that raw feed:
 *
 *   1. Cloudinary tags / context  (set live via /admin)  — HIGHEST precedence
 *   2. gallery-curation.json      (this repo)            — baseline
 *   3. nothing                    → item still shows, uncategorized
 *
 * Because Cloudinary metadata always wins, the owner can re-tag or upload new
 * images through /admin without ever editing this file, and new images that
 * aren't in the curation file still appear in the gallery (under "all" and,
 * if untagged, without a category). We never mutate the source images.
 */

export const CATEGORIES = ['kitchens', 'bathrooms', 'walls', 'stairs', 'slabs', 'special'] as const;
export type Category = (typeof CATEGORIES)[number];

// The owner's own Cloudinary account. Fallback keeps images rendering in
// local/preview builds where VITE_CLOUDINARY_CLOUD_NAME isn't set; it is the
// same account /api/media reads from, never a third party.
const CLOUD = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'dst5uru0';

type CurationEntry = { category?: string; caption?: string; featured?: number };
type CurationFile = {
  version: number;
  hero: string;
  categories: string[];
  items: Record<string, CurationEntry>;
};

const curation = curationData as CurationFile;

/** publicId of the fixed, intentional hero image (never random). */
export const HERO_PUBLIC_ID = curation.hero;

export type EnrichedItem = MediaItem & {
  category: Category | '';
  caption: string;
  featured: number | null;
  /** width / height, used to reserve space and avoid layout shift. */
  aspect: number;
};

const isCategory = (v: string | undefined): v is Category =>
  !!v && (CATEGORIES as readonly string[]).includes(v);

const tagCategory = (tags: string[]): Category | '' => {
  const tag = tags.find((t) => t.startsWith('cat:'));
  if (!tag) return '';
  const slug = tag.slice(4);
  return isCategory(slug) ? slug : '';
};

const tagFeatured = (tags: string[]): number | null => {
  const tag = tags.find((t) => t.startsWith('featured:'));
  if (!tag) return null;
  const n = Number(tag.slice(9));
  return Number.isFinite(n) ? n : null;
};

/** Merge Cloudinary metadata (wins) over the curation baseline. */
export const enrich = (item: MediaItem): EnrichedItem => {
  const cur = curation.items[item.publicId] ?? {};
  const category = tagCategory(item.tags) || (isCategory(cur.category) ? cur.category : '');
  const caption = item.context?.alt?.trim() || cur.caption || '';
  const featured = tagFeatured(item.tags) ?? (typeof cur.featured === 'number' ? cur.featured : null);
  const retouched = item.resourceType === 'image' ? retouchedPhoto(item.publicId) : undefined;
  const aspect = retouched ? retouched.width / retouched.height : item.width && item.height ? item.width / item.height : 1;
  return { ...item, category, caption, featured, aspect };
};

export const enrichAll = (items: MediaItem[]): EnrichedItem[] => items.map(enrich);

/**
 * Featured items first (by ascending order), then newest-first. Gives the
 * owner a curated highlight reel at the top while the rest flows by date.
 */
export const sortForDisplay = (items: EnrichedItem[]): EnrichedItem[] =>
  [...items].sort((a, b) => {
    if (a.featured !== null && b.featured !== null) return a.featured - b.featured;
    if (a.featured !== null) return -1;
    if (b.featured !== null) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

// Encode each path segment but keep the folder slashes Cloudinary needs.
const enc = (publicId: string) => publicId.split('/').map(encodeURIComponent).join('/');
const metadata = photoMetadata as Record<string, { width: number; height: number }>;
const photoOptions = (publicId: string, nativeWidth?: number): Omit<PhotoOptions, 'width'> => ({
  nativeWidth: nativeWidth || metadata[publicId]?.width,
  nativeHeight: metadata[publicId]?.height,
  role: publicId.startsWith('shayish/materials/') || curation.items[publicId]?.category === 'slabs' ? 'material' : 'project',
});

/**
 * Responsive still image, aspect ratio PRESERVED (c_limit never crops or
 * upscales) — so portrait project shots are never square-cropped.
 */
export const imgUrl = (publicId: string, w: number, nativeWidth?: number): string =>
  retouchedPhotoUrl(publicId, w) ?? buildPhotoUrl(CLOUD, publicId, { ...photoOptions(publicId, nativeWidth), width: w });

export const imgSrcSet = (publicId: string, widths: number[], nativeWidth?: number): string =>
  retouchedPhotoSrcSet(publicId, widths) ?? buildPhotoSrcSet(CLOUD, publicId, widths, photoOptions(publicId, nativeWidth));

export const croppedImgSrcSet = (publicId: string, widths: number[], aspect: number): string =>
  retouchedPhotoSrcSet(publicId, widths) ?? buildCroppedPhotoSrcSet(CLOUD, publicId, widths, aspect, photoOptions(publicId));

/** Hero / full-bleed crop (c_fill with smart gravity) for banner use only. */
export const heroUrl = (publicId: string, w: number, h: number): string =>
  retouchedPhotoUrl(publicId, w) ?? buildPhotoUrl(CLOUD, publicId, { ...photoOptions(publicId), width: w, height: h, crop: 'fill' });

export const videoUrl = (publicId: string): string =>
  CLOUD ? `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,w_1280/${enc(publicId)}.mp4` : '';

export const videoPoster = (publicId: string, w: number): string =>
  CLOUD ? `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,c_limit,w_${w},q_auto,f_jpg/${enc(publicId)}.jpg` : '';

export const hasCloud = Boolean(CLOUD);
