import type { VercelRequest, VercelResponse } from '@vercel/node';
import { issueSessionCookie, passwordMatches } from '../../lib/session.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'admin not configured' });
  }

  const body = (req.body ?? {}) as { password?: string };
  const password = typeof body.password === 'string' ? body.password : '';

  if (!passwordMatches(password)) {
    // Deliberate small delay to blunt brute-force.
    await new Promise((r) => setTimeout(r, 400));
    return res.status(401).json({ error: 'invalid password' });
  }

  res.setHeader('Set-Cookie', issueSessionCookie(secret));
  return res.status(200).json({ ok: true });
}
