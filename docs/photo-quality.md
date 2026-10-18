# Photo quality, AI retouches and originals

The prepared update reviews all 126 gallery images. Individual AI retouches
remove unrelated people, tools, packaging and installation debris, and improve
framing, perspective and illumination. Two existing clean visualizations are
retained. These are edited illustrations: reconstructed areas, stone patterns
and other details can differ from the original photograph. The lightbox labels
AI versions. Original files are retained privately in the asset history; the
public gallery has no original-photo comparison control.

Retouches are exported to `public/photo-retouch-v2` with content fingerprints
and actual width/height metadata in `retouched-photo-assets.json`. The gallery,
featured homepage projects and admin previews use the same local versions.
Responsive descriptors describe the exported pixels, rather than the larger
original. A failed derivative falls back to the original without a retry loop.
No original Cloudinary public ID or source file is overwritten.

New admin uploads and images without a retouch retain the existing gentle,
non-generative Cloudinary delivery: small brightness/colour/contrast blends,
light sharpening after resizing, and native pixel bounds. Material swatches
retain their colour balance. About-page images retain their colour and the
existing detail view avoids excessive enlargement.

## Import and review

AI content editing is performed with imagegen. The import command only converts
formats, exports responsive delivery sizes and creates the private review:

```sh
python scripts/import-photo-retouches.py \
  --inventory /absolute/path/image-inventory.json \
  --edits /absolute/path/retouch-v2-final-manifest.json \
  --review-dir /absolute/path/photo-retouch-review
```

The inventory supplies each original path and SHA-256; the edits manifest
supplies each generated result and its public ID. All original hashes are
checked before import. The resulting standalone review includes embedded
before/after previews; the ZIP also includes full edited files and unchanged
originals. They can be inspected without publishing the website.

Eight additional catalog originals are independently retouched from their own
source photographs. `scripts/complete-photo-review.py prepare` adds these to
the review, exports their JPEGs, and records their original hashes with
`sourceKind: catalog-original`. The final review contains 134 entries: 126
gallery images (124 new edits and two retained visualizations) and eight
additional catalog edits. It never uses an ambiguous match to substitute a
different project. Run `prepare` after gallery import and before rebuilding
the PDF; run `package` after the PDF rebuild. Both modes accept `--review-dir`,
`--gallery-edits` and `--catalog-edits`. The package includes full PNG renders,
JPEGs, unchanged originals, the PDF and the standalone comparison.

## Static images and PDF catalog

`npm run photos:prepare` creates native corrected copies of the 90 catalog
images and 18 homepage slab/hero images using the owner's existing public
upload preset. Sources remain under `catalog/images`, `public/cinematic` and
`public/stone-slabs/edited`. Tagged working copies are excluded from media lists.

Run native preparation before importing AI retouches. The import replaces only
catalog photographs with unambiguous exact visual matches to reviewed gallery
sources, recorded in `catalog/retouch-sources.json`; existing renderings and
ambiguous matches are retained. Rebuild the PDF and previews afterwards:

```sh
python catalog/build.py
python catalog/build-preview.py
```

PDF export retains quality 90 and a 180 DPI ceiling. These settings preserve
available detail; they do not recover information absent from a source.
Existing PDF URLs are retained. The catalog identifies digital reconstructions.

## Validation

### Gallery consistency update — 18 October 2026

`gallery-slab-sources.json` maps all 15 existing slab gallery records to the
13 approved homepage slabs. `retouchedPhotos.ts` resolves their thumbnail,
responsive and lightbox variants directly from `public-photo-assets.json`.
No duplicate slab uploads or new gallery records are created. The three
existing views of the final white-and-gold slab share its approved image.

Seven views of the fluted basin were edited with Imagegen to remove the blue
metal workshop supports and surrounding worktables. Each preserves its own
viewpoint and uses a neutral display surface with a contact shadow. These are
AI-edited product illustrations, not additional photographs of an installation.
The exact source/output associations and SHA-256 hashes are recorded in
`gallery-sink-cleanup-20261018.json`. Existing originals remain unchanged.

Imagegen prompt:

> Edit this exact product photograph. Preserve the marble basin itself EXACTLY: identical rectangular geometry, precise camera angle and perspective, crop and size in frame, vertical rounded fluting count and shapes, thin rim, basin interior, raised inner ledge, drain opening if visible, and especially every existing white/ivory, black-gray and warm gold stone vein and its placement. Do not redesign, recolor, smooth out or regenerate the sink pattern. Remove ALL blue metal workstands, supporting legs, crossbars and wooden rails, including background worktables. Replace only the surrounding workshop/yard with a clean warm light-gray studio backdrop and a plain matte neutral display surface directly beneath the basin. The basin must rest physically on this continuous surface with a small soft contact shadow, not float. No visible stand, legs, frames, cabinets, faucets, accessories or signage. Keep the entire sink visible with all its bottom fluted edges. Photorealistic premium product photography, softly lit to match the source, natural stone texture, crisp detail. Preserve original portrait aspect ratio. No text.

The seven basin JPEGs in `catalog/enhanced` use the same new edits, and its
13 slab JPEGs are exact copies of `public/stone-slabs/edited`. Rebuild and review
both catalog PDF URLs and the preview pages when publishing these sources.

```sh
npm run typecheck
npm run test:photos
npm run build
git diff --check
```

Tests cover native pixel bounds, new-upload fallback, exported retouch variants,
responsive descriptors and the retained baseline captions. The original
126-image CDN audit remains in `photo-quality-audit.json`; it is separate from
the new local asset checks and is not proof of exact generative fidelity.
