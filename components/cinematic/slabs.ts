import type { Language } from '../../translations';

type Slab = {
  id: string;
  name: Record<Language, string>;
  // A visual comparison only. Never treat this as verified supplier inventory.
  possibleMatch?: string;
};

export const homeSlabs: Slab[] = [
  { id: 'stone-01-x235', name: { he: 'גלים בירוק וכסף', ar: 'تموّجات خضراء وفضية', en: 'Green & Silver Waves', ru: 'Зелёные и серебристые волны' } },
  { id: 'stone-02-x240', name: { he: 'כחול ונחושת', ar: 'أزرق ونحاسي', en: 'Blue & Copper', ru: 'Голубой и медный' }, possibleMatch: 'Blue Roma' },
  { id: 'stone-03-x242', name: { he: 'כחול ולבן', ar: 'أزرق وأبيض', en: 'Blue & White', ru: 'Синий и белый' }, possibleMatch: 'Azul Bahia' },
  { id: 'stone-04-x241', name: { he: 'שחור וזהב', ar: 'أسود وذهبي', en: 'Black & Gold', ru: 'Чёрный и золотой' }, possibleMatch: 'Black Cosmic' },
  { id: 'stone-05-x247', name: { he: 'חום מעושן', ar: 'بني دخاني', en: 'Smoky Brown', ru: 'Дымчато-коричневый' } },
  { id: 'stone-06-x248', name: { he: 'לבן וענבר', ar: 'أبيض وعنبري', en: 'White & Amber', ru: 'Белый и янтарный' } },
  { id: 'stone-07-x249', name: { he: 'שנהב ושחור', ar: 'عاجي وأسود', en: 'Ivory & Black', ru: 'Слоновая кость и чёрный' }, possibleMatch: 'Patagonia' },
  { id: 'stone-08-x256', name: { he: 'חום ועורקי זהב', ar: 'بني بعروق ذهبية', en: 'Brown & Golden Veins', ru: 'Коричневый с золотистыми прожилками' }, possibleMatch: 'Marrón Emperador' },
  { id: 'stone-09-x254', name: { he: 'פסים בכחול', ar: 'خطوط زرقاء', en: 'Blue Stripes', ru: 'Синие полосы' }, possibleMatch: 'Azul Macaubas' },
  { id: 'stone-10-x255', name: { he: 'גלים באפור וכחול', ar: 'تموّجات رمادية وزرقاء', en: 'Grey & Blue Waves', ru: 'Серые и синие волны' } },
  { id: 'stone-11-x261', name: { he: 'שנהב ונחושת', ar: 'عاجي ونحاسي', en: 'Ivory & Copper', ru: 'Слоновая кость и медный' } },
  { id: 'stone-12-x262', name: { he: 'לבן ורשת זהב', ar: 'أبيض بشبكة ذهبية', en: 'White & Golden Web', ru: 'Белый с золотистой сеткой' } },
  { id: 'stone-13-x263', name: { he: 'פנינה וזהב', ar: 'لؤلؤي وذهبي', en: 'Pearl & Gold', ru: 'Жемчужный и золотой' } },
];

export const slabNamingCopy: Record<Language, { match: string; note: string }> = {
  he: { match: 'זיהוי משוער', note: 'שמות הלוחות מתארים את המראה. הזיהויים המסחריים משוערים לפי תמונות; את שם הדגם המדויק יש לאמת מול הספק.' },
  ar: { match: 'تعرّف تقديري', note: 'أسماء الألواح تصف مظهرها. الأسماء التجارية تقديرية بحسب الصور؛ يجب تأكيد اسم الموديل الدقيق مع المورّد.' },
  en: { match: 'Possible match', note: 'Slab names describe their appearance. Trade names are tentative visual matches; confirm the exact model with the supplier.' },
  ru: { match: 'Предположительное название', note: 'Названия описывают внешний вид плит. Торговые названия предположены по фотографиям; точную модель нужно уточнить у поставщика.' },
};
