# Cinematic home

The homepage uses the reviewed stone-to-space design. The cutting machine is a single static illustration: there is no blade canvas, rotation, spray or time-driven animation. Scrolling fades the opening into a real project photograph. The other project chapters retain their scroll-driven transitions.

## Files and assets

- `components/cinematic/CinematicHome.tsx`: opening, three project stories, material selector, project dialog, craft and contact sections.
- `components/cinematic/useCinematicScroll.ts`: scroll/resize updates with one scheduled animation frame and cleanup on unmount; no continuous animation loop.
- `components/cinematic/content.ts`: Hebrew, Arabic, English and Russian copy.
- `components/cinematic/CinematicHome.css`: scoped responsive styles and reduced-motion layouts.
- `public/cinematic/`: the local WebP machine illustration and self-hosted display/body fonts extracted from the approved preview, with their OFL licenses. The machine is an artistic illustration; the three projects are the original business photographs from the preview, loaded from the existing public Cloudinary portfolio. Detail thumbnails are crops of the same project photographs.

The existing React routes, shared navigation, language/theme controls, catalog, cookie controls, contact constants and gallery admin remain in use. The complete collection remains accessible at `/gallery` and continues to use the existing Cloudinary/admin workflow. The three featured homepage images reference curated Cloudinary public IDs; the selection is independent of the dynamic gallery feed.

`overflow-x: clip` on the document prevents sideways scrolling without introducing a scroll container that breaks sticky chapters. The scrolled header uses the theme's opaque primary colour to remain legible over light project backgrounds.

## Verification

- `npm run build`
- `npx tsc --noEmit`
- Desktop 1500×920 and mobile 390×844 browser checks.
- Pixel-identical crops of the saw at two different times; no canvas, animation or transform applied to the machine.
- Project stage remains pinned to the viewport during the detail reveal.
- Full-photo dialog opens and Escape closes it; material selector changes image and selected state.
- Four language choices retain direction and no horizontal overflow.
- Reduced-motion preference disables sticky/scroll effects.
- Contact page and admin login render; no uncaught browser errors.
