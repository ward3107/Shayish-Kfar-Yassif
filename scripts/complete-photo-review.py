"""Add independently edited catalog photos, then package the verified PDF/review.

Run prepare after the gallery import, rebuild the catalog, then run package.
Only file-format conversion and packaging happen here; imagegen edits content.
"""
import argparse
import hashlib
import html
import importlib.util
import json
import shutil
import zipfile
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('photo_import', ROOT / 'scripts/import-photo-retouches.py')
photo_import = importlib.util.module_from_spec(spec)
spec.loader.exec_module(photo_import)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_path(value, manifest):
    path = Path(value)
    return path if path.is_absolute() else manifest.resolve().parent / path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['prepare', 'package'])
    parser.add_argument('--review-dir', required=True, type=Path)
    parser.add_argument('--gallery-edits', required=True, type=Path)
    parser.add_argument('--catalog-edits', required=True, type=Path)
    args = parser.parse_args()
    review = args.review_dir.resolve()
    extras = json.loads(args.catalog_edits.read_text())['completed']
    assert len(extras) == len({row['catalog'] for row in extras}) == 8
    records = json.loads((review / 'photos.json').read_text())

    if args.mode == 'prepare':
        records = [row for row in records if row.get('sourceKind') != 'catalog-original']
        assert len(records) == 126
        catalog_sources = json.loads((ROOT / 'catalog/retouch-sources.json').read_text())
        catalog_sources = [row for row in catalog_sources if row.get('sourceKind') != 'catalog-original']
        portable_edits = []
        for index, edit in enumerate(extras, 127):
            source = source_path(edit['path'], args.catalog_edits)
            original = source_path(edit['sourcePath'], args.catalog_edits)
            relative_original = Path('catalog-extras/originals') / edit['catalog']
            relative_photo = Path('catalog-extras/photos') / edit['catalog']
            for relative in [relative_original, relative_photo]:
                (review / relative).parent.mkdir(parents=True, exist_ok=True)
            source_hash = digest(original)
            shutil.copy2(original, review / relative_original)
            with Image.open(source) as opened:
                image = ImageOps.exif_transpose(opened).convert('RGB')
                width, height = image.size
                photo_import.save_export(image, review / relative_photo, 'JPEG', quality=96, subsampling=0, optimize=True)
            with Image.open(original) as image:
                original_width, original_height = image.size
            assert digest(review / relative_original) == source_hash
            shutil.copy2(review / relative_photo, ROOT / 'catalog/enhanced' / edit['catalog'])
            source_render = f'catalog-extras/source-renders/{edit["catalog"][:-5]}.png'
            record = {'index': index, 'publicId': 'catalog/' + edit['catalog'], 'caption': 'מטבח עם אי אבן בהירה וחזית עץ — צילום קטלוג נוסף',
                      'category': 'catalog', 'sourceKind': 'catalog-original', 'editedWithAI': True,
                      'width': width, 'height': height, 'originalWidth': original_width, 'originalHeight': original_height,
                      'file': relative_photo.as_posix(), 'originalFile': relative_original.as_posix(),
                      'sourceRenderFile': source_render, 'sourceSha256': source_hash,
                      'outputSha256': digest(review / relative_photo)}
            records.append(record)
            portable_edits.append({**edit, 'path': source_render.removeprefix('catalog-extras/'),
                                   'sourcePath': relative_original.as_posix().removeprefix('catalog-extras/'), 'sourceSha256': source_hash})
            catalog_sources.append({'catalog': edit['catalog'], 'sourceKind': 'catalog-original', 'sourceSha256': source_hash,
                                    'editedWithAI': True, 'reviewIndex': index})
        assert len(catalog_sources) == 77
        (ROOT / 'catalog/retouch-sources.json').write_text(json.dumps(catalog_sources, ensure_ascii=False, indent=2))
        (review / 'catalog-extras/edits.json').write_text(json.dumps({'completed': portable_edits}, ensure_ascii=False, indent=2))
        (review / 'photos.json').write_text(json.dumps(records, ensure_ascii=False, indent=2))
        embedded = [{**row, 'beforePreview': photo_import.preview(review / row['originalFile']),
                     'afterPreview': photo_import.preview(review / row['file'])} for row in records]
        data = json.dumps(embedded, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
        initial = next(row for row in embedded if row['index'] == 33)
        page = (ROOT / 'scripts/photo-retouch-review.html').read_text().replace('__PHOTO_DATA__', data)
        page = page.replace('__INITIAL_PHOTO__', initial['afterPreview']).replace('__INITIAL_CAPTION__', html.escape(initial['caption']))
        (review / 'index.html').write_text(page)
        (review.parent / 'shayish-kfar-yassif-photo-review.html').write_text(page)
        (review / 'README.txt').write_text('שיש כפר יאסיף — חבילת העריכות לפני פרסום.\nפתחו את index.html להשוואת לפני ואחרי בכל תמונה.\n126 תמונות גלריה: 124 עריכות AI חדשות ושתי המחשות קיימות שנשמרו. נוסף לכך שמונה צילומי קטלוג נערכו בנפרד.\nphotos ו־catalog-extras/photos מכילות גרסאות JPEG מלאות. source-renders מכילה את קובצי PNG של העריכות החדשות; originals מכילה מקורות ללא שינוי.\nדוגמת האבן ופרטים ששוחזרו בעזרת AI עשויים להשתנות; המקורות זמינים לבדיקה.\nהתמונות החדשות והקטלוג המעודכן טרם פורסמו באתר.\n')
        verification = json.loads((review / 'verification.json').read_text())
        verification.update({'reviewPhotos': 134, 'galleryPhotos': 126, 'additionalCatalogRetouches': 8, 'catalogRetouches': 77, 'newRetouches': 132, 'embeddedPreviewsDecoded': None})
        (review / 'verification.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2))
        print(json.dumps({'reviewPhotos': len(records), 'newGalleryRetouches': 124, 'extraCatalogRetouches': 8, 'catalogRetouches': len(catalog_sources)}))
        return

    assert len(records) == 134
    pdf = ROOT / 'public/catalog/shayish-kfar-yassif-catalog-v2.pdf'
    pdf_name = 'shayish-kfar-yassif-catalog-retouched-v2.pdf'
    shutil.copy2(pdf, review / pdf_name)
    shutil.copy2(pdf, review.parent / pdf_name)
    gallery = json.loads(args.gallery_edits.read_text())['completed']
    raw_sources = {row['index']: source_path(row['path'], args.gallery_edits) for row in gallery if row['status'] == 'draft-generated'}
    raw_sources.update({index: source_path(row['path'], args.catalog_edits) for index, row in enumerate(extras, 127)})
    archive = review.parent / 'shayish-kfar-yassif-retouched-v2.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=5) as output:
        for path in sorted(review.rglob('*')):
            if path.is_file():
                output.write(path, path.relative_to(review))
        for record in records:
            if record['editedWithAI']:
                output.write(raw_sources[record['index']], record['sourceRenderFile'], compress_type=zipfile.ZIP_STORED)
    with zipfile.ZipFile(archive) as output:
        assert output.testzip() is None
        assert len(output.namelist()) == len(set(output.namelist()))
    print(json.dumps({'archiveBytes': archive.stat().st_size, 'pdfBytes': pdf.stat().st_size, 'sourceRenders': len(raw_sources), 'reviewPhotos': len(records)}))


if __name__ == '__main__':
    main()
