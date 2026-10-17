import type { Language } from '../../translations';

export type MaterialKey = 'cladding' | 'treads' | 'structure' | 'surround' | 'trim' | 'firebox' | 'worktop' | 'cabinetry' | 'base';
export type MaterialLayer = {
  material: MaterialKey;
  paths: string[];
  cutouts?: string[];
  offset: [number, number];
  anchor: [number, number];
};
export type MaterialView = { photoId: string; layers: MaterialLayer[] };

export const materialCopy: Record<Language, { open: string; title: string; explode: string; assemble: string; hint: string; angles: string; close: string }> = {
  he: { open: 'פירוק לחומרים', title: 'מה מרכיב את העבודה?', explode: 'פירוק לחומרים', assemble: 'הרכבת התמונה', hint: 'בחרו חומר כדי להדגיש את החלק שלו.', angles: 'זוויות נוספות', close: 'סגירה' },
  ar: { open: 'تفكيك حسب المواد', title: 'ممّ يتكوّن هذا العمل؟', explode: 'تفكيك حسب المواد', assemble: 'إعادة تركيب الصورة', hint: 'اختاروا مادة لإبراز الجزء الخاص بها.', angles: 'زوايا أخرى', close: 'إغلاق' },
  en: { open: 'Explore the materials', title: 'What makes up this project?', explode: 'Separate the materials', assemble: 'Put the photo together', hint: 'Select a material to highlight its part.', angles: 'Other angles', close: 'Close' },
  ru: { open: 'Разобрать по материалам', title: 'Из чего состоит проект?', explode: 'Разобрать по материалам', assemble: 'Собрать фотографию', hint: 'Выберите материал, чтобы выделить его часть.', angles: 'Другие ракурсы', close: 'Закрыть' },
};

// Material families and visible roles, without inferring a stone SKU or timber species.
export const materialLabels: Record<MaterialKey, Record<Language, [string, string]>> = {
  cladding: { he: ['אבן', 'חיפוי הקיר'], ar: ['حجر', 'كسوة الجدار'], en: ['Stone', 'Wall cladding'], ru: ['Камень', 'Облицовка стены'] },
  treads: { he: ['עץ', 'מדרכי המדרגות'], ar: ['خشب', 'درجات السلم'], en: ['Wood', 'Stair treads'], ru: ['Дерево', 'Ступени'] },
  structure: { he: ['מתכת', 'שלד המדרגות'], ar: ['معدن', 'هيكل السلم'], en: ['Metal', 'Stair structure'], ru: ['Металл', 'Каркас лестницы'] },
  surround: { he: ['אבן', 'חיפוי הקמין'], ar: ['حجر', 'كسوة المدفأة'], en: ['Stone', 'Fireplace surround'], ru: ['Камень', 'Облицовка камина'] },
  trim: { he: ['אבן', 'מסגרת הפתח'], ar: ['حجر', 'إطار الفتحة'], en: ['Stone', 'Opening trim'], ru: ['Камень', 'Обрамление проёма'] },
  firebox: { he: ['מתכת', 'מסגרת הקמין'], ar: ['معدن', 'إطار المدفأة'], en: ['Metal', 'Fireplace frame'], ru: ['Металл', 'Рама камина'] },
  worktop: { he: ['אבן', 'משטח האי'], ar: ['حجر', 'سطح الجزيرة'], en: ['Stone', 'Island worktop'], ru: ['Камень', 'Столешница острова'] },
  cabinetry: { he: ['גימור עץ', 'חזיתות האי'], ar: ['تشطيب خشبي', 'واجهات الجزيرة'], en: ['Wood finish', 'Island panels'], ru: ['Отделка под дерево', 'Панели острова'] },
  base: { he: ['אבן', 'חיפוי בסיס האי'], ar: ['حجر', 'كسوة قاعدة الجزيرة'], en: ['Stone', 'Island base cladding'], ru: ['Камень', 'Облицовка основания'] },
};

// Paths are percentages of each uncropped photo. Masks only lift visible pixels;
// they do not reconstruct hidden surfaces or claim a structural assembly drawing.
const stairFrontWood = [
  'M0 99 L8 95 L36 100 L0 100Z',
  'M14.5 84.5 L20.5 81.5 L66.7 88 L64.5 95 L14.2 86Z',
  'M24.8 73.3 L29.4 71.9 L69 75.7 L67.5 80.2 L24.8 74.8Z',
  'M32.5 65.2 L35.1 64.3 L71 66.7 L69.9 69.4 L32.4 66.9Z',
  'M38.3 58.6 L40 58.3 L72.3 60.1 L71.4 62 L38.1 60Z',
  'M42.8 53.5 L44.2 53.5 L73.2 54.7 L72.7 56.2 L42.8 54.7Z',
  'M46.5 49.5 L48 49.5 L73.7 50 L73.5 51.5 L46.4 50.5Z',
  'M49.5 46.2 L51 46.2 L74.6 46.4 L74.4 47.6 L49.4 47.3Z',
  'M52 43.4 L53.2 43.3 L75.2 43.3 L75 44.5 L52 44.4Z',
  'M54.4 41 L55.5 40.7 L75.8 40.5 L75.8 41.7 L54.3 41.9Z',
  'M56.1 38.8 L56.9 38.5 L75.6 38.2 L75.9 39.4 L56.1 39.5Z',
  'M57.7 36.9 L59.2 36.6 L75 36.3 L75.2 37.5 L57.7 37.6Z',
  'M59.4 35.2 L60.5 35 L74.4 34.7 L74.7 35.8 L59.4 35.9Z',
  'M60.5 33.6 L74 33 L74.2 34.5 L60.5 35Z',
];
const stairFrontMetal = [
  'M64.5 95 L67.5 80 L67.5 76 L69.9 69.4 L69.9 67 L71.5 62 L71.5 60 L72.8 56 L72.8 54.5 L73.6 51.5 L73.6 49.8 L74.5 47.6 L74.5 46 L75.3 44.5 L75.3 42.3 L76.1 40 L77 41 L76.2 48 L75 48 L75 51.5 L74 51.5 L74 56 L73 56 L73 62 L72.3 62 L72.3 69.5 L70.8 70 L70.8 80.5 L69.3 82 L68.7 99 L64.5 100Z',
  'M12 96 L14.5 86 L17 86.6 L17 95Z M24 81.5 L24.8 75 L27 75.7 L27 81.8Z M31.4 71.8 L32.5 67 L34.8 67.4 L34.3 72Z M37.1 64.3 L38.1 60 L40.7 60.2 L40 64.6Z M41.8 58.1 L42.8 54.7 L45.3 54.8 L44.5 58.2Z M45.5 53.3 L46.5 50.5 L49 50.5 L48.3 53.5Z M48.5 49.4 L49.5 47.3 L52 47.3 L51.4 49.5Z M51 46 L52 44.4 L54.3 44.4 L53.8 46.2Z',
];
const stairSideMetal = ['M0 87.3 L14.4 87.5 L14.4 82.7 L20.3 82.7 L20.3 77.4 L26.2 77.4 L26.2 71.9 L32.3 71.9 L32.3 66.5 L38.5 66.5 L38.5 60.9 L44.8 60.9 L44.8 55.2 L50.9 55.2 L50.9 49.6 L57.2 49.6 L57.2 43.9 L63.3 43.9 L63.3 38.4 L69.5 38.4 L69.5 32.2 L75.8 32.2 L75.8 26.4 L82 26.4 L82 20.4 L88.3 20.4 L88.3 14.1 L95.3 14.1 L95.3 12.4 L98.4 12.4 L98.4 18.2 L91.8 18.2 L91.8 24.4 L85.6 24.4 L85.6 30.4 L79 30.4 L79 36.3 L72.5 36.3 L72.5 42 L66.1 42 L66.1 47.9 L60.1 47.9 L60.1 53.6 L53.9 53.6 L53.9 59.4 L47.6 59.4 L47.6 65 L41.3 65 L41.3 70.5 L35.1 70.5 L35.1 76 L29.1 76 L29.1 81.4 L23.3 81.4 L23.3 86.5 L17.2 86.5 L17.2 93 L0 92.4Z'];
const stairSideWood = [
  'M0 87.3 L6.7 77.4 L18.2 77.5 L14.4 87.5Z',
  'M14.5 82.6 L21.7 74 L24.3 73.7 L20.3 77.4 L20.3 82.7Z',
  'M20.4 77.3 L26.2 70.2 L28.4 70.1 L26.2 71.9 L26.2 77.4Z',
  'M26.3 71.8 L31.4 65.2 L33.4 65.1 L32.3 66.5 L32.3 71.9Z',
  'M32.4 66.4 L36 60.8 L38.5 60.9 L38.5 66.4Z',
  'M38.6 60.8 L40.9 56.3 L44.5 56.3 L43.4 60.9Z',
  'M44.9 55.2 L46.4 52.1 L49.4 51.9 L49.4 55.1Z',
  'M51 49.5 L50.8 47.4 L55.5 47.5 L56.2 49.5Z',
  'M57.2 43.9 L55.5 43.1 L60.6 42.7 L60.6 43.9Z',
  'M63.3 39.7 L60.3 39.7 L60.3 38.4 L63.3 38.1Z',
  'M69.5 34.6 L65.2 35.1 L65.2 32.7 L69.5 31.5Z',
  'M75.7 29.8 L70 30.4 L70 28.7 L75.7 26.8Z',
  'M82 24.6 L75 26 L75 24.4 L82 21.8Z',
  'M88.3 19 L80 21.2 L80 19.7 L88.3 16.3Z',
  'M95.2 12.5 L84.8 16.3 L84.8 15 L92.1 10.4 L95.2 10.4Z',
  'M42.5 53.7 L79.8 17.6 L80.8 18.7 L43 54.8Z',
];

const fireplaceView = (photoId: string, outer: string, trim: string, frame: string, opening: string, anchors: [[number, number], [number, number], [number, number]]): MaterialView => ({
  photoId,
  layers: [
    { material: 'surround', paths: [outer], cutouts: [trim], offset: [-10, -8], anchor: anchors[0] },
    { material: 'trim', paths: [trim], cutouts: [frame], offset: [12, 1], anchor: anchors[1] },
    { material: 'firebox', paths: [frame], cutouts: [opening], offset: [0, 16], anchor: anchors[2] },
  ],
});

export const materialViews: [MaterialView, MaterialView][] = [
  [
    { photoId: 'IMG-20260718-WA0102', layers: [
      { material: 'cladding', paths: ['M0 69.2 L63 22 L65.6 26.5 L60.2 40 L57.5 84.8 L0 99Z'], cutouts: [...stairFrontWood, ...stairFrontMetal], offset: [-10, 2], anchor: [26, 58] },
      { material: 'treads', paths: stairFrontWood, offset: [-2, -12], anchor: [48, 66] },
      { material: 'structure', paths: stairFrontMetal, offset: [14, 4], anchor: [70, 76] },
    ] },
    { photoId: 'IMG-20260718-WA0103', layers: [
      { material: 'cladding', paths: ['M0 61.3 L18.6 61.1 L72.8 10.3 L96.1 10.3 L96.1 83.5 L26 82.6 L26 77.6 L0 77.6Z'], cutouts: [...stairSideWood, ...stairSideMetal], offset: [-9, 6], anchor: [74, 59] },
      { material: 'treads', paths: stairSideWood, offset: [-3, -15], anchor: [38, 62] },
      { material: 'structure', paths: stairSideMetal, offset: [12, 2], anchor: [60, 45] },
    ] },
  ],
  [
    fireplaceView('IMG-20260718-WA0052', 'M3.6 2.6 L100 12.5 L100 79.5 L6.7 95.1Z', 'M29.8 37.3 L95.2 37.6 L93.2 68.7 L30 75.3Z', 'M31.5 38.7 L93 38.8 L91 67.2 L31.7 73.5Z', 'M37.4 43.8 L86.1 43.1 L85.8 59.7 L37.6 63.4Z', [[56, 23], [93, 52], [58, 68]]),
    fireplaceView('IMG-20260718-WA0054', 'M4 2.5 L92.4 2.5 L91.6 97.2 L5.6 97.4Z', 'M22 39.3 L77.3 39 L77 82.4 L22.4 82.4Z', 'M24 40.7 L75.5 40.8 L75.1 79.4 L24.5 79.4Z', 'M28.9 46.6 L70.7 47 L70.7 69.7 L29.1 69.7Z', [[56, 21], [76, 56], [48, 75]]),
  ],
  [
    { photoId: 'IMG-20260718-WA0092', layers: [
      { material: 'worktop', paths: ['M3.5 23.1 L32.4 19.6 L98.8 41.2 L98.8 43 L62.6 58.7 L59.5 58.8 L3.7 24.6Z'], offset: [-2, -15], anchor: [52, 37] },
      { material: 'cabinetry', paths: ['M3.7 24.6 L59.5 58.8 L62.6 58.7 L98.4 43.1 L94.4 61.5 L61 78.4 L57.2 78 L54 74.3 L54 57.7 L17.9 35.5 L17.9 37.1 L7.1 37.4 L5.8 36.7Z'], offset: [12, 1], anchor: [74, 65] },
      { material: 'base', paths: ['M5.8 36.7 L7.1 37.4 L17.9 35.5 L19.4 45.5 L9 47.2 L8.4 46.8Z', 'M17.9 35.5 L54 57.7 L54 74.3 L19.4 45.5Z', 'M54 74.3 L57.2 78 L61 78.4 L94.4 61.5 L91.1 78.7 L60.5 92.2 L57.3 91.7 L53.8 89.1Z'], offset: [-8, 11], anchor: [72, 81] },
    ] },
    { photoId: 'IMG-20260718-WA0095', layers: [
      { material: 'worktop', paths: ['M0 0 L30 0 L87.3 25.8 L87.3 27 L84.3 28.3 L72.7 27.9 L30.7 12.8 L12.8 1 L0 1.2Z'], offset: [-2, -15], anchor: [58, 17] },
      { material: 'cabinetry', paths: ['M0 1.2 L12.8 1 L30.7 12.8 L36.7 58.8 L35.5 60.4 L21.2 64.5 L0 61.5Z', 'M33.2 19.9 L72.7 27.9 L86.7 27 L86.5 40.8 L72.4 41.4 L35.7 49Z'], offset: [12, 1], anchor: [51, 35] },
      { material: 'base', paths: ['M0 61.5 L21.2 64.5 L35.5 60.4 L40.5 97.4 L37 100 L7 100 L0 96.4Z', 'M35.7 49 L72.4 41.4 L86.5 40.8 L85.7 53.6 L72.4 53.5 L38 74.7Z'], offset: [-8, 10], anchor: [23, 79] },
    ] },
  ],
];
