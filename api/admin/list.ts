import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listMedia } from '../../lib/cloudinary.js';
import { verifyRequest } from '../../lib/session.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'unauthorized' });
  try {
    const items = await listMedia();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return res.status(500).json({ error: message });
  }
}
