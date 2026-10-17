import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { retouchedPhoto, retouchedPhotoUrl, retouchedPhotoSrcSet } from '../lib/retouchedPhotos.ts';

const assets = JSON.parse(fs.readFileSync(new URL('../retouched-photo-assets.json', import.meta.url), 'utf8'));

test('new uploads retain the existing delivery fallback', () => {
  assert.equal(retouchedPhoto('a-new-owner-upload'), undefined);
  assert.equal(retouchedPhotoUrl('a-new-owner-upload', 800), undefined);
  assert.equal(retouchedPhotoSrcSet('a-new-owner-upload', [480, 800]), undefined);
});

test('every reviewed retouch has real local variants within its actual dimensions', () => {
  assert.equal(Object.keys(assets).length, 124);
  for (const [id, asset] of Object.entries(assets)) {
    assert.ok(asset.editedWithAI, id);
    assert.ok(asset.width > 0 && asset.height > 0, id);
    assert.ok(asset.variants.length > 0, id);
    const widths = asset.variants.map(variant => variant.width);
    assert.deepEqual(widths, [...new Set(widths)].sort((a, b) => a - b), id);
    for (const variant of asset.variants) {
      assert.ok(variant.width <= asset.width && variant.height <= asset.height, id);
      assert.ok(Math.abs(variant.width / variant.height - asset.width / asset.height) < 0.004, id);
      assert.ok(variant.src.startsWith('/photo-retouch-v2/') && !variant.src.includes('..'), id);
      const bytes = fs.readFileSync(new URL('../public' + variant.src, import.meta.url));
      assert.ok(bytes.length > 32, id);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', id);
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', id);
    }
    assert.equal(retouchedPhotoUrl(id, 10000), asset.src, id);
  }
});

test('retouch srcsets describe exported widths and deduplicate selected files', () => {
  const [id, asset] = Object.entries(assets)[0];
  const set = retouchedPhotoSrcSet(id, [0, -1, NaN, 320, 640, 640, 1600, 10000]);
  const widths = [...set.matchAll(/ (\d+)w(?:,|$)/g)].map(match => Number(match[1]));
  assert.deepEqual(widths, [...new Set(widths)].sort((a, b) => a - b));
  assert.ok(widths.every(width => width <= asset.width));
  assert.equal(widths.at(-1), asset.width);
});
