export type Point = { x: number; y: number };
export type Region = { points: Point[]; exclude: boolean };
export const MAX_PHOTO_BYTES = 2_500_000;
export const MAX_REGIONS = 12;
export const validRequestId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export function polygonArea(points: Point[]): number {
  return Math.abs(points.reduce((sum, p, i) => {
    const q = points[(i + 1) % points.length];
    return sum + p.x * q.y - q.x * p.y;
  }, 0)) / 2;
}

export function validRegions(value: unknown): value is Region[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_REGIONS) return false;
  return value.some(r => r?.exclude === false) && value.every(r =>
    r && typeof r.exclude === 'boolean' && Array.isArray(r.points) && r.points.length >= 3 && r.points.length <= 40 &&
    r.points.every((p: Point) => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1) &&
    polygonArea(r.points) >= 0.0001);
}

export function fitPhoto(width: number, height: number) {
  const scale = Math.min(1, 1536 / Math.max(width, height));
  return { width: Math.max(16, Math.round(width * scale / 16) * 16), height: Math.max(16, Math.round(height * scale / 16) * 16) };
}
export function renderSize(width: number, height: number) {
  // GPT Image custom output must contain at least 655,360 pixels.
  const scale = Math.max(1, Math.sqrt(655_360 / (width * height)));
  return { width: Math.ceil(width * scale / 16) * 16, height: Math.ceil(height * scale / 16) * 16 };
}
