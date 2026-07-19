import crypto from 'node:crypto';

/**
 * Minimal signed-session helper. No third-party JWT library required — HMAC
 * over `<payload>.<expires>` gives us a tamper-proof cookie value. Rotating
 * ADMIN_SESSION_SECRET invalidates every session, which is exactly what we
 * want for lockout.
 *
 * Env vars:
 *   ADMIN_PASSWORD        — the password the owner types on /admin
 *   ADMIN_SESSION_SECRET  — random 32+ char string used to sign the cookie
 */

const COOKIE_NAME = 'shayish_admin';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const b64urlDecode = (s: string) =>
  Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

function sign(payload: string, secret: string) {
  return b64url(crypto.createHmac('sha256', secret).update(payload).digest());
}

export function issueSessionCookie(secret: string): string {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${b64url('admin')}.${expires}`;
  const sig = sign(payload, secret);
  const value = `${payload}.${sig}`;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function verifyRequest(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookieHeader = req.headers.cookie;
  const cookies = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader ?? '';
  const match = cookies.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;

  const value = match.slice(COOKIE_NAME.length + 1);
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [subject, expiresStr, sig] = parts;
  const expected = sign(`${subject}.${expiresStr}`, secret);

  // Constant-time compare to prevent timing attacks.
  const a = b64urlDecode(sig);
  const b = b64urlDecode(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires * 1000 < Date.now()) return false;

  return true;
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
