/**
 * Cookie Consent Banner
 * Amendment 13 (Israel Privacy Protection Law) Compliant
 * GTM Consent Mode v2 Integration
 *
 * Signals: analytics_storage, ad_storage, ad_user_data, ad_personalization
 * Built: 2025-02-23
 *
 * Features:
 * - Granular consent (Necessary, Analytics, Marketing)
 * - localStorage persistence (12 months)
 * - RTL/LTR support
 * - 4 languages: Hebrew (he), Arabic (ar), English (en), Russian (ru)
 * - Keyboard accessible
 * - ARIA compliant
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

// Types
export type CookieLanguage = 'he' | 'ar' | 'en' | 'ru';

export interface CookieConsent {
  version: string;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  language: CookieLanguage;
  expires: string;
}

interface CookieBannerProps {
  gtmId?: string;
  privacyPolicyUrl?: string;
  contactEmail?: string;
}

const STORAGE_KEY = 'cookieConsent';
const CONSENT_VERSION = '1.0';
const EXPIRY_MONTHS = 12;

// Language definitions
const translations: Record<CookieLanguage, {
  title: string;
  description: string;
  necessary: { label: string; description: string };
  analytics: { label: string; description: string };
  marketing: { label: string; description: string };
  acceptAll: string;
  rejectAll: string;
  customize: string;
  savePreferences: string;
  privacyPolicy: string;
  privacyLink: string;
  aria: { banner: string; customize: string; close: string };
}> = {
  he: {
    title: 'שימוש בקובצי Cookie',
    description: 'אנו משתמשים בקובצי Cookie כדי לשפר את חוויית השימוש שלך, לנתח את הפעילות באתר ולהציג פרסומות רלוונטיות. אנא בחר את סוגי ה-Cookie שאתה מאשר.',
    necessary: {
      label: 'קובצי Cookie נדרשים',
      description: 'נדרשים לתפקוד האתר. אין שיתוף נתונים אישיים. תמיד פעיל.'
    },
    analytics: {
      label: 'ניתוח וסטטיסטיקה',
      description: 'Google Analytics — צפיות בדף, משך הביקור. הנתונים נשלחים לשרתי Google. אין נתונים מזהים אישית. שימוש לשיפור האתר.'
    },
    marketing: {
      label: 'שיווק ופרסום',
      description: 'Facebook Pixel, Google Ads — משמש להצגת פרסומות רלוונטיות. נתונים משותפים עם Meta ו-Google למטרות מיקוד פרסומות ומעקב המרות.'
    },
    acceptAll: 'קבל הכל',
    rejectAll: 'דחה הכל',
    customize: 'התאם אישית',
    savePreferences: 'שמור העדפות',
    privacyPolicy: 'מדיניות הפרטיות שלנו',
    privacyLink: 'קרא את מדיניות הפרטיות',
    aria: {
      banner: 'הודעת הסכמה לקובצי Cookie',
      customize: 'הרחב אפשרויות התאמה אישית',
      close: 'סגור הודעת Cookie'
    }
  },
  ar: {
    title: 'استخدام ملفات تعريف الارتباط',
    description: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك، وتحليل نشاط الموقع، وعرض الإعلانات ذات الصلة. يرجى اختيار أنواع ملفات تعريف الارتباط التي تسمح بها.',
    necessary: {
      label: 'ملفات تعريف الارتباط الضرورية',
      description: 'مطلوبة لتشغيل الموقع. لا تشارك بيانات شخصية. دائماً مفعلة.'
    },
    analytics: {
      label: 'التحليل والإحصائيات',
      description: 'Google Analytics — مشاهدات الصفحة، مدة الجلسة. البيانات ترسل إلى خوادم Google. لا بيانات تعريف شخصية. تستخدم لتحسين الموقع.'
    },
    marketing: {
      label: 'التسويق والإعلانات',
      description: 'Facebook Pixel، Google Ads — يستخدم لعرض الإعلانات ذات الصلة. البيانات تشارك مع Meta و Google لاستهداف الإعلانات وتتبع التحويلات.'
    },
    acceptAll: 'قبول الكل',
    rejectAll: 'رفض الكل',
    customize: 'تخصيص',
    savePreferences: 'حفظ التفضيلات',
    privacyPolicy: 'سياسة الخصوصية الخاصة بنا',
    privacyLink: 'اقرأ سياسة الخصوصية',
    aria: {
      banner: 'إشعار موافقة ملفات تعريف الارتباط',
      customize: 'توسيع خيارات التخصيص',
      close: 'إغلاق إشعار ملفات تعريف الارتباط'
    }
  },
  en: {
    title: 'Cookie Usage',
    description: 'We use cookies to improve your experience, analyze site activity, and show relevant ads. Please select the types of cookies you allow.',
    necessary: {
      label: 'Necessary Cookies',
      description: 'Required for the site to function. No personal data shared. Always active.'
    },
    analytics: {
      label: 'Analytics & Statistics',
      description: 'Google Analytics — page views, session duration. Data sent to Google servers. No personally identifiable data. Used to improve the site.'
    },
    marketing: {
      label: 'Marketing & Advertising',
      description: 'Facebook Pixel, Google Ads — used to show relevant ads. Data shared with Meta and Google for ad targeting and conversion tracking.'
    },
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    savePreferences: 'Save Preferences',
    privacyPolicy: 'Our Privacy Policy',
    privacyLink: 'Read Privacy Policy',
    aria: {
      banner: 'Cookie consent notice',
      customize: 'Expand customization options',
      close: 'Close cookie notice'
    }
  },
  ru: {
    title: 'Использование файлов cookie',
    description: 'Мы используем файлы cookie для улучшения вашего опыта, анализа активности сайта и показа релевантной рекламы. Пожалуйста, выберите типы файлов cookie, которые вы разрешаете.',
    necessary: {
      label: 'Необходимые файлы cookie',
      description: 'Необходимы для работы сайта. Личные данные не передаются. Всегда активны.'
    },
    analytics: {
      label: 'Аналитика и статистика',
      description: 'Google Analytics — просмотры страниц, длительность сессии. Данные отправляются на серверы Google. Без персональных данных. Используется для улучшения сайта.'
    },
    marketing: {
      label: 'Маркетинг и реклама',
      description: 'Facebook Pixel, Google Ads — используется для показа релевантной рекламы. Данные передаются Meta и Google для таргетинга рекламы и отслеживания конверсий.'
    },
    acceptAll: 'Принять все',
    rejectAll: 'Отклонить все',
    customize: 'Настроить',
    savePreferences: 'Сохранить настройки',
    privacyPolicy: 'Наша политика конфиденциальности',
    privacyLink: 'Читать политику конфиденциальности',
    aria: {
      banner: 'Уведомление о согласии на использование файлов cookie',
      customize: 'Раскрыть параметры настройки',
      close: 'Закрыть уведомление о файлах cookie'
    }
  }
};

// RTL language check
const isRTL = (lang: CookieLanguage): boolean => lang === 'he' || lang === 'ar';

// Get direction attribute
const getDir = (lang: CookieLanguage): 'rtl' | 'ltr' => isRTL(lang) ? 'rtl' : 'ltr';

// Detect language from browser or fallback
const detectLanguage = (): CookieLanguage => {
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('he')) return 'he';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('ru')) return 'ru';
  return 'en';
};

// Check if consent is valid and not expired
const isConsentValid = (consent: CookieConsent): boolean => {
  if (!consent || !consent.timestamp || !consent.expires) return false;
  return new Date(consent.expires) > new Date();
};

// Initialize GTM dataLayer with default consent (denied)
const initializeGTMConsent = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // Push default consent state BEFORE GTM loads
  window.dataLayer.push({
    'event': 'default_consent_default',
    'consent_default': true
  });
};

// Update GTM consent based on user preferences
const updateGTMConsent = (analytics: boolean, marketing: boolean) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // gtag function for Consent Mode v2
  window.gtag = window.gtag || function() {
    window.dataLayer.push(arguments);
  };

  // Update consent with Granted/Denied for each category
  window.gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
    wait_for_update: 2000
  });

  // Push event for GTM triggers
  window.dataLayer.push({
    event: 'cookie_consent_update',
    consent_analytics: analytics,
    consent_marketing: marketing
  });
};

// Save consent to localStorage
const saveConsent = (analytics: boolean, marketing: boolean, language: CookieLanguage): void => {
  const now = new Date();
  const expires = new Date();
  expires.setMonth(expires.getMonth() + EXPIRY_MONTHS);

  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    marketing,
    timestamp: now.toISOString(),
    language,
    expires: expires.toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
};

// Load consent from localStorage
const loadConsent = (): CookieConsent | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const consent: CookieConsent = JSON.parse(stored);
    return isConsentValid(consent) ? consent : null;
  } catch {
    return null;
  }
};

// Clear expired consent
const clearExpiredConsent = (): void => {
  const consent = loadConsent();
  if (consent && !isConsentValid(consent)) {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const CookieBanner: React.FC<CookieBannerProps> = ({
  gtmId = 'GTM-XXXXXXX',
  privacyPolicyUrl = '/privacy-policy',
  contactEmail
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [language, setLanguage] = useState<CookieLanguage>(detectLanguage());
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize on mount
  useEffect(() => {
    clearExpiredConsent();

    // Check if user already consented
    const existingConsent = loadConsent();

    if (existingConsent) {
      // Restore consent and update GTM
      setAnalytics(existingConsent.analytics);
      setMarketing(existingConsent.marketing);
      setLanguage(existingConsent.language);
      updateGTMConsent(existingConsent.analytics, existingConsent.marketing);
      // Don't show banner if already consented
      return;
    }

    // Initialize GTM with default consent (all denied)
    initializeGTMConsent();

    // Show banner after a short delay for better UX
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle accept all
  const handleAcceptAll = useCallback(() => {
    setAnalytics(true);
    setMarketing(true);
    saveConsent(true, true, language);
    updateGTMConsent(true, true);
    handleClose();
  }, [language]);

  // Handle reject all
  const handleRejectAll = useCallback(() => {
    setAnalytics(false);
    setMarketing(false);
    saveConsent(false, false, language);
    updateGTMConsent(false, false);
    handleClose();
  }, [language]);

  // Handle save preferences
  const handleSavePreferences = useCallback(() => {
    saveConsent(analytics, marketing, language);
    updateGTMConsent(analytics, marketing);
    handleClose();
  }, [analytics, marketing, language]);

  // Close banner with animation
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  // Handle keyboard escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when banner is open
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const dir = getDir(language);
  const t = translations[language];
  const isRtl = isRTL(language);

  return (
    <div
      role="dialog"
      aria-label={t.aria.banner}
      aria-live="polite"
      dir={dir}
      className={`fixed bottom-0 left-0 right-0 z-[9999] bg-secondary/98 backdrop-blur-md border-t border-neutral-700 shadow-2xl transition-all duration-300 ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Close button (X) */}
      <button
        onClick={handleClose}
        aria-label={t.aria.close}
        className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} text-muted hover:text-light transition-colors p-1`}
      >
        <X size={20} />
      </button>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 pr-12">
            <h2 className="text-lg font-bold text-light mb-3 font-serif">
              {t.title}
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              {t.description}
            </p>

            {!isExpanded && (
              <a
                href={privacyPolicyUrl}
                className="text-sm text-accent hover:text-light transition-colors underline underline-offset-2"
              >
                {t.privacyLink}
              </a>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:items-start">
            {!isExpanded ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-accent text-white text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors rounded-sm"
                  aria-label={t.acceptAll}
                >
                  {t.acceptAll}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 bg-transparent border border-neutral-600 text-light text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-sm"
                  aria-label={t.rejectAll}
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-6 py-3 text-accent text-sm font-bold uppercase tracking-wider hover:text-light transition-colors flex items-center gap-2"
                  aria-label={t.aria.customize}
                  aria-expanded={isExpanded ? 'true' : 'false'}
                >
                  {t.customize}
                  <ChevronUp size={16} className={isExpanded ? 'rotate-180' : ''} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-accent text-sm font-bold uppercase tracking-wider hover:text-light transition-colors flex items-center gap-2"
                aria-label={t.aria.customize}
                aria-expanded={isExpanded ? 'true' : 'false'}
              >
                {t.customize}
                <ChevronDown size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Expanded customization panel */}
        {isExpanded && (
          <div
            className="mt-6 pt-6 border-t border-neutral-700 animate-in slide-in-from-top-2 duration-300"
            role="region"
            aria-label={t.customize}
          >
            {/* Necessary Cookies - Always ON */}
            <div className="mb-5 p-4 bg-neutral-800/50 rounded-sm border border-neutral-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-sm bg-accent/20 border-2 border-accent flex items-center justify-center">
                    <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-light mb-1">{t.necessary.label}</h3>
                  <p className="text-xs text-muted leading-relaxed">{t.necessary.description}</p>
                </div>
              </div>
            </div>

            {/* Analytics Toggle */}
            <div className="mb-5 p-4 bg-neutral-800/30 rounded-sm border border-neutral-700 hover:border-neutral-600 transition-colors">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setAnalytics(!analytics)}
                  role="switch"
                  aria-checked={analytics}
                  aria-label={`${t.analytics.label}: ${analytics ? 'enabled' : 'disabled'}`}
                  className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary ${
                    analytics ? 'bg-accent' : 'bg-neutral-600'
                  }`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setAnalytics(!analytics);
                    }
                  }}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      analytics ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-light mb-1">{t.analytics.label}</h3>
                  <p className="text-xs text-muted leading-relaxed">{t.analytics.description}</p>
                </div>
              </div>
            </div>

            {/* Marketing Toggle */}
            <div className="mb-5 p-4 bg-neutral-800/30 rounded-sm border border-neutral-700 hover:border-neutral-600 transition-colors">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setMarketing(!marketing)}
                  role="switch"
                  aria-checked={marketing}
                  aria-label={`${t.marketing.label}: ${marketing ? 'enabled' : 'disabled'}`}
                  className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary ${
                    marketing ? 'bg-accent' : 'bg-neutral-600'
                  }`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setMarketing(!marketing);
                    }
                  }}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      marketing ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-light mb-1">{t.marketing.label}</h3>
                  <p className="text-xs text-muted leading-relaxed">{t.marketing.description}</p>
                </div>
              </div>
            </div>

            {/* Language selector and save button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t border-neutral-700">
              {/* Language switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted uppercase tracking-wider">{t.privacyPolicy}:</span>
                <div className="flex gap-1">
                  {(['he', 'ar', 'en', 'ru'] as CookieLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      aria-label={`Switch to ${lang === 'he' ? 'Hebrew' : lang === 'ar' ? 'Arabic' : lang === 'en' ? 'English' : 'Russian'}`}
                      className={`px-2 py-1 text-xs font-bold uppercase rounded transition-colors ${
                        language === lang
                          ? 'bg-accent text-white'
                          : 'bg-neutral-700 text-muted hover:text-light'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <a
                  href={privacyPolicyUrl}
                  className="text-sm text-muted hover:text-accent transition-colors underline underline-offset-2"
                >
                  {t.privacyLink}
                </a>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-3 bg-accent text-white text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors rounded-sm whitespace-nowrap"
                >
                  {t.savePreferences}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;

// Export utility functions for external use
export const cookieUtils = {
  loadConsent,
  saveConsent,
  clearExpiredConsent,
  updateGTMConsent,
  isConsentValid
};
