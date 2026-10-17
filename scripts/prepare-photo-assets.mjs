/**
 * Prepare corrected static/catalog copies; never overwrite a source photo.
 * Existing gallery uploads are corrected at delivery by lib/photoDelivery.ts.
 * Run explicitly with VITE_CLOUDINARY_UPLOAD_PRESET set, not during builds.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildPhotoUrl, PHOTO_CORRECTION, photoWidths } from '../lib/photoDelivery.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cloud = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dst5uru0';
const preset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;
if (!preset) throw new Error('Set VITE_CLOUDINARY_UPLOAD_PRESET to the existing owner upload preset.');
const checkpointPath = path.join(root, 'catalog/photo-sources.json');
let checkpoint = { version: 1, correction: PHOTO_CORRECTION, sources: {} };
try { checkpoint = JSON.parse(await fs.readFile(checkpointPath, 'utf8')); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
checkpoint.correction = PHOTO_CORRECTION;
const saveCheckpoint = async () => {
  // Synchronous ordering on the JS event loop: a write queue prevents an older
  // parallel request from overwriting a newer completed asset record.
  const text = JSON.stringify(checkpoint, null, 2) + '\n';
  writes = writes.then(() => fs.writeFile(checkpointPath, text));
  await writes;
};
let writes = Promise.resolve();

async function request(url, init = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(60000) });
    if (response.ok) return response;
    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    throw new Error(`${response.status} ${await response.text()}`);
  }
}

const sourcePaths = [
  ...(await fs.readdir(path.join(root, 'catalog/images'))).filter((name) => name.endsWith('.jpeg')).map((name) => `catalog/images/${name}`),
  ...(await fs.readdir(path.join(root, 'public/stone-slabs/edited'))).filter((name) => name.endsWith('.jpeg')).map((name) => `public/stone-slabs/edited/${name}`),
  ...(await fs.readdir(path.join(root, 'public/cinematic'))).filter((name) => name.endsWith('.webp')).map((name) => `public/cinematic/${name}`),
].sort();
let completed = 0;
const failures = [];

async function prepare(source) {
  const bytes = await fs.readFile(path.join(root, source));
  const sourceSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  let record = checkpoint.sources[source];
  if (!record || record.sourceSha256 !== sourceSha256) {
    const name = path.basename(source);
    const body = new FormData();
    body.append('file', new Blob([bytes], { type: source.endsWith('.webp') ? 'image/webp' : 'image/jpeg' }), name);
    body.append('upload_preset', preset);
    body.append('folder', 'shayish/quality-sources');
    body.append('public_id', `photo-quality-20261017/${source.startsWith('catalog/') ? 'catalog' : 'site'}-${path.parse(name).name}-${sourceSha256.slice(0, 12)}`);
    body.append('tags', 'site-derivative-source');
    const response = await request(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
    const uploaded = await response.json();
    if (!uploaded.public_id || !uploaded.width || !uploaded.height) throw new Error(`Incomplete upload response: ${source}`);
    record = { sourceSha256, publicId: uploaded.public_id, width: uploaded.width, height: uploaded.height };
    checkpoint.sources[source] = record;
    await saveCheckpoint();
  }
  const material = source.includes('/stone-') || source.includes('stone-slabs/');
  const options = { nativeWidth: record.width, nativeHeight: record.height, role: material ? 'material' : 'project' };
  if (source.startsWith('catalog/')) {
    const output = `catalog/enhanced/${path.basename(source)}`;
    const url = buildPhotoUrl(cloud, record.publicId, { ...options, width: record.width, format: 'jpg' });
    const response = await request(url);
    await fs.mkdir(path.dirname(path.join(root, output)), { recursive: true });
    await fs.writeFile(path.join(root, output), Buffer.from(await response.arrayBuffer()));
    record.output = output;
  } else {
    const stem = source.replace(/^public\//, '').replace(/\.(?:jpeg|webp)$/, '');
    const revision = crypto.createHash('sha256').update(sourceSha256 + JSON.stringify(PHOTO_CORRECTION)).digest('hex').slice(0, 10);
    record.variants = [];
    for (const width of photoWidths([480, 800, 1200, 1600, record.width], record.width)) {
      const output = `public/photo-quality/${stem}-${width}-${revision}.webp`;
      const response = await request(buildPhotoUrl(cloud, record.publicId, { ...options, width, format: 'webp' }));
      await fs.mkdir(path.dirname(path.join(root, output)), { recursive: true });
      await fs.writeFile(path.join(root, output), Buffer.from(await response.arrayBuffer()));
      record.variants.push({ src: output.replace(/^public/, ''), width });
    }
  }
  await saveCheckpoint();
  completed++;
  if (completed % 10 === 0 || completed === sourcePaths.length) console.log(JSON.stringify({ prepared: completed, total: sourcePaths.length }));
}

let index = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (index < sourcePaths.length) {
    const source = sourcePaths[index++];
    try { await prepare(source); } catch (error) { failures.push({ source, error: String(error) }); console.error(`${source}: ${error.message}`); }
  }
}));
await writes;
if (failures.length) {
  console.error(JSON.stringify({ failures, completed }));
  process.exitCode = 1;
} else {
  const assets = {};
  for (const [source, record] of Object.entries(checkpoint.sources)) {
    if (!source.startsWith('public/') || !record.variants) continue;
    const variants = record.variants;
    const largest = variants[variants.length - 1];
    assets[source.replace(/^public/, '')] = {
      src: largest.src, srcSet: variants.map((v) => `${v.src} ${v.width}w`).join(', '),
      width: record.width, height: record.height,
    };
  }
  await fs.writeFile(path.join(root, 'public-photo-assets.json'), JSON.stringify(assets, null, 2) + '\n');
  console.log(JSON.stringify({ completed, catalog: sourcePaths.filter((s) => s.startsWith('catalog/')).length, site: Object.keys(assets).length }));
}
