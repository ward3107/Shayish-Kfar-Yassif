import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyRequest } from '../lib/session.ts';
import { clientIp } from '../lib/ratelimit.ts';
import { configuration, readSwitch, sameOrigin, parseInput, preparePhoto, buildMasks, reserve, generateImage, compositeResult, verifyChallenge, VisualizerError } from '../lib/visualizerServer.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const config = configuration();
  try {
    if (req.method === 'GET') {
      const preview = req.query.preview === '1' && verifyRequest(req);
      // With no image provider configured, no external call is needed on public pages.
      const enabled = config.configured && await readSwitch();
      return res.status(200).json({ enabled, preview: !!preview, ...(enabled ? { siteKey: process.env.TURNSTILE_SITE_KEY } : {}) });
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
    if (!sameOrigin(req) || !req.headers['content-type']?.startsWith('application/json')) return res.status(403).json({ error: 'forbidden' });
    if (!config.configured) return res.status(503).json({ error: 'unavailable' });
    if (!await readSwitch()) return res.status(403).json({ error: 'disabled' });
    const input = parseInput(req.body);
    const ip = clientIp(req);
    if (ip === 'unknown') return res.status(403).json({ error: 'forbidden' });
    await verifyChallenge(req.body?.verificationToken, new URL(String(req.headers.origin)).hostname, ip);
    const prepared = await preparePhoto(input.photo);
    const { mask, coverage } = await buildMasks(prepared.width, prepared.height, input.regions);
    // Do not cache the switch on the generation path. OFF rejects stale tabs.
    if (!await readSwitch()) return res.status(403).json({ error: 'disabled' });
    await reserve(ip, input);
    const generated = await generateImage(input, prepared, mask, ip);
    const output = await compositeResult(prepared.photo, generated, coverage, prepared.width, prepared.height);
    res.setHeader('Content-Type', 'image/jpeg');
    return res.status(200).send(output);
  } catch (error) {
    // Never log uploaded photos, provider payloads, keys, or raw provider errors.
    if (error instanceof VisualizerError) {
      if (error.status === 429) res.setHeader('Retry-After', '86400');
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(503).json({ error: 'unavailable' });
  }
}
