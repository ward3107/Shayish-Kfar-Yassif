import { v2 as cloudinary } from 'cloudinary';

/**
 * Shared Cloudinary client used by every /api function. Reads config from
 * process env — set these in Vercel Project Settings → Environment Variables:
 *
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * The public site also needs (for browser uploads):
 *   VITE_CLOUDINARY_CLOUD_NAME
 *   VITE_CLOUDINARY_UPLOAD_PRESET   (unsigned preset — created in Cloudinary UI)
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const GALLERY_FOLDER = process.env.CLOUDINARY_GALLERY_FOLDER || 'shayish/gallery';

// Fail loud at cold-start if the folder name would corrupt the search
// expression. Cloudinary paths use `[a-z0-9/_-]` in practice; a stray quote
// or backslash would let a mis-configured env var break listMedia() below.
if (!/^[a-zA-Z0-9/_\-.]+$/.test(GALLERY_FOLDER)) {
  throw new Error(`CLOUDINARY_GALLERY_FOLDER contains unsafe characters: ${GALLERY_FOLDER}`);
}

export type MediaItem = {
  publicId: string;
  url: string;
  secureUrl: string;
  thumbUrl: string;
  resourceType: 'image' | 'video';
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
  tags: string[];
  context: Record<string, string>;
};

type SearchResource = {
  public_id: string;
  url: string;
  secure_url: string;
  resource_type: 'image' | 'video';
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  tags?: string[];
  context?: { custom?: Record<string, string> };
};

const toItem = (r: SearchResource): MediaItem => ({
  publicId: r.public_id,
  url: r.url,
  secureUrl: r.secure_url,
  thumbUrl: cloudinary.url(r.public_id, {
    resource_type: r.resource_type,
    secure: true,
    transformation: [
      { width: 600, height: 600, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  }),
  resourceType: r.resource_type,
  format: r.format,
  width: r.width,
  height: r.height,
  bytes: r.bytes,
  createdAt: r.created_at,
  tags: r.tags ?? [],
  context: r.context?.custom ?? {},
});

export async function listMedia(): Promise<MediaItem[]> {
  const expression = `folder="${GALLERY_FOLDER}"`;
  const result = await cloudinary.search
    .expression(expression)
    .with_field('context')
    .with_field('tags')
    .sort_by('created_at', 'desc')
    .max_results(500)
    .execute();
  const resources = (result.resources ?? []) as SearchResource[];
  return resources.map(toItem);
}

export async function destroyMedia(publicId: string, resourceType: 'image' | 'video') {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}

/**
 * Categories the owner can tag photos with. Stored on Cloudinary as a
 * `cat:<slug>` tag. Must stay in sync with CATEGORIES in lib/galleryData.ts
 * and pages/Admin.tsx. Hebrew labels live in translations.ts (gallery.cat.*).
 */
export const CATEGORIES = ['kitchens', 'bathrooms', 'walls', 'stairs', 'slabs', 'special'] as const;
export type Category = typeof CATEGORIES[number];

/**
 * Update an asset's caption (context.alt) + category (tag `cat:<slug>`)
 * + featured order (tag `featured:<N>` where N is a 3-digit number; low N
 * sorts first). The three fields are optional — undefined leaves them
 * untouched.
 */
export async function updateMedia(
  publicId: string,
  resourceType: 'image' | 'video',
  patch: { alt?: string; category?: Category | ''; featuredOrder?: number | null }
) {
  const { alt, category, featuredOrder } = patch;
  const updates: Record<string, string> = {};

  if (alt !== undefined) {
    // Cloudinary context uses "key=value|key2=value2" — strip separators
    // from user input so a stray "|" or "=" can't corrupt other fields.
    updates.context = `alt=${alt.replace(/[|=]/g, ' ').trim()}`;
  }

  if (category !== undefined || featuredOrder !== undefined) {
    // Merge with existing tags so we don't clobber unrelated ones (e.g.
    // if Cloudinary auto-tagged the image with "kitchen" or similar).
    const existing = ((await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
      tags: true,
    })).tags as string[] | undefined) ?? [];

    const kept = existing.filter((t) => {
      if (category !== undefined && t.startsWith('cat:')) return false;
      if (featuredOrder !== undefined && t.startsWith('featured:')) return false;
      return true;
    });
    if (category) kept.push(`cat:${category}`);
    if (typeof featuredOrder === 'number') {
      kept.push(`featured:${String(featuredOrder).padStart(3, '0')}`);
    }
    updates.tags = kept.join(',');
  }

  if (Object.keys(updates).length === 0) return;

  return cloudinary.api.update(publicId, {
    resource_type: resourceType,
    ...updates,
  });
}

export { cloudinary };
