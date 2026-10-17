import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildPhotoUrl, buildPhotoSrcSet, buildCroppedPhotoSrcSet, photoWidths } from '../lib/photoDelivery.ts';

const metadata = JSON.parse(fs.readFileSync(new URL('../photo-metadata.json', import.meta.url), 'utf8'));
const curation = JSON.parse(fs.readFileSync(new URL('../gallery-curation.json', import.meta.url), 'utf8'));

test('a width descriptor never promises pixels beyond the original photo', () => {
  assert.deepEqual(photoWidths([320, 640, 960, 1280, 2560], 1200), [320, 640, 960, 1200]);
  assert.deepEqual(photoWidths([0, -1, NaN, 800, 400, 800], 600), [400, 600]);
  const set = buildPhotoSrcSet('owner', 'gallery/photo', [640, 1280, 2048], { nativeWidth: 942 });
  assert.deepEqual([...set.matchAll(/ (\d+)w(?:,|$)/g)].map((m) => Number(m[1])), [640, 942]);
});

test('banner crops respect both native dimensions and retain their target ratio', () => {
  const url = buildPhotoUrl('owner', 'gallery/photo', { width: 2400, height: 1600, nativeWidth: 1200, nativeHeight: 800, crop: 'fill' });
  assert.match(url, /c_lfill,g_auto,w_1200,h_800/);
  const set = buildCroppedPhotoSrcSet('owner', 'material/slab', [400, 800, 1200], 0.8, { nativeWidth: 1600, nativeHeight: 1000 });
  assert.deepEqual([...set.matchAll(/ (\d+)w(?:,|$)/g)].map((m) => Number(m[1])), [400, 800]);
  assert.match(set, /w_800,h_1000/);
});

test('stone swatches receive no automatic recolouring or generative effects', () => {
  const url = buildPhotoUrl('owner', 'material/stone', { width: 800, role: 'material' });
  assert.doesNotMatch(url, /auto_color|gen_|enhance|replace|remove/);
  assert.match(url, /c_limit,w_800/);
});

test('the owner can request uncorrected delivery and IDs remain safely encoded', () => {
  const url = buildPhotoUrl('owner', 'folder/אבן #1', { width: 800, corrected: false });
  assert.doesNotMatch(url, /e_auto|e_sharpen/);
  assert.match(url, /folder\/%D7%90%D7%91%D7%9F%20%231$/);
});

test('all existing gallery photos have native dimensions and reviewed captions', () => {
  const photos = Object.entries(metadata).filter(([id]) => id.startsWith('shayish/gallery/'));
  assert.equal(photos.length, 126);
  for (const [id, dimensions] of photos) {
    assert.ok(dimensions.width > 0 && dimensions.height > 0, id);
    assert.ok(curation.items[id]?.caption?.length > 15, id);
    const url = buildPhotoUrl('owner', id, { width: 5000, nativeWidth: dimensions.width });
    assert.ok(url.includes(`c_limit,w_${dimensions.width}/`), id);
  }
});
