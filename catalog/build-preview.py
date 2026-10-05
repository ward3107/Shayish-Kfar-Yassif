"""Render a browser gallery of every page in the completed catalog."""
from html import escape
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT.parent / 'public/catalog'
OUT = PUBLIC / 'preview'
OUT.mkdir(exist_ok=True)
manifest = json.loads((ROOT / 'objects/manifest.json').read_text())
subprocess.run(['pdftoppm', '-scale-to', '1200', '-jpeg', '-jpegopt', 'quality=85',
                str(PUBLIC / 'shayish-kfar-yassif-catalog-v2.pdf'), str(OUT / 'page')], check=True)
cards = []
for page in manifest:
    number = page['page']
    image = f'page-{number:02d}.jpg'
    cards.append(f'<figure id="page-{number}"><a href="{image}" target="_blank" rel="noopener"><img src="{image}" loading="lazy" alt="עמוד {number} — {escape(page["section"])}"></a><figcaption>{number:02d} / {len(manifest)} · {escape(page["section"])}</figcaption></figure>')
html = '''<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>הקטלוג המעודכן — שיש כפר יאסיף</title><style>
*{box-sizing:border-box}body{margin:0;background:#202720;color:#eee9df;font-family:Arial,sans-serif}header{padding:32px 24px;max-width:1300px;margin:auto}h1{font-size:28px;margin:0 0 12px}p{color:#b8b9ac;line-height:1.7}header a{display:inline-block;color:#e5c390;padding:10px 0;margin-left:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:28px;padding:0 24px 40px;max-width:1300px;margin:auto}figure{margin:0}img{width:100%;height:auto;display:block}figure a:focus-visible{outline:3px solid #e5c390;outline-offset:4px}figcaption{padding:12px 0;color:#b8b9ac;font-size:14px}
</style><header><h1>הקטלוג המעודכן.</h1><p>41 עמודים · 90 תמונות · אובייקט עיצובי ייחודי בכל עמוד.<br>לחצו על עמוד כדי לפתוח אותו בגודל מלא.</p><a href="../shayish-kfar-yassif-catalog-v2.pdf">פתיחת ה־PDF המלא</a><a href="/">חזרה לאתר</a></header><main>''' + ''.join(cards) + '</main></html>'
(OUT / 'index.html').write_text(html, encoding='utf-8')
print(OUT / 'index.html')
