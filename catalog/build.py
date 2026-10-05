"""Build the complete Shayish Kfar Yassif photo catalog.

Run from any directory with: python catalog/build.py
Requires WeasyPrint 70 and its standard dependencies.
"""

from __future__ import annotations

import json
import os
import re

from html import escape
from pathlib import Path
from shutil import copyfile
from urllib.parse import quote

from PIL import Image
from weasyprint import HTML


ROOT = Path(__file__).resolve().parent
PDF = ROOT.parent / "public/catalog/shayish-kfar-yassif-catalog-v2.pdf"
LEGACY_PDF = ROOT.parent / "public/catalog/shayish-kfar-yassif-catalog.pdf"
HTML_FILE = ROOT / "catalog.html"
IMAGES = ROOT / "images"
WEBSITE_URL = "https://shayish-kfar-yassif.vercel.app/"
WHATSAPP_URL = "https://wa.me/972505636648?text=" + quote(
    "שלום, ראיתי את הקטלוג ואשמח לקבל פרטים."
)

# One colour per page, all drawn from the site's dark stone palette.
PALETTE = (
    "#202720",  # charcoal olive
    "#293128",  # deep moss
    "#2c2b25",  # warm stone
    "#233034",  # slate
    "#302b24",  # umber
    "#252d26",  # olive
)

SECTIONS = (
    {
        "slug": "kitchen", "count": 29, "number": "01", "title": "מטבחים ואיים",
        "headline": "המקום<br>שבו נפגשים.",
        "body": "משטחים, חיפויים ואיים: מבטים שונים על המקום שבו החומר פוגש את החיים בבית.",
        "hero_xref": 14,
    },
    {
        "slug": "bathroom", "count": 14, "number": "02", "title": "רחצה",
        "headline": "שקט<br>שמרגיש בחומר.",
        "body": "כיורים ומשטחי רחצה בחללים גמורים. קו נקי, גוון מדויק ומקום לפרטים הקטנים.",
        "hero_xref": 86,
    },
    {
        "slug": "fireplace", "count": 13, "number": "03", "title": "קמינים וקירות כוח",
        "headline": "אבן<br>עם נוכחות.",
        "body": "עורקים טבעיים וחיפויים שנותנים מוקד ברור לחלל.",
        "hero_xref": 145,
    },
    {
        "slug": "stairs", "count": 14, "number": "04", "title": "מדרגות ופרטי פנים",
        "headline": "קצב שעולה<br>עם הבית.",
        "body": "רצף של חומר ותנועה בין הקומות, מהתמונה המלאה עד לפרט הקצה.",
        "hero_xref": 178,
    },
    {
        "slug": "special", "count": 7, "number": "05", "title": "עבודות מיוחדות",
        "headline": "הצורה<br>שבחומר.",
        "body": "כיורים ופרטי אבן שבהם העבודה ניכרת גם מקרוב.",
        "hero_xref": 223,
    },
    {
        "slug": "stone", "count": 13, "number": "06", "title": "לוחות אבן",
        "headline": "הסיפור מתחיל<br>בלוח.",
        "body": "גוונים, עורקים ותנועה. המחשות חזיתיות המבוססות על צילומי הלוחות המקוריים; פרטים מוסתרים שוחזרו דיגיטלית.",
        "hero_xref": 241,
    },
)


def photo_number(path: Path) -> int:
    return int(path.stem.split("-")[1])


def photo_xref(path: Path) -> int:
    return int(path.stem.split("-x")[1])


def is_wide(path: Path) -> bool:
    with Image.open(path) as image:
        return image.width / image.height > 1.28


def photo(path: Path, alt: str) -> str:
    return (
        '<div class="shot"><img src="images/' + escape(path.name) + '" alt="'
        + escape(alt, quote=True) + '"><span class="index">'
        + f"{photo_number(path):02d}" + "</span></div>"
    )


def batches(paths: list[Path]) -> list[list[Path]]:
    """Keep the final page from containing a lone photograph."""
    result = []
    while paths:
        size = 2 if len(paths) == 4 else min(3, len(paths))
        result.append(paths[:size])
        paths = paths[size:]
    return result


pages: list[tuple[str, str, str]] = []
used: list[Path] = []

cover = next(IMAGES.glob("kitchen-01-x003.*"))
used.append(cover)
pages.append((
    "cover",
    f"""
      <div class="copy"><span class="eyebrow">מלאכת האבן · כפר יאסיף</span>
      <h1>אבן שמרגישה<br>כמו בית.</h1>
      <p>מבחר עבודות במטבחים, חדרי רחצה, קמינים, מדרגות ולוחות אבן.</p></div>
      <div class="cover-image"><img src="images/{escape(cover.name)}" alt="מטבח עם אי אבן"></div>
      <div class="shade"></div>
      <div class="actions">
        <a class="whatsapp" href="{escape(WHATSAPP_URL, quote=True)}">דברו איתנו ב־WhatsApp</a>
        <a class="website" href="{escape(WEBSITE_URL, quote=True)}">לאתר שלנו</a>
      </div>
    """,
    "עבודות נבחרות",
))

for section in SECTIONS:
    paths = sorted(IMAGES.glob(section["slug"] + "-*.jpeg"), key=photo_number)
    assert len(paths) == section["count"], (section["slug"], len(paths))
    hero = next(p for p in paths if photo_xref(p) == section["hero_xref"])
    remaining = [p for p in paths if p != hero and p != cover]
    used.append(hero)
    pages.append((
        "hero",
        '<div class="copy"><span class="eyebrow">' + section["number"] + " / "
        + section["title"] + '</span><h2>' + section["headline"] + '</h2><p>'
        + section["body"] + '</p></div><div class="visual"><img src="images/'
        + escape(hero.name) + '" alt="' + section["title"]
        + '"></div><div class="count">' + str(section["count"])
        + (' המחשות חזיתיות · על בסיס צילומי מקור</div>' if section["slug"] == "stone" else ' צילומים בפרק · מתוך תיק העבודות</div>'),
        section["title"],
    ))
    # Keep wide photographs together so they can fill landscape frames without
    # cutting away most of the subject. Portraits use the taller mosaics.
    portraits = [path for path in remaining if not is_wide(path)]
    wides = [path for path in remaining if is_wide(path)]
    grouped = [(group, "mosaic" if len(group) == 3 else "pair" if len(group) == 2 else "single")
               for group in batches(portraits)]
    while wides:
        if len(wides) == 3:
            grouped.append((wides, "wide"))
            break
        group = wides[:2]
        grouped.append((group, "pair-wide" if len(group) == 2 else "single-wide"))
        wides = wides[2:]
    for group, layout in grouped:
        used.extend(group)
        numbers = [photo_number(p) for p in group]
        markup = (
            '<div class="intro"><span class="eyebrow">' + section["number"] + " / "
            + section["title"] + '</span><h3>מבט מקרוב.</h3><span class="range">'
            + " · ".join(f"{n:02d}" for n in numbers) + '</span></div><div class="gallery '
            + layout + '">' + "".join(photo(p, section["title"] + " — צילום " + str(photo_number(p))) for p in group) + '</div>'
        )
        pages.append(("gallery-page", markup, section["title"]))

assert len(used) == 90 and len(set(used)) == 90, "Every approved original photograph must appear once"
assert set(used) == set(IMAGES.glob("*.jpeg")), "Unexpected or missing photographs"

pages.append((
    "closing",
    f"""
      <div class="copy"><span class="eyebrow">הפרויקט הבא מתחיל בשיחה</span>
      <h2>איזה חלל אתם<br>מדמיינים?</h2>
      <p>ספרו לנו על הבית, על החומר ועל הפרטים החשובים לכם. נתחיל משם.</p>
      <a href="{escape(WEBSITE_URL, quote=True)}">shayish-kfar-yassif.vercel.app</a></div>
      <div class="line"></div><div class="location">אזור התעשייה · כפר יאסיף</div>
    """,
    "שיש כפר יאסיף",
))

total = len(pages)
html_pages = []
manifest = []
plan_only = os.environ.get("CATALOG_PLAN_ONLY") == "1"
for index, (kind, body, footer) in enumerate(pages, 1):
    shade = PALETTE[(index - 1) % len(PALETTE)]
    artwork = ROOT / "objects" / f"page-{index:02d}.png"
    references = re.findall(r'src="images/([^"]+)"', body)
    if not references:
        references = [cover.name]
    manifest.append({"page": index, "kind": kind, "section": footer, "references": references,
                     "artwork": str(artwork.relative_to(ROOT))})
    if not plan_only:
        assert artwork.exists(), f"Missing page object: {artwork}"
    object_markup = f'<img class="page-object" src="objects/page-{index:02d}.png" alt="" aria-hidden="true">'
    html_pages.append(
        '<section class="page ' + kind + (' stone' if footer == 'לוחות אבן' else '') + '" style="--shade:' + shade + '">'
        '<div class="brand">שיש כפר יאסיף</div>'
        '<div class="edition">STONE / SPACE / CRAFT</div><div class="top-rule"></div>'
        + body + object_markup + '<div class="foot"><span class="number">'
        + f"{index:02d} / {total:02d}" + '</span><span class="name">'
        + footer + '</span></div></section>'
    )

document = (
    '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">'
    '<title>שיש כפר יאסיף | עבודות נבחרות</title>'
    '<meta name="description" content="קטלוג עבודות נבחרות באבן, שיש ופורצלן">'
    '<link rel="stylesheet" href="catalog.css"></head><body>'
    + "\n".join(html_pages) + '</body></html>'
)
(ROOT / "objects").mkdir(exist_ok=True)
(ROOT / "objects" / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
if plan_only:
    print(f"Planned {total} page objects")
    raise SystemExit(0)
HTML_FILE.write_text(document, encoding="utf-8")
HTML(filename=str(HTML_FILE)).write_pdf(str(PDF), optimize_images=True, jpeg_quality=85, dpi=180)
copyfile(PDF, LEGACY_PDF)
print(f"Built {PDF}: {total} pages, {len(used)} images and visualizations")
