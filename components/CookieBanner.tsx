/**
 * Cookie Consent — Amendment 13 compliant — GTM Consent Mode v2
 * Signals: analytics_storage, ad_storage, ad_user_data, ad_personalization
 * Built: 2026-02-23
 *
 * Compliance: Israel Privacy Protection Law Amendment 13 (August 2025)
 * - Explicit consent (user action required)
 * - Granular controls (3 categories)
 * - Documented consent (localStorage with timestamp)
 * - Informed consent (descriptions for each category)
 * - 12-month consent expiry
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

// ============ CONFIGURATION ============
const COOKIE_CONFIG = {
  storageKey: 'cookieConsent',
  version: '1.0',
  expiryMonths: 12,
  brandColor: '#b8860b',
  brandColorDark: '#9a7209',
  privacyPolicyUrl: '/privacy-policy',
  // GTM Container ID - set when ready to use GTM
  gtmContainerId: '', // e.g., 'GTM-XXXXXXX'
};

// ============ TYPES ============
interface ConsentState {
  version: string;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  language: string;
  expires: string;
}

interface ConsentEvent {
  event: 'cookie_consent_update';
  consent_analytics: boolean;
  consent_marketing: boolean;
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

// ============ CONSENT MANAGEMENT ============
const getStoredConsent = (): ConsentState | null => {
  try {
    const stored = localStorage.getItem(COOKIE_CONFIG.storageKey);
    if (!stored) return null;

    const consent: ConsentState = JSON.parse(stored);

    // Check if consent has expired
    const expiresAt = new Date(consent.expires);
    if (new Date() > expiresAt) {
      localStorage.removeItem(COOKIE_CONFIG.storageKey);
      return null;
    }

    return consent;
  } catch {
    return null;
  }
};

const saveConsent = (analytics: boolean, marketing: boolean, language: string): void => {
  const now = new Date();
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + COOKIE_CONFIG.expiryMonths);

  const consent: ConsentState = {
    version: COOKIE_CONFIG.version,
    analytics,
    marketing,
    timestamp: now.toISOString(),
    language,
    expires: expires.toISOString(),
  };

  localStorage.setItem(COOKIE_CONFIG.storageKey, JSON.stringify(consent));
};

const updateGtmConsent = (analytics: boolean, marketing: boolean): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    });

    // Push event for GTM tag triggers
    const consentEvent: ConsentEvent = {
      event: 'cookie_consent_update',
      consent_analytics: analytics,
      consent_marketing: marketing,
    };
    window.dataLayer.push(consentEvent);
  }
};

// ============ COMPONENT ============
const CookieBanner: React.FC = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const existingConsent = getStoredConsent();
    if (existingConsent) {
      // Update GTM with existing consent
      updateGtmConsent(existingConsent.analytics, existingConsent.marketing);
      // Don't show banner
      setIsVisible(false);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-detect language from browser
  useEffect(() => {
    if (!getStoredConsent()) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs: Language[] = ['he', 'ar', 'en', 'ru'];
      if (supportedLangs.includes(browserLang as Language)) {
        setLanguage(browserLang as Language);
      }
    }
  }, [setLanguage]);

  const handleAcceptAll = useCallback(() => {
    setAnalytics(true);
    setMarketing(true);
    saveConsent(true, true, language);
    updateGtmConsent(true, true);
    setIsVisible(false);
  }, [language]);

  const handleRejectAll = useCallback(() => {
    setAnalytics(false);
    setMarketing(false);
    saveConsent(false, false, language);
    updateGtmConsent(false, false);
    setIsVisible(false);
  }, [language]);

  const handleSavePreferences = useCallback(() => {
    saveConsent(analytics, marketing, language);
    updateGtmConsent(analytics, marketing);
    setIsVisible(false);
  }, [analytics, marketing, language]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  if (!isVisible) return null;

  const cookiesT = t('cookies');
  const categoriesT = cookiesT?.categories || {};

  const languages: { code: Language; label: string }[] = [
    { code: 'he', label: 'עב' },
    { code: 'ar', label: 'عر' },
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
  ];

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      dir={dir}
      className="cookie-banner"
    >
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: #ffffff;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
          font-family: 'Assistant', 'Heebo', sans-serif;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .cookie-banner__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
        }

        .cookie-banner__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .cookie-banner__title {
          font-size: 1.25rem;
          font-weight: 700;
          color: ${COOKIE_CONFIG.brandColor};
          margin: 0 0 0.5rem 0;
        }

        .cookie-banner__description {
          font-size: 0.9rem;
          color: #b0b0b0;
          margin: 0;
          line-height: 1.5;
        }

        .cookie-banner__lang-switcher {
          display: flex;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem;
          border-radius: 0.5rem;
        }

        .cookie-banner__lang-btn {
          padding: 0.35rem 0.6rem;
          border: none;
          background: transparent;
          color: #b0b0b0;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .cookie-banner__lang-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .cookie-banner__lang-btn--active {
          background: ${COOKIE_CONFIG.brandColor};
          color: #ffffff;
        }

        .cookie-banner__lang-btn:focus {
          outline: 2px solid ${COOKIE_CONFIG.brandColor};
          outline-offset: 2px;
        }

        .cookie-banner__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .cookie-banner__btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .cookie-banner__btn:focus {
          outline: 2px solid ${COOKIE_CONFIG.brandColor};
          outline-offset: 2px;
        }

        .cookie-banner__btn--primary {
          background: ${COOKIE_CONFIG.brandColor};
          color: #ffffff;
        }

        .cookie-banner__btn--primary:hover {
          background: ${COOKIE_CONFIG.brandColorDark};
          transform: translateY(-1px);
        }

        .cookie-banner__btn--secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cookie-banner__btn--secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .cookie-banner__btn--link {
          background: transparent;
          color: ${COOKIE_CONFIG.brandColor};
          padding: 0.75rem 1rem;
        }

        .cookie-banner__btn--link:hover {
          text-decoration: underline;
        }

        .cookie-banner__expand-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: ${COOKIE_CONFIG.brandColor};
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.75rem;
          padding: 0;
        }

        .cookie-banner__expand-btn:hover {
          text-decoration: underline;
        }

        .cookie-banner__expand-btn:focus {
          outline: 2px solid ${COOKIE_CONFIG.brandColor};
          outline-offset: 2px;
        }

        .cookie-banner__categories {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cookie-banner__category {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cookie-banner__category:last-child {
          border-bottom: none;
        }

        .cookie-banner__category-content {
          flex: 1;
        }

        .cookie-banner__category-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .cookie-banner__category-title {
          font-weight: 600;
          color: #ffffff;
          font-size: 0.95rem;
          margin: 0;
        }

        .cookie-banner__category-badge {
          background: rgba(255, 255, 255, 0.15);
          color: #b0b0b0;
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }

        .cookie-banner__category-description {
          font-size: 0.8rem;
          color: #888;
          line-height: 1.5;
          margin: 0;
        }

        .cookie-banner__toggle {
          position: relative;
          width: 48px;
          height: 26px;
          flex-shrink: 0;
        }

        .cookie-banner__toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .cookie-banner__toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          transition: 0.3s;
          border-radius: 26px;
        }

        .cookie-banner__toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        .cookie-banner__toggle input:checked + .cookie-banner__toggle-slider {
          background-color: ${COOKIE_CONFIG.brandColor};
        }

        .cookie-banner__toggle input:checked + .cookie-banner__toggle-slider:before {
          transform: translateX(22px);
        }

        .cookie-banner__toggle input:focus + .cookie-banner__toggle-slider {
          box-shadow: 0 0 0 2px ${COOKIE_CONFIG.brandColor};
        }

        .cookie-banner__toggle--disabled .cookie-banner__toggle-slider {
          background-color: ${COOKIE_CONFIG.brandColor};
          cursor: not-allowed;
        }

        .cookie-banner__footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .cookie-banner__privacy-link {
          color: ${COOKIE_CONFIG.brandColor};
          text-decoration: none;
          font-size: 0.85rem;
        }

        .cookie-banner__privacy-link:hover {
          text-decoration: underline;
        }

        /* RTL Adjustments */
        [dir="rtl"] .cookie-banner__toggle-slider:before {
          left: auto;
          right: 3px;
        }

        [dir="rtl"] .cookie-banner__toggle input:checked + .cookie-banner__toggle-slider:before {
          transform: translateX(-22px);
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .cookie-banner__container {
            padding: 1rem;
          }

          .cookie-banner__header {
            flex-direction: column;
            gap: 0.75rem;
          }

          .cookie-banner__lang-switcher {
            align-self: flex-start;
          }

          .cookie-banner__actions {
            flex-direction: column;
          }

          .cookie-banner__btn {
            width: 100%;
            justify-content: center;
          }

          .cookie-banner__category {
            flex-direction: column;
            gap: 0.5rem;
          }

          .cookie-banner__toggle {
            align-self: flex-start;
          }

          .cookie-banner__footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="cookie-banner__container">
        <div className="cookie-banner__header">
          <div>
            <h2 className="cookie-banner__title">{cookiesT?.title}</h2>
            <p className="cookie-banner__description">{cookiesT?.description}</p>
          </div>

          <div className="cookie-banner__lang-switcher" role="group" aria-label="Language selection">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`cookie-banner__lang-btn ${language === lang.code ? 'cookie-banner__lang-btn--active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
                aria-pressed={language === lang.code}
                aria-label={`Switch to ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cookie-banner__actions">
          <button
            className="cookie-banner__btn cookie-banner__btn--primary"
            onClick={handleAcceptAll}
          >
            <Check size={18} />
            {cookiesT?.accept_all}
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--secondary"
            onClick={handleRejectAll}
          >
            <X size={18} />
            {cookiesT?.reject_all}
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {cookiesT?.customize}
          </button>
        </div>

        {isExpanded && (
          <div className="cookie-banner__categories">
            {/* Necessary Cookies - Always On */}
            <div className="cookie-banner__category">
              <div className="cookie-banner__category-content">
                <div className="cookie-banner__category-header">
                  <h3 className="cookie-banner__category-title">
                    {categoriesT?.necessary?.title}
                  </h3>
                  <span className="cookie-banner__category-badge">
                    {categoriesT?.necessary?.always_on}
                  </span>
                </div>
                <p className="cookie-banner__category-description">
                  {categoriesT?.necessary?.description}
                </p>
              </div>
              <div className="cookie-banner__toggle cookie-banner__toggle--disabled">
                <span className="cookie-banner__toggle-slider" />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="cookie-banner__category">
              <div className="cookie-banner__category-content">
                <div className="cookie-banner__category-header">
                  <h3 className="cookie-banner__category-title">
                    {categoriesT?.analytics?.title}
                  </h3>
                </div>
                <p className="cookie-banner__category-description">
                  {categoriesT?.analytics?.description}
                </p>
              </div>
              <label className="cookie-banner__toggle">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label={categoriesT?.analytics?.title}
                />
                <span className="cookie-banner__toggle-slider" />
              </label>
            </div>

            {/* Marketing Cookies */}
            <div className="cookie-banner__category">
              <div className="cookie-banner__category-content">
                <div className="cookie-banner__category-header">
                  <h3 className="cookie-banner__category-title">
                    {categoriesT?.marketing?.title}
                  </h3>
                </div>
                <p className="cookie-banner__category-description">
                  {categoriesT?.marketing?.description}
                </p>
              </div>
              <label className="cookie-banner__toggle">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  aria-label={categoriesT?.marketing?.title}
                />
                <span className="cookie-banner__toggle-slider" />
              </label>
            </div>

            <div className="cookie-banner__footer">
              <a
                href={COOKIE_CONFIG.privacyPolicyUrl}
                className="cookie-banner__privacy-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {cookiesT?.privacy_policy}
              </a>
              <button
                className="cookie-banner__btn cookie-banner__btn--primary"
                onClick={handleSavePreferences}
              >
                {cookiesT?.save_preferences}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;

// ============ GTM HEAD SNIPPET ============
/**
 * Add this to index.html <head>, BEFORE the GTM script:
 *
 * <script>
 *   window.dataLayer = window.dataLayer || [];
 *   function gtag(){dataLayer.push(arguments);}
 *   gtag('consent', 'default', {
 *     analytics_storage: 'denied',
 *     ad_storage: 'denied',
 *     ad_user_data: 'denied',
 *     ad_personalization: 'denied',
 *     wait_for_update: 2000
 *   });
 * </script>
 * <!-- Google Tag Manager -->
 * <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 * new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 * j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 * 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 * })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
 * <!-- End Google Tag Manager -->
 */
