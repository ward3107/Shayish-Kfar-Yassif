/**
 * Terms of Use — Israeli Contract Law 5733-1973 compliant
 * Consumer Protection Law 5741-1981 — Built: 2025-02-25
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';

// Types
type Language = 'he' | 'ar' | 'en' | 'ru';

interface Translation {
  lastUpdated: string;
  effectiveDate: string;
  backToHome: string;
  language: string;
  switchLanguage: {
    he: string;
    ar: string;
    en: string;
    ru: string;
  };
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessUrl: string;
  ownerName: string;

  // Section 1: Introduction and Acceptance
  section1: {
    title: string;
    subtitle: string;
    introduction: string;
    acceptance: string;
    activeAcceptance: string;
    contactAgreement: string;
  };

  // Section 2: Who May Use This Website
  section2: {
    title: string;
    subtitle: string;
    ageRequirement: string;
    age: string;
    legalCapacity: string;
    jurisdiction: string;
  };

  // Section 3: Permitted and Prohibited Conduct
  section3: {
    title: string;
    subtitle: string;
    permittedTitle: string;
    permittedList: string[];
    prohibitedTitle: string;
    prohibitedList: string[];
  };

  // Section 4: Intellectual Property
  section4: {
    title: string;
    subtitle: string;
    ownership: string;
    copyrightLaw: string;
    restrictions: string;
    thirdParty: string;
  };

  // Section 5: Disclaimer of Warranties
  section5: {
    title: string;
    subtitle: string;
    asIs: string;
    accuracy: string;
    consumerNote: string;
  };

  // Section 6: Limitation of Liability
  section6: {
    title: string;
    subtitle: string;
    exclusions: string;
    thirdPartyLinks: string;
    liabilityCap: string;
    israeliLaw: string;
  };

  // Section 7: External Links
  section7: {
    title: string;
    subtitle: string;
    convenience: string;
    noEndorsement: string;
    thirdPartyContent: string;
  };

  // Section 8: Privacy
  section8: {
    title: string;
    subtitle: string;
    governedBy: string;
    privacyLink: string;
    incorporated: string;
  };

  // Section 9: Changes to Terms
  section9: {
    title: string;
    subtitle: string;
    updates: string;
    continuedUse: string;
    materialChanges: string;
  };

  // Section 10: Governing Law and Dispute Resolution
  section10: {
    title: string;
    subtitle: string;
    governedBy: string;
    jurisdiction: string;
    smallClaims: string;
    contactFirst: string;
  };

  footer: {
    updated: string;
    hebrewPrevails: string;
  };
}

const TRANSLATIONS: Record<Language, Translation> = {
  he: {
    lastUpdated: 'עודכן לאחרונה',
    effectiveDate: '25 בפברואר 2025',
    backToHome: '← חזרה לדף הבית',
    language: 'שפה',
    switchLanguage: {
      he: 'עברית',
      ar: 'العربية',
      en: 'English',
      ru: 'Русский'
    },
    businessName: 'שיש כפר יאסיף',
    businessAddress: 'אזור תעשייה, כפר יאסיף, ישראל',
    businessEmail: 'info@shayish-yasif.co.il',
    businessUrl: 'https://shayish-yasif.co.il',
    ownerName: '[שם בעל העסק]',

    section1: {
      title: 'מבוא וקבלת תנאים',
      subtitle: 'אנא קראו את התנאים להלן בעיון לפני השימוש באתר זה',
      introduction: 'ברוכים הבאים לאתר שיש כפר יאסיף ("האתר"). אתר זה מופעל על ידי שיש כפר יאסיף ("אנחנו", "שלנו", "לנו"). האתר מספק מידע אודות שירותי משטחי אבן, שיש וקרמיקה.',
      acceptance: 'בכפוף לחוק החוזים (חלק כללי), תשל"ג-1973 ולחוק הגנת הצרכן, תשמ"א-1981, הגישה והשימוש באתר זה מהווים הסכמה מחייבת לתנאים אלה.',
      activeAcceptance: 'בהתאם לדיני ישראל, נדרשת הסכמה פעילה לתנאים אלה. השימוש באתר אינו מהווה בפני עצמו הסכמה לתנאים.',
      contactAgreement: 'בטופס יצירת הקשר באתר, יש לסמן את התיבה "קראתי ואני מסכים לתנאי השימוש" (ברירת המחדל: לא סומן).'
    },

    section2: {
      title: 'מי רשאי להשתמש באתר זה',
      subtitle: 'דרישות גיל, כשירות משפטית ושיפוט',
      ageRequirement: 'דרישות גיל',
      age: 'גיל 18 ומעלה, או עם הסכמת הורה/אפוטרופוס. על פי דיני ישראל, קטינים יכולים להשתמש באתר רק עם הסכמת הורה או אפוטרופוס חוקי.',
      legalCapacity: 'כשירות משפטית. על ידי השימוש באתר זה, אתה מצהיר שיש לך הכשירות המשפטית המלאה לכרות ברית חוזית מחייבת על פי דיני מדינת ישראל.',
      jurisdiction: 'שיפוט. האתר עשוי להיות לא זמין במדינות מסוימות. אתה אחראי באופן בלעדי לוודא שהשימוש שלך באתר עומד בדינים המקומיים שלך.'
    },

    section3: {
      title: 'התנהגות מותרת ואסורה',
      subtitle: 'כללי שימוש נאות באתר',
      permittedTitle: 'התנהגות מותרת',
      permittedList: [
        'עיון וגלישה בתוכן האתר למטרות אישיות ולא מסחריות',
        'יצירת קשר דרך טופס יצירת הקשר לבירורות אודות שירותי שיש וקרמיקה',
        'שיתוף קישורים לדפים באתר ברשתות החברתיות ובאמצעי תקשורת אחרים',
        'שמירת עותקים לשימוש אישי בלבד של מסמכים המוצעים להורדה'
      ],
      prohibitedTitle: 'התנהגות אסורה',
      prohibitedList: [
        'גרידת (Scraping) או איסוף אוטומטי של נתונים מהאתר',
        'ניסיון לחדור למערכות האתר, לשבש את פעילותו או להפר את אמצעי האבטחה',
        'הגשת מידע כוזב או מטעה דרך טפסי יצירת קשר',
        'התחזות לאדם אחר או ייצוג מוטעה של זהותך',
        'הפצת דואר זבל (Spam), תוכנות זדוניות או קוד זדוני דרך האתר',
        'שימוש באתר לפעילות בלתי חוקית או הפרת זכויות אחרות'
      ]
    },

    section4: {
      title: 'קניין רוחני',
      subtitle: 'זכויות יוצרים ושימוש בתוכן האתר',
      ownership: 'כל התוכן באתר, לרבות טקסטים, תמונות, לוגואים, עיצובים, גרפיקה וקוד, בבעלות שיש כפר יאסיף אלא אם צוין אחרת.',
      copyrightLaw: 'התוכן מוגן על פי דיני זכויות יוצרים בישראל, לרבות חוק זכויות יוצרים התשס"ח-2007 ואמנות בינלאומיות רלוונטיות.',
      restrictions: 'אסור להעתיק, להפיץ, לשנות, ליצור יצירות נגזרות או להשתמש בתוכן למטרות מסחריות ללא הרשאה כתובה מפורשת מאיתנו.',
      thirdParty: 'סימנים מסחריים ולוגואים של צד שלישי המופיעים באתר שייכים לבעליהם המתאימים ומשמשים להמחשה בלבד.'
    },

    section5: {
      title: 'כתב ויתור מאחריות',
      subtitle: 'מגבלות אחריות ושימוש באתר כמות שהוא',
      asIs: 'האתר מסופק "כמות שהוא" ללא כל אחריות, מפורשת או משתמעת, לגבי זמינות ללא הפרעות, דיוק, שלמות או אבטחת האתר.',
      accuracy: 'המידע באתר מסופק בתום לב ולמטרות מידע בלבד. אין להסתמך על המידע כייעוץ מקצועי. אנו מתנים את הזכות לשנות, לעדכן או להסיר מידע ללא הודעה מוקדמת.',
      consumerNote: 'הערה: על פי חוק הגנת הצרכן, תשמ"א-1981, אחריות מסוימת אינה ניתנת להפחתה במקרים של מכירת מוצרים או שירותים לצרכן. זכויותיך החוקיות כצרכן נשמרות.'
    },

    section6: {
      title: 'הגבלת אחריות',
      subtitle: 'מגבלות אחריות ופיצויים',
      exclusions: 'במידת האפשר על פי הדין הישראלי, איננו אחראים לנזקים עקיפים, אקראיים, תוצאתיים או לנזקים ישירים שנגרמו כתוצאה מהשימוש או מאי היכולת להשתמש באתר.',
      thirdPartyLinks: 'איננו אחראים לתוכן, מדיניות פרטיות או אמצעי אבטחה של אתרים חיצוניים המקושרים מהאתר.',
      liabilityCap: 'במקרה שבו נקבעה אחריות מצדנו, האחריות תהיה מוגבלת לסכום ששילמת (אם שילמת) עבור השירות.',
      israeliLaw: 'הערה: בתי המשפט בישראל עשויים להגביל סעיפי פטור רחבים. שפת סעיף זה מאוזנת ופרופורציונלית בהתאם לפסיקה הישראלית.'
    },

    section7: {
      title: 'קישורים חיצוניים',
      subtitle: 'מדיניות לגבי קישורים לאתרים חיצוניים',
      convenience: 'האתר עשוי להכיל קישורים לאתרים חיצוניים, לרבות ספקים, שותפים ומקורות מידע, המסופקים לנוחיותך בלבד.',
      noEndorsement: 'איננו מביעים תמיכה, אישור או ערבות לגבי הדיוק, האמינות או האיכות של אתרים חיצוניים או תוכנם.',
      thirdPartyContent: 'הגישה לאתרים חיצוניים היא על אחריותך הבלעדית ועל פי תנאי השימוש שלהם.'
    },

    section8: {
      title: 'פרטיות',
      subtitle: 'שימוש בנתוניך האישיים',
      governedBy: 'השימוש שלך באתר זה כפוף גם למדיניות הפרטיות שלנו.',
      privacyLink: 'אנא עיין במדיניות הפרטיות שלנו לפרטים מלאים על איסוף, שימוש והגנה על הנתונים האישיים שלך.',
      incorporated: 'מדיניות הפרטיות משולבת בזה החלק בתנאי השימוש ומהווה חלק בלתי נפרד מהם.'
    },

    section9: {
      title: 'שינויים בתנאים',
      subtitle: 'מדיניות עדכון תנאי השימוש',
      updates: 'אנו שומרים את הזכות לעדכן, לשנות או להחליף תנאים אלה בכל עת. תאריך העדכון האחרון מוצג בראש המסמך הזה.',
      continuedUse: 'המשך השימוש באתר לאחר שינויים בתנאים מהווה הסכמה לתנאים המעודכנים.',
      materialChanges: 'במקרה של שינויים מהותיים, נודיע לך באמצעות באנר בולט באתר או בדואר אלקטרוני, בהתאם לכתובת הדוא"ל שסיפקת.'
    },

    section10: {
      title: 'דין חל ויישוב סכסוכים',
      subtitle: 'השיפוט והדין החלים על תנאים אלה',
      governedBy: 'תנאים אלה כפופים לדיני מדינת ישראל ולפרשנותם בלבד, ללא התחשבות בעקרונות דיני נפש אחרים.',
      jurisdiction: 'הסמכות השיפוטית הבלעדית: בתי המשפט המוסמכים באזור צפון ישראל.',
      smallClaims: 'אלטרנטיבית: סכסוכים בסכום של עד ₪75,000 ניתן להגיש בבית משפט לתביעות קטנות.',
      contactFirst: 'לפני פתיחה בהליכים משפטיים, אנא פנה אלינו בכתב לכתובת: info@shayish-yasif.co.il. נעשה כל מאמץ ליישב את הסכסוך בדרכי נועם.'
    },

    footer: {
      updated: 'עודכן לאחרונה',
      hebrewPrevails: 'במקרה של אי-התאמה בין הגרסאות, הגרסה העברית מהווה את הגרסה המחייבת.'
    }
  },

  ar: {
    lastUpdated: 'تم التحديث',
    effectiveDate: '25 فبراير 2025',
    backToHome: '→ العودة إلى الصفحة الرئيسية',
    language: 'اللغة',
    switchLanguage: {
      he: 'עברית',
      ar: 'العربية',
      en: 'English',
      ru: 'Русский'
    },
    businessName: 'تشايس كفر ياسيف',
    businessAddress: 'المنطقة الصناعية، كفر ياسيف، إسرائيل',
    businessEmail: 'info@shayish-yasif.co.il',
    businessUrl: 'https://shayish-yasif.co.il',
    ownerName: '[اسم صاحب العمل]',

    section1: {
      title: 'المقدمة والقبول',
      subtitle: 'يرجى قراءة الشروط التالية بعناية قبل استخدام هذا الموقع',
      introduction: 'مرحبًا بكم في موقع تشايس كفر ياسيف ("الموقع"). يتم تشغيل هذا الموقع من قبل تشايس كفر ياسيف ("نحن"،"لنا"). يوفر الموقع معلومات حول خدمات الأسطح الحجرية والرخام والسيراميك.',
      acceptance: 'وفقًا لقانون العقود (الجزء العام) لعام 1973 وقانون حماية المستهلك لعام 1981، فإن الوصول إلى هذا الموقع واستخدامه يشكلان موافقة ملزمة على هذه الشروط.',
      activeAcceptance: 'وفقًا للقانون الإسرائيلي، مطلوب موافقة نشطة على هذه الشروط. استخدام الموقع وحده لا يشكل موافقة على الشروط.',
      contactAgreement: 'في نموذج الاتصال بالموقع، يجب تحديد خانة "لقد قرأت ووافقت على شروط الاستخدام" (الافتراضي: غير محدد).'
    },

    section2: {
      title: 'من قد يستخدم هذا الموقع',
      subtitle: 'متطلبات العمر والأهلية القانونية والاختصاص',
      ageRequirement: 'متطلبات العمر',
      age: 'عمر 18 فما فوق، أو بموافقة الوالي/الوصي. وفقًا للقانون الإسرائيلي، يمكن للقاصرين استخدام الموقع فقط بموافقة الوالي أو الوصي القانوني.',
      legalCapacity: 'الأهلية القانونية. باستخدام هذا الموقع، تقر بأن لديك الأهلية القانونية الكاملة لإبرام عقد ملزم وفقًا لقوانين دولة إسرائيل.',
      jurisdiction: 'الاختصاص القضائي. قد يكون الموقع غير متاح في بعض الدول. أنت مسؤول وحيدًا عن التأكد من أن استخدامك للموقع يتوافق مع القوانين المحلية الخاصة بك.'
    },

    section3: {
      title: 'السلوك المسموح والمحظور',
      subtitle: 'قواعد الاستخدام المناسب للموقع',
      permittedTitle: 'السلوك المسموح',
      permittedList: [
        'تصفح ومحتوى الموقع لأغراض شخصية وليست تجارية',
        'التواصل عبر نموذج الاتصال للاستفسارات حول خدمات الرخام والسيراميك',
        'مشاركة روابط الصفحات في الموقع على شبكات التواصل الاجتماعي ووسائل الاتصال الأخرى',
        'حفظ نسخ للاستخدام الشخصي فقط من المستندات المتاحة للتحميل'
      ],
      prohibitedTitle: 'السلوك المحظور',
      prohibitedList: [
        'كشط (Scraping) أو جمع البيانات تلقائيًا من الموقع',
        'محاولة اختراق أنظمة الموقع أو تعطيل عمله أو انتهاك تدابير الأمان',
        'تقديم معلومات كاذبة أو مضللة عبر نماذج الاتصال',
        'انتحال شخصية شخص آخر أو تمثيل هويتك بشكل مضلل',
        'نشر البريد العشوائي (Spam) أو البرمجيات الخبيثة أو الأكواد الضارة عبر الموقع',
        'استخدام الموقع لأنشطة غير قانونية أو انتهاك حقوق الآخرين'
      ]
    },

    section4: {
      title: 'الملكية الفكرية',
      subtitle: 'حقوق النشر واستخدام محتوى الموقع',
      ownership: 'جميع المحتويات في الموقع، بما في ذلك النصوص والصور والشعارات والتصاميم والرسومات والأكواد، مملوكة لتشايس كفر ياسيف ما لم يُذكر خلاف ذلك.',
      copyrightLaw: 'المحتوى محمي بموجب قوانين حقوق النشر في إسرائيل، بما في ذلك قانون حقوق النشر لعام 2007 والاتفاقيات الدولية ذات الصلة.',
      restrictions: 'يُحظر نسخ أو توزيع أو تعديل أو إنشاء أعمال مشتقة أو استخدام المحتوى لأغراض تجارية دون إذن كتابي صريح منا.',
      thirdParty: 'العلامات التجارية والشعارات التابعة لطرف ثالث الظاهرة في الموقع تخص أصحابها وتُستخدم لأغراض التوضيح فقط.'
    },

    section5: {
      title: 'إخلاء المسؤولية',
      subtitle: 'قيود المسؤولية واستخدام الموقع "كما هو"',
      asIs: 'يُوفر الموقع "كما هو" دون أي ضمانات، صريحة أو ضمنية، فيما يتعلق بالتAvailability بدون انقطاع أو الدقة أو completeness أو أمان الموقع.',
      accuracy: 'المعلومات في الموقع مُقدمة بحسن نية لأغراض المعلومات فقط. لا ينبغي الاعتماد عليها كنصيحة مهنية. نحن نحتفظ بالحق في تغيير أو تحديث أو إزالة المعلومات دون إشعار مسبق.',
      consumerNote: 'ملاحظة: وفقًا لقانون حماية المستهلك لعام 1981، لا يمكن تقليل بعض المسؤولية في حالات بيع المنتجات أو الخدمات للمستهلكين. حقوقك القانونية ك مستهلك محفوظة.'
    },

    section6: {
      title: 'تقييد المسؤولية',
      subtitle: 'قيود المسؤولية والتعويضات',
      exclusions: 'قدر الإمكان بموجب القانون الإسرائيلي، نحن غير مسؤولين عن الأضرار غير المباشرة أو العرضية أو التبعية أو المباشرة الناتجة عن الاستخدام أو عدم القدرة على استخدام الموقع.',
      thirdPartyLinks: 'نحن غير مسؤولين عن المحتوى أو سياسات الخصوصية أو تدابير الأمان للمواقع الخارجية المرتبطة من الموقع.',
      liabilityCap: 'في حال تحديد مسؤوليتنا، ستكون المسؤولية محدودة بالمبلغ الذي دفعته (إذا كنت قد دفعت) مقابل الخدمة.',
      israeliLaw: 'ملاحظة: قد تُحد المحاكم الإسرائيلية بنود الإعفاء الواسعة. لغة هذا البند متوازنة ونسبية وفقًا للسوابق القضائية الإسرائيلية.'
    },

    section7: {
      title: 'الروابط الخارجية',
      subtitle: 'سياسة الروابط إلى مواقع خارجية',
      convenience: 'قد يحتوي الموقع على روابط لمواقع خارجية، بما في ذلك الموردون والشركاء ومصادر المعلومات، المُقدمة لراحتك فقط.',
      noEndorsement: 'نحن لا نعرب عن أي دعم أو موافقة أو ضمان فيما يتعلق بدقة أو موثوقية أو جودة المواقع الخارجية أو محتوياتها.',
      thirdPartyContent: 'الوصول إلى المواقع الخارجية هو مسؤوليتك الوحيدة وفقًا لشروط استخدامهم.'
    },

    section8: {
      title: 'الخصوصية',
      subtitle: 'استخدام بياناتك الشخصية',
      governedBy: 'استخدامك لهذا الموقع خاضع أيضًا لسياسة الخصوصية الخاصة بنا.',
      privacyLink: 'يرجى مراجعة سياسة الخصوصية الخاصة بنا للحصول على تفاصيل كاملة حول جمع واستخدام وحماية بياناتك الشخصية.',
      incorporated: 'تُدمج سياسة الخصوصية هنا في شروط الاستخدام وتُشكل جزءًا لا يتجزأ منها.'
    },

    section9: {
      title: 'تغييرات الشروط',
      subtitle: 'سياسة تحديث شروط الاستخدام',
      updates: 'نحن نحتفظ بالحق في تحديث أو تعديل أو استبدال هذه الشروط في أي وقت. تاريخ آخر تحديث معروض في أعلى هذا المستند.',
      continuedUse: 'الاستخدام المستمر للموقع بعد التغييرات في الشروط يشكل قبولًا للشروط المحدثة.',
      materialChanges: 'في حال وجود تغييرات جوهرية، سنُبلغك عبر لافتة بارزة في الموقع أو عبر البريد الإلكتروني، وفقًا لعنوان البريد الإلكتروني الذي قدمته.'
    },

    section10: {
      title: 'القانون الحل وتسوية النزاعات',
      subtitle: 'الاختصاص والقانون المطبق على هذه الشروط',
      governedBy: 'هذه الشروط خاضعة لقوانين دولة إسرائيل وتفسيرها فقط، دون النظر إلى مبادئ قانون النزاعات الدولية.',
      jurisdiction: 'الاختصاص القضائي الحصري: المحاكم المختصة في منطقة شمال إسرائيل.',
      smallClaims: 'بديلاً: يمكن رفع النزاعات التي تصل قيمتها إلى 75,000 شيكل في محكمة المطالبات الصغيرة.',
      contactFirst: 'قبل بدء الإجراءات القانونية، يرجى الاتصال بنا خطيًا على العنوان: info@shayish-yasif.co.il. سن بذل كل جهد لتسوية النزاع بشكل ودي.'
    },

    footer: {
      updated: 'آخر تحديث',
      hebrewPrevails: 'في حالة عدم التطابق بين النسخ، تعتبر النسخة العبرية هي النسخة الملزمة.'
    }
  },

  en: {
    lastUpdated: 'Last updated',
    effectiveDate: 'February 25, 2025',
    backToHome: '← Back to Home',
    language: 'Language',
    switchLanguage: {
      he: 'עברית',
      ar: 'العربية',
      en: 'English',
      ru: 'Русский'
    },
    businessName: 'Shayish Kfar Yassif',
    businessAddress: 'Industrial Zone, Kfar Yassif, Israel',
    businessEmail: 'info@shayish-yasif.co.il',
    businessUrl: 'https://shayish-yasif.co.il',
    ownerName: '[Owner Name]',

    section1: {
      title: 'Introduction and Acceptance',
      subtitle: 'Please read the following terms carefully before using this website',
      introduction: 'Welcome to the Shayish Kfar Yassif website ("the Website"). This website is operated by Shayish Kfar Yassif ("we", "our", "us"). The Website provides information about stone, marble, and ceramic surface services.',
      acceptance: 'Subject to the Contract Law (General Part) 5733-1973 and the Consumer Protection Law 5741-1981, access to and use of this Website constitutes binding agreement to these terms.',
      activeAcceptance: 'Under Israeli law, active acceptance of these terms is required. Use of the Website alone does not constitute acceptance of the terms.',
      contactAgreement: 'In the contact form on the Website, you must check the box "I have read and agree to the Terms of Use" (default: unchecked).'
    },

    section2: {
      title: 'Who May Use This Website',
      subtitle: 'Age requirements, legal capacity, and jurisdiction',
      ageRequirement: 'Age Requirements',
      age: 'Age 18 and over, or with parental/guardian consent. Under Israeli law, minors may only use the Website with parental or legal guardian consent.',
      legalCapacity: 'Legal Capacity. By using this Website, you represent that you have full legal capacity to enter into a binding contract under the laws of the State of Israel.',
      jurisdiction: 'Jurisdiction. The Website may be unavailable in certain countries. You are solely responsible for ensuring that your use of the Website complies with your local laws.'
    },

    section3: {
      title: 'Permitted and Prohibited Conduct',
      subtitle: 'Rules for proper use of the Website',
      permittedTitle: 'Permitted Conduct',
      permittedList: [
        'Browsing and viewing Website content for personal, non-commercial purposes',
        'Contacting via the contact form for inquiries about marble and ceramic services',
        'Sharing links to Website pages on social media and other communication channels',
        'Saving personal copies only of documents offered for download'
      ],
      prohibitedTitle: 'Prohibited Conduct',
      prohibitedList: [
        'Scraping or automated collection of data from the Website',
        'Attempting to breach Website systems, disrupt operation, or violate security measures',
        'Submitting false or misleading information through contact forms',
        'Impersonating another person or misrepresenting your identity',
        'Distributing spam, malicious software, or harmful code through the Website',
        'Using the Website for illegal activities or infringing on others\' rights'
      ]
    },

    section4: {
      title: 'Intellectual Property',
      subtitle: 'Copyright and use of Website content',
      ownership: 'All content on the Website, including text, images, logos, designs, graphics, and code, is owned by Shayish Kfar Yassif unless otherwise stated.',
      copyrightLaw: 'The content is protected under Israeli copyright laws, including Copyright Law 5768-2007 and relevant international conventions.',
      restrictions: 'You may not copy, distribute, modify, create derivative works, or use content for commercial purposes without our explicit written permission.',
      thirdParty: 'Third-party trademarks and logos appearing on the Website belong to their respective owners and are used for illustration purposes only.'
    },

    section5: {
      title: 'Disclaimer of Warranties',
      subtitle: 'Limitation of warranties and "as is" use of the Website',
      asIs: 'The Website is provided "as is" without any warranties, express or implied, regarding uninterrupted availability, accuracy, completeness, or security of the Website.',
      accuracy: 'Information on the Website is provided in good faith for informational purposes only. It should not be relied upon as professional advice. We reserve the right to change, update, or remove information without prior notice.',
      consumerNote: 'Note: Under the Consumer Protection Law 5741-1981, certain warranties cannot be disclaimed in cases of sale of products or services to consumers. Your legal rights as a consumer are preserved.'
    },

    section6: {
      title: 'Limitation of Liability',
      subtitle: 'Limitation of liability and damages',
      exclusions: 'To the maximum extent permitted under Israeli law, we are not liable for indirect, incidental, consequential, or direct damages resulting from use or inability to use the Website.',
      thirdPartyLinks: 'We are not responsible for the content, privacy policies, or security measures of external websites linked from the Website.',
      liabilityCap: 'In cases where liability is determined, our liability shall be limited to the amount you paid (if any) for the service.',
      israeliLaw: 'Note: Israeli courts may limit broad exclusion clauses. The language of this clause is balanced and proportionate according to Israeli case law.'
    },

    section7: {
      title: 'External Links',
      subtitle: 'Policy regarding links to external websites',
      convenience: 'The Website may contain links to external websites, including suppliers, partners, and information sources, provided for your convenience only.',
      noEndorsement: 'We do not express support, approval, or warranty regarding the accuracy, reliability, or quality of external websites or their content.',
      thirdPartyContent: 'Access to external websites is at your sole risk and subject to their terms of use.'
    },

    section8: {
      title: 'Privacy',
      subtitle: 'Use of your personal data',
      governedBy: 'Your use of this Website is also governed by our Privacy Policy.',
      privacyLink: 'Please review our Privacy Policy for full details on collection, use, and protection of your personal data.',
      incorporated: 'The Privacy Policy is incorporated herein by reference into these Terms of Use and forms an integral part thereof.'
    },

    section9: {
      title: 'Changes to Terms',
      subtitle: 'Policy for updating Terms of Use',
      updates: 'We reserve the right to update, modify, or replace these terms at any time. The last updated date is displayed at the top of this document.',
      continuedUse: 'Continued use of the Website after changes to the terms constitutes acceptance of the updated terms.',
      materialChanges: 'In case of material changes, we will notify you via a prominent banner on the Website or via email, according to the email address you provided.'
    },

    section10: {
      title: 'Governing Law and Dispute Resolution',
      subtitle: 'Jurisdiction and applicable law for these terms',
      governedBy: 'These terms are governed by the laws of the State of Israel and their interpretation only, without regard to conflict of laws principles.',
      jurisdiction: 'Exclusive jurisdiction: Competent courts in the Northern District of Israel.',
      smallClaims: 'Alternatively: Disputes up to ₪75,000 may be filed in Small Claims Court.',
      contactFirst: 'Before initiating legal proceedings, please contact us in writing at: info@shayish-yasif.co.il. We will make every effort to resolve the dispute amicably.'
    },

    footer: {
      updated: 'Last updated',
      hebrewPrevails: 'In case of inconsistency between versions, the Hebrew version shall prevail as the binding version.'
    }
  },

  ru: {
    lastUpdated: 'Последнее обновление',
    effectiveDate: '25 февраля 2025 г.',
    backToHome: '← Вернуться на главную',
    language: 'Язык',
    switchLanguage: {
      he: 'עברית',
      ar: 'العربية',
      en: 'English',
      ru: 'Русский'
    },
    businessName: 'Шаиш Кфар Ясиф',
    businessAddress: 'Промышленная зона, Кфар Ясиф, Израиль',
    businessEmail: 'info@shayish-yasif.co.il',
    businessUrl: 'https://shayish-yasif.co.il',
    ownerName: '[Имя владельца]',

    section1: {
      title: 'Введение и принятие условий',
      subtitle: 'Пожалуйста, внимательно прочитайте следующие условия перед использованием этого веб-сайта',
      introduction: 'Добро пожаловать на веб-сайт Шаиш Кфар Ясиф ("Веб-сайт"). Этот веб-сайт управляется Шаиш Кфар Ясиф ("мы", "наш", "нам"). Веб-сайт предоставляет информацию об услугах по каменным, мраморным и керамическим поверхностям.',
      acceptance: 'В соответствии с Законом о договорах (общая часть) 5733-1973 и Законом о защите прав потребителей 5741-1981, доступ к этому веб-сайту и его использование обязывают к соблюдению этих условий.',
      activeAcceptance: 'Согласно израильскому закону требуется активное принятие этих условий. Само по себе использование Веб-сайта не означает принятие условий.',
      contactAgreement: 'В форме контакта на Веб-сайте необходимо установить флажок "Я прочитал и согласен с Условиями использования" (по умолчанию: не установлен).'
    },

    section2: {
      title: 'Кто может использовать этот веб-сайт',
      subtitle: 'Требования к возрасту, правоспособность и юрисдикция',
      ageRequirement: 'Требования к возрасту',
      age: 'Возраст 18 лет и старше, или с согласия родителя/опекуна. Согласно израильскому закону, несовершеннолетние могут использовать Веб-сайт только с согласия родителя или законного опекуна.',
      legalCapacity: 'Правоспособность. Используя этот Веб-сайт, вы подтверждаете, что обладаете полной правоспособностью для заключения обязывающего договора в соответствии с законами Государства Израиль.',
      jurisdiction: 'Юрисдикция. Веб-сайт может быть недоступен в определенных странах. Вы несете исключительную ответственность за обеспечение того, чтобы ваше использование Веб-сайта соответствовало вашим местным законам.'
    },

    section3: {
      title: 'Разрешенное и запрещенное поведение',
      subtitle: 'Правила надлежащего использования Веб-сайта',
      permittedTitle: 'Разрешенное поведение',
      permittedList: [
        'Просмотр содержимого Веб-сайта в личных некоммерческих целях',
        'Связь через форму контакта для запросов о мраморных и керамических услугах',
        'Совместное использование ссылок на страницы Веб-сайта в социальных сетях и других каналах связи',
        'Сохранение личных копий документов, предлагаемых для загрузки'
      ],
      prohibitedTitle: 'Запрещенное поведение',
      prohibitedList: [
        'Сбор или автоматизированный сбор данных с Веб-сайта',
        'Попытка взлома систем Веб-сайта, нарушение работы или мер безопасности',
        'Предоставление ложной или вводящей в заблуждение информации через формы контакта',
        'Выдавание себя за другое лицо или ложное представление своей личности',
        'Распространение спама, вредоносного ПО или вредоносного кода через Веб-сайт',
        'Использование Веб-сайта для незаконной деятельности или нарушения прав других лиц'
      ]
    },

    section4: {
      title: 'Интеллектуальная собственность',
      subtitle: 'Авторское право и использование содержимого Веб-сайта',
      ownership: 'Все содержимое на Веб-сайте, включая тексты, изображения, логотипы, дизайны, графику и код, принадлежит Шаиш Кфар Ясиф, если не указано иное.',
      copyrightLaw: 'Содержимое защищено законами Израиля об авторском праве, включая Закон об авторском праве 5768-2007 и соответствующие международные конвенции.',
      restrictions: 'Вы не можете копировать, распространять, изменять, создавать производные произведения или использовать содержимое в коммерческих целях без нашего явного письменного разрешения.',
      thirdParty: 'Товарные знаки и логотипы третьих сторон, appearing на Веб-сайте, принадлежат их соответствующим владельцам и используются только для иллюстрации.'
    },

    section5: {
      title: 'Отказ от гарантий',
      subtitle: 'Ограничение гарантий и использование Веб-сайта "как есть"',
      asIs: 'Веб-сайт предоставляется "как есть" без каких-либо гарантий, явных или подразумеваемых, в отношении непрерывной доступности, точности, полноты или безопасности Веб-сайта.',
      accuracy: 'Информация на Веб-сайте предоставляется добросовестно только в информационных целях. На нее не следует полагаться как на профессиональный совет. Мы оставляем за собой право изменить, обновить или удалить информацию без предварительного уведомления.',
      consumerNote: 'Примечание: В соответствии с Законом о защите прав потребителей 5741-1981, определенные гарантии не могут быть отменены в случаях продажи товаров или услуг потребителям. Ваши законные права как потребителя сохраняются.'
    },

    section6: {
      title: 'Ограничение ответственности',
      subtitle: 'Ограничение ответственности и убытков',
      exclusions: 'В максимальной степени, разрешенной израильским законом, мы не несем ответственности за косвенные, случайные, последующие или прямые убытки, возникшие в результате использования или невозможности использования Веб-сайта.',
      thirdPartyLinks: 'Мы не несем ответственности за содержимое, политики конфиденциальности или меры безопасности внешних веб-сайтов, на которые есть ссылки с Веб-сайта.',
      liabilityCap: 'В случаях, когда ответственность установлена, наша ответственность ограничивается суммой, которую вы заплатили (если платили) за услугу.',
      israeliLaw: 'Примечание: Израильские суды могут ограничить широкие исключительные пункты. Язык этого пункта сбалансирован и пропорционален согласно израильской судебной практике.'
    },

    section7: {
      title: 'Внешние ссылки',
      subtitle: 'Политика в отношении ссылок на внешние веб-сайты',
      convenience: 'Веб-сайт может содержать ссылки на внешние веб-сайты, включая поставщиков, партнеров и источники информации, предоставленные для вашего удобства.',
      noEndorsement: 'Мы не выражаем поддержки, одобрения или гарантии в отношении точности, надежности или качества внешних веб-сайтов или их содержимого.',
      thirdPartyContent: 'Доступ к внешним веб-сайтам осуществляется на ваш собственный риск и в соответствии с их условиями использования.'
    },

    section8: {
      title: 'Конфиденциальность',
      subtitle: 'Использование ваших личных данных',
      governedBy: 'Ваше использование этого Веб-сайта также регулируется нашей Политикой конфиденциальности.',
      privacyLink: 'Пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности для получения полной информации о сборе, использовании и защите ваших личных данных.',
      incorporated: 'Политика конфиденциальности включена в эти Условия использования путем ссылки и составляет их неотъемлемую часть.'
    },

    section9: {
      title: 'Изменения условий',
      subtitle: 'Политика обновления Условий использования',
      updates: 'Мы оставляем за собой право обновлять, изменять или заменять эти условия в любое время. Дата последнего обновления отображается в верхней части этого документа.',
      continuedUse: 'Продолжение использования Веб-сайта после изменений в условиях означает принятие обновленных условий.',
      materialChanges: 'В случае существенных изменений мы уведомим вас через заметный баннер на Веб-сайте или по электронной почте, в соответствии с указанным вами адресом электронной почты.'
    },

    section10: {
      title: 'Применимое право и разрешение споров',
      subtitle: 'Юрисдикция и применимое право к этим условиям',
      governedBy: 'Эти условия регулируются законами Государства Израиль и их толкованием исключительно, без учета принципов коллизионного права.',
      jurisdiction: 'Исключительная юрисдикция: компетентные суды Северного округа Израиля.',
      smallClaims: 'Альтернативно: споры на сумму до 75 000 шекелей могут быть поданы в суд по мелким искам.',
      contactFirst: 'Перед началом судебных разбирательств, пожалуйста, свяжитесь с нами в письменном виде по адресу: info@shayish-yasif.co.il. Мы приложим все усилия для урегулирования спора в досудебном порядке.'
    },

    footer: {
      updated: 'Последнее обновление',
      hebrewPrevails: 'В случае несоответствия между версиями, ивритская версия имеет преимущественную силу как обязательная версия.'
    }
  }
};

const TermsOfUse: React.FC = () => {
  // Detect language from document or default to Hebrew
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof document !== 'undefined') {
      const htmlLang = document.documentElement.lang;
      if (htmlLang === 'he' || htmlLang === 'ar' || htmlLang === 'en' || htmlLang === 'ru') {
        return htmlLang as Language;
      }
    }
    return 'he';
  });

  const t = TRANSLATIONS[language];
  const dir = language === 'he' || language === 'ar' ? 'rtl' : 'ltr';

  // Set page title and lang
  useEffect(() => {
    const titles = {
      he: 'תנאי שימוש | שיש כפר יאסיף - Shayish Kfar Yassif',
      ar: 'شروط الاستخدام | تشايس كفر ياسيف',
      en: 'Terms of Use | Shayish Kfar Yassif',
      ru: 'Условия использования | Шаиш Кфар Ясиф'
    };
    document.title = titles[language];
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-primary text-light py-16 px-4 md:px-8" dir={dir}>
      <div className="max-w-4xl mx-auto">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-accent hover:text-yellow-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>{t.backToHome}</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-accent mb-4">
            {language === 'he' && 'תנאי שימוש'}
            {language === 'ar' && 'شروط الاستخدام'}
            {language === 'en' && 'Terms of Use'}
            {language === 'ru' && 'Условия использования'}
          </h1>
          <p className="text-xl text-muted mb-6">
            {t.businessName}
          </p>

          {/* Last Updated */}
          <div className="flex items-center gap-4 text-sm text-muted mb-8">
            <span>{t.lastUpdated}:</span>
            <span className="text-accent font-semibold">{t.effectiveDate}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-secondary/30 rounded-lg border border-neutral-800">
            <Globe size={18} className="text-muted" />
            <span className="text-sm text-muted">{t.language}:</span>
            <div className="flex gap-2">
              {(['he', 'ar', 'en', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    language === lang
                      ? 'bg-accent text-white font-semibold'
                      : 'bg-neutral-700 text-muted hover:bg-neutral-600'
                  }`}
                  aria-pressed={language === lang}
                >
                  {t.switchLanguage[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-secondary/30 p-6 rounded-lg border border-neutral-800 mb-8">
            <h2 className="text-lg font-semibold text-accent mb-3">{t.businessName}</h2>
            <p className="text-muted mb-1">{t.businessAddress}</p>
            <a
              href={`mailto:${t.businessEmail}`}
              className="text-accent hover:underline"
            >
              {t.businessEmail}
            </a>
            <p className="text-muted mt-1">{t.businessUrl}</p>
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <nav
              className="sticky top-24 bg-secondary/20 p-6 rounded-lg border border-neutral-800 max-h-[calc(100vh-8rem)] overflow-y-auto"
              aria-label="Table of Contents"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
                {language === 'he' && 'תוכן עניינים'}
                {language === 'ar' && 'جدول المحتويات'}
                {language === 'en' && 'Table of Contents'}
                {language === 'ru' && 'Содержание'}
              </h3>
              <ul className="space-y-2 text-sm">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                  const section = t[`section${num}` as keyof Translation] as { title: string };
                  return (
                    <li key={num}>
                      <button
                        onClick={() => scrollToSection(`section-${num}`)}
                        className="text-muted hover:text-accent transition-colors text-left w-full text-right"
                      >
                        {num}. {section.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
        {/* Section 1 */}
        <section id="section-1" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section1.title}</h2>
            <p className="text-muted mt-1">{t.section1.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section1.introduction}</p>
            <p>{t.section1.acceptance}</p>
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
              <p className="font-semibold text-light mb-2">⚠️ {t.section1.activeAcceptance.split(':')[0]}:</p>
              <p>{t.section1.activeAcceptance}</p>
              <p className="mt-2">{t.section1.contactAgreement}</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section2.title}</h2>
            <p className="text-muted mt-1">{t.section2.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <div>
              <h4 className="font-semibold text-light mb-2">{t.section2.ageRequirement}</h4>
              <p>{t.section2.age}</p>
            </div>
            <div>
              <h4 className="font-semibold text-light mb-2">{t.section2.legalCapacity.split(':')[0]}</h4>
              <p>{t.section2.legalCapacity}</p>
            </div>
            <div>
              <h4 className="font-semibold text-light mb-2">{t.section2.jurisdiction.split(':')[0]}</h4>
              <p>{t.section2.jurisdiction}</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section3.title}</h2>
            <p className="text-muted mt-1">{t.section3.subtitle}</p>
          </div>
          <div className="space-y-6 text-muted leading-relaxed">
            <div>
              <h4 className="font-semibold text-light mb-3">✓ {t.section3.permittedTitle}</h4>
              <ul className="space-y-2">
                {t.section3.permittedList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-light mb-3">✗ {t.section3.prohibitedTitle}</h4>
              <ul className="space-y-2">
                {t.section3.prohibitedList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section4.title}</h2>
            <p className="text-muted mt-1">{t.section4.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section4.ownership}</p>
            <p>{t.section4.copyrightLaw}</p>
            <p className="text-light font-semibold">{t.section4.restrictions}</p>
            <p className="text-sm italic">{t.section4.thirdParty}</p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section5.title}</h2>
            <p className="text-muted mt-1">{t.section5.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section5.asIs}</p>
            <p>{t.section5.accuracy}</p>
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
              <p className="text-sm">⚖️ {t.section5.consumerNote}</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section6.title}</h2>
            <p className="text-muted mt-1">{t.section6.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section6.exclusions}</p>
            <p>{t.section6.thirdPartyLinks}</p>
            <p>{t.section6.liabilityCap}</p>
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
              <p className="text-sm">⚖️ {t.section6.israeliLaw}</p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section7.title}</h2>
            <p className="text-muted mt-1">{t.section7.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section7.convenience}</p>
            <p>{t.section7.noEndorsement}</p>
            <p>{t.section7.thirdPartyContent}</p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section8.title}</h2>
            <p className="text-muted mt-1">{t.section8.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section8.governedBy}</p>
            <p>
              {t.section8.privacyLink}{' '}
              <Link to="/privacy-policy" className="text-accent hover:underline">
                {language === 'he' && 'מדיניות הפרטיות שלנו'}
                {language === 'ar' && 'سياسة الخصوصية الخاصة بنا'}
                {language === 'en' && 'Privacy Policy'}
                {language === 'ru' && 'Политика конфиденциальности'}
              </Link>
            </p>
            <p className="text-sm italic">{t.section8.incorporated}</p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="section-9" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section9.title}</h2>
            <p className="text-muted mt-1">{t.section9.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section9.updates}</p>
            <p>{t.section9.continuedUse}</p>
            <p>{t.section9.materialChanges}</p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="section-10" className="mb-16 scroll-mt-32">
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-r-4 border-accent pr-6 py-4 mb-6">
            <h2 className="text-2xl font-serif text-accent">{t.section10.title}</h2>
            <p className="text-muted mt-1">{t.section10.subtitle}</p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>{t.section10.governedBy}</p>
            <p>{t.section10.jurisdiction}</p>
            <p>{t.section10.smallClaims}</p>
            <p>{t.section10.contactFirst}</p>
          </div>
        </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted gap-4">
            <span>{t.footer.updated}: {t.effectiveDate}</span>
            <span className="text-accent">⚖️ {t.footer.hebrewPrevails}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfUse;
