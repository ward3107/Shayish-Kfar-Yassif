"""Import imagegen retouches, export real responsive pixels, and build a private review.

This script only changes file format and delivery size; all content editing is
performed by imagegen. Originals are copied byte-for-byte for comparison.
"""
from __future__ import annotations

import argparse
import base64
import concurrent.futures
import hashlib
import html
import io
import json
import shutil
import zipfile
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
WEBP_OPTIONS = {'quality': 92, 'method': 6}


def save_export(image: Image.Image, path: Path, format: str, **options) -> None:
    """Validate encoded bytes and replace the destination atomically."""
    buffer = io.BytesIO()
    image.save(buffer, format=format, **options)
    encoded = buffer.getvalue()
    with Image.open(io.BytesIO(encoded)) as decoded:
        decoded.load()
        assert decoded.size == image.size, 'Encoded image dimensions changed.'
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_bytes(encoded)
    temporary.replace(path)


def preview(path: Path) -> str:
    with Image.open(path) as opened:
        image = ImageOps.exif_transpose(opened).convert('RGB')
        image.thumbnail((480, 680), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=84, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buffer.getvalue()).decode()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory', type=Path, required=True)
    parser.add_argument('--edits', type=Path, required=True)
    parser.add_argument('--review-dir', type=Path, required=True)
    parser.add_argument('--partial', action='store_true')
    args = parser.parse_args()
    photos = json.loads(args.inventory.read_text())['photos']
    edits = json.loads(args.edits.read_text())
    edits = edits['completed'] if isinstance(edits, dict) else edits
    by_index = {item['index']: item for item in edits}
    assert len(by_index) == len(edits), 'Duplicate photograph indices.'
    if not args.partial:
        assert set(by_index) == {photo['index'] for photo in photos}, 'Not all photographs have been prepared.'
    curation = json.loads((ROOT / 'gallery-curation.json').read_text())['items']
    destination = ROOT / 'public/photo-retouch-v2'
    destination.mkdir(parents=True, exist_ok=True)
    review = args.review_dir.resolve()
    (review / 'photos').mkdir(parents=True, exist_ok=True)
    (review / 'originals').mkdir(exist_ok=True)

    def resolve_source(value: str, manifest: Path) -> Path:
        path = Path(value)
        return path if path.is_absolute() else manifest.resolve().parent / path

    def export(photo: dict) -> tuple[dict, dict | None]:
        index = photo['index']
        original = resolve_source(photo['path'], args.inventory)
        assert hashlib.sha256(original.read_bytes()).hexdigest() == photo['sha256'], 'Original changed.'
        edit = by_index.get(index)
        generated = bool(edit and edit['status'] == 'draft-generated')
        source = resolve_source(edit['path'], args.edits) if edit else original
        name = f"{index:03d}-" + photo['publicId'].split('/')[-1]
        original_export = review / 'originals' / (name + '.jpg')
        shutil.copy2(original, original_export)
        full = review / 'photos' / (name + '.jpg')
        asset = None
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).convert('RGB')
            width, height = image.size
            save_export(image, full, 'JPEG', quality=96, subsampling=0, optimize=True)
            if generated:
                revision = hashlib.sha256(source.read_bytes() + json.dumps(WEBP_OPTIONS, sort_keys=True).encode()).hexdigest()[:10]
                variants = []
                for output_width in sorted({min(width, value) for value in (480, 800, width)}):
                    size = (output_width, round(height * output_width / width))
                    variant = image.resize(size, Image.Resampling.LANCZOS) if output_width != width else image
                    filename = f'{name}-{revision}-{output_width}.webp'
                    save_export(variant, destination / filename, 'WEBP', **WEBP_OPTIONS)
                    variants.append({'src': '/photo-retouch-v2/' + filename, 'width': size[0], 'height': size[1]})
                asset = {'src': variants[-1]['src'], 'width': width, 'height': height, 'variants': variants, 'editedWithAI': True}
        cur = curation[photo['publicId']]
        record = {'index': index, 'publicId': photo['publicId'], 'caption': cur['caption'], 'category': cur['category'], 'editedWithAI': generated,
                  'width': width, 'height': height, 'originalWidth': photo['width'], 'originalHeight': photo['height'],
                  'file': full.relative_to(review).as_posix(), 'originalFile': original_export.relative_to(review).as_posix(),
                  'sourceSha256': photo['sha256'], 'outputSha256': hashlib.sha256(full.read_bytes()).hexdigest(),
                  'sourceRenderFile': f'source-renders/{index:03d}-{source.name}' if generated else original_export.relative_to(review).as_posix(),
                  'beforePreview': preview(original), 'afterPreview': preview(full)}
        return record, asset

    records = []
    assets = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        for record, asset in executor.map(export, photos):
            records.append(record)
            if asset:
                assets[record['publicId']] = asset
    (ROOT / 'retouched-photo-assets.json').write_text(json.dumps(assets, ensure_ascii=False, indent=2))
    data = json.dumps(records, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    page = (ROOT / 'scripts/photo-retouch-review.html').read_text().replace('__PHOTO_DATA__', data)
    initial = next((item for item in records if item['index'] == 33), records[0])
    page = page.replace('__INITIAL_PHOTO__', initial['afterPreview']).replace('__INITIAL_CAPTION__', html.escape(initial['caption']))
    (review / 'index.html').write_text(page)
    standalone = review.parent / 'shayish-kfar-yassif-photo-review.html'
    standalone.write_text(page)
    manifest = [{key: value for key, value in row.items() if key not in ('beforePreview', 'afterPreview')} for row in records]
    (review / 'photos.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    portable_inventory = []
    portable_edits = []
    for photo, record in zip(photos, records):
        portable_inventory.append({**photo, 'path': record['originalFile']})
        edit = by_index.get(photo['index'])
        if edit:
            portable_edits.append({**edit, 'path': record['sourceRenderFile']})
    (review / 'image-inventory.json').write_text(json.dumps({'photos': portable_inventory}, ensure_ascii=False, indent=2))
    (review / 'edits.json').write_text(json.dumps({'completed': portable_edits}, ensure_ascii=False, indent=2))
    (review / 'README.txt').write_text('גלריית העריכה של שיש כפר יאסיף.\nפתחו את index.html להשוואה בין המקור לעריכה.\nבתיקיית photos נמצאות 126 גרסאות להצגה: 124 עריכות AI חדשות ושתי המחשות קיימות שנשמרו.\nבתיקיית originals נשמרו המקורות ללא שינוי. בתיקיית source-renders נמצאים קובצי PNG המלאים של העריכות החדשות.\nבאזורים שהוסתרו ובתיקוני פרספקטיבה הושלמו פרטים דיגיטלית; דוגמת האבן ופרטים משוחזרים עשויים להשתנות.\nהתמונות החדשות עדיין לא פורסמו באתר.\n')

    # Only unambiguous exact visual matches replace the corresponding catalog
    # photograph. Existing renderings and ambiguous matches remain untouched.
    matches_path = args.inventory.parent / 'catalog-matches.json'
    catalog_records = []
    if matches_path.exists():
        shutil.copy2(matches_path, review / 'catalog-matches.json')
        source_records = {record['index']: record for record in records}
        for match in json.loads(matches_path.read_text()):
            if match['distance'] != 0 or match.get('runnerUpDistance', 0) <= 0:
                continue
            record = source_records[match['index']]
            if not record['editedWithAI']:
                continue
            catalog_destination = ROOT / 'catalog/enhanced' / match['catalog']
            shutil.copy2(review / record['file'], catalog_destination)
            catalog_records.append({'catalog': match['catalog'], 'publicId': record['publicId'], 'sourceIndex': record['index'], 'matchDistance': 0, 'editedWithAI': True})
    (ROOT / 'catalog/retouch-sources.json').write_text(json.dumps(catalog_records, ensure_ascii=False, indent=2))
    archive = review.parent / 'shayish-kfar-yassif-retouched-v2.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=5) as output:
        for path in sorted(review.rglob('*')):
            if path.is_file():
                output.write(path, path.relative_to(review))
        for record in records:
            if record['editedWithAI']:
                source = resolve_source(by_index[record['index']]['path'], args.edits)
                output.write(source, record['sourceRenderFile'], compress_type=zipfile.ZIP_STORED)
    with zipfile.ZipFile(archive) as output:
        assert output.testzip() is None
    print(json.dumps({'review': str(standalone), 'archive': str(archive), 'photos': len(records), 'aiRetouched': len(assets), 'catalogRetouches': len(catalog_records), 'htmlBytes': standalone.stat().st_size, 'zipBytes': archive.stat().st_size}), flush=True)


if __name__ == '__main__':
    main()
