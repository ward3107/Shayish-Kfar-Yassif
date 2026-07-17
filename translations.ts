export type Language = 'en' | 'he' | 'ar' | 'ru';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      collections: 'Collections',
      process: 'Process',
      materials: 'Materials',
      studio: 'Studio',
      faq: 'FAQ',
      consultation: 'Consultation'
    },
    hero: {
      est: 'Est. 2008 • Kfar Yassif',
      title_line1: 'Mastery in',
      title_line2: 'Stone & Porcelain',
      subtitle: 'The premier destination for porcelain, marble, and custom stone surfaces in Northern Israel.',
      explore: 'Explore Collections',
      book: 'Book Appointment'
    },
    intro: {
      quote: '"We believe that stone is not just a material, but the foundation of design. Shayish Kfar Yassif brings the durability of porcelain and the elegance of marble into your home."'
    },
    home: {
      instagram_title: 'Follow Us on Instagram',
      instagram_subtitle: 'Daily work, latest installations, and behind-the-scenes moments — every project we finish, live on our feed.',
      instagram_cta: 'View Our Instagram',
      art_title: 'The Art of Stone & Porcelain',
      art_desc: 'Our name, Shayish, is our heritage. We specialize in precision cutting and installation in Kfar Yassif. From Italian marble to advanced porcelain surfaces, we engineer durability and beauty.',
      discover: 'Discover Materials',
      visit_title: 'Visit the Showroom',
      visit_loc: 'Kfar Yassif Industrial Zone'
    },
    footer: {
      desc: 'Expertise in Stone, Marble & Porcelain surfaces. Creating the heart of the home in Kfar Yassif since 2008.',
      collections: 'Collections',
      studio: 'Studio',
      visit: 'Visit Us',
      rights: 'Shayish Kfar Yassif. All rights reserved.',
      ceramic: 'Porcelain Surfaces',
      marble: 'Natural Marble',
      islands: 'Kitchen Islands',
      story: 'Our Story',
      process: 'The Process',
      contact: 'Contact',
      privacyPolicy: 'Privacy Policy',
      accessibility: 'Accessibility Statement',
      termsOfUse: 'Terms of Use'
    },
    contact: {
      title: 'Contact',
      subtitle: 'We invite you to visit our factory showroom in Kfar Yassif to experience our stone and porcelain collections in person.',
      phone: 'Phone',
      email: 'Email',
      address_title: 'Factory & Showroom',
      address_lines: ['Industrial Zone', 'Kfar Yassif, Israel'],
      waze: 'Navigate with Waze',
      form_title: 'Begin Your Journey',
      form_desc: 'Leave your details and our designers will reach out.',
      name: 'Name',
      city: 'City',
      project_type: 'Project Type',
      notes: 'Vision / Notes',
      submit: 'Request Consultation',
      request_received: 'Request Received',
      will_contact: 'We will contact you shortly to coordinate your private consultation.',
      back: 'Back to Form',
      types: {
        new: 'New Apartment',
        reno: 'Renovation',
        villa: 'Private Villa'
      }
    },
    whatsapp: {
      title: 'Chat With Us',
      description: 'The fastest way to reach us. Send a message on WhatsApp and our designers will respond shortly.',
      chat: 'Chat on WhatsApp',
      or_call: 'Or call the studio',
      default_message: "Hi, I'm interested in a consultation with Shayish Kfar Yassif."
    },
    notFound: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
      home: 'Back to Home'
    },
    showroom: {
      open_now: 'Open Now',
      closed_now: 'Closed Now',
      until: 'Until',
      opens_at: 'Opens at',
      opens_tomorrow: 'Opens tomorrow at',
      opens_in_days: 'Opens in {days} days at'
    },
    sound: {
      enable: 'Enable sound',
      disable: 'Disable sound'
    },
    music: {
      title: 'Ambient music',
      open: 'Open music player',
      collapse: 'Collapse player',
      play: 'Play',
      pause: 'Pause',
      prev: 'Previous track',
      next: 'Next track',
      volume: 'Volume',
      click_sounds: 'Click sounds',
      error: "Couldn't play this track"
    },
    explorer: {
      section_title: 'Interactive 3D Viewer',
      section_desc: 'Rotate a marble slab and switch between finishes to see how the same material behaves polished, matte, or honed. Drag to rotate, scroll to zoom.',
      launch: 'Launch 3D Viewer',
      launch_hint: 'Loads on demand · ~800 KB',
      loading: 'Loading 3D viewer…',
      canvas_label: 'Interactive 3D marble slab',
      polished: 'Polished',
      matte: 'Matte',
      honed: 'Honed',
      pause: 'Pause rotation',
      rotate: 'Auto-rotate',
      hint: 'Drag · Scroll to zoom'
    },
    about: {
      title_line1: 'Legacy of',
      title_line2: 'Stone & Porcelain',
      desc: 'Founded in Kfar Yassif, our factory has evolved from a humble workshop to a leader in luxury stone and porcelain manufacturing. We operate at the intersection of traditional artistry and modern technology.',
      years: 'Years Active',
      projects: 'Projects',
      size: 'Factory Size',
      made_in: 'Made in Israel',
      family_title: 'The Family',
      family_desc1: 'We are more than a factory; we are a family of artisans and engineers rooted in Kfar Yassif. Every slab of stone we cut carries our name and our reputation.',
      family_desc2: "Our approach is personal. Whether it's a porcelain countertop or a marble staircase, we treat every project as a piece of art."
    },
    cookies: {
      title: 'Cookie Settings',
      description: 'We use cookies to improve your experience. Choose which cookies you allow us to use.',
      accept_all: 'Accept All',
      reject_all: 'Reject All',
      customize: 'Customize',
      save_preferences: 'Save Preferences',
      privacy_policy: 'Privacy Policy',
      categories: {
        necessary: {
          title: 'Necessary Cookies',
          description: 'Required for the site to function. No personal data is shared with third parties.',
          always_on: 'Always On'
        },
        analytics: {
          title: 'Analytics Cookies',
          description: 'Google Analytics — tracks page views and session duration. Data is sent to Google servers. No personally identifiable data is collected. Used to improve the site.'
        },
        marketing: {
          title: 'Marketing Cookies',
          description: 'Facebook Pixel, Google Ads — used to show you relevant advertisements. Data is shared with Meta and Google for ad targeting and conversion tracking.'
        }
      }
    },
    // Gallery Page — Instagram-first: the owner posts once to Instagram, it shows here.
    gallery: {
      title: 'Our Work',
      subtitle: 'Every kitchen, every countertop, every install — posted daily on our Instagram.',
      instagram_cta: 'View Full Portfolio on Instagram',
      handle_note: 'Follow @shayish_kfar_yassif for real-time updates.'
    },
    // FAQ Page
    faq: {
      eyebrow: 'Frequently Asked',
      title: 'Questions & Answers',
      subtitle: 'The things people ask us most often, before, during, and after their project.',
      still_asking: "Didn't find your answer?",
      still_asking_desc: 'We answer WhatsApp within business hours. Real people, no bots.',
      items: [
        {
          q: 'What is the difference between marble, porcelain, and Caesarstone?',
          a: 'Marble is a natural stone — soft, unique veining, warm feel, but stains easily and needs sealing. Porcelain is engineered — extremely hard, stain-proof, heat-proof, unlimited designs including marble looks. Caesarstone is Israeli quartz — 90% natural quartz bound in resin, non-porous, resistant to almost everything except direct high heat.'
        },
        {
          q: 'How long does production take from measurement to installation?',
          a: 'Typically 6 to 8 weeks from the final on-site measurement, depending on the material, size, and any custom cutouts (sink, cooktop, edge profile). Rush jobs are possible for an extra fee.'
        },
        {
          q: 'Do you offer a warranty?',
          a: 'Yes — 10-year warranty on manufacturing defects and craftsmanship. Natural stones carry an inherent-imperfection notice; porcelain and quartz are fully covered.'
        },
        {
          q: 'Do you provide 3D designs before production?',
          a: 'Every consultation includes a detailed 3D rendering of your countertop or installation, so you can approve the design before we cut a single slab.'
        },
        {
          q: 'Do you deliver and install throughout Israel?',
          a: 'Yes — nationwide, from Metula to Eilat. Delivery cost depends on distance and access; the north is included in standard pricing.'
        },
        {
          q: 'Can I visit the factory showroom?',
          a: 'Yes, by appointment. We prefer scheduled visits so a designer can walk you through material samples and answer questions properly. Reach out on WhatsApp to book.'
        },
        {
          q: 'How do polished, matte, and honed finishes differ?',
          a: 'Polished is high-gloss, mirror-like, reflects light. Matte (or silk) is smooth without shine. Honed is smooth-matte but shows the natural stone character more strongly. Choice is mostly aesthetic — durability is the same.'
        },
        {
          q: 'How do I care for a marble surface? Will it stain?',
          a: 'Marble needs sealing once every 6-12 months and immediate cleanup of acidic spills (wine, lemon, tomato). Use a stone-safe cleaner, never acidic ones. Porcelain and Caesarstone need no such care — just soap and water.'
        },
        {
          q: 'How is pricing calculated?',
          a: 'Per square meter of the material you choose, plus edge finishing, cutouts, and installation. Prices vary widely: Caesarstone from ~₪1,200/sqm, mid-range porcelain from ~₪1,800/sqm, exotic marble can be much higher. Free quotes on request.'
        },
        {
          q: 'Can I choose the exact slab I get?',
          a: 'For natural stone, yes — we invite you to see and reserve specific slabs at the showroom, since no two are identical. For engineered materials, the pattern is consistent and slab selection is not needed.'
        }
      ]
    },
    // Process Page
    process: {
      title: 'The Methodology',
      subtitle: 'Precision planning meets artisanal execution.',
      start_project: 'Start Your Project',
      book_consultation: 'Book Consultation',
      steps: {
        consultation: { title: 'Consultation', description: 'We meet to discuss your vision, needs, and budget.' },
        design:       { title: 'Design & Plan', description: 'Our designers create a custom 3D plan for your space.' },
        measurements: { title: 'Measurements', description: 'Precise laser measurements are taken at your home.' },
        production:   { title: 'Production', description: 'Your surface is crafted in our advanced factory.' },
        installation: { title: 'Installation', description: 'Professional delivery and installation by our expert team.' },
        warranty:     { title: 'Warranty', description: 'Enjoy your new surfaces with our full support and warranty.' }
      }
    },
    // Materials Page
    materials: {
      title: 'Materiality',
      subtitle: 'The soul of a home lies in the materials. We source the world\'s finest porcelain and natural stones.',
      section_stone: 'Porcelain & Stone',
      section_finishes: 'Surface Finishes',
      porcelain_title: 'Porcelain Surfaces',
      porcelain_desc: 'Ultra-compact surfaces perfect for modern kitchens. Heat resistant, scratch resistant, and available in stunning designs.',
      caesarstone_title: 'Caesarstone',
      caesarstone_desc: 'The Israeli standard for quartz surfaces. Durable, practical, and beautiful for everyday use.',
      marble_title: 'Natural Marble',
      marble_desc: 'Timeless beauty sourced from Italy and Greece. For those who appreciate the unique imperfections and character of nature.',
      finish_polished: 'Polished',
      finish_polished_desc: 'Classic high-gloss shine reflecting light.',
      finish_matte: 'Matte / Silk',
      finish_matte_desc: 'Smooth, non-reflective, soft touch.',
      finish_concrete: 'Concrete',
      finish_concrete_desc: 'Industrial textured look and feel.',
      finish_honed: 'Honed',
      finish_honed_desc: 'Smooth matte finish with natural stone authenticity.'
    },
    // Legal Pages
    privacy: {
      nav_home: 'Home',
      nav_privacy: 'Privacy Policy',
      title: 'Privacy Policy',
      subtitle: 'This policy explains how we collect, use, and protect your personal information.',
      last_updated: 'Last Updated',
      reading_time: 'Reading Time',
      minutes: 'minutes',
      language: 'Language',
      table_of_contents: 'Table of Contents',
      toc_introduction: 'Introduction and Data Controller Identity',
      toc_dataCollected: 'Information We Collect',
      toc_purposeBasis: 'Purpose and Legal Basis',
      toc_dataRecipients: 'Who Receives Your Information',
      toc_internationalTransfer: 'International Data Transfer',
      toc_retention: 'Data Retention Periods',
      toc_consequences: 'Consequences of Not Providing Information',
      toc_yourRights: 'Your Rights Under Privacy Protection Law',
      toc_complaint: 'Right to File Complaint with Authority',
      toc_cookies: 'Cookies',
      toc_automatedDecisions: 'Automated Decisions and Artificial Intelligence',
      toc_security: 'Information Security',
      toc_updates: 'Policy Updates',
      toc_gdprAddendum: 'GDPR Addendum for European Residents'
    },
    terms: {
      nav_home: 'Home',
      nav_terms: 'Terms of Use',
      title: 'Terms of Use',
      subtitle: 'Please read these terms carefully before using our website.',
      last_updated: 'Last Updated',
      introduction: 'Introduction',
      acceptance: 'Acceptance of Terms',
      services: 'Our Services',
      user_responsibilities: 'User Responsibilities',
      intellectual_property: 'Intellectual Property',
      limitation: 'Limitation of Liability',
      indemnification: 'Indemnification',
      termination: 'Termination',
      governing_law: 'Governing Law',
      changes: 'Changes to Terms',
      contact_us: 'Contact Us'
    },
    accessibility: {
      nav_home: 'Home',
      nav_accessibility: 'Accessibility Statement',
      title: 'Accessibility Statement',
      subtitle: 'Our commitment to accessibility for all users.',
      commitment: 'Our Commitment',
      improvement: 'Continuous Improvement',
      measures: 'Technical Measures',
      standards: 'Accessibility Standards',
      feedback: 'Feedback and Assistance',
      contact: 'Contact for Accessibility Issues'
    },
    gdpr: {
      nav_home: 'Home',
      nav_gdpr: 'GDPR Request',
      title: 'GDPR Data Subject Request',
      subtitle: 'Exercise your data rights under GDPR.',
      your_rights: 'Your Rights Under GDPR',
      access_request: 'Right to Access',
      rectification_request: 'Right to Rectification',
      erasure_request: 'Right to Erasure',
      restriction_request: 'Right to Restrict Processing',
      portability_request: 'Right to Data Portability',
      objection_request: 'Right to Object',
      form_name: 'Full Name',
      form_email: 'Email Address',
      form_request_type: 'Request Type',
      form_message: 'Additional Details',
      form_submit: 'Submit Request',
      form_success: 'Request Submitted Successfully',
      form_success_desc: 'We will process your request within 30 days.',
      form_error: 'Please fill in all required fields.',
      types: {
        access: 'I want to know what personal data you have about me',
        rectify: 'I want to correct inaccurate personal data',
        erase: 'I want to delete my personal data',
        restrict: 'I want to restrict how my personal data is used',
        port: 'I want to receive my personal data in a machine-readable format',
        object: 'I object to how my personal data is being used'
      }
    }
  },
  he: {
    nav: {
      home: 'בית',
      collections: 'קולקציות',
      process: 'תהליך',
      materials: 'חומרים',
      studio: 'סטודיו',
      faq: 'שאלות נפוצות',
      consultation: 'ייעוץ'
    },
    hero: {
      est: 'נוסד 2008 • כפר יאסיף',
      title_line1: 'מומחיות ב',
      title_line2: 'שיש ופורצלן',
      subtitle: 'היעד המוביל למשטחי פורצלן, שיש ואבן בהתאמה אישית בצפון.',
      explore: 'לכל הקולקציות',
      book: 'תיאום פגישה'
    },
    intro: {
      quote: '״אנחנו מאמינים שאבן היא לא רק חומר, אלא הבסיס לעיצוב. שיש כפר יאסיף מביא את העמידות של הפורצלן והאלגנטיות של השיש לביתכם.״'
    },
    home: {
      instagram_title: 'עקבו אחרינו באינסטגרם',
      instagram_subtitle: 'עבודות יומיומיות, התקנות אחרונות, ורגעים מאחורי הקלעים — כל פרויקט שאנחנו מסיימים, ישר לפיד.',
      instagram_cta: 'לצפייה באינסטגרם',
      art_title: 'אומנות האבן והפורצלן',
      art_desc: 'השם שלנו, שיש, הוא המורשת שלנו. אנו מתמחים בחיתוך והתקנה מדויקים בכפר יאסיף. משיש איטלקי ועד משטחי פורצלן מתקדמים, אנו מהנדסים עמידות ויופי.',
      discover: 'גלה חומרים',
      visit_title: 'בקר באולם התצוגה',
      visit_loc: 'אזור תעשייה כפר יאסיף'
    },
    footer: {
      desc: 'מומחיות במשטחי אבן, שיש ופורצלן. יוצרים את לב הבית בכפר יאסיף מאז 2008.',
      collections: 'קולקציות',
      studio: 'סטודיו',
      visit: 'בקר אותנו',
      rights: 'שיש כפר יאסיף. כל הזכויות שמורות.',
      ceramic: 'משטחי פורצלן',
      marble: 'שיש טבעי',
      islands: 'איי מטבח',
      story: 'הסיפור שלנו',
      process: 'תהליך העבודה',
      contact: 'צור קשר',
      privacyPolicy: 'מדיניות פרטיות',
      accessibility: 'הצהרת נגישות',
      termsOfUse: 'תנאי שימוש'
    },
    contact: {
      title: 'צור קשר',
      subtitle: 'אנו מזמינים אתכם לבקר באולם התצוגה שלנו בכפר יאסיף ולהתרשם מקולקציות השיש והפורצלן באופן אישי.',
      phone: 'טלפון',
      email: 'אימייל',
      address_title: 'מפעל ואולם תצוגה',
      address_lines: ['אזור תעשייה', 'כפר יאסיף, ישראל'],
      waze: 'נווט עם Waze',
      form_title: 'התחל את המסע',
      form_desc: 'השאר פרטים והמעצבים שלנו יחזרו אליך.',
      name: 'שם מלא',
      city: 'עיר',
      project_type: 'סוג פרויקט',
      notes: 'חזון / הערות',
      submit: 'בקש ייעוץ',
      request_received: 'הבקשה התקבלה',
      will_contact: 'ניצור איתך קשר בהקדם לתיאום פגישת ייעוץ פרטית.',
      back: 'חזור לטופס',
      types: {
        new: 'דירה חדשה',
        reno: 'שיפוץ',
        villa: 'וילה פרטית'
      }
    },
    whatsapp: {
      title: 'דברו איתנו',
      description: 'הדרך המהירה ביותר ליצור קשר. שלחו הודעה בוואטסאפ והמעצבים שלנו יחזרו אליכם בהקדם.',
      chat: 'שלחו הודעה בוואטסאפ',
      or_call: 'או התקשרו לסטודיו',
      default_message: 'שלום, אשמח לקבל ייעוץ משיש כפר יאסיף.'
    },
    notFound: {
      title: 'העמוד לא נמצא',
      description: 'העמוד שחיפשת אינו קיים או הועבר למקום אחר.',
      home: 'חזרה לעמוד הבית'
    },
    showroom: {
      open_now: 'פתוח כעת',
      closed_now: 'סגור כעת',
      until: 'עד',
      opens_at: 'נפתח ב־',
      opens_tomorrow: 'נפתח מחר ב־',
      opens_in_days: 'נפתח בעוד {days} ימים ב־'
    },
    sound: {
      enable: 'הפעל צליל',
      disable: 'השתק צליל'
    },
    music: {
      title: 'מוזיקת רקע',
      open: 'פתח נגן מוזיקה',
      collapse: 'צמצם נגן',
      play: 'נגן',
      pause: 'עצור',
      prev: 'רצועה קודמת',
      next: 'רצועה הבאה',
      volume: 'עוצמה',
      click_sounds: 'צלילי לחיצה',
      error: 'לא ניתן לנגן את הרצועה'
    },
    explorer: {
      section_title: 'צפייה תלת־מימדית אינטראקטיבית',
      section_desc: 'סובב לוח שיש ועבור בין גימורים לראות איך אותו חומר מתנהג במבריק, מט או מלוט. גרור לסיבוב, גלגל לזום.',
      launch: 'הפעל צופה תלת־מימד',
      launch_hint: 'נטען לפי דרישה · ~800KB',
      loading: 'טוען צופה תלת־מימד…',
      canvas_label: 'לוח שיש תלת־מימדי אינטראקטיבי',
      polished: 'מבריק',
      matte: 'מט',
      honed: 'מלוט',
      pause: 'עצור סיבוב',
      rotate: 'סיבוב אוטומטי',
      hint: 'גרור · גלגל לזום'
    },
    about: {
      title_line1: 'מורשת של',
      title_line2: 'שיש ופורצלן',
      desc: 'מאז היווסדו בכפר יאסיף, המפעל שלנו צמח מבית מלאכה צנוע למוביל בייצור יוקרתי של שיש וקרמיקה. אנו פועלים במפגש שבין אומנות מסורתית לטכנולוגיה מודרנית.',
      years: 'שנות פעילות',
      projects: 'פרויקטים',
      size: 'גודל מפעל',
      made_in: 'תוצרת כחול לבן',
      family_title: 'המשפחה',
      family_desc1: 'אנחנו יותר ממפעל; אנחנו משפחה של אומנים ומהנדסים השורשית בכפר יאסיף. כל לוח אבן שאנחנו חותכים נושא את שמנו ואת המוניטין שלנו.',
      family_desc2: 'הגישה שלנו היא אישית. בין אם זה משטח פורצלן למטבח או מדרגות שיש, אנחנו מתייחסים לכל פרויקט כיצירת אומנות.'
    },
    cookies: {
      title: 'הגדרות עוגיות',
      description: 'אנו משתמשים בעוגיות לשיפור החוויה שלכם. בחרו אילו עוגיות לאפשר.',
      accept_all: 'אשר הכל',
      reject_all: 'דחה הכל',
      customize: 'התאמה אישית',
      save_preferences: 'שמור העדפות',
      privacy_policy: 'מדיניות פרטיות',
      categories: {
        necessary: {
          title: 'עוגיות הכרחיות',
          description: 'נדרשות לתפקוד האתר. לא מועברים נתונים אישיים לצדדים שלישיים.',
          always_on: 'תמיד פעיל'
        },
        analytics: {
          title: 'עוגיות ניתוח',
          description: 'Google Analytics — עוקב אחר צפיות בדפים ומשך שהייה. הנתונים נשלחים לשרתי Google. לא נאספים נתונים מזהים אישית. משמש לשיפור האתר.'
        },
        marketing: {
          title: 'עוגיות שיווק',
          description: 'Facebook Pixel, Google Ads — משמשים להצגת פרסומות רלוונטיות. הנתונים משותפים עם Meta ו-Google לצורך מיקוד פרסומות ומעקב המרות.'
        }
      }
    },
    // Gallery Page — Instagram-first: the owner posts once to Instagram, it shows here.
    gallery: {
      title: 'העבודות שלנו',
      subtitle: 'כל מטבח, כל משטח, כל התקנה — מתפרסמים מדי יום באינסטגרם שלנו.',
      instagram_cta: 'לצפייה בכל התיק באינסטגרם',
      handle_note: 'עקבו אחר @shayish_kfar_yassif לעדכונים בזמן אמת.'
    },
    // FAQ Page
    faq: {
      eyebrow: 'שאלות נפוצות',
      title: 'שאלות ותשובות',
      subtitle: 'הדברים שהכי הרבה שואלים אותנו — לפני, במהלך ואחרי הפרויקט.',
      still_asking: 'לא מצאת את התשובה?',
      still_asking_desc: 'עונים בוואטסאפ בשעות פעילות. אנשים אמיתיים, לא בוטים.',
      items: [
        {
          q: 'מה ההבדל בין שיש, פורצלן וקיסרסטון?',
          a: 'שיש הוא אבן טבעית — רך, ורידים ייחודיים, תחושה חמה, אבל נכתם בקלות ודורש שיקוע. פורצלן מהונדס — עמיד מאוד, לא נכתם, עמיד בחום, אינסוף עיצובים כולל מראה שיש. קיסרסטון הוא קוורץ ישראלי — 90% קוורץ טבעי מחובר בשרף, לא נקבובי, עמיד כמעט בכל דבר חוץ מחום ישיר גבוה.'
        },
        {
          q: 'כמה זמן לוקח מהמדידה ועד ההתקנה?',
          a: 'בדרך כלל 6 עד 8 שבועות מהמדידה הסופית בשטח, תלוי בחומר, בגודל, ובחיתוכים מיוחדים (כיור, כיריים, פרופיל קצה). ניתן להזמין ייצור מזורז בתוספת תשלום.'
        },
        {
          q: 'האם יש אחריות?',
          a: 'כן — אחריות של 10 שנים על פגמי ייצור ואומנות. אבן טבעית כוללת הודעה על פגמים אינהרנטיים; פורצלן וקוורץ מכוסים במלואם.'
        },
        {
          q: 'האם אתם מכינים תכנון תלת-מימד לפני ייצור?',
          a: 'כל ייעוץ כולל הדמיה תלת-מימדית מפורטת של המשטח או ההתקנה, כדי שתוכלו לאשר את העיצוב לפני שאנחנו חותכים לוח אחד.'
        },
        {
          q: 'האם אתם מתקינים בכל הארץ?',
          a: 'כן — מכל מקום בארץ, ממטולה עד אילת. עלות המשלוח תלויה במרחק ובגישה; הצפון כלול במחיר הסטנדרטי.'
        },
        {
          q: 'האם אפשר לבקר באולם התצוגה במפעל?',
          a: 'כן, בתיאום מראש. אנחנו מעדיפים ביקורים מתואמים כדי שמעצב יוכל להעביר אתכם על דוגמאות החומרים ולענות על שאלות בצורה מסודרת. פנו בוואטסאפ לתיאום.'
        },
        {
          q: 'מה ההבדל בין גימור מבריק, מט ומלוט?',
          a: 'מבריק זה בהיר, כמו מראה, משקף אור. מט (או משי) זה חלק בלי ברק. מלוט זה חלק-מט אבל מראה יותר בבירור את האופי הטבעי של האבן. הבחירה בעיקר אסתטית — העמידות זהה.'
        },
        {
          q: 'איך מטפלים במשטח שיש? האם הוא נכתם?',
          a: 'שיש דורש שיקוע כל 6-12 חודשים וניקוי מיידי של נוזלים חומציים (יין, לימון, עגבנייה). השתמשו בחומר ניקוי בטוח לאבן, אף פעם לא בחומצי. פורצלן וקיסרסטון לא דורשים טיפול מיוחד — סבון ומים.'
        },
        {
          q: 'איך מתמחרים?',
          a: 'לפי מטר רבוע של החומר שבחרתם, בתוספת גימור קצה, חיתוכים והתקנה. המחירים משתנים מאוד: קיסרסטון החל מכ־₪1,200/מ״ר, פורצלן בינוני החל מכ־₪1,800/מ״ר, שיש אקזוטי יכול להיות הרבה יותר. הצעות מחיר בחינם.'
        },
        {
          q: 'האם אפשר לבחור את הלוח הספציפי שאני מקבל?',
          a: 'לאבן טבעית — כן, אנו מזמינים אתכם לראות ולשריין לוחות ספציפיים באולם התצוגה, כי אין שתי אבנים זהות. לחומרים מהונדסים — הדוגמה עקבית וכן בחירת לוח לא נדרשת.'
        }
      ]
    },
    // Process Page
    process: {
      title: 'שיטת העבודה',
      subtitle: 'תכנון מדויק פוגש ביצוע אומנותי.',
      start_project: 'התחל פרויקט',
      book_consultation: 'תאם ייעוץ',
      steps: {
        consultation: { title: 'ייעוץ', description: 'נפגשים כדי לדבר על החזון, הצרכים והתקציב שלכם.' },
        design:       { title: 'עיצוב ותכנון', description: 'המעצבים שלנו יוצרים תכנית תלת-מימד מותאמת לחלל שלכם.' },
        measurements: { title: 'מדידות', description: 'מדידות לייזר מדויקות מתבצעות בביתכם.' },
        production:   { title: 'ייצור', description: 'המשטח שלכם מיוצר במפעל המתקדם שלנו.' },
        installation: { title: 'התקנה', description: 'משלוח והתקנה מקצועיים על ידי צוות המומחים שלנו.' },
        warranty:     { title: 'אחריות', description: 'תיהנו מהמשטחים החדשים עם התמיכה והאחריות המלאה שלנו.' }
      }
    },
    // Materials Page
    materials: {
      title: 'חומריות',
      subtitle: 'נשמת הבית נמצאת בחומרים. אנו מביאים את הקרמיקה, הפורצלן ואבני הטבע המשובחים בעולם.',
      section_stone: 'פורצלן ואבן',
      section_finishes: 'גימורי פני שטח',
      porcelain_title: 'פורצלן וקרמיקה',
      porcelain_desc: 'משטחים אולטרה-קומפקטיים מושלמים למטבחים מודרניים. עמידים בחום, עמידים בשריטות, זמינים בעיצובים מרהיבים.',
      caesarstone_title: 'קיסרסטון',
      caesarstone_desc: 'הסטנדרט הישראלי למשטחי קוורץ. עמיד, מעשי ויפה לשימוש יומיומי.',
      marble_title: 'שיש טבעי',
      marble_desc: 'יופי נצחי ממקורות איטליה ויוון. למי שמעריך את הפגמים הייחודיים והאופי של הטבע.',
      finish_polished: 'מבריק',
      finish_polished_desc: 'ברק קלאסי עם השתקפות אור.',
      finish_matte: 'מט / משי',
      finish_matte_desc: 'חלק, לא מחזיר, מגע רך.',
      finish_concrete: 'בטון',
      finish_concrete_desc: 'מראה ותחושה של מרקם תעשייתי.',
      finish_honed: 'מלוט',
      finish_honed_desc: 'גימור מט חלק עם אותנטיות של אבן טבעית.'
    },
    // Legal Pages
    privacy: {
      nav_home: 'דף הבית',
      nav_privacy: 'מדיניות פרטיות',
      title: 'מדיניות פרטיות',
      subtitle: 'מדיניות זו מסבירה איך אנחנו אוספים, משתמשים ומגנים על המידע האישי שלך.',
      last_updated: 'עודכן לאחרונה',
      reading_time: 'זמן קריאה',
      minutes: 'דקות',
      language: 'שפה',
      table_of_contents: 'תוכן עניינים',
      toc_introduction: 'מבוא וזהות בעל המידע',
      toc_dataCollected: 'איזה מידע אנחנו אוספים',
      toc_purposeBasis: 'מטרה ובסיס משפטי',
      toc_dataRecipients: 'מי מקבל את המידע שלך',
      toc_internationalTransfer: 'העברת מידע לחו״ל',
      toc_retention: 'תקופות שמירת מידע',
      toc_consequences: 'השלכות אי-מסירת מידע',
      toc_yourRights: 'הזכויות שלך לפי חוק הגנת הפרטיות',
      toc_complaint: 'זכות הגשת תלונה לרשות',
      toc_cookies: 'עוגיות',
      toc_automatedDecisions: 'החלטות אוטומטיות ובינה מלאכותית',
      toc_security: 'אבטחת מידע',
      toc_updates: 'עדכוני מדיניות',
      toc_gdprAddendum: 'תוספת GDPR לתושבי אירופה'
    },
    terms: {
      nav_home: 'דף הבית',
      nav_terms: 'תנאי שימוש',
      title: 'תנאי שימוש',
      subtitle: 'אנא קרא את התנאים בעיון לפני השימוש באתר שלנו.',
      last_updated: 'עודכן לאחרונה',
      introduction: 'מבוא',
      acceptance: 'קבלת התנאים',
      services: 'השירותים שלנו',
      user_responsibilities: 'אחריות המשתמש',
      intellectual_property: 'קניין רוחני',
      limitation: 'הגבלת אחריות',
      indemnification: 'פיצויים',
      termination: 'סיום השירות',
      governing_law: 'דין חל',
      changes: 'שינויים בתנאים',
      contact_us: 'צור קשר'
    },
    accessibility: {
      nav_home: 'דף הבית',
      nav_accessibility: 'הצהרת נגישות',
      title: 'הצהרת נגישות',
      subtitle: 'המחויבות שלנו לנגישות עבור כלל המשתמשים.',
      commitment: 'המחויבות שלנו',
      improvement: 'שיפור מתמיד',
      measures: 'אמצעים טכניים',
      standards: 'תקני נגישות',
      feedback: 'משוב וסיוע',
      contact: 'צור קשר לענייני נגישות'
    },
    gdpr: {
      nav_home: 'דף הבית',
      nav_gdpr: 'בקשת GDPR',
      title: 'בקשת נתוני עיקריות GDPR',
      subtitle: 'ממש את זכויות הנתונים שלך על פי GDPR.',
      your_rights: 'הזכויות שלך על פי GDPR',
      access_request: 'זכות הגישה',
      rectification_request: 'זכות התיקון',
      erasure_request: 'זכות המחיקה',
      restriction_request: 'זכות הגבלת עיבוד',
      portability_request: 'זכות לניידות נתונים',
      objection_request: 'זכות התנגדות',
      form_name: 'שם מלא',
      form_email: 'כתובת אימייל',
      form_request_type: 'סוג הבקשה',
      form_message: 'פרטים נוספים',
      form_submit: 'שלח בקשה',
      form_success: 'הבקשה התקבלה בהצלחה',
      form_success_desc: 'נעבד את הבקשה שלך תוך 30 יום.',
      form_error: 'אנא מלא את כל השדות הנדרשים.',
      types: {
        access: 'אני רוצה לדעת אילו נתונים אישיים יש לך עלי',
        rectify: 'אני רוצה לתקן נתונים אישיים לא מדויקים',
        erase: 'אני רוצה למחוק את הנתונים האישיים שלי',
        restrict: 'אני רוצה להגביל את השימוש בנתונים האישיים שלי',
        port: 'אני רוצה לקבל את הנתונים האישיים שלי בפורמט קריא מכונה',
        object: 'אני מתנגד לדרך שבה הנתונים האישיים שלי משומשים'
      }
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      collections: 'المجموعات',
      process: 'العملية',
      materials: 'المواد',
      studio: 'الاستوديو',
      faq: 'أسئلة شائعة',
      consultation: 'استشارة'
    },
    hero: {
      est: 'تأسست 2008 • كفر ياسيف',
      title_line1: 'إتقان في',
      title_line2: 'الحجر والبورسلين',
      subtitle: 'الوجهة الرائدة للبورسلين، الرخام، وأسطح الحجر المخصصة في شمال إسرائيل.',
      explore: 'تصفح المجموعات',
      book: 'حجز موعد'
    },
    intro: {
      quote: '"نحن نؤمن أن الحجر ليس مجرد مادة، بل هو أساس التصميم. شايش كفر ياسيف يجمع بين متانة البورسلين وأناقة الرخام في منزلك."'
    },
    home: {
      instagram_title: 'تابعونا على إنستغرام',
      instagram_subtitle: 'أعمال يومية، أحدث التركيبات، ولحظات من وراء الكواليس — كل مشروع ننجزه، مباشرة على صفحتنا.',
      instagram_cta: 'شاهدوا إنستغرام',
      art_title: 'فن الحجر والبورسلين',
      art_desc: 'اسمنا، شايش، هو تراثنا. نحن متخصصون في القص والتركيب الدقيق في كفر ياسيف. من الرخام الإيطالي إلى أسطح البورسلين المتقدمة، نحن نهندس المتانة والجمال.',
      discover: 'اكتشف المواد',
      visit_title: 'زُر صالة العرض',
      visit_loc: 'المنطقة الصناعية كفر ياسيف'
    },
    footer: {
      desc: 'خبرة في أسطح الحجر، الرخام والبورسلين. نصنع قلب المنزل في كفر ياسيف منذ 2008.',
      collections: 'المجموعات',
      studio: 'الاستوديو',
      visit: 'زورونا',
      rights: 'شايش كفر ياسيف. جميع الحقوق محفوظة.',
      ceramic: 'أسطح بورسلين',
      marble: 'رخام طبيعي',
      islands: 'جزر مطبخ',
      story: 'قصتنا',
      process: 'العملية',
      contact: 'اتصل بنا',
      privacyPolicy: 'سياسة الخصوصية',
      accessibility: 'بيان إمكانية الوصول',
      termsOfUse: 'شروط الاستخدام'
    },
    contact: {
      title: 'اتصل بنا',
      subtitle: 'ندعوكم لزيارة صالة العرض في كفر ياسيف لتجربة مجموعات الحجر والبورسلين شخصيًا.',
      phone: 'هاتف',
      email: 'بريد إلكتروني',
      address_title: 'المصنع وصالة العرض',
      address_lines: ['المنطقة الصناعية', 'كفر ياسيف، إسرائيل'],
      waze: 'توجيه عبر Waze',
      form_title: 'ابدأ رحلتك',
      form_desc: 'اترك تفاصيلك وسيتواصل معك مصممونا.',
      name: 'الاسم',
      city: 'المدينة',
      project_type: 'نوع المشروع',
      notes: 'رؤية / ملاحظات',
      submit: 'طلب استشارة',
      request_received: 'تم استلام الطلب',
      will_contact: 'سنتصل بك قريبًا لتنسيق استشارة خاصة.',
      back: 'العودة للنموذج',
      types: {
        new: 'شقة جديدة',
        reno: 'تجديد',
        villa: 'فيلا خاصة'
      }
    },
    whatsapp: {
      title: 'تحدث معنا',
      description: 'أسرع طريقة للتواصل معنا. أرسل رسالة عبر واتساب وسيرد عليك مصممونا قريبًا.',
      chat: 'الدردشة عبر واتساب',
      or_call: 'أو اتصل بالاستوديو',
      default_message: 'مرحبًا، أود الحصول على استشارة من شايش كفر ياسيف.'
    },
    notFound: {
      title: 'الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      home: 'العودة إلى الرئيسية'
    },
    showroom: {
      open_now: 'مفتوح الآن',
      closed_now: 'مغلق الآن',
      until: 'حتى',
      opens_at: 'يفتح في',
      opens_tomorrow: 'يفتح غدًا في',
      opens_in_days: 'يفتح خلال {days} أيام في'
    },
    sound: {
      enable: 'تفعيل الصوت',
      disable: 'كتم الصوت'
    },
    music: {
      title: 'موسيقى الخلفية',
      open: 'فتح مشغل الموسيقى',
      collapse: 'تصغير المشغل',
      play: 'تشغيل',
      pause: 'إيقاف',
      prev: 'المسار السابق',
      next: 'المسار التالي',
      volume: 'مستوى الصوت',
      click_sounds: 'أصوات النقر',
      error: 'تعذّر تشغيل المسار'
    },
    explorer: {
      section_title: 'عارض ثلاثي الأبعاد تفاعلي',
      section_desc: 'دور لوح رخام وبدل بين التشطيبات لترى كيف تتصرف نفس المادة مصقولة، مطفية أو ملساء. اسحب للدوران، مرر للتكبير.',
      launch: 'شغل العارض ثلاثي الأبعاد',
      launch_hint: 'يحمّل عند الطلب · ~800KB',
      loading: 'جاري تحميل العارض ثلاثي الأبعاد…',
      canvas_label: 'لوح رخام ثلاثي الأبعاد تفاعلي',
      polished: 'مصقول',
      matte: 'مطفي',
      honed: 'ملساء',
      pause: 'إيقاف الدوران',
      rotate: 'دوران تلقائي',
      hint: 'اسحب · مرر للتكبير'
    },
    about: {
      title_line1: 'تراث من',
      title_line2: 'الحجر والبورسلين',
      desc: 'تأسس مصنعنا في كفر ياسيف، وتطور من ورشة عمل متواضعة إلى رائد في تصنيع الحجر والبورسلين الفاخر. نحن نعمل في تقاطع الفن التقليدي والتكنولوجيا الحديثة.',
      years: 'سنوات الخبرة',
      projects: 'مشاريع',
      size: 'مساحة المصنع',
      made_in: 'صنع في إسرائيل',
      family_title: 'العائلة',
      family_desc1: 'نحن أكثر من مجرد مصنع؛ نحن عائلة من الحرفيين والمهندسين المتجذرين في كفر ياسيف. كل لوح حجر نقطعه يحمل اسمنا وسمعتنا.',
      family_desc2: 'نهجنا شخصي. سواء كان سطح مطبخ من البورسلين أو درج رخامي، نحن نعامل كل مشروع كقطعة فنية.'
    },
    cookies: {
      title: 'إعدادات ملفات تعريف الارتباط',
      description: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. اختر ملفات تعريف الارتباط التي تسمح لنا باستخدامها.',
      accept_all: 'قبول الكل',
      reject_all: 'رفض الكل',
      customize: 'تخصيص',
      save_preferences: 'حفظ التفضيلات',
      privacy_policy: 'سياسة الخصوصية',
      categories: {
        necessary: {
          title: 'ملفات تعريف الارتباط الضرورية',
          description: 'مطلوبة لعمل الموقع. لا يتم مشاركة بيانات شخصية مع أطراف ثالثة.',
          always_on: 'دائمًا نشط'
        },
        analytics: {
          title: 'ملفات تعريف الارتباط للتحليلات',
          description: 'Google Analytics — يتتبع مشاهدات الصفحة ومدة الجلسة. يتم إرسال البيانات إلى خوادم Google. لا يتم جمع بيانات شخصية. يُستخدم لتحسين الموقع.'
        },
        marketing: {
          title: 'ملفات تعريف الارتباط للتسويق',
          description: 'Facebook Pixel، Google Ads — تُستخدم لعرض إعلانات ذات صلة. تتم مشاركة البيانات مع Meta و Google لاستهداف الإعلانات وتتبع التحويلات.'
        }
      }
    },
    // Gallery Page — Instagram-first: the owner posts once to Instagram, it shows here.
    gallery: {
      title: 'أعمالنا',
      subtitle: 'كل مطبخ، كل سطح، كل تركيب — يُنشر يوميًا على إنستغرام.',
      instagram_cta: 'شاهدوا الأعمال الكاملة على إنستغرام',
      handle_note: 'تابعوا @shayish_kfar_yassif للتحديثات المباشرة.'
    },
    // FAQ Page
    faq: {
      eyebrow: 'الأسئلة الشائعة',
      title: 'أسئلة وأجوبة',
      subtitle: 'الأمور التي يسألنا عنها العملاء أكثر — قبل المشروع وأثناءه وبعده.',
      still_asking: 'لم تجد إجابتك؟',
      still_asking_desc: 'نرد على واتساب خلال ساعات العمل. أشخاص حقيقيون، لا روبوتات.',
      items: [
        {
          q: 'ما الفرق بين الرخام والبورسلين والكوارتز (سيزارستون)؟',
          a: 'الرخام حجر طبيعي — ناعم، عروق فريدة، إحساس دافئ، لكنه يتلطخ بسهولة ويحتاج إلى مانع تسرب. البورسلين مُهندس — صلب جدًا، مقاوم للبقع والحرارة، تصاميم لا نهائية بما فيها مظهر الرخام. سيزارستون هو كوارتز إسرائيلي — 90% كوارتز طبيعي مربوط بالراتنج، غير مسامي، مقاوم لكل شيء تقريبًا باستثناء الحرارة المباشرة العالية.'
        },
        {
          q: 'كم يستغرق الإنتاج من القياس إلى التركيب؟',
          a: 'عادة 6 إلى 8 أسابيع من القياس النهائي في الموقع، حسب المادة والحجم وأي قطع مخصصة (حوض، موقد، حواف). الإنتاج السريع ممكن مقابل رسوم إضافية.'
        },
        {
          q: 'هل يوجد ضمان؟',
          a: 'نعم — ضمان 10 سنوات على عيوب التصنيع والحرفية. الأحجار الطبيعية لها إشعار بالعيوب المتأصلة؛ البورسلين والكوارتز مغطاة بالكامل.'
        },
        {
          q: 'هل تقدمون تصميمات ثلاثية الأبعاد قبل الإنتاج؟',
          a: 'كل استشارة تشمل تصميمًا ثلاثي الأبعاد مفصلًا للسطح أو التركيب، لتتمكنوا من الموافقة على التصميم قبل قص أي لوح.'
        },
        {
          q: 'هل تركبون في جميع أنحاء إسرائيل؟',
          a: 'نعم — على مستوى البلاد، من ميتولا إلى إيلات. تكلفة التوصيل تعتمد على المسافة والوصول؛ الشمال مشمول في التسعير القياسي.'
        },
        {
          q: 'هل يمكنني زيارة صالة العرض في المصنع؟',
          a: 'نعم، بموعد مسبق. نفضل الزيارات المنسقة حتى يتمكن المصمم من مرافقتكم عبر عينات المواد والإجابة على الأسئلة بشكل صحيح. تواصلوا عبر واتساب للحجز.'
        },
        {
          q: 'ما الفرق بين التشطيبات المصقولة والمطفية والملساء؟',
          a: 'المصقول عالي اللمعان، كالمرآة، يعكس الضوء. المطفي (أو الحرير) ناعم بدون لمعان. الملساء ناعم-مطفي لكنه يظهر الطبيعة الفريدة للحجر بشكل أقوى. الاختيار جمالي في الغالب — المتانة واحدة.'
        },
        {
          q: 'كيف أعتني بسطح رخامي؟ هل سيتلطخ؟',
          a: 'الرخام يحتاج إلى مانع تسرب كل 6-12 شهرًا وتنظيف فوري للانسكابات الحمضية (نبيذ، ليمون، طماطم). استخدموا منظفًا آمنًا للحجر، ليس حمضيًا أبدًا. البورسلين والكوارتز لا يحتاجان لهذه العناية — فقط صابون وماء.'
        },
        {
          q: 'كيف يتم حساب التسعير؟',
          a: 'لكل متر مربع من المادة التي تختارونها، بالإضافة إلى تشطيب الحواف والقطع والتركيب. الأسعار تختلف كثيرًا: سيزارستون من ~1200 شيكل/م²، بورسلين متوسط من ~1800 شيكل/م²، الرخام النادر يمكن أن يكون أعلى بكثير. عروض أسعار مجانية عند الطلب.'
        },
        {
          q: 'هل يمكنني اختيار اللوح المحدد الذي أحصل عليه؟',
          a: 'للحجر الطبيعي، نعم — نرحب بكم لرؤية وحجز ألواح محددة في صالة العرض، حيث لا يوجد لوحان متطابقان. للمواد المُهندسة، النمط ثابت واختيار اللوح غير مطلوب.'
        }
      ]
    },
    // Process Page
    process: {
      title: 'المنهجية',
      subtitle: 'تخطيط دقيق يلتقي بتنفيذ حرفي.',
      start_project: 'ابدأ مشروعك',
      book_consultation: 'حجز استشارة',
      steps: {
        consultation: { title: 'استشارة', description: 'نلتقي لمناقشة رؤيتك واحتياجاتك وميزانيتك.' },
        design:       { title: 'التصميم والتخطيط', description: 'يصمم فريقنا مخططًا ثلاثي الأبعاد مخصصًا لمساحتك.' },
        measurements: { title: 'القياسات', description: 'تُؤخذ قياسات ليزر دقيقة في منزلك.' },
        production:   { title: 'الإنتاج', description: 'يُصنع سطحك في مصنعنا المتطور.' },
        installation: { title: 'التركيب', description: 'توصيل وتركيب احترافي على يد فريق الخبراء لدينا.' },
        warranty:     { title: 'الضمان', description: 'استمتع بأسطحك الجديدة مع دعمنا وضماننا الكامل.' }
      }
    },
    // Materials Page
    materials: {
      title: 'المادية',
      subtitle: 'روح المنزل تكمن في المواد. نوفر أجود البورسلين والأحجار الطبيعية في العالم.',
      section_stone: 'البورسلين والحجر',
      section_finishes: 'تشطيب الأسطح',
      porcelain_title: 'البورسلين',
      porcelain_desc: 'أسطح فائقة الدقة مثالية للمطابخ العصرية. مقاومة للحرارة والخدوش، ومتاحة بتصاميم مذهلة.',
      caesarstone_title: 'قيصر ستون',
      caesarstone_desc: 'المعيار الإسرائيلي لأسطح الكوارتز. متين وعملي وجميل للاستخدام اليومي.',
      marble_title: 'الرخام الطبيعي',
      marble_desc: 'جمال خالد من إيطاليا واليونان. لمن يقدر العيوب الفريدة وطبيعة الطبيعة.',
      finish_polished: 'مصقول',
      finish_polished_desc: 'لامع كلاسيكي يعكس الضوء.',
      finish_matte: 'مطفي / حريري',
      finish_matte_desc: 'ناعم وغير عاكس، ملمس ناعم.',
      finish_concrete: 'خرسانة',
      finish_concrete_desc: 'مظهر وملمس منسوج صناعي.',
      finish_honed: 'مصقول ناعم',
      finish_honed_desc: 'تشطيب ناعم غير لامع مع أصالة الحجر الطبيعي.'
    },
    // Legal Pages
    privacy: {
      nav_home: 'الرئيسية',
      nav_privacy: 'سياسة الخصوصية',
      title: 'سياسة الخصوصية',
      subtitle: 'تشرح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.',
      last_updated: 'آخر تحديث',
      reading_time: 'وقت القراءة',
      minutes: 'دقائق',
      language: 'اللغة',
      table_of_contents: 'جدول المحتويات',
      toc_introduction: 'المقدمة وهوية مسيطر البيانات',
      toc_dataCollected: 'المعلومات التي نجمعها',
      toc_purposeBasis: 'الغرض والأساس القانوني',
      toc_dataRecipients: 'من يستلم معلوماتك',
      toc_internationalTransfer: 'نقل البيانات عبر الحدود',
      toc_retention: 'فترات الاحتفاظ بالبيانات',
      toc_consequences: 'عواقب عدم تقديم المعلومات',
      toc_yourRights: 'حقوقك بموجب قانون حماية الخصوصية',
      toc_complaint: 'حق تقديم شكوى للسلطة',
      toc_cookies: 'ملفات تعريف الارتباط',
      toc_automatedDecisions: 'القرارات الآلية والذكاء الاصطناعي',
      toc_security: 'أمن المعلومات',
      toc_updates: 'تحديثات السياسة',
      toc_gdprAddendum: 'ملحق GDPR لسكان أوروبا'
    },
    terms: {
      nav_home: 'الرئيسية',
      nav_terms: 'شروط الاستخدام',
      title: 'شروط الاستخدام',
      subtitle: 'يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا.',
      last_updated: 'آخر تحديث',
      introduction: 'مقدمة',
      acceptance: 'قبول الشروط',
      services: 'خدماتنا',
      user_responsibilities: 'مسؤوليات المستخدم',
      intellectual_property: 'الملكية الفكرية',
      limitation: 'تحديد المسؤولية',
      indemnification: 'التعويض',
      termination: 'إنهاء الخدمة',
      governing_law: 'القانون الحاكم',
      changes: 'تغييرات على الشروط',
      contact_us: 'اتصل بنا'
    },
    accessibility: {
      nav_home: 'الرئيسية',
      nav_accessibility: 'بيان إمكانية الوصول',
      title: 'بيان إمكانية الوصول',
      subtitle: 'التزامنا بإمكانية الوصول لجميع المستخدمين.',
      commitment: 'التزامنا',
      improvement: 'التحسين المستمر',
      measures: 'التدابير التقنية',
      standards: 'معايير إمكانية الوصول',
      feedback: 'التعليقات والمساعدة',
      contact: 'اتصل للإبلاغ عن مشاكل إمكانية الوصول'
    },
    gdpr: {
      nav_home: 'الرئيسية',
      nav_gdpr: 'طلب GDPR',
      title: 'طلب مقدم البيانات حسب GDPR',
      subtitle: 'مارسة حقوق بياناتك وفقًا لـ GDPR.',
      your_rights: 'حقوقك وفقًا لـ GDPR',
      access_request: 'حق الوصول',
      rectification_request: 'حق التصحيح',
      erasure_request: 'حق المحو',
      restriction_request: 'حق تقييد المعالجة',
      portability_request: 'حق نقل البيانات',
      objection_request: 'حق الاعتراض',
      form_name: 'الاسم الكامل',
      form_email: 'عنوان البريد الإلكتروني',
      form_request_type: 'نوع الطلب',
      form_message: 'تفاصيل إضافية',
      form_submit: 'إرسال الطلب',
      form_success: 'تم إرسال الطلب بنجاح',
      form_success_desc: 'سنقوم بمعالجة طلبك في غضون 30 يومًا.',
      form_error: 'يرجى ملء جميع الحقول المطلوبة.',
      types: {
        access: 'أريد معرفة البيانات الشخصية التي لديكم عني',
        rectify: 'أريد تصحيح بيانات شخصية غير دقيقة',
        erase: 'أريد حذف بياناتي الشخصية',
        restrict: 'أريد تقييد كيفية استخدام بياناتي الشخصية',
        port: 'أريد استلام بياناتي الشخصية بتنسيق مقروء آليًا',
        object: 'أعارض على كيفية استخدام بياناتي الشخصية'
      }
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      collections: 'Коллекции',
      process: 'Процесс',
      materials: 'Материалы',
      studio: 'Студия',
      faq: 'FAQ',
      consultation: 'Консультация'
    },
    hero: {
      est: 'Основано в 2008 • Кфар Ясиф',
      title_line1: 'Мастерство в',
      title_line2: 'Камне и Фарфоре',
      subtitle: 'Ведущий центр фарфора, мрамора и bespoke каменных поверхностей на севере Израиля.',
      explore: 'Смотреть коллекции',
      book: 'Записаться на приём'
    },
    intro: {
      quote: '"Мы верим, что камень — это не просто материал, а основа дизайна. Шаиш Кфар Ясиф сочетает прочность фарфора и элегантность мрамора в вашем доме."'
    },
    home: {
      instagram_title: 'Подписывайтесь на нас в Instagram',
      instagram_subtitle: 'Ежедневные работы, последние установки и моменты за кулисами — каждый завершённый проект прямо в нашей ленте.',
      instagram_cta: 'Смотреть Instagram',
      art_title: 'Искусство Камня и Фарфора',
      art_desc: 'Наше имя, Шаиш, — это наше наследие. Мы специализируемся на точной резке и установке в Кфар Ясиф. От итальянского мрамора до продвинутых фарфоровых поверхностей — мы создаём прочность и красоту.',
      discover: 'Открыть материалы',
      visit_title: 'Посетить шоу-рум',
      visit_loc: 'Промышленная зона Кфар Ясиф'
    },
    footer: {
      desc: 'Экспертиза в каменных, мраморных и фарфоровых поверхностях. Создаём сердце дома в Кфар Ясиф с 2008 года.',
      collections: 'Коллекции',
      studio: 'Студия',
      visit: 'Посетить нас',
      rights: 'Шаиш Кфар Ясиф. Все права защищены.',
      ceramic: 'Фарфоровые поверхности',
      marble: 'Натуральный мрамор',
      islands: 'Кухонные острова',
      story: 'Наша история',
      process: 'Процесс',
      contact: 'Контакты',
      privacyPolicy: 'Политика конфиденциальности',
      accessibility: 'Заявление о доступности',
      termsOfUse: 'Условия использования'
    },
    contact: {
      title: 'Контакты',
      subtitle: 'Приглашаем вас посетить наш шоу-рум на фабрике в Кфар Ясиф и лично оценить наши коллекции камня и фарфора.',
      phone: 'Телефон',
      email: 'Email',
      address_title: 'Фабрика и шоу-рум',
      address_lines: ['Промышленная зона', 'Кфар Ясиф, Израиль'],
      waze: 'Навигация через Waze',
      form_title: 'Начните свой путь',
      form_desc: 'Оставьте свои данные, и наши дизайнеры свяжутся с вами.',
      name: 'Имя',
      city: 'Город',
      project_type: 'Тип проекта',
      notes: 'Видение / Заметки',
      submit: 'Запросить консультацию',
      request_received: 'Запрос получен',
      will_contact: 'Мы свяжемся с вами в ближайшее время для организации частной консультации.',
      back: 'Назад к форме',
      types: {
        new: 'Новая квартира',
        reno: 'Реновация',
        villa: 'Частная вилла'
      }
    },
    whatsapp: {
      title: 'Напишите нам',
      description: 'Самый быстрый способ связаться с нами. Напишите в WhatsApp — наши дизайнеры ответят в ближайшее время.',
      chat: 'Написать в WhatsApp',
      or_call: 'Или позвоните в студию',
      default_message: 'Здравствуйте, меня интересует консультация в Шаиш Кфар Ясиф.'
    },
    notFound: {
      title: 'Страница не найдена',
      description: 'Страница, которую вы ищете, не существует или была перемещена.',
      home: 'Вернуться на главную'
    },
    showroom: {
      open_now: 'Открыто сейчас',
      closed_now: 'Закрыто сейчас',
      until: 'До',
      opens_at: 'Откроется в',
      opens_tomorrow: 'Откроется завтра в',
      opens_in_days: 'Откроется через {days} дн. в'
    },
    sound: {
      enable: 'Включить звук',
      disable: 'Выключить звук'
    },
    music: {
      title: 'Фоновая музыка',
      open: 'Открыть плеер',
      collapse: 'Свернуть плеер',
      play: 'Воспроизвести',
      pause: 'Пауза',
      prev: 'Предыдущий трек',
      next: 'Следующий трек',
      volume: 'Громкость',
      click_sounds: 'Звуки нажатий',
      error: 'Не удалось воспроизвести трек'
    },
    explorer: {
      section_title: 'Интерактивный 3D-просмотр',
      section_desc: 'Вращайте мраморную плиту и переключайтесь между отделками, чтобы увидеть один и тот же материал полированным, матовым или шлифованным. Тащите для вращения, прокрутка — зум.',
      launch: 'Открыть 3D-просмотр',
      launch_hint: 'Загружается по требованию · ~800 КБ',
      loading: 'Загрузка 3D-просмотра…',
      canvas_label: 'Интерактивная 3D-плита из мрамора',
      polished: 'Полированный',
      matte: 'Матовый',
      honed: 'Шлифованный',
      pause: 'Остановить вращение',
      rotate: 'Авто-вращение',
      hint: 'Тащите · Прокрутка для зума'
    },
    about: {
      title_line1: 'Наследие',
      title_line2: 'Камня и Фарфора',
      desc: 'Основанная в Кфар Ясиф, наша фабрика выросла из скромной мастерской до лидера в производстве роскошного камня и фарфора. Мы работаем на стыке традиционного ремесла и современных технологий.',
      years: 'Лет работы',
      projects: 'Проекты',
      size: 'Площадь фабрики',
      made_in: 'Сделано в Израиле',
      family_title: 'Семья',
      family_desc1: 'Мы больше, чем фабрика; мы семья мастеров и инженеров, укоренившихся в Кфар Ясиф. Каждый каменный лист, который мы режем, несёт наше имя и нашу репутацию.',
      family_desc2: 'Наш подход индивидуален. Будь то фарфоровая столешница или мраморная лестница, мы относимся к каждому проекту как к произведению искусства.'
    },
    cookies: {
      title: 'Настройки файлов cookie',
      description: 'Мы используем файлы cookie для улучшения вашего опыта. Выберите, какие файлы cookie вы разрешаете нам использовать.',
      accept_all: 'Принять все',
      reject_all: 'Отклонить все',
      customize: 'Настроить',
      save_preferences: 'Сохранить настройки',
      privacy_policy: 'Политика конфиденциальности',
      categories: {
        necessary: {
          title: 'Необходимые файлы cookie',
          description: 'Требуются для работы сайта. Никакие личные данные не передаются третьим лицам.',
          always_on: 'Всегда включены'
        },
        analytics: {
          title: 'Файлы cookie аналитики',
          description: 'Google Analytics — отслеживает просмотры страниц и продолжительность сессии. Данные отправляются на серверы Google. Персональные данные не собираются. Используется для улучшения сайта.'
        },
        marketing: {
          title: 'Маркетинговые файлы cookie',
          description: 'Facebook Pixel, Google Ads — используются для показа релевантной рекламы. Данные передаются Meta и Google для таргетинга рекламы и отслеживания конверсий.'
        }
      }
    },
    // Gallery Page — Instagram-first: the owner posts once to Instagram, it shows here.
    gallery: {
      title: 'Наши работы',
      subtitle: 'Каждая кухня, каждая столешница, каждая установка — публикуются ежедневно в нашем Instagram.',
      instagram_cta: 'Смотреть полное портфолио в Instagram',
      handle_note: 'Подписывайтесь на @shayish_kfar_yassif для обновлений в реальном времени.'
    },
    // FAQ Page
    faq: {
      eyebrow: 'Часто задаваемые',
      title: 'Вопросы и ответы',
      subtitle: 'То, что нас спрашивают чаще всего — до, во время и после проекта.',
      still_asking: 'Не нашли ответ?',
      still_asking_desc: 'Отвечаем в WhatsApp в рабочие часы. Живые люди, без ботов.',
      items: [
        {
          q: 'В чём разница между мрамором, фарфором и Caesarstone?',
          a: 'Мрамор — натуральный камень, мягкий, уникальные прожилки, тёплое ощущение, но легко пачкается и требует пропитки. Фарфор — инженерный материал, очень прочный, устойчив к пятнам и жару, бесконечные дизайны включая имитацию мрамора. Caesarstone — израильский кварц, 90% натуральный кварц на смоле, непористый, устойчив почти ко всему кроме прямого высокого тепла.'
        },
        {
          q: 'Сколько времени занимает производство от замера до установки?',
          a: 'Обычно 6-8 недель с момента финального замера на объекте, в зависимости от материала, размера и вырезов (мойка, варочная, профиль края). Срочные заказы возможны за доплату.'
        },
        {
          q: 'Есть ли гарантия?',
          a: 'Да — 10 лет на производственные дефекты и качество работы. Натуральный камень имеет уведомление о врождённых несовершенствах; фарфор и кварц покрываются полностью.'
        },
        {
          q: 'Предоставляете ли вы 3D-дизайн до производства?',
          a: 'Каждая консультация включает подробную 3D-визуализацию столешницы или установки, чтобы вы могли одобрить дизайн до того, как мы разрежем плиту.'
        },
        {
          q: 'Доставляете и устанавливаете по всему Израилю?',
          a: 'Да — по всей стране, от Метулы до Эйлата. Стоимость доставки зависит от расстояния и доступа; север включён в стандартную цену.'
        },
        {
          q: 'Могу ли я посетить шоу-рум на фабрике?',
          a: 'Да, по предварительной записи. Предпочитаем запланированные визиты, чтобы дизайнер провёл вас по образцам материалов и ответил на вопросы. Пишите в WhatsApp для записи.'
        },
        {
          q: 'В чём разница между полированной, матовой и шлифованной отделкой?',
          a: 'Полированная — глянцевая, зеркальная, отражает свет. Матовая (или шёлк) — гладкая без блеска. Шлифованная — гладко-матовая, но сильнее показывает природный характер камня. Выбор в основном эстетический — прочность одинаковая.'
        },
        {
          q: 'Как ухаживать за мраморной поверхностью? Будет ли пятна?',
          a: 'Мрамор требует пропитки раз в 6-12 месяцев и немедленной уборки кислотных пятен (вино, лимон, помидор). Используйте средство, безопасное для камня, никогда не кислотное. Фарфор и Caesarstone не требуют такого ухода — просто мыло и вода.'
        },
        {
          q: 'Как рассчитывается цена?',
          a: 'За квадратный метр выбранного материала, плюс обработка кромок, вырезы и установка. Цены сильно варьируются: Caesarstone от ~1200 шек/м², средний фарфор от ~1800 шек/м², редкий мрамор может быть значительно дороже. Бесплатные оценки по запросу.'
        },
        {
          q: 'Могу ли я выбрать конкретную плиту?',
          a: 'Для натурального камня — да, приглашаем вас посмотреть и забронировать конкретные плиты в шоу-руме, так как двух одинаковых не бывает. Для инженерных материалов — узор постоянный и выбор плиты не требуется.'
        }
      ]
    },
    // Process Page
    process: {
      title: 'Методология',
      subtitle: 'Точное планирование встречается с мастерским исполнением.',
      start_project: 'Начать проект',
      book_consultation: 'Записаться на консультацию',
      steps: {
        consultation: { title: 'Консультация', description: 'Встречаемся, чтобы обсудить ваше видение, потребности и бюджет.' },
        design:       { title: 'Дизайн и план', description: 'Наши дизайнеры создают индивидуальный 3D-план вашего пространства.' },
        measurements: { title: 'Замеры', description: 'Точные лазерные замеры выполняются у вас дома.' },
        production:   { title: 'Производство', description: 'Ваша поверхность изготавливается на нашей современной фабрике.' },
        installation: { title: 'Установка', description: 'Профессиональная доставка и установка нашей командой экспертов.' },
        warranty:     { title: 'Гарантия', description: 'Наслаждайтесь новыми поверхностями с нашей полной поддержкой и гарантией.' }
      }
    },
    // Materials Page
    materials: {
      title: 'Материальность',
      subtitle: 'Душа дома заключается в материалах. Мы поставляем лучшие фарфор и природный камень со всего мира.',
      section_stone: 'Фарфор и камень',
      section_finishes: 'Отделки поверхностей',
      porcelain_title: 'Фарфор',
      porcelain_desc: 'Ультра-компактные поверхности, идеально подходящие для современных кухонь. Устойчивые к нагреву, царапинам, доступные в потрясающих дизайнах.',
      caesarstone_title: 'Caesarstone',
      caesarstone_desc: 'Израильский стандарт кварцевых поверхностей. Прочный, практичный и красивый для повседневного использования.',
      marble_title: 'Натуральный мрамор',
      marble_desc: 'Вечная красота из Италии и Греции. Для тех, кто ценит уникальные несовершенства и характер природы.',
      finish_polished: 'Полированный',
      finish_polished_desc: 'Классический глянцевый блеск, отражающий свет.',
      finish_matte: 'Матовый / Шёлк',
      finish_matte_desc: 'Гладкая, отражающая поверхность, мягкое прикосновение.',
      finish_concrete: 'Бетон',
      finish_concrete_desc: 'Промышленная текстура и ощущение.',
      finish_honed: 'Гладкий',
      finish_honed_desc: 'Гладкая матовая отделка с естественной аутентичностью камня.'
    },
    // Legal Pages
    privacy: {
      nav_home: 'Главная',
      nav_privacy: 'Политика конфиденциальности',
      title: 'Политика конфиденциальности',
      subtitle: 'Эта политика объясняет, как мы собираем, используем и защищаем вашу личную информацию.',
      last_updated: 'Последнее обновление',
      reading_time: 'Время чтения',
      minutes: 'минут',
      language: 'Язык',
      table_of_contents: 'Содержание',
      toc_introduction: 'Введение и личность контролёра данных',
      toc_dataCollected: 'Какую информацию мы собираем',
      toc_purposeBasis: 'Цель и правовая основа',
      toc_dataRecipients: 'Кто получает вашу информацию',
      toc_internationalTransfer: 'Международная передача данных',
      toc_retention: 'Сроки хранения данных',
      toc_consequences: 'Последствия непредоставления информации',
      toc_yourRights: 'Ваши права согласно Закону о защите конфиденциальности',
      toc_complaint: 'Право на подачу жалобы в орган',
      toc_cookies: 'Файлы cookie',
      toc_automatedDecisions: 'Автоматические решения и искусственный интеллект',
      toc_security: 'Безопасность информации',
      toc_updates: 'Обновления политики',
      toc_gdprAddendum: 'Дополнение GDPR для жителей Европы'
    },
    terms: {
      nav_home: 'Главная',
      nav_terms: 'Условия использования',
      title: 'Условия использования',
      subtitle: 'Пожалуйста, внимательно прочитайте эти условия перед использованием нашего сайта.',
      last_updated: 'Последнее обновление',
      introduction: 'Введение',
      acceptance: 'Принятие условий',
      services: 'Наши услуги',
      user_responsibilities: 'Ответственность пользователя',
      intellectual_property: 'Интеллектуальная собственность',
      limitation: 'Ограничение ответственности',
      indemnification: 'Возмещение убытков',
      termination: 'Прекращение',
      governing_law: 'Применимое право',
      changes: 'Изменения в условиях',
      contact_us: 'Связаться с нами'
    },
    accessibility: {
      nav_home: 'Главная',
      nav_accessibility: 'Заявление о доступности',
      title: 'Заявление о доступности',
      subtitle: 'Наши обязательства по доступности для всех пользователей.',
      commitment: 'Наши обязательства',
      improvement: 'Непрерывное улучшение',
      measures: 'Технические меры',
      standards: 'Стандарты доступности',
      feedback: 'Обратная связь и помощь',
      contact: 'Связаться по вопросам доступности'
    },
    gdpr: {
      nav_home: 'Главная',
      nav_gdpr: 'Запрос GDPR',
      title: 'Запрос субъекта данных GDPR',
      subtitle: 'Осуществите свои права на данные в соответствии с GDPR.',
      your_rights: 'Ваши права в соответствии с GDPR',
      access_request: 'Право на доступ',
      rectification_request: 'Право на исправление',
      erasure_request: 'Право на удаление',
      restriction_request: 'Право на ограничение обработки',
      portability_request: 'Право на переносимость данных',
      objection_request: 'Право на возражение',
      form_name: 'Полное имя',
      form_email: 'Адрес электронной почты',
      form_request_type: 'Тип запроса',
      form_message: 'Дополнительные сведения',
      form_submit: 'Отправить запрос',
      form_success: 'Запрос успешно отправлен',
      form_success_desc: 'Мы обработаем ваш запрос в течение 30 дней.',
      form_error: 'Пожалуйста, заполните все обязательные поля.',
      types: {
        access: 'Я хочу знать, какие персональные данные вы обо мне имеете',
        rectify: 'Я хочу исправить неточные персональные данные',
        erase: 'Я хочу удалить мои персональные данные',
        restrict: 'Я хочу ограничить использование моих персональных данных',
        port: 'Я хочу получить свои персональные данные в машиночитаемом формате',
        object: 'Я возражаю против того, как используются мои персональные данные'
      }
    }
  }
};