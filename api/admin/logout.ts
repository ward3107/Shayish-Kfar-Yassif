import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearSessionCookie } from '../../lib/session.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', clearSessionCookie());
  return res.status(200).json({ ok: true });
}
