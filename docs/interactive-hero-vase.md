# Interactive hero vase

Visitors can drag the existing hero vase horizontally, move it with arrow buttons or keyboard arrows, and reset it. The photographed shelf determines its vertical anchor. A contact shadow, directional cast shadow and faded reflection share its horizontal transform. No movement is automatic; reduced motion disables button easing. Vertical touch scrolling and pinch zoom remain available.

The desktop range ends before the hero copy, including after language changes. Mobile uses a portrait background and narrower object. Pointer capture ends on release/cancellation; resizing resets the active gesture. The controls become inert as the scroll transition hides the green scene. Failed image loads fall back to the original complete hero photograph.

This is a photographic layered interaction, not a reconstructed 3D object. The vase does not rotate or reveal new sides. The new raster files are WebP exports of built-in Imagegen edits; no gallery originals were replaced or uploaded again.

## Assets and generation prompts

Sources: `public/photo-quality/cinematic/hero-green-vase-1672-3d7d2127c3.webp` and the corresponding portrait `hero-green-vase-mobile-941-9244a47c0c.webp`.

Outputs: `public/cinematic/interactive-vase/` contains the transparent vase at 600, 1000 and 1431 pixels, the desktop plate at 800 and 1672 pixels, and the portrait plate at 480 and 941 pixels. Pillow was used only to resize and encode the generated images. No external image-generation API or CLI fallback was used.

**Cutout prompt:** Edit this photograph into one isolated transparent product cutout: retain EXACTLY the existing sage green ceramic vase AND every olive branch and leaf together as one object. Preserve the exact vase identity, silhouette, grain, olive leaf layout, size ratios, camera angle and warm light from upper left. Remove ALL stone wall, countertop, cast shadows and reflected vase. Actual transparent alpha background including all gaps between stems and leaves. No floor, no pedestal, no text. The entire object must be intact with no clipped leaf tips and minimal transparent margin. This is a faithful extraction for compositing back into the same scene, not a redesign.

**Desktop plate prompt:** Make a clean empty background plate from this EXACT photograph. Remove ONLY the green vase, ALL branches/leaves, their cast shadow and their reflection in the polished shelf. Reconstruct continuous green marble veining in the areas they occupied. Preserve the entire wall and shelf, original 16:9 framing, exact perspective, shelf top seam and front edge heights, all existing stone pattern outside the removed object, original color, texture, warm directional illumination, and image sharpness. No objects remain. No new decor. Do not crop, reframe, zoom or move the camera. Full bleed photorealistic architectural background.

**Portrait plate prompt:** Make a clean empty background plate from this EXACT portrait photograph. Remove ONLY the green vase, ALL branches/leaves, their cast shadow and their reflection in the polished shelf. Reconstruct continuous green marble veining where they were. Preserve the full original 9:16 portrait framing, exact perspective, shelf top seam and front edge heights, all existing stone pattern outside the removed object, original color, texture, warm directional illumination, and image sharpness. No objects remain. No new decor. Do not crop, reframe, zoom or move the camera. Full bleed photorealistic architectural background.

## Verification

`npm run typecheck`, `npm run test:photos`, `npm run test:vase`, and `npm run build`. The vase tests cover overshoot, responsive travel bounds, clearance from text, and the shelf anchor under image cropping. Browser checks cover drag, keyboard boundaries, reset, responsive layout, languages and the existing scroll transition. Responsive emulation is not a physical-device touch test.
