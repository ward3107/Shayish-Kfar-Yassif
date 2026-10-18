import slabSources from '../gallery-slab-sources.json' with { type: 'json' };

export const SELECTION_STORAGE_KEY = 'shayish.selections.v1';
export const MAX_SELECTIONS = 150;
const slabs = slabSources as Record<string, string>;
const slabIds = new Set(Object.values(slabs));
const materialIds = new Set(['calacatta', 'nero-marquina', 'emperador', 'verde-alpi', 'porcelain-full-body', 'porcelain-large-format', 'porcelain-glazed', 'porcelain-wood-look']);

/** Stable references only: no arbitrary URLs, captions or personal data in storage/links. */
export function canonicalSelection(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 130) return null;
  let ref = value;
  if (ref.startsWith('shayish/gallery/')) ref = `g:${ref.slice(16)}`;
  if (ref.startsWith('shayish/materials/')) ref = `m:${ref.slice(18)}`;
  const id = ref.slice(2);
  if (ref.startsWith('s:')) return slabIds.has(id) ? ref : null;
  if (ref.startsWith('m:')) return materialIds.has(id) ? ref : null;
  if (!/^[gv]:[A-Za-z0-9_-]{1,120}$/.test(ref)) return null;
  return ref.startsWith('g:') && slabs[`shayish/gallery/${id}`] ? `s:${slabs[`shayish/gallery/${id}`]}` : ref;
}

export function normalizeSelections(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.slice(0, 2000).map(canonicalSelection).filter((id): id is string => id !== null))].slice(0, MAX_SELECTIONS);
}

export function readSelections(raw: string | null): string[] {
  try { return normalizeSelections(JSON.parse(raw || '[]')); } catch { return []; }
}

export function toggleSelection(values: string[], value: string): string[] {
  const ref = canonicalSelection(value);
  if (!ref) return values;
  if (values.includes(ref)) return values.filter(id => id !== ref);
  return values.length < MAX_SELECTIONS ? [...values, ref] : values;
}

export function selectionLink(origin: string, refs: string[]): string {
  return `${new URL(origin).origin}/favorites#v1=${normalizeSelections(refs).map(encodeURIComponent).join(',')}`;
}

export function parseSharedSelection(hash: string): { refs: string[]; invalid: boolean } | null {
  if (!hash) return null;
  if (!hash.startsWith('#v1=') || hash.length > 24000) return { refs: [], invalid: true };
  try {
    const values = hash.slice(4).split(',').map(decodeURIComponent);
    if (!values.length || values.length > MAX_SELECTIONS || values.some(value => !canonicalSelection(value))) return { refs: [], invalid: true };
    return { refs: normalizeSelections(values), invalid: false };
  } catch { return { refs: [], invalid: true }; }
}

export function selectionMessage(args: { intro: string; nameLabel: string; name: string; labels: string[]; linkLabel: string; url: string }): string {
  const name = args.name.replace(/[\r\n\u0000-\u001f\u202a-\u202e\u2066-\u2069]/g, ' ').trim().slice(0, 80);
  return [args.intro, name ? `${args.nameLabel}: ${name}` : '', ...args.labels.slice(0, 12).map((label, i) => `${i + 1}. ${label}`), `${args.linkLabel} (${args.labels.length}):`, args.url].filter(Boolean).join('\n');
}
