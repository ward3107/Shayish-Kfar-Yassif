import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalSelection, normalizeSelections, readSelections, toggleSelection, selectionLink, parseSharedSelection, selectionMessage, MAX_SELECTIONS } from '../lib/selections.ts';
import { prepareSelectionSheets } from '../lib/selectionSheets.ts';

test('homepage and gallery references select the same slab, including alternate slab photos', () => {
  const home = 's:stone-13-x263';
  for (const id of ['ip7pl3dilvqwvczch51e', 'v4scxwjc6qqioy3x6zw2', 'falj3g2mxto7o9mzrpl7']) {
    assert.equal(canonicalSelection(`shayish/gallery/${id}`), home);
    assert.deepEqual(toggleSelection([home], `g:${id}`), []);
  }
  assert.deepEqual(normalizeSelections(['g:ip7pl3dilvqwvczch51e', home]), [home]);
});

test('new gallery uploads, video posters, materials and existing project photos retain stable references', () => {
  assert.equal(canonicalSelection('shayish/gallery/new-upload_2026'), 'g:new-upload_2026');
  assert.equal(canonicalSelection('shayish/materials/calacatta'), 'm:calacatta');
  assert.equal(canonicalSelection('g:IMG-20260718-WA0049'), 'g:IMG-20260718-WA0049');
  assert.equal(canonicalSelection('v:workshop-video'), 'v:workshop-video');
});

test('malformed or injected references cannot select arbitrary files or external hosts', () => {
  for (const value of [null, {}, 42, 'g:../../secret', 'g:<script>', 'g:foo/bar', 'javascript:alert(1)', 'https://evil.invalid/image.jpg', 's:unknown', 'm:unknown', 'g:' + 'a'.repeat(121)]) assert.equal(canonicalSelection(value), null);
});

test('corrupt storage is recoverable and a full list still allows removal', () => {
  assert.deepEqual(readSelections('{broken'), []);
  assert.deepEqual(readSelections('{"refs":[]}'), []);
  assert.deepEqual(readSelections('["g:one","g:one",null,"g:two"]'), ['g:one', 'g:two']);
  const full = Array.from({ length: MAX_SELECTIONS }, (_, i) => `g:photo${i}`);
  assert.equal(toggleSelection(full, 'g:extra').length, MAX_SELECTIONS);
  assert.equal(toggleSelection(full, 'g:photo0').length, MAX_SELECTIONS - 1);
});

test('shared URLs round-trip all selections without changing the recipients own list', () => {
  const personal = ['g:mine'];
  const sent = ['s:stone-13-x263', 'g:IMG-20260718-WA0049', 'm:calacatta'];
  const url = new URL(selectionLink('https://shayish-kfar-yassif.vercel.app/ignored', sent));
  assert.equal(url.pathname, '/favorites');
  assert.equal(url.search, '');
  assert.deepEqual(parseSharedSelection(url.hash), { refs: sent, invalid: false });
  assert.deepEqual(personal, ['g:mine']);
  assert.equal(parseSharedSelection(''), null);
  const full = Array.from({ length: MAX_SELECTIONS }, (_, i) => `g:photo${i}`);
  assert.deepEqual(parseSharedSelection(new URL(selectionLink(url.origin, full)).hash)?.refs, full);
});

test('invalid shared links do not silently show the recipients personal selections', () => {
  for (const hash of ['#v2=g:one', '#v1=', '#v1=g:one,https://evil.invalid', '#v1=%ZZ', '#v1=' + 'x'.repeat(24001), '#v1=' + Array.from({ length: 151 }, (_, i) => `g:p${i}`).join(',')]) {
    assert.deepEqual(parseSharedSelection(hash), { refs: [], invalid: true });
  }
});

test('WhatsApp message includes a readable name and all-photo link; private input never enters the link', () => {
  const labels = Array.from({ length: 30 }, (_, i) => `Photo ${i}`);
  const url = selectionLink('https://example.com', ['g:one']);
  const message = selectionMessage({ intro: 'Hello', nameLabel: 'Name', name: 'Waseem\n\u202eTest', labels, linkLabel: 'All photos', url });
  assert.ok(message.includes('Name: Waseem  Test'));
  assert.ok(message.includes('12. Photo 11'));
  assert.ok(!message.includes('13. Photo 12'));
  assert.ok(message.includes('All photos (30):\n' + url));
  assert.ok(!url.includes('Waseem'));
  const href = `https://wa.me/972505636648?text=${encodeURIComponent(message)}`;
  assert.equal(new URL(href).searchParams.get('text'), message);
});

test('photo sheets include every image exactly once and fail rather than silently omit a broken photo', async () => {
  const originals = { Image: globalThis.Image, document: globalThis.document, window: globalThis.window };
  let drawn = [];
  globalThis.window = { setTimeout };
  globalThis.Image = class {
    naturalWidth = 800; naturalHeight = 1000;
    set src(value) { this.source = value; if (value) queueMicrotask(() => value === 'broken' ? this.onerror?.() : this.onload?.()); }
  };
  globalThis.document = { createElement: () => ({
    width: 0, height: 0,
    getContext: () => ({ fillRect() {}, fillText() {}, measureText: text => ({ width: text.length * 10 }), drawImage: image => drawn.push(image.source) }),
    toBlob: callback => callback(new Blob(['jpeg-data'], { type: 'image/jpeg' })),
  }) };
  try {
    const items = Array.from({ length: 7 }, (_, i) => ({ image: `photo${i}`, label: `Photo ${i}`, code: `${i}`, ref: `g:p${i}` }));
    const files = await prepareSelectionSheets(items, 'My selections', '050-563-6648', new AbortController().signal);
    assert.equal(files.length, 2);
    assert.ok(files.every(file => file.type === 'image/jpeg' && file.size > 0));
    assert.deepEqual(drawn, items.map(item => item.image));
    await assert.rejects(prepareSelectionSheets([{ ...items[0], image: 'broken' }], '', '', new AbortController().signal), /Photo unavailable/);
    const controller = new AbortController(); controller.abort();
    await assert.rejects(prepareSelectionSheets(items, '', '', controller.signal), { name: 'AbortError' });
  } finally {
    for (const [key, value] of Object.entries(originals)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; }
  }
});
