import assert from 'node:assert/strict';
import test from 'node:test';
import { clampVase, vaseLayout } from '../components/cinematic/vaseLayout.ts';

test('drag overshoot stops at the surface boundaries', () => {
  assert.equal(clampVase(-800), 0);
  assert.equal(clampVase(300), 100);
  assert.equal(clampVase(42), 42);
});

test('vase remains entirely within mobile and desktop surfaces, with room to move', () => {
  for (const [width, height] of [[320, 600], [390, 844], [750, 1000], [768, 1024], [1440, 900], [1920, 1080], [2560, 1440]]) {
    const result = vaseLayout(width, height, width * .52);
    assert.ok(result.minX >= 0);
    assert.ok(result.maxX > result.minX);
    assert.ok(result.maxX + result.width < width);
    assert.ok(result.bottom - result.height > 0);
    if (width > 750) assert.ok(result.maxX + result.width < width * .52 - 24);
  }
});

test('contact point follows the photographed shelf when cover cropping changes', () => {
  assert.equal(vaseLayout(1672, 941).bottom, 841);
  assert.equal(vaseLayout(941 / 2, 1672 / 2).bottom, 1481 / 2);
  // On an ultrawide screen the vertically cropped shelf still anchors the vase.
  const layout = vaseLayout(2000, 600);
  const scale = 2000 / 1672;
  assert.equal(layout.bottom, 600 - 941 * scale + 841 * scale);
  assert.ok(layout.bottom + layout.reflectionHeight < 600);
  assert.ok(layout.reflectionHeight > 0);
});
