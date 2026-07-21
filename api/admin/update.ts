import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateMedia, GALLERY_FOLDER, CATEGORIES, type Category } from '../../lib/cloudinary.js';
import { verifyRequest } from '../../lib/session.js';

/**
 * Owner updates one asset's caption / category / featured order.
 *
 * Body: {
 *   publicId: string,
 *   resourceType: 'image' | 'video',
 *   alt?: string,                       // caption + alt text (public gallery reads this)
 *   category?: 'kitchen' | 'bathroom' | 'countertop' | 'floor' | 'island' | 'other' | '',
 *   featuredOrder?: number | null       // null clears the pin, number 0-999 pins with that sort weight
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!verifyRequest(req)) return res.status(401).json({ error: 'unauthorized' });

  const body = (req.body ?? {}) as {
    publicId?: string;
    resourceType?: 'image' | 'video';
    alt?: string;
    category?: string;
    featuredOrder?: number | null;
  };

  const publicId = typeof body.publicId === 'string' ? body.publicId : '';
  if (!publicId) return res.status(400).json({ error: 'publicId required' });

  // Defense in depth (same as delete): only update assets inside the gallery folder.
  if (!publicId.startsWith(`${GALLERY_FOLDER}/`)) {
    return res.status(403).json({ error: 'publicId outside gallery folder' });
  }

  const resourceType = body.resourceType === 'video' ? 'video' : 'image';

  // Validate category if provided (allow empty string to clear).
  let category: Category | '' | undefined;
  if (body.category !== undefined) {
    if (body.category === '' || (CATEGORIES as readonly string[]).includes(body.category)) {
      category = body.category as Category | '';
    } else {
      return res.status(400).json({ error: 'invalid category' });
    }
  }

  // Validate featuredOrder.
  let featuredOrder: number | null | undefined;
  if (body.featuredOrder !== undefined) {
    if (body.featuredOrder === null) {
      featuredOrder = null;
    } else if (typeof body.featuredOrder === 'number' && body.featuredOrder >= 0 && body.featuredOrder <= 999) {
      featuredOrder = body.featuredOrder;
    } else {
      return res.status(400).json({ error: 'featuredOrder must be 0-999 or null' });
    }
  }

  // Cap alt text length so a mistake doesn't spam Cloudinary context storage.
  const alt = typeof body.alt === 'string' ? body.alt.slice(0, 500) : undefined;

  try {
    await updateMedia(publicId, resourceType, { alt, category, featuredOrder });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[admin/update]', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
