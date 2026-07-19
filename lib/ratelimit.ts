/**
 * Best-effort in-memory rate limiter, keyed by IP.
 *
 * IMPORTANT: Vercel serverless functions are per-instance. A single instance
 * absorbing a burst is throttled; a distributed attacker hitting different
 * instances gets one attempt each. That's fine for the small blast radius of
 * this admin (one owner, one password), but for real hardening swap this for
 * Upstash / Vercel KV:
 *
 *   import { Ratelimit } from '@upstash/ratelimit';
 *   import { kv } from '@vercel/kv';
 *   const limiter = new Ratelimit({ redis: kv, limiter: Ratelimit.slidingWindow(5, '15 m') });
 *
 * Store shape: ip -> [{ ts }] within the current window. Trimmed on each hit.
 */

type Hit = { ts: number };
const buckets = new Map<string, Hit[]>();

export function clientIp(req: { headers: Record<string, string | string[] | undefined> }): string {
  const xff = req.headers['x-forwarded-for'];
  const first = Array.isArray(xff) ? xff[0] : xff;
  if (typeof first === 'string' && first.length > 0) return first.split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string') return real;
  return 'unknown';
}

/**
 * @returns { allowed, retryAfterSeconds }
 */
export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const bucket = (buckets.get(key) ?? []).filter((h) => h.ts > cutoff);

  if (bucket.length >= max) {
    const oldest = bucket[0].ts;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, bucket);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.push({ ts: now });
  buckets.set(key, bucket);
  return { allowed: true, retryAfterSeconds: 0 };
}
