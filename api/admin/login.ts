import type { VercelRequest, VercelResponse } from '@vercel/node';
import { issueSessionCookie, passwordMatches } from '../../lib/session.js';
import { clientIp, rateLimit } from '../../lib/ratelimit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'admin not configured' });
  }

  // 5 attempts per IP per 15 minutes. See lib/ratelimit.ts for the KV upgrade.
  const gate = rateLimit(`login:${clientIp(req)}`, { max: 5, windowMs: 15 * 60 * 1000 });
  if (!gate.allowed) {
    res.setHeader('Retry-After', String(gate.retryAfterSeconds));
    return res.status(429).json({ error: 'too many attempts, try later' });
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
