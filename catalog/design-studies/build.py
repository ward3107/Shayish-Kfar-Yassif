"""Build a separate three-page design preview; leaves the published catalog intact."""
from pathlib import Path
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent
studies = [
    ('kitchen', 'kitchen-02-x014.jpeg', 'חומר בתנועה.', 'מטבח', 'אבן בהירה · עץ כהה · שחור', '#293128'),
    ('bathroom', 'bathroom-01-x086.jpeg', 'שקט מעוגל.', 'רחצה', 'אבן בגוון חול · לבן · שחור', '#233034'),
    ('fireplace', 'fireplace-01-x145.jpeg', 'ניגוד עם נוכחות.', 'קמין', 'שיש עורקי · שחור · מתכת חמה', '#302b24'),
]
pages = []
for number, (key, photo, title, category, materials, background) in enumerate(studies, 1):
    pages.append(f'''<section class="page {key}" style="background:{background}">
      <header><span>STONE / SPACE / CRAFT</span><b>שיש כפר יאסיף</b></header>
      <div class="heading"><small>מחקר עיצוב / {number:02}</small><h1>{title}</h1></div>
      <img class="photo" src="../images/{photo}">
      <aside><small>{category}</small><h2>מהחלל<br>אל החומר.</h2><p>{materials}</p><p class="note">אובייקט עיצובי בהשראת הגוונים והמרקמים שבתמונה.</p></aside>
      <img class="object" src="assets/{key}.png">
      <footer><span>DESIGN STUDY / {number:02}</span><span>דוגמה לבחירת כיוון עיצובי</span></footer>
    </section>''')
html = '''<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><title>דוגמאות עיצוב — שיש כפר יאסיף</title><style>
@font-face{font-family:Heebo;src:url('../../public/cinematic/heebo.woff')}
@font-face{font-family:Frank;src:url('../../public/cinematic/frank-ruhl-libre.woff')}
@page{size:210mm 280mm;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:Heebo;color:#ede9de}
.page{position:relative;width:210mm;height:280mm;overflow:hidden;break-after:page}.page:last-child{break-after:auto}
header{position:absolute;top:14mm;left:17mm;width:176mm;padding-bottom:6mm;border-bottom:.2mm solid #77796a;direction:ltr;font-size:8pt}
header span{position:absolute;left:0;top:0;color:#c9ad78;font-size:7pt;letter-spacing:1.2px}header b{position:absolute;right:0;top:0;font-weight:500}
.heading{position:absolute;top:34mm;right:17mm;left:17mm}.heading small,aside small{color:#c9ad78;font-size:8pt}h1{font-family:Frank;font-size:29pt;font-weight:400;margin:2mm 0}
.photo{position:absolute;left:17mm;top:64mm;width:132mm;height:176mm;object-fit:cover}
aside{position:absolute;right:17mm;top:76mm;width:35mm}h2{font-family:Frank;font-size:20pt;line-height:1.2;font-weight:400;margin:4mm 0}p{font-size:9pt;line-height:1.8}.note{font-size:8pt;color:#b9bbad;margin-top:7mm}
.object{position:absolute;left:116mm;top:188mm;width:82mm;height:60mm;object-fit:contain}.fireplace .object{left:108mm;top:182mm;width:88mm;height:73mm}
footer{position:absolute;bottom:12mm;left:17mm;width:176mm;border-top:.2mm solid #77796a;padding-top:4mm;direction:ltr;font-size:7pt;color:#b9bbad}
footer span:first-child{position:absolute;left:0;top:4mm}footer span:last-child{position:absolute;right:0;top:4mm}</style><body>''' + ''.join(pages) + '</body></html>'
(ROOT / 'preview.html').write_text(html, encoding='utf-8')
HTML(filename=str(ROOT / 'preview.html')).write_pdf(ROOT / 'material-objects-preview.pdf')
print(ROOT / 'material-objects-preview.pdf')
