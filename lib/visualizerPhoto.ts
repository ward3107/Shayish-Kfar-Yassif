import { fitPhoto, MAX_PHOTO_BYTES } from './visualizer';
export async function loadKitchenPhoto(file: File): Promise<{ url: string; width: number; height: number }> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20_000_000) throw new Error('invalid_photo');
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    if (bitmap.width * bitmap.height > 40_000_000 || Math.min(bitmap.width, bitmap.height) < 256 || bitmap.width / bitmap.height > 3 || bitmap.height / bitmap.width > 3) throw new Error('invalid_photo');
    const size = fitPhoto(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = size.width; canvas.height = size.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('invalid_photo');
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/jpeg', .92);
    if (url.length * .75 > MAX_PHOTO_BYTES) throw new Error('invalid_photo');
    return { url, ...size };
  } finally { bitmap.close(); }
}
