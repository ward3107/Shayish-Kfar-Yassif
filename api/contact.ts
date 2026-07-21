import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clientIp, rateLimit } from '../lib/ratelimit.js';

/**
 * Public contact-form endpoint.
 *
 * Flow:
 *   1. Rate-limit by IP (3 per 10 min) so a bot can't flood the owner's inbox.
 *   2. Validate name / email / message minimally.
 *   3. Send the message to the owner via Resend (https://resend.com — free
 *      100 emails/day). If RESEND_API_KEY isn't set we skip email and just
 *      log to Vercel's function logs, and return ok:true so the visitor UX
 *      isn't broken while the owner sets up email — they can watch logs.
 *
 * Env vars (all optional; endpoint works in degraded mode without them):
 *   RESEND_API_KEY       — from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL     — owner's inbox (defaults to info@shayish-yasif.co.il)
 *   CONTACT_FROM_EMAIL   — sender address; must be on a Resend-verified
 *                          domain (defaults to onboarding@resend.dev for
 *                          testing — swap once your domain is verified)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  // Honeypot: real users leave this blank; bots fill every input. Any
  // non-empty value quietly 204s (looks like success to the bot).
  website?: unknown;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const body = (req.body ?? {}) as ContactBody;

  // Silent honeypot trap.
  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

  // Rate-limit BEFORE reading body fields so an attacker sending garbage
  // still hits the limiter.
  const gate = rateLimit(`contact:${clientIp(req)}`, { max: 3, windowMs: 10 * 60 * 1000 });
  if (!gate.allowed) {
    res.setHeader('Retry-After', String(gate.retryAfterSeconds));
    return res.status(429).json({ error: 'too many requests, try again later' });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';

  if (!name || name.length < 2) return res.status(400).json({ error: 'name required' });
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'valid email required' });
  if (!message || message.length < 10) return res.status(400).json({ error: 'message must be at least 10 characters' });

  const to = process.env.CONTACT_TO_EMAIL || 'info@shayish-yasif.co.il';
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
  const apiKey = process.env.RESEND_API_KEY;

  const subject = `New inquiry from ${name}`;
  const html = `<h2>New inquiry from the website</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> <a href="mailto:${encodeURI(email)}">${escapeHtml(email)}</a></p>
<p><strong>Message:</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<hr />
<p style="color:#888;font-size:12px">Sent via shayish-yasif.co.il contact form. Rate-limited to 3/10min per IP.</p>`;
  const text = `New inquiry from ${name}\n\nEmail: ${email}\n\nMessage:\n${message}\n\n— shayish-yasif.co.il contact form`;

  if (!apiKey) {
    // Degraded mode: log the submission so the owner can grep Vercel logs
    // until they wire RESEND_API_KEY. Don't fail the user's request.
    console.log('[contact] RESEND_API_KEY not set; submission logged only:', { name, email, message: message.slice(0, 200) });
    return res.status(200).json({ ok: true, delivered: false, note: 'email disabled' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });
    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => '');
      console.error('[contact] Resend failed:', resendRes.status, errText.slice(0, 300));
      return res.status(502).json({ error: 'email delivery failed' });
    }
    return res.status(200).json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[contact] send error:', err);
    return res.status(500).json({ error: 'internal error' });
  }
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
