import type { Language } from '../../translations';

type Slab = {
  id: string;
  name: Record<Language, string>;
  // Catalog trade name matched against the original photo, not verified inventory.
  tradeName: string;
};

export const homeSlabs: Slab[] = [
  { id: 'stone-01-x235', tradeName: 'Patagonia Green', name: { he: 'פטגוניה גרין', ar: 'باتاغونيا غرين', en: 'Patagonia Green', ru: 'Патагония Грин' } },
  { id: 'stone-02-x240', tradeName: 'Ijen Blue', name: { he: 'איג׳ן בלו', ar: 'إيجين بلو', en: 'Ijen Blue', ru: 'Иджен Блю' } },
  { id: 'stone-03-x242', tradeName: 'Azul Bahia', name: { he: 'אזול באהיה', ar: 'أزول باهيا', en: 'Azul Bahia', ru: 'Азул Баия' } },
  { id: 'stone-04-x241', tradeName: 'Black Cosmic', name: { he: 'בלאק קוסמיק', ar: 'بلاك كوزميك', en: 'Black Cosmic', ru: 'Блэк Космик' } },
  { id: 'stone-05-x247', tradeName: 'Splendido', name: { he: 'ספלנדידו', ar: 'سبلينديدو', en: 'Splendido', ru: 'Сплендидо' } },
  { id: 'stone-06-x248', tradeName: 'Cristallo Lumix', name: { he: 'קריסטלו לומיקס', ar: 'كريستالو لوميكس', en: 'Cristallo Lumix', ru: 'Кристалло Люмикс' } },
  { id: 'stone-07-x249', tradeName: 'Patagonia', name: { he: 'פטגוניה', ar: 'باتاغونيا', en: 'Patagonia', ru: 'Патагония' } },
  { id: 'stone-08-x256', tradeName: 'Emperador Dark', name: { he: 'אמפרדור דארק', ar: 'إمبرادور دارك', en: 'Emperador Dark', ru: 'Имперадор Дарк' } },
  { id: 'stone-09-x254', tradeName: 'Azul Macaubas', name: { he: 'אזול מקאובס', ar: 'أزول ماكاوباس', en: 'Azul Macaubas', ru: 'Азул Макаубас' } },
  { id: 'stone-10-x255', tradeName: 'Azul Bahia', name: { he: 'אזול באהיה', ar: 'أزول باهيا', en: 'Azul Bahia', ru: 'Азул Баия' } },
  { id: 'stone-11-x261', tradeName: 'Calacatta Oyster', name: { he: 'קלקטה אויסטר', ar: 'كالاكاتا أويستر', en: 'Calacatta Oyster', ru: 'Калакатта Ойстер' } },
  { id: 'stone-12-x262', tradeName: 'Cristallo Lumix', name: { he: 'קריסטלו לומיקס', ar: 'كريستالو لوميكس', en: 'Cristallo Lumix', ru: 'Кристалло Люмикс' } },
  { id: 'stone-13-x263', tradeName: 'Cristallo Lumix', name: { he: 'קריסטלו לומיקס', ar: 'كريستالو لوميكس', en: 'Cristallo Lumix', ru: 'Кристалло Люмикс' } },
];

export const slabNamingCopy: Record<Language, { note: string }> = {
  he: { note: 'אלה שמות מסחריים מקטלוגי אבן, ששויכו ללוחות בהשוואת תמונות המקור. השיוך משוער; את הדגם המדויק של הלוח הנבחר יש לאמת מול הספק לפני הזמנה.' },
  ar: { note: 'هذه أسماء تجارية من كتالوجات الحجر، طُوبقت مع الألواح بمقارنة الصور الأصلية. المطابقة تقديرية؛ يجب تأكيد الموديل الدقيق للوح المختار مع المورّد قبل الطلب.' },
  en: { note: 'These are catalog trade names matched by comparing the original slab photos. The matches are tentative; confirm the selected slab’s exact model with the supplier before ordering.' },
  ru: { note: 'Это торговые названия из каталогов камня, подобранные по исходным фотографиям плит. Совпадения предположительные; перед заказом уточните точную модель выбранной плиты у поставщика.' },
};
