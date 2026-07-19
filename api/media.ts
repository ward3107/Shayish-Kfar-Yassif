import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listMedia } from '../lib/cloudinary.js';

/**
 * Public gallery feed. Cached for 60s at the edge so the Gallery page
 * doesn't hammer Cloudinary's Search API on every page load.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const items = await listMedia();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    res.status(500).json({ error: message });
  }
}
