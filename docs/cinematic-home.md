# Cinematic home

The homepage opens on a green marble still-life with a sage vase and olive branches, then reveals black-and-gold marble with a patinated metal sculpture as the visitor scrolls. The transition into the slab collection reveals the heading, a fine gold line and the cards in sequence, before the three project stories. Reduced-motion mode shows the slab collection immediately.

## Files and assets

- `components/cinematic/CinematicHome.tsx`: opening, three project stories, material selector, project dialog, craft and contact sections.
- `components/cinematic/useCinematicScroll.ts`: scroll/resize updates with one scheduled animation frame and cleanup on unmount; no continuous animation loop.
- `components/cinematic/useSlabScroll.ts`: native touch scrolling, mouse-drag inertia, keyboard navigation and click suppression after dragging.
- `components/cinematic/content.ts`: Hebrew, Arabic, English and Russian copy.
- `components/cinematic/CinematicHome.css`: scoped responsive styles and reduced-motion layouts.
- `public/cinematic/`: local WebP hero still-lifes, with separate landscape and portrait compositions, and self-hosted display/body fonts with their OFL licenses. The hero compositions are digital visualizations based on the slab images. The three projects share the gallery's reviewed photo versions. Each pair of thumbnails uses two separate photographs of the same project from other viewpoints, rather than crops of the main photograph.

The alternate viewpoints are stairs `WA0102` / `WA0103`, fireplace `WA0052` / `WA0054`, and kitchen island `WA0092` / `WA0095`. They reuse existing retouched assets, so no new uploads or image generation are needed. Localized captions describe each viewpoint.

The existing React routes, shared navigation, language/theme controls, catalog, cookie controls, contact constants and gallery admin remain in use. The homepage's 13 slabs use a native horizontal scroll track without slide snapping, with mouse drag and keyboard navigation. The complete collection remains accessible at `/gallery` and continues to use the existing Cloudinary/admin workflow. The three featured homepage images reference curated Cloudinary public IDs; the selection is independent of the dynamic gallery feed.

`overflow-x: clip` on the document prevents sideways scrolling without introducing a scroll container that breaks sticky chapters. The scrolled header uses the theme's opaque primary colour to remain legible over light project backgrounds.

## Verification

- `npm run build`
- `npx tsc --noEmit`
- Desktop 1500×920 and mobile 390×844 browser checks.
- Check both hero still-lifes, responsive source selection and text legibility on desktop and mobile.
- Check the staged slab entrance, keyboard focus visibility and immediate rendering with reduced motion.
- Swipe the 13 slabs without snapping, drag with a mouse, navigate with arrow keys and open a slab.
- Project stage remains pinned to the viewport during the detail reveal.
- Full-photo dialog opens and Escape closes it; material selector changes image and selected state.
- Four language choices retain direction and no horizontal overflow.
- Reduced-motion preference disables sticky/scroll effects.
- Contact page and admin login render; no uncaught browser errors.
