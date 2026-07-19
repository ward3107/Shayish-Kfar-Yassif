import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cloudinary, GALLERY_FOLDER } from '../../lib/cloudinary.js';
import { verifyRequest } from '../../lib/session.js';

/**
 * Signed upload endpoint (opt-in alternative to the unsigned preset).
 *
 * Flow:
 *   1. Admin UI POSTs here with { resourceType, publicId? } — session gated.
 *   2. We hand back { timestamp, signature, apiKey, cloudName, folder }.
 *   3. Browser POSTs the file directly to Cloudinary with those fields; the
 *      unsigned preset never has to exist. This means only an authenticated
 *      owner can upload, and the abuse surface of a leaked preset disappears.
 *
 * The client should send the same `folder` param unchanged — Cloudinary
 * signs each field, so tampering invalidates the signature.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!verifyRequest(req)) return res.status(401).json({ error: 'unauthorized' });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'cloudinary not configured' });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = { folder: GALLERY_FOLDER, timestamp };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return res.status(200).json({
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder: GALLERY_FOLDER,
  });
}
