import type { SelectionAsset } from './selectionAssets';

function loadImage(src: string, signal: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const finish = (error?: Error) => {
      clearTimeout(timer); signal.removeEventListener('abort', abort);
      img.onload = img.onerror = null;
      if (error) { img.src = ''; reject(error); } else resolve(img);
    };
    const abort = () => finish(new DOMException('Aborted', 'AbortError'));
    const timer = window.setTimeout(() => finish(new Error('Photo timed out')), 20000);
    img.onload = () => finish();
    img.onerror = () => finish(new Error('Photo unavailable'));
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort(); else img.src = src;
  });
}

/** Each image is fitted in full, numbered and labelled; failure never drops a selection. */
export async function prepareSelectionSheets(items: SelectionAsset[], title: string, phone: string, signal: AbortSignal): Promise<File[]> {
  const files: File[] = [];
  for (let offset = 0; offset < items.length; offset += 6) {
    signal.throwIfAborted();
    const page = items.slice(offset, offset + 6);
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 180 + Math.ceil(page.length / 2) * 520;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.fillStyle = '#f8f4ec'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e1a15'; ctx.textAlign = 'left'; ctx.font = '34px Georgia, serif';
    ctx.fillText('Shayish Kfar Yassif', 40, 55);
    ctx.font = '22px Arial, sans-serif'; ctx.fillText(`WhatsApp ${phone}`, 40, 91);
    ctx.textAlign = 'right'; ctx.fillText(`${offset / 6 + 1} / ${Math.ceil(items.length / 6)}`, 1160, 55);
    ctx.fillText(title, 1160, 91);
    for (let i = 0; i < page.length; i++) {
      const item = page[i];
      const img = await loadImage(item.image, signal);
      signal.throwIfAborted();
      const x = 40 + (i % 2) * 580, y = 130 + Math.floor(i / 2) * 520;
      ctx.fillStyle = '#e6dcc7'; ctx.fillRect(x, y, 540, 400);
      const scale = Math.min(540 / img.naturalWidth, 400 / img.naturalHeight);
      ctx.drawImage(img, x + (540 - img.naturalWidth * scale) / 2, y + (400 - img.naturalHeight * scale) / 2, img.naturalWidth * scale, img.naturalHeight * scale);
      ctx.fillStyle = '#1e1a15'; ctx.textAlign = 'right'; ctx.font = '22px Arial, sans-serif';
      let label = item.label;
      while (ctx.measureText(label).width > 530 && label.length > 1) label = label.slice(0, -2) + '…';
      ctx.fillText(label, x + 540, y + 435);
      ctx.textAlign = 'left'; ctx.font = '18px Arial, sans-serif';
      ctx.fillText(`${offset + i + 1} / ${item.code}`, x, y + 468, 540);
    }
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Export failed')), 'image/jpeg', .9));
    signal.throwIfAborted();
    files.push(new File([blob], `shayish-selections-${offset / 6 + 1}.jpg`, { type: 'image/jpeg' }));
    canvas.width = canvas.height = 0;
  }
  return files;
}
