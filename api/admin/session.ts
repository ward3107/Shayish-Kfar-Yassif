import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyRequest } from '../../lib/session.js';

/** Whoami — the admin page uses this on load to decide login vs dashboard. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ authenticated: verifyRequest(req) });
}
