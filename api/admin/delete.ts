import type { VercelRequest, VercelResponse } from '@vercel/node';
import { destroyMedia } from '../../lib/cloudinary.js';
import { verifyRequest } from '../../lib/session.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!verifyRequest(req)) return res.status(401).json({ error: 'unauthorized' });

  const body = (req.body ?? {}) as { publicId?: string; resourceType?: 'image' | 'video' };
  const publicId = typeof body.publicId === 'string' ? body.publicId : '';
  const resourceType = body.resourceType === 'video' ? 'video' : 'image';
  if (!publicId) return res.status(400).json({ error: 'publicId required' });

  try {
    const result = await destroyMedia(publicId, resourceType);
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return res.status(500).json({ error: message });
  }
}
