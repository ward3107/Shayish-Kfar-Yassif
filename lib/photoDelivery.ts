/**
 * Non-destructive photographic delivery. Low blend strengths preserve the
 * existing stone pattern; no generative reconstruction or object removal.
 * Each effect has its own Cloudinary transformation component.
 * https://cloudinary.com/documentation/transformation_reference
 */
export type PhotoRole = 'project' | 'material';
export type PhotoOptions = {
  width: number;
  height?: number;
  nativeWidth?: number;
  nativeHeight?: number;
  crop?: 'limit' | 'fill';
  role?: PhotoRole;
  corrected?: boolean;
  format?: 'auto' | 'jpg' | 'webp';
};

export const PHOTO_CORRECTION = Object.freeze({
  brightness: 18,
  color: 10,
  contrast: 15,
  sharpen: 30,
});

const positive = (n: number | undefined): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n > 0;

export const encodedPublicId = (id: string): string =>
  id.split('/').map(encodeURIComponent).join('/');

/** A srcset descriptor must describe the actual delivered pixel width. */
export function photoWidths(candidates: readonly number[], nativeWidth?: number): number[] {
  const valid = candidates.filter(positive).map(Math.round);
  if (!valid.length) return [];
  const limit = positive(nativeWidth) ? Math.floor(nativeWidth) : Math.max(...valid);
  return [...new Set(valid.map((width) => Math.min(width, limit)))].sort((a, b) => a - b);
}

export function buildPhotoUrl(cloud: string, publicId: string, options: PhotoOptions): string {
  if (!cloud || !publicId) return '';
  const requestedWidth = positive(options.width) ? Math.round(options.width) : 800;
  let width = positive(options.nativeWidth)
    ? Math.min(requestedWidth, Math.floor(options.nativeWidth))
    : requestedWidth;
  let height = positive(options.height) ? Math.round(options.height) : undefined;
  if (options.crop === 'fill' && height) {
    const scale = Math.min(1,
      positive(options.nativeWidth) ? options.nativeWidth / requestedWidth : 1,
      positive(options.nativeHeight) ? options.nativeHeight / height : 1,
    );
    width = Math.max(1, Math.floor(requestedWidth * scale));
    height = Math.max(1, Math.round(height * scale));
  }
  const components: string[] = [];
  const material = options.role === 'material';
  if (options.corrected !== false) {
    components.push(`e_auto_brightness:${material ? 10 : PHOTO_CORRECTION.brightness}`);
    // Material swatches retain their original colour balance.
    if (!material) components.push(`e_auto_color:${PHOTO_CORRECTION.color}`);
    components.push(`e_auto_contrast:${material ? 10 : PHOTO_CORRECTION.contrast}`);
  }
  if (options.crop === 'fill' && height) {
    // lfill can crop a banner but never invent resolution by enlarging it.
    components.push(`c_lfill,g_auto,w_${width},h_${height}`);
  } else {
    components.push(`c_limit,w_${width}${height ? `,h_${height}` : ''}`);
  }
  if (options.corrected !== false) components.push(`e_sharpen:${material ? 20 : PHOTO_CORRECTION.sharpen}`);
  components.push('cs_srgb', 'q_auto:best', `f_${options.format || 'auto'}`);
  return `https://res.cloudinary.com/${encodeURIComponent(cloud)}/image/upload/${components.join('/')}/${encodedPublicId(publicId)}`;
}

export function buildPhotoSrcSet(
  cloud: string,
  publicId: string,
  candidates: readonly number[],
  options: Omit<PhotoOptions, 'width' | 'height' | 'crop'> = {},
): string {
  return photoWidths(candidates, options.nativeWidth)
    .map((width) => `${buildPhotoUrl(cloud, publicId, { ...options, width })} ${width}w`)
    .join(', ');
}

/** Native pixels available after a banner crop, including short landscapes. */
export function buildCroppedPhotoSrcSet(
  cloud: string,
  publicId: string,
  candidates: readonly number[],
  aspect: number,
  options: Omit<PhotoOptions, 'width' | 'height' | 'crop'> = {},
): string {
  if (!positive(aspect)) return '';
  const nativeCropWidth = positive(options.nativeHeight)
    ? Math.min(options.nativeWidth || Infinity, options.nativeHeight * aspect)
    : options.nativeWidth;
  return photoWidths(candidates, nativeCropWidth)
    .map((width) => `${buildPhotoUrl(cloud, publicId, { ...options, width, height: Math.round(width / aspect), crop: 'fill' })} ${width}w`)
    .join(', ');
}
