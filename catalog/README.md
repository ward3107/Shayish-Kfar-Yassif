# Catalog source

`build.py` generates `catalog.html` and `public/catalog/shayish-kfar-yassif-catalog-v2.pdf` from the photographs in `images/`. It also updates the original PDF path for existing links. The images contain all 90 unique photographs from the previous catalog except nine photographs whose original captions identify bathroom installation work. The bathroom section therefore uses finished-room photographs only.

To rebuild from the repository root, install WeasyPrint 70.0, then run:

```sh
python -m pip install weasyprint==70.0
python catalog/build.py
```

The page backgrounds rotate through six dark shades of the site's stone palette. Photographs fill their frames and may be cropped at the edges; landscape photographs are grouped into wide frames. Each of the 41 pages has its own transparent sculptural object, generated with that page's photographs as colour and texture references. These decorative objects are visual interpretations, not claims about the precise stone species or actual furnishings in the photographed rooms. The old rectangular material samples have been removed. The cover links to WhatsApp (using the number and message from the original catalog) and to the current Vercel site. The website already links to the generated PDF path.

The committed objects in `objects/page-NN.png` are required for rebuilding. `objects/manifest.json` maps each page to its photograph references and its object. Run `CATALOG_PLAN_ONLY=1 python catalog/build.py` to regenerate the manifest without building the PDF. When page grouping changes, review the mapping and replace any objects whose reference photographs changed.

After rebuilding the PDF, run `python catalog/build-preview.py` (requires Poppler's `pdftoppm`) to refresh the browser gallery at `/catalog/preview/index.html`. It contains a clickable image of every page and a link to the full PDF. Both the legacy PDF URL and the current v2 URL receive the same rebuilt file. Catalog responses revalidate their cache so existing links can pick up future updates.

The 13 slab images in `images/` are edited frontal visualizations, with obstructing metal stands removed. Their untouched source photographs are retained in the repository's `original-stone/` directory, but are not served by the website. Because hidden stone was reconstructed digitally, these images illustrate the slabs' appearance rather than document exact vein placement. The website uses separate edge-to-edge 4:3 visualizations in `public/stone-slabs/edited/`, presented as equal-size cards with free touch scrolling, mouse-drag inertia, and a larger view on click. The cards do not snap to individual images.
