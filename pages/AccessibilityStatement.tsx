/**
 * ACCESSIBILITY STATEMENT (הצהרת נגישות)
 *
 * Compliant with:
 * - Equal Rights for Persons with Disabilities Law (1998)
 * - Israeli Standard IS 5568
 * - WCAG 2.0 Level AA
 *
 * Website: שיש כפר יאסיף - Shayish Kfar Yassif
 * URL: https://shayish-yasif.co.il
 * Last Accessibility Review: February 25, 2025
 * Next Review: February 25, 2026
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, User, CheckCircle, AlertCircle } from 'lucide-react';

type StatementLanguage = 'he' | 'ar' | 'en' | 'ru';

interface CoordinatorInfo {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

const ACCESSIBILITY_REVIEW_DATE = '2025-02-25';
const NEXT_REVIEW_DATE = '2026-02-25';
const WEBSITE_URL = 'https://shayish-yasif.co.il';

const COORDINATOR: CoordinatorInfo = {
  name: '[שם הממונה על נגישות]',
  role: 'Accessibility Coordinator / ממונה על נגישות',
  email: 'info@shayish-yasif.co.il',
  phone: '+972-50-000-0000'
};

const translations: Record<StatementLanguage, any> = {
  he: {
    backHome: 'חזרה לדף הבית',
    title: 'הצהרת נגישות',
    subtitle: 'שיש כפר יאסיף מחויב להנגשת האתר לאנשים עם מוגבלויות',

    // Section 1: Our Commitment
    commitment: {
      title: 'התחייבות שלנו',
      content: 'שיש כפר יאסיף מחויב להנגישת האתר לכלל המשתמשים, כולל אנשים עם מוגבלויות, בהתאם לחוק הישראלי לשוויון זכויות לאנשים עם מוגבלויות (1998) ולתקן הישראלי IS 5568 (המבוסס על WCAG 2.0 רמת AA).'
    },

    // Section 2: Compliance Level
    compliance: {
      title: 'רמת תאימות',
      level: 'אתר זה עומד בדרישות תקן WCAG 2.0 רמת AA כפי שנדרש בתקן IS 5568.',
      lastReview: 'תאריך בדיקת נגישות אחרונה',
      lastReviewDate: ACCESSIBILITY_REVIEW_DATE,
      nextReview: 'תאריך בדיקת נגישות הבאה',
      nextReviewDate: NEXT_REVIEW_DATE,
      websiteUrl: 'כתובת האתר',
      url: WEBSITE_URL
    },

    // Section 3: Accessibility Features
    features: {
      title: 'תכונות נגישות שיושמו',
      subtitle: 'אתר זה כולל את תכונות הנגישות הבאות:',
      items: {
        widget: 'ווידגט נגישות עם 10 כלים (גודל טקסט, ניגודיות, גווני אפור, קישורים, פונט קריא, ריווח אותיות, גובה שורה, השהיית אנימציות, הדגשה בעכבר, איפוס הכל)',
        skipLink: 'קישור דילוג לתוכן עיקרי (Skip Navigation)',
        headings: 'היררכיית כותרות נכונה (H1 → H2 → H3)',
        altText: 'טקסט חלופי (Alt Text) לכל התמונות',
        keyboard: 'ניווט במקלדת בלבד לכל האלמנטים האינטראקטיביים',
        focus: 'אינדיקטור פוקוס גלוי בכל אלמנט פוקוסבילי',
        linkText: 'טקסט קישור תיאורי (לא "לחץ כאן")',
        formLabels: 'תוויות גלויות בכל שדות הטופס',
        contrast: 'יחס ניגודיות צבעים עומד על 4.5:1 לפחות',
        langAttr: 'מאפיין שפה מוצהר על אלמנט ה-HTML',
        aria: 'מאפייני ARIA על רכיבים מותאמים אישית',
        noFlashing: 'אין תוכן מהבהב יותר מ-3 פעמים בשנייה'
      }
    },

    // Section 4: Known Limitations
    limitations: {
      title: 'מגבלות נגישות ידועות',
      none: 'אין מגבלות נגישות ידועות בשלב זה.',
      partial: 'מגבלות חלקיות',
      expectedFix: 'תיקון צפוי'
    },

    // Section 5: Coordinator Contact
    coordinator: {
      title: 'פרטי רכז הנגישות',
      name: 'שם',
      role: 'תפקיד',
      email: 'אימייל',
      phone: 'טלפון',
      responseTime: 'זמן תגובה',
      responseTimeValue: 'תוך 5 ימי עסקים',
      contactBox: 'תיבת יצירת קשר - ממונה על נגישות'
    },

    // Section 6: How to Report
    report: {
      title: 'כיצד לדווח על מחסום נגישות',
      intro: 'אם נתקלת במחסום נגישות באתר שלנו, אנא צור קשר איתנו:',
      email: 'info@shayish-yasif.co.il',
      instructions: 'אנא ציין:',
      page: 'העמוד או התכונה שבה נתקלת בבעיה',
      technology: 'סוג טכנולוגיית הנגישה שבה אתה משתמש (אם יש)',
      description: 'תיאור המחסום',
      response: 'נחזור אליך תוך 5 ימי עסקים ונשאף לפתור את הבעיה בהקדם האפשרי.'
    },

    // Section 7: Continuous Improvement
    improvement: {
      title: 'שיפור מתמיד',
      content: 'אנו מחויבים לשפר את נגישות האתר שלנו באופן מתמיד. אנו מבצעים ביקורות נגישות שנתיות ומיישמים שיפורים באופן מתמיד. המשוב שלך עוזר לנו להשתפר לטובת כולם.'
    },

    // Widget section
    widget: {
      title: 'ווידגט הנגישות שלנו',
      intro: 'לחץ על כפתור הנגישות בפינה הימנית התחתונה של המסך כדי לגשת לתכונות נגישות מורחבות:',
      features: [
        'הגדלת/הקטנת גודל טקסט (100% - 180%)',
        'מצב ניגודיות גבוהה',
        'מצב גווני אפור',
        'הדגשת קישורים',
        'פונט קריא',
        'הגדלת ריווח בין אותיות',
        'הגדלת גובה שורה',
        'השהיית אנימציות',
        'הדגשה בעכבר ופוקוס',
        'איפוס כל ההגדרות'
      ],
      keyboardTitle: 'קיצורי מקלדת',
      shortcuts: {
        tab: 'עבור לאלמנט הבא',
        shiftTab: 'עבור לאלמנט הקודם',
        enter: 'הפעל כפתורים וקישורים',
        esc: 'סגור תפריטים ודיאלוגים'
      }
    },

    language: 'שפה',
    lastUpdated: 'עודכן לאחרונה',
    lastUpdatedDate: '25 בפברואר 2025'
  },

  ar: {
    backHome: 'العودة إلى الصفحة الرئيسية',
    title: 'بيان إتاحة الوصول',
    subtitle: 'تشايس كفر ياسيف ملتزم بجعل موقعنا متاحًا لجميع المستخدمين',

    commitment: {
      title: 'التزامنا',
      content: `تشايس كفر ياسيف ملتزم بجعل موقعنا متاحًا لجميع المستخدمين، بما في ذلك الأشخاص ذوو الإعاقة، وفقًا لقانون المساواة في حقوق الأشخاص ذوي الإعاقة (1998) والمعيار الإسرائيلي IS 5568 (بناءً على WCAG 2.0 المستوى AA).`
    },

    compliance: {
      title: 'مستوى الامتثال',
      level: 'يتوافق هذا الموقع مع متطلبات معيار WCAG 2.0 المستوى AA كما هو مطلوب في معيار IS 5568.',
      lastReview: 'تاريخ آخر مراجعة لإتاحة الوصول',
      lastReviewDate: ACCESSIBILITY_REVIEW_DATE,
      nextReview: 'تاريخ المراجعة القادمة لإتاحة الوصول',
      nextReviewDate: NEXT_REVIEW_DATE,
      websiteUrl: 'عنوان الموقع',
      url: WEBSITE_URL
    },

    features: {
      title: 'ميزات إتاحة الوصول المنفذة',
      subtitle: 'يحتوي هذا الموقع على ميزات إتاحة الوصول التالية:',
      items: {
        widget: 'ودجة إتاحة الوصول مع 10 أدوات (حجم النص، التباين العالي، تدرج الرمادي، الخطوط، الخط المقروء، تباعد الأحرف، ارتفاع السطر، إيقاف الحركات، التظليل عند التمرير، إعادة التعيين)',
        skipLink: 'رابط تخطي إلى المحتوى الرئيسي',
        headings: 'تسلسل هرمي صحيح للعناوين (H1 → H2 → H3)',
        altText: 'نص بديل للصور',
        keyboard: 'التنقل بلوحة المفاتيح فقط لجميع العناصر التفاعلية',
        focus: 'مؤشر تركيز مرئي على جميع العناصر القابلة للتركيز',
        linkText: 'نص رابط وصفي',
        formLabels: 'تسميات مرئية على جميع حقول النموذج',
        contrast: 'نسبة تباين الألوان 4.5:1 على الأقل',
        langAttr: 'سمة اللغة معلنة على عنصر HTML',
        aria: 'سمات ARIA على المكونات المخصصة',
        noFlashing: 'لا يوجد محتوى وميض أكثر من 3 مرات في الثانية'
      }
    },

    limitations: {
      title: 'قيود إتاحة الوصول المعروفة',
      none: 'لا توجد قيود إتاحة الوصول المعروفة في الوقت الحالي.',
      partial: 'قيود جزئية',
      expectedFix: 'إصلاح متوقع'
    },

    coordinator: {
      title: 'تفاصيل منسق إتاحة الوصول',
      name: 'الاسم',
      role: 'الدور',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      responseTime: 'وقت الاستجابة',
      responseTimeValue: 'خلال 5 أيام عمل',
      contactBox: 'صندوق الاتصال - منسق إتاحة الوصول'
    },

    report: {
      title: 'كيفية الإبلاغ عن حاجز إتاحة الوصول',
      intro: 'إذا واجهت أي حاجز لإتاحة الوصول على موقعنا، يرجى الاتصال بنا:',
      email: 'info@shayish-yasif.co.il',
      instructions: 'يرجى تحديد:',
      page: 'الصفحة أو الميزة التي واجهت فيها المشكلة',
      technology: 'نوع تقنية إتاحة الوصول التي تستخدمها (إن وجدت)',
      description: 'وصف الحاجز',
      response: 'سنت responded إليك خلال 5 أيام عمل ونسعى لحل المشكلة في أسرع وقت ممكن.'
    },

    improvement: {
      title: 'التحسين المستمر',
      content: 'نحن ملتزمون بتحسين إتاحة موقعنا بشكل مستمر. نجري تدقيقات إتاحة سنوية وننفذ التحسينات على أساس مستمر. تساعدنا ملاحظاتك على التحسن من أجل الجميع.'
    },

    // Section 1: Our Commitment
    commitment: {
      title: 'التزامنا',
      content: 'تشايس كفر ياسيف ملتزم بجعل موقعنا متاحًا لجميع المستخدمين، بما في ذلك الأشخاص ذوو الإعاقة، وفقًا لقانون المساواة في حقوق الأشخاص ذوي الإعاقة (1998) والمعيار الإسرائيلي IS 5568 (بناءً على WCAG 2.0 المستوى AA).'
    },

    improvement: {
      title: 'التحسين المستمر',
      content: 'نحن ملتزمون بتحسين إتاحة موقعنا بشكل مستمر. نجري تدقيقات إتاحة سنوية وننفذ التحسينات على أساس مستمر. تساعدنا ملاحظاتك على التحسن من أجل الجميع.'
    },

    widget: {
      title: 'ودجة إتاحة الوصول',
      intro: 'انقر على زر إتاحة الوصول في الزاوية اليمنى السفلية للشاشة للوصول إلى ميزات إتاحة الوصول الموسعة:',
      features: [
        'زيادة/تقليل حجم النص (100% - 180%)',
        'وضع التباين العالي',
        'وضع تدرج الرمادي',
        'تسطير الروابط',
        'خط مقروء',
        'تباعد الأحرف',
        'ارتفاع السطر',
        'إيقاف الحركات',
        'تظليل عند التمرير والتركيز',
        'إعادة تعيين الكل'
      ],
      keyboardTitle: 'اختصارات لوحة المفاتيح',
      shortcuts: {
        tab: 'الانتقال إلى العنصر التالي',
        shiftTab: 'الانتقال إلى العنصر السابق',
        enter: 'تنشيط الأزرار والروابط',
        esc: 'إغلاق القوائم ومربعات الحوار'
      }
    },

    language: 'اللغة',
    lastUpdated: 'آخر تحديث',
    lastUpdatedDate: '25 فبراير 2025'
  },

  en: {
    backHome: 'Back to Home',
    title: 'Accessibility Statement',
    subtitle: 'Shayish Kfar Yassif is committed to making our website accessible to everyone',

    commitment: {
      title: 'Our Commitment',
      content: `Shayish Kfar Yassif is committed to making our website accessible to all users, including people with disabilities, in accordance with Israel's Equal Rights for Persons with Disabilities Law (1998) and Israeli Standard IS 5568 (based on WCAG 2.0 Level AA).`
    },

    compliance: {
      title: 'Compliance Level',
      level: 'This website conforms to WCAG 2.0 Level AA requirements as mandated by IS 5568 standard.',
      lastReview: 'Last Accessibility Review Date',
      lastReviewDate: ACCESSIBILITY_REVIEW_DATE,
      nextReview: 'Next Scheduled Accessibility Review',
      nextReviewDate: NEXT_REVIEW_DATE,
      websiteUrl: 'Website URL',
      url: WEBSITE_URL
    },

    features: {
      title: 'Implemented Accessibility Features',
      subtitle: 'This website includes the following accessibility features:',
      items: {
        widget: 'Accessibility widget with 10 tools (text size, contrast, grayscale, links, font, letter spacing, line height, pause animations, hover highlight, reset all)',
        skipLink: 'Skip to main content navigation link',
        headings: 'Proper heading hierarchy (H1 → H2 → H3)',
        altText: 'Alt text on all images',
        keyboard: 'Keyboard navigation for all interactive elements',
        focus: 'Visible focus indicators on all focusable elements',
        linkText: 'Descriptive link text (not "click here")',
        formLabels: 'Visible labels on all form fields',
        contrast: 'Color contrast meeting 4.5:1 minimum ratio',
        langAttr: 'Language attribute declared on HTML element',
        aria: 'ARIA attributes on custom interactive components',
        noFlashing: 'No content flashing more than 3 times per second'
      }
    },

    limitations: {
      title: 'Known Accessibility Limitations',
      none: 'No known accessibility limitations at this time.',
      partial: 'Partial limitations',
      expectedFix: 'Expected fix'
    },

    coordinator: {
      title: 'Accessibility Coordinator Details',
      name: 'Name',
      role: 'Role',
      email: 'Email',
      phone: 'Phone',
      responseTime: 'Response Time',
      responseTimeValue: 'Within 5 business days',
      contactBox: 'Contact Box - Accessibility Coordinator'
    },

    report: {
      title: 'How to Report an Accessibility Barrier',
      intro: 'If you encounter any accessibility barrier on our website, please contact us:',
      email: 'info@shayish-yasif.co.il',
      instructions: 'Please specify:',
      page: 'The page or feature where you encountered the issue',
      technology: 'The type of assistive technology you use (if any)',
      description: 'A description of the barrier',
      response: 'We will respond within 5 business days and strive to resolve the issue as quickly as possible.'
    },

    improvement: {
      title: 'Continuous Improvement',
      content: 'We are committed to continuously improving the accessibility of our website. We conduct annual accessibility audits and implement improvements on an ongoing basis. Your feedback helps us improve for everyone.'
    },

    widget: {
      title: 'Our Accessibility Widget',
      intro: 'Click the accessibility button in the bottom-right corner of the screen to access extended accessibility features:',
      features: [
        'Increase/decrease text size (100% - 180%)',
        'High contrast mode',
        'Grayscale mode',
        'Underline links',
        'Readable font',
        'Letter spacing',
        'Line height',
        'Pause animations',
        'Hover/focus highlight',
        'Reset all'
      ],
      keyboardTitle: 'Keyboard Shortcuts',
      shortcuts: {
        tab: 'Move to next element',
        shiftTab: 'Move to previous element',
        enter: 'Activate buttons and links',
        esc: 'Close menus and dialogs'
      }
    },

    language: 'Language',
    lastUpdated: 'Last Updated',
    lastUpdatedDate: 'February 25, 2025'
  },

  ru: {
    backHome: 'Вернуться на главную',
    title: 'Заявление о доступности',
    subtitle: 'Шайиш Кфар-Ясиф стремится сделать наш веб-сайт доступным для всех',

    commitment: {
      title: 'Наши обязательства',
      content: `Шайиш Кфар-Ясиф стремится сделать наш веб-сайт доступным для всех пользователей, включая людей с ограниченными возможностями, в соответствии с Законом Израиля о равных правах людей с ограниченными возможностями (1998) и израильским стандартом IS 5568 (основанном на WCAG 2.0 Level AA).`
    },

    compliance: {
      title: 'Уровень соответствия',
      level: 'Этот веб-сайт соответствует требованиям WCAG 2.0 Level AA, требуемым стандартом IS 5568.',
      lastReview: 'Дата последней проверки доступности',
      lastReviewDate: ACCESSIBILITY_REVIEW_DATE,
      nextReview: 'Дата следующей запланированной проверки',
      nextReviewDate: NEXT_REVIEW_DATE,
      websiteUrl: 'URL веб-сайта',
      url: WEBSITE_URL
    },

    features: {
      title: 'Реализованные функции доступности',
      subtitle: 'Этот веб-сайт включает следующие функции доступности:',
      items: {
        widget: 'Виджет доступности с 10 инструментами (размер текста, контраст, оттенки серого, ссылки, шрифт, межбуквенный интервал, высота строки, пауза анимации, выделение при наведении, сброс всех)',
        skipLink: 'Ссылка пропуска к основному содержимому',
        headings: 'Правильная иерархия заголовков (H1 → H2 → H3)',
        altText: 'Альтернативный текст для всех изображений',
        keyboard: 'Навигация с клавиатуры для всех интерактивных элементов',
        focus: 'Видимые индикаторы фокуса на всех элементах',
        linkText: 'Описательный текст ссылок',
        formLabels: 'Видимые метки на всех полях формы',
        contrast: 'Контрастность цветов соответствует минимуму 4.5:1',
        langAttr: 'Атрибут языка объявлен в элементе HTML',
        aria: 'Атрибуты ARIA на настраиваемых компонентах',
        noFlashing: 'Нет содержимого, мигающего более 3 раз в секунду'
      }
    },

    limitations: {
      title: 'Известные ограничения доступности',
      none: 'На данный момент нет известных ограничений доступности.',
      partial: 'Частичные ограничения',
      expectedFix: 'Ожажаемое исправление'
    },

    coordinator: {
      title: 'Данные координатора доступности',
      name: 'Имя',
      role: 'Роль',
      email: 'Эл. почта',
      phone: 'Телефон',
      responseTime: 'Время ответа',
      responseTimeValue: 'В течение 5 рабочих дней',
      contactBox: 'Контактная коробка - Координатор доступности'
    },

    report: {
      title: 'Как сообщить о барьере доступности',
      intro: 'Если вы столкнулись с каким-либо барьером доступности на нашем веб-сайте, пожалуйста, свяжитесь с нами:',
      email: 'info@shayish-yasif.co.il',
      instructions: 'Пожалуйста, укажите:',
      page: 'Страница или функция, где вы столкнулись с проблемой',
      technology: 'Тип вспомогательной технологии, которую вы используете (если есть)',
      description: 'Описание барьера',
      response: 'Мы ответим в течение 5 рабочих дней и постараемся решить проблему как можно скорее.'
    },

    improvement: {
      title: 'Непрерывное улучшение',
      content: 'Мы стремимся к постоянному улучшению доступности нашего веб-сайта. Мы проводим годовые проверки доступности и внедряем улучшения на постоянной основе. Ваши отзывы помогают нам улучшать для всех.'
    },

    widget: {
      title: 'Наш виджет доступности',
      intro: 'Нажмите на кнопку доступности в правом нижнем углу экрана для доступа к расширенным функциям доступности:',
      features: [
        'Увеличение/уменьшение размера текста (100% - 180%)',
        'Режим высокого контраста',
        'Режим оттенков серого',
        'Подчеркивание ссылок',
        'Читаемый шрифт',
        'Межбуквенный интервал',
        'Высота строки',
        'Пауза анимации',
        'Выделение при наведении/фокусе',
        'Сбросить все'
      ],
      keyboardTitle: 'Сочетания клавиш',
      shortcuts: {
        tab: 'Перейти к следующему элементу',
        shiftTab: 'Перейти к предыдущему элементу',
        enter: 'Активировать кнопки и ссылки',
        esc: 'Закрыть меню и диалоги'
      }
    },

    language: 'Язык',
    lastUpdated: 'Последнее обновление',
    lastUpdatedDate: '25 февраля 2025'
  }
};

const AccessibilityStatement: React.FC = () => {
  const [lang, setLang] = useState<StatementLanguage>('he');
  const t = translations[lang];

  useEffect(() => {
    // Detect language from html element (more reliable than navigator)
    const htmlLang = document.documentElement.lang || navigator.language || 'he';
    const detectedLang = htmlLang.toLowerCase().split('-')[0];
    if (['he', 'ar', 'ru', 'en'].includes(detectedLang)) {
      setLang(detectedLang as StatementLanguage);
    }
    // Empty dependency array means this only runs on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = `${t.title} | שיש כפר יאסיף - Shayish Kfar Yassif`;
  }, [lang, t.title]);

  const isRTL = lang === 'he' || lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      lang === 'he' ? 'he-IL' : lang === 'ar' ? 'ar-IL' : lang === 'ru' ? 'ru-RU' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return (
    <div className="min-h-screen bg-primary text-light transition-colors duration-300" dir={dir}>
      {/* Header */}
      <header className="bg-secondary border-b border-neutral-800 py-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="text-accent hover:text-light transition-colors mb-4 inline-block">
            {isRTL ? '→ חזרה לדף הבית' : '← Back to Home'}
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-serif text-light">
              {t.title}
            </h1>

            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">{t.language}:</span>
              {(['he', 'ar', 'en', 'ru'] as StatementLanguage[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                    lang === l
                      ? 'bg-accent text-white'
                      : 'bg-neutral-800 text-muted hover:text-light'
                  }`}
                  aria-label={`Switch to ${l === 'he' ? 'Hebrew' : l === 'ar' ? 'Arabic' : l === 'en' ? 'English' : 'Russian'}`}
                  aria-pressed={lang === l}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <p className="text-muted text-lg max-w-3xl">
            {t.subtitle}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-6 py-12 max-w-4xl" role="main" tabIndex={-1}>
        <div className="space-y-8">

          {/* Section 1: Our Commitment */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="commitment-title">
            <h2 id="commitment-title" className="text-2xl font-serif text-accent mb-4">
              {t.commitment.title}
            </h2>
            <p className="text-muted leading-relaxed">
              {t.commitment.content}
            </p>
          </section>

          {/* Section 2: Compliance Level */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="compliance-title">
            <h2 id="compliance-title" className="text-2xl font-serif text-accent mb-4">
              {t.compliance.title}
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              {t.compliance.level}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-neutral-800/50 p-4 rounded-sm">
                <div className="text-accent font-bold mb-1">{t.compliance.lastReview}:</div>
                <div className="text-light">{formatDate(t.compliance.lastReviewDate)}</div>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-sm">
                <div className="text-accent font-bold mb-1">{t.compliance.nextReview}:</div>
                <div className="text-light">{formatDate(t.compliance.nextReviewDate)}</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-sm">
              <a
                href={t.compliance.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-light transition-colors underline underline-offset-2"
              >
                {t.compliance.websiteUrl}: {t.compliance.url}
              </a>
            </div>
          </section>

          {/* Section 3: Accessibility Features */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="features-title">
            <h2 id="features-title" className="text-2xl font-serif text-accent mb-4">
              {t.features.title}
            </h2>
            <p className="text-muted mb-6">{t.features.subtitle}</p>

            <ul className="space-y-3" role="list">
              {Object.entries(t.features.items).map(([key, value]) => (
                <li key={key} className="flex items-start gap-3 text-muted">
                  <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4: Known Limitations */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="limitations-title">
            <h2 id="limitations-title" className="text-2xl font-serif text-accent mb-4 flex items-center gap-3">
              <AlertCircle size={24} aria-hidden="true" />
              {t.limitations.title}
            </h2>
            <p className="text-muted leading-relaxed">
              <span className="font-semibold text-light">{t.limitations.none}</span>
            </p>
          </section>

          {/* Section 5: Coordinator Contact (Highlighted Box) */}
          <section
            className="bg-accent/20 border-2 border-accent rounded-sm p-8"
            aria-labelledby="coordinator-title"
          >
            <h2 id="coordinator-title" className="text-2xl font-serif text-accent mb-6">
              {t.coordinator.title}
            </h2>

            <div className="bg-black/30 rounded-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <User className="text-accent flex-shrink-0 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">{t.coordinator.name}</div>
                    <div className="text-light font-semibold">{COORDINATOR.name}</div>
                    <div className="text-xs text-muted">{COORDINATOR.role}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-accent flex-shrink-0 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">{t.coordinator.email}</div>
                    <a
                      href={`mailto:${COORDINATOR.email}?subject=Accessibility%20Inquiry`}
                      className="text-accent hover:text-light underline underline-offset-2 font-semibold"
                    >
                      {COORDINATOR.email}
                    </a>
                  </div>
                </div>

                {COORDINATOR.phone && (
                  <div className="flex items-start gap-4">
                    <Phone className="text-accent flex-shrink-0 mt-1" size={20} aria-hidden="true" />
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-1">{t.coordinator.phone}</div>
                      <a
                        href={`tel:${COORDINATOR.phone}`}
                        className="text-light font-semibold hover:text-accent transition-colors"
                        dir="ltr"
                      >
                        {COORDINATOR.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="text-accent flex-shrink-0 mt-1" size={20} aria-hidden="true">
                    ⏱
                  </div>
                  <div>
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">{t.coordinator.responseTime}</div>
                    <div className="text-light font-semibold">{t.coordinator.responseTimeValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: How to Report */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="report-title">
            <h2 id="report-title" className="text-2xl font-serif text-accent mb-4">
              {t.report.title}
            </h2>

            <p className="text-muted leading-relaxed mb-4">
              {t.report.intro}
            </p>

            <div className="bg-neutral-800/50 border border-neutral-600 rounded-sm p-6 mb-4">
              <div className="text-accent font-bold mb-3">{t.report.instructions}</div>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent" aria-hidden="true">•</span>
                  <span>{t.report.page}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent" aria-hidden="true">•</span>
                  <span>{t.report.technology}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent" aria-hidden="true">•</span>
                  <span>{t.report.description}</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-muted">
              <span className="font-semibold text-light">{t.report.response}</span>
            </p>
          </section>

          {/* Section 7: Continuous Improvement */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="improvement-title">
            <h2 id="improvement-title" className="text-2xl font-serif text-accent mb-4">
              {t.improvement.title}
            </h2>
            <p className="text-muted leading-relaxed">
              {t.improvement.content}
            </p>
          </section>

          {/* Widget Info Section */}
          <section className="bg-secondary border border-neutral-700 rounded-sm p-8" aria-labelledby="widget-title">
            <h2 id="widget-title" className="text-2xl font-serif text-accent mb-4">
              {t.widget.title}
            </h2>

            <p className="text-muted leading-relaxed mb-6">
              {t.widget.intro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {t.widget.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-accent flex-shrink-0" aria-hidden="true">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-light mb-3">{t.widget.keyboardTitle}</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="bg-neutral-800 px-2 py-1 rounded text-xs text-muted">Tab</kbd>
                  <span className="text-muted">{t.widget.shortcuts.tab}</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-neutral-800 px-2 py-1 rounded text-xs text-muted">Shift + Tab</kbd>
                  <span className="text-muted">{t.widget.shortcuts.shiftTab}</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-neutral-800 px-2 py-1 rounded text-xs text-muted">Enter / Space</kbd>
                  <span className="text-muted">{t.widget.shortcuts.enter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-neutral-800 px-2 py-1 rounded text-xs text-muted">Esc</kbd>
                  <span className="text-muted">{t.widget.shortcuts.esc}</span>
                </div>
              </dl>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted py-4 border-t border-neutral-800">
            <p>{t.lastUpdated}: {t.lastUpdatedDate}</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AccessibilityStatement;
