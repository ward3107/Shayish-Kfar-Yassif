# Catalog source

`build.py` generates `catalog.html` and `public/catalog/shayish-kfar-yassif-catalog-v2.pdf` from the photographs in `images/`. It also updates the original PDF path for existing links. The images contain all 90 unique photographs from the previous catalog except nine photographs whose original captions identify bathroom installation work. The bathroom section therefore uses finished-room photographs only.

To rebuild from the repository root, install WeasyPrint 70.0, then run:

```sh
python -m pip install weasyprint==70.0
python catalog/build.py
```

The page backgrounds rotate through six dark shades of the site's stone palette. Photographs fill their frames and may be cropped at the edges; landscape photographs are grouped into wide frames. Each photograph has three circular material details sampled from distinct areas of that same photograph. The cover links to WhatsApp (using the number and message from the original catalog) and to the current Vercel site. The website already links to the generated PDF path.

The 13 slab images in `images/` are edited frontal visualizations, with obstructing metal stands removed. Their untouched source photographs are retained in the repository's `original-stone/` directory, but are not served by the website. Because hidden stone was reconstructed digitally, these images illustrate the slabs' appearance rather than document exact vein placement. The website uses separate edge-to-edge 4:3 visualizations in `public/stone-slabs/edited/`, presented as equal-size swipeable cards with a larger view on click.
