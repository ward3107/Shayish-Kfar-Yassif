import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyRequest } from '../../lib/session.ts';
import { configuration, readSwitch, writeSwitch, sameOrigin } from '../../lib/visualizerServer.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (!verifyRequest(req)) return res.status(401).json({ error: 'unauthorized' });
  if (!['GET', 'POST'].includes(req.method || '')) { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const config = configuration();
  try {
    if (req.method === 'POST') {
      if (!sameOrigin(req) || !req.headers['content-type']?.startsWith('application/json')) return res.status(403).json({ error: 'forbidden' });
      if (typeof req.body?.enabled !== 'boolean') return res.status(400).json({ error: 'invalid_input' });
      if (req.body.enabled && !config.configured) return res.status(409).json({ error: 'setup_required', missing: config.missing });
      await writeSwitch(req.body.enabled);
    }
    return res.status(200).json({ enabled: await readSwitch(), configured: config.configured, missing: config.missing, dailyLimit: config.limit || 10, monthlyLimit: config.monthlyLimit || 100, perNetworkLimit: 2 });
  } catch { return res.status(503).json({ error: 'settings_unavailable' }); }
}
