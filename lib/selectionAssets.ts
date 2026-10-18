import { homeSlabs } from '../components/cinematic/slabs';
import { imgUrl, videoPoster } from './galleryData';
import { localPhoto } from './localPhotos';
import curation from '../gallery-curation.json';
import type { Language } from '../translations';
import { selectionCopy } from './selectionCopy';

export type SelectionAsset = { ref: string; label: string; image: string; code: string };
export function selectionAsset(ref: string, language: Language): SelectionAsset {
  const c = selectionCopy[language];
  const id = ref.slice(2);
  if (ref.startsWith('s:')) {
    const slab = homeSlabs.find(s => s.id === id)!;
    return { ref, label: slab.name[language], image: localPhoto(`/stone-slabs/edited/${id}.jpeg`), code: id.replace('stone-', '').toUpperCase() };
  }
  const material = ref.startsWith('m:');
  const video = ref.startsWith('v:');
  const publicId = `shayish/${material ? 'materials' : 'gallery'}/${id}`;
  const entry = (curation.items as Record<string, { caption?: string }>)[publicId];
  const label = material ? id.replaceAll('-', ' ') : language === 'he' && entry?.caption ? entry.caption : `${video ? c.video : c.image} ${id.replace('IMG-', '')}`;
  return { ref, label, image: video ? videoPoster(publicId, 800) : imgUrl(publicId, 800), code: id.replace('IMG-', '') };
}
