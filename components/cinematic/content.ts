import type { Language } from '../../translations';

type Project = { title: string; headline: string; description: string; category: string; detail: string; captions: [string, string] };
type Copy = {
  eyebrow: string; start: string; tagline: string; reveal: string; revealBody: string;
  scroll: string; skip: string; selected: string; room: string; detail: string; full: string;
  close: string; all: string; material: string; materialTitle: string; looks: [string, string, string];
  lookDescriptions: [string, string, string]; real: string; craft: string; craftTitle: string;
  craftBody: string; steps: [string, string][]; contactTag: string; contactTitle: string;
  chat: string; location: string; catalog: string; reduce: string; enable: string;
  sawAlt: string; detailNote: string; projects: [Project, Project, Project];
};

export const cinematicCopy: Record<Language, Copy> = {
  he: {
    eyebrow: 'שיש כפר יאסיף · מלאכת האבן', start: 'כאן הכול\nמתחיל.', tagline: 'חומר. דיוק. יצירה.',
    reveal: 'מהאבן\nאל החלל שלך.', revealBody: 'מחשבה שהופכת לחומר.\nחומר שהופך לבית.',
    scroll: 'גללו וגלו מה נוצר', skip: 'דלגו לעבודות', selected: 'עבודות נבחרות', room: 'מבט על הבית', detail: 'מבט על הפרטים', full: 'הצילום המלא', close: 'סגירה', all: 'לכל העבודות',
    material: '03 — השפה של החומר', materialTitle: 'איזה אופי\nיש לבית שלכם?', looks: ['תנועה', 'ניגוד', 'חום'],
    lookDescriptions: ['עורקים מודגשים וקווים אדריכליים.', 'אבן בהירה ומסגרת כהה. שיחה בין ניגודים.', 'אבן בגוון חם שפוגשת את נגרות העץ.'], real: 'עבודות אמיתיות מתוך תיק הפרויקטים',
    craft: '04 — המלאכה', craftTitle: 'מחשבה בחומר.\nדיוק בכל חיבור.', craftBody: 'חיתוך והתקנה של משטחי אבן, שיש ופורצלן בכפר יאסיף. למטבחים, חדרי רחצה, קמינים ומדרגות.',
    steps: [['מתחילים בחלל', 'מדברים על השימוש, המידות והאופי שתרצו לתת לבית.'], ['בוחרים את החומר', 'מסתכלים יחד על הגוון, הטקסטורה והגימור, ועל ההתאמה לפרויקט.'], ['מדייקים את הפרטים', 'מתכננים את החיתוך, הקצוות והמפגשים בין המשטחים לפני הביצוע.']],
    contactTag: 'הפרויקט הבא מתחיל בשיחה', contactTitle: 'איזה חלל\nאתם מדמיינים?', chat: 'בואו נדבר בוואטסאפ', location: 'אזור התעשייה · כפר יאסיף', catalog: 'הקטלוג שלנו', reduce: 'הפחתת תנועה', enable: 'הפעלת תנועה', sawAlt: 'הדמיה אמנותית של מכונה בחיתוך אבן', detailNote: 'פרטים מתוך אותו צילום',
    projects: [
      { title: 'תנועה באבן', headline: 'קווים שנפגשים.\nבית שמתרומם.', description: 'קווי המדרגות פוגשים את עורקי האבן. מבט אחד על השלם, ועוד מבט על הפרטים.', category: 'מדרגות · חיפוי קיר', detail: 'הדיוק נמצא במפגש.', captions: ['קצב המדרגות', 'עורקי האבן'] },
      { title: 'מרכז של שקט', headline: 'אבן עם נוכחות.\nמקום לעצור.', description: 'הפתח הכהה מדגיש את האבן שסביבו. העורקים ממשיכים את התנועה גם כשהבית שקט.', category: 'קמין · אבן טבעית', detail: 'מסגרת לשקט.', captions: ['מפגש החומרים', 'מרקם האבן'] },
      { title: 'המקום שבו נפגשים', headline: 'מגע של אבן.\nחום של בית.', description: 'גוון האבן, משטח העבודה ונגרות העץ נפגשים במקום אחד. מקום ליום־יום ולרגעים ביחד.', category: 'אי מטבח · משטח בהתאמה אישית', detail: 'החומר פוגש את החיים.', captions: ['קצה המשטח', 'גוונים וחומרים'] },
    ],
  },
  ar: {
    eyebrow: 'شايش كفر ياسيف · حرفة الحجر', start: 'من هنا\nتبدأ الحكاية.', tagline: 'مادة. دقّة. إبداع.', reveal: 'من الحجر\nإلى مساحتك.', revealBody: 'فكرة تتحوّل إلى مادة.\nومادة تصبح بيتًا.', scroll: 'مرّر لتكتشف النتيجة', skip: 'انتقل إلى الأعمال', selected: 'أعمال مختارة', room: 'المشهد الكامل', detail: 'نظرة إلى التفاصيل', full: 'الصورة الكاملة', close: 'إغلاق', all: 'كل الأعمال',
    material: '03 — لغة المادة', materialTitle: 'ما الطابع الذي\nتريده لبيتك؟', looks: ['حركة', 'تباين', 'دفء'], lookDescriptions: ['عروق واضحة وخطوط معمارية.', 'حجر فاتح وإطار داكن. حوار بين الأضداد.', 'حجر بألوان دافئة يلتقي بخشب المطبخ.'], real: 'أعمال حقيقية من مشاريعنا', craft: '04 — الحرفة', craftTitle: 'فكرة في الحجر.\nدقّة في كل التقاء.', craftBody: 'قصّ وتركيب أسطح الحجر والرخام والبورسلان في كفر ياسيف، للمطابخ والحمّامات والمدافئ والأدراج.',
    steps: [['نبدأ بالمساحة', 'نتحدّث عن الاستخدام والمقاسات والطابع الذي تريده لبيتك.'], ['نختار المادة', 'نختار معًا اللون والملمس والتشطيب المناسب للمشروع.'], ['ندقّق في التفاصيل', 'نخطّط للقصّ والحواف والتقاء الأسطح قبل التنفيذ.']],
    contactTag: 'مشروعك القادم يبدأ بمحادثة', contactTitle: 'أي مساحة\nتتخيّل؟', chat: 'لنتحدّث عبر واتساب', location: 'المنطقة الصناعية · كفر ياسيف', catalog: 'الكتالوج', reduce: 'تقليل الحركة', enable: 'تفعيل الحركة', sawAlt: 'تصوّر فني لآلة قصّ الحجر', detailNote: 'تفاصيل من الصورة نفسها',
    projects: [
      { title: 'حركة في الحجر', headline: 'خطوط تلتقي.\nبيت يرتقي.', description: 'تلتقي خطوط الدرج بعروق الحجر. نظرة إلى المشهد الكامل، وأخرى إلى التفاصيل.', category: 'أدراج · كسوة جدران', detail: 'الدقّة في نقطة الالتقاء.', captions: ['إيقاع الدرج', 'عروق الحجر'] },
      { title: 'مركز الهدوء', headline: 'حجر بحضور.\nمكان للتأمّل.', description: 'تُبرز الفتحة الداكنة الحجر المحيط بها. تبقى العروق نابضة حتى عندما يهدأ البيت.', category: 'مدفأة · حجر طبيعي', detail: 'إطار للهدوء.', captions: ['التقاء المواد', 'ملمس الحجر'] },
      { title: 'حيث نلتقي', headline: 'لمسة حجر.\nدفء البيت.', description: 'يلتقي لون الحجر وسطح العمل وخشب المطبخ في مكان يجمع تفاصيل الحياة اليومية.', category: 'جزيرة مطبخ · سطح حسب الطلب', detail: 'حيث تلتقي المادة بالحياة.', captions: ['حافة السطح', 'الألوان والمواد'] },
    ],
  },
  en: {
    eyebrow: 'Shayish Kfar Yassif · The craft of stone', start: 'It all\nbegins here.', tagline: 'Material. Precision. Creation.', reveal: 'From stone\nto your space.', revealBody: 'An idea becomes a material.\nA material becomes a home.', scroll: 'Scroll to discover', skip: 'Skip to projects', selected: 'Selected projects', room: 'The whole space', detail: 'A closer look', full: 'View full photograph', close: 'Close', all: 'Explore all projects',
    material: '03 — The language of material', materialTitle: 'What character\ndoes your home have?', looks: ['Movement', 'Contrast', 'Warmth'], lookDescriptions: ['Expressive veins and architectural lines.', 'Light stone and a dark frame. A dialogue of contrasts.', 'Warm stone meets the grain of wood.'], real: 'Real work from our project portfolio', craft: '04 — The craft', craftTitle: 'Thought in material.\nPrecision at every joint.', craftBody: 'Stone, marble and porcelain fabrication and installation in Kfar Yassif. For kitchens, bathrooms, fireplaces and stairs.',
    steps: [['Start with the space', 'We discuss how you use the room, its dimensions and the character you want.'], ['Choose the material', 'Together we consider colour, texture, finish and suitability for your project.'], ['Refine the details', 'We plan the cuts, edges and junctions before fabrication.']],
    contactTag: 'Your next project starts with a conversation', contactTitle: 'What space\ndo you imagine?', chat: 'Talk to us on WhatsApp', location: 'Industrial area · Kfar Yassif', catalog: 'Our catalog', reduce: 'Reduce motion', enable: 'Enable motion', sawAlt: 'Artistic illustration of a stone-cutting machine', detailNote: 'Details from the same photograph',
    projects: [
      { title: 'Movement in stone', headline: 'Lines meet.\nA home rises.', description: 'The lines of the stairs meet the veins of the stone. First the whole composition, then the details.', category: 'Stairs · Wall cladding', detail: 'Precision at the junction.', captions: ['The rhythm of the stairs', 'The veins of the stone'] },
      { title: 'A centre of calm', headline: 'Stone with presence.\nA place to pause.', description: 'The dark opening brings out the surrounding stone. Its veins keep moving even when the room is still.', category: 'Fireplace · Natural stone', detail: 'A frame for stillness.', captions: ['Materials meeting', 'The stone texture'] },
      { title: 'Where we gather', headline: 'A touch of stone.\nThe warmth of home.', description: 'Stone colour, the work surface and wood cabinetry meet in one place. For everyday life and moments together.', category: 'Kitchen island · Custom surface', detail: 'Material meets life.', captions: ['The surface edge', 'Tones and materials'] },
    ],
  },
  ru: {
    eyebrow: 'Shayish Kfar Yassif · Мастерство камня', start: 'Здесь всё\nначинается.', tagline: 'Материал. Точность. Создание.', reveal: 'От камня\nк вашему интерьеру.', revealBody: 'Идея становится материалом.\nМатериал становится домом.', scroll: 'Листайте, чтобы увидеть результат', skip: 'К проектам', selected: 'Избранные проекты', room: 'Общий вид', detail: 'Внимание к деталям', full: 'Открыть фотографию', close: 'Закрыть', all: 'Все проекты',
    material: '03 — Язык материала', materialTitle: 'Какой характер\nу вашего дома?', looks: ['Движение', 'Контраст', 'Тепло'], lookDescriptions: ['Выразительные прожилки и архитектурные линии.', 'Светлый камень и тёмная рама. Диалог контрастов.', 'Тёплые оттенки камня встречаются с деревом.'], real: 'Реальные работы из нашего портфолио', craft: '04 — Мастерство', craftTitle: 'Мысль в материале.\nТочность каждого стыка.', craftBody: 'Изготовление и монтаж поверхностей из камня, мрамора и керамогранита в Кфар-Ясифе. Для кухонь, ванных, каминов и лестниц.',
    steps: [['Начинаем с пространства', 'Обсуждаем назначение, размеры и желаемый характер интерьера.'], ['Выбираем материал', 'Вместе подбираем цвет, фактуру и обработку для вашего проекта.'], ['Уточняем детали', 'Планируем раскрой, края и стыки поверхностей до изготовления.']],
    contactTag: 'Ваш следующий проект начинается с разговора', contactTitle: 'Какой интерьер\nвы представляете?', chat: 'Напишите нам в WhatsApp', location: 'Промышленная зона · Кфар-Ясиф', catalog: 'Наш каталог', reduce: 'Уменьшить движение', enable: 'Включить движение', sawAlt: 'Художественная визуализация станка для резки камня', detailNote: 'Детали той же фотографии',
    projects: [
      { title: 'Движение в камне', headline: 'Линии встречаются.\nДом устремляется вверх.', description: 'Линии лестницы встречаются с прожилками камня. Сначала общий вид, затем детали.', category: 'Лестницы · Облицовка стен', detail: 'Точность в месте встречи.', captions: ['Ритм лестницы', 'Прожилки камня'] },
      { title: 'Центр спокойствия', headline: 'Выразительный камень.\nМесто для паузы.', description: 'Тёмный проём подчёркивает окружающий камень. Его прожилки сохраняют движение в тихом доме.', category: 'Камин · Натуральный камень', detail: 'Рама для тишины.', captions: ['Сочетание материалов', 'Фактура камня'] },
      { title: 'Место встречи', headline: 'Прикосновение камня.\nТепло дома.', description: 'Оттенок камня, рабочая поверхность и дерево кухни встречаются в одном месте. Для повседневной жизни и общих моментов.', category: 'Кухонный остров · Индивидуальная столешница', detail: 'Материал встречается с жизнью.', captions: ['Край поверхности', 'Оттенки и материалы'] },
    ],
  },
};

// Keep business photographs on the existing public portfolio CDN.
export const projectImages = ['IMG-20260718-WA0101', 'IMG-20260718-WA0057', 'IMG-20260718-WA0090'].map(id => `https://res.cloudinary.com/dst5uru0/image/upload/c_limit,w_1800,q_auto,f_auto/shayish/gallery/${id}`);
export const detailPositions = [['25% 45%', '78% 32%'], ['30% 45%', '72% 55%'], ['28% 60%', '76% 48%']];
