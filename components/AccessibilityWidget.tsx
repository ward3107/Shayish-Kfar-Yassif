/**
 * Accessibility Widget
 *
 * Fully compliant with:
 * - WCAG 2.0 AA (Web Content Accessibility Guidelines)
 * - IS 5568 (Israel Standard for Accessibility)
 *
 * Features: 10 accessibility tools with localStorage persistence
 * Built: 2025-02-23
 *
 * USAGE: Add <AccessibilityWidget /> to any page
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accessibility, X, Minus, Plus, RotateCcw } from 'lucide-react';

// Types
interface A11ySettings {
  fontSize: number;
  contrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  letterSpacing: boolean;
  lineHeight: boolean;
  pauseAnimations: boolean;
  highlightHover: boolean;
}

type A11yLanguage = 'he' | 'ar' | 'en' | 'ru';

const STORAGE_KEY = 'a11ySettings';
const HIDE_WIDGET_KEY = 'a11yWidgetHidden';
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 28;
const DEFAULT_FONT_SIZE = 16;
const FONT_STEP = 2;

// Default settings
const defaultSettings: A11ySettings = {
  fontSize: DEFAULT_FONT_SIZE,
  contrast: false,
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
  letterSpacing: false,
  lineHeight: false,
  pauseAnimations: false,
  highlightHover: false,
};

// Translations
const translations: Record<A11yLanguage, {
  openLabel: string;
  closeLabel: string;
  title: string;
  fontSize: { label: string; decrease: string; increase: string };
  contrast: { label: string; enabled: string; disabled: string };
  grayscale: { label: string; enabled: string; disabled: string };
  underlineLinks: { label: string; enabled: string; disabled: string };
  readableFont: { label: string; enabled: string; disabled: string };
  letterSpacing: { label: string; enabled: string; disabled: string };
  lineHeight: { label: string; enabled: string; disabled: string };
  pauseAnimations: { label: string; enabled: string; disabled: string };
  highlightHover: { label: string; enabled: string; disabled: string };
  reset: { label: string; announcement: string };
  statement: string;
  hide: string;
  restore: string;
}> = {
  he: {
    openLabel: 'פתח כלי נגישות',
    closeLabel: 'סגור כלי נגישות',
    title: 'כלי נגישות',
    fontSize: {
      label: 'גודל טקסט',
      decrease: 'הקטן טקסט',
      increase: 'הגדל טקסט'
    },
    contrast: {
      label: 'ניגודיות גבוהה',
      enabled: 'מצב ניגודיות גבוהה הופעל',
      disabled: 'מצב ניגודיות גבוהה כובה'
    },
    grayscale: {
      label: 'גווני אפור',
      enabled: 'מצב גווני אפור הופעל',
      disabled: 'מצב גווני אפור כובה'
    },
    underlineLinks: {
      label: 'הדגשת קישורים',
      enabled: 'הדגשת קישורים הופעלה',
      disabled: 'הדגשת קישורים כובתה'
    },
    readableFont: {
      label: 'פונט קריא',
      enabled: 'פונט קריא הופעל',
      disabled: 'פונט קריא כובה'
    },
    letterSpacing: {
      label: 'ריווח אותיות',
      enabled: 'ריווח אותיות הופעל',
      disabled: 'ריווח אותיות כובה'
    },
    lineHeight: {
      label: 'גובה שורה',
      enabled: 'גובה שורה הופעל',
      disabled: 'גובה שורה כובה'
    },
    pauseAnimations: {
      label: 'השהה אנימציות',
      enabled: 'אנימציות הושהו',
      disabled: 'אנימציות הופעלו מחדש'
    },
    highlightHover: {
      label: 'הדגשה בעכבר/פוקוס',
      enabled: 'הדגשה בעכבר הופעלה',
      disabled: 'הדגשה בעכבר כובתה'
    },
    reset: {
      label: 'אפס הכל',
      announcement: 'כל הגדרות הנגישות אופסו'
    },
    statement: 'הצהרת נגישות',
    hide: 'הסתר את הכלי',
    restore: 'נגישות'
  },
  ar: {
    openLabel: 'فتح أدوات إمكانية الوصول',
    closeLabel: 'إغلاق أدوات إمكانية الوصول',
    title: 'أدوات إمكانية الوصول',
    fontSize: {
      label: 'حجم النص',
      decrease: 'تصغير النص',
      increase: 'تكبير النص'
    },
    contrast: {
      label: 'تباين عالي',
      enabled: 'تم تفعيل التباين العالي',
      disabled: 'تم إيقاف التباين العالي'
    },
    grayscale: {
      label: 'تدرج رمادي',
      enabled: 'تم تفعيل التدرج الرمادي',
      disabled: 'تم إيقاف التدرج الرمادي'
    },
    underlineLinks: {
      label: 'تسطير الروابط',
      enabled: 'تم تفعيل تسطير الروابط',
      disabled: 'تم إيقاف تسطير الروابط'
    },
    readableFont: {
      label: 'خط سهل القراءة',
      enabled: 'تم تفعيل الخط سهل القراءة',
      disabled: 'تم إيقاف الخط سهل القراءة'
    },
    letterSpacing: {
      label: 'تباعد الأحرف',
      enabled: 'تم تفعيل تباعد الأحرف',
      disabled: 'تم إيقاف تباعد الأحرف'
    },
    lineHeight: {
      label: 'ارتفاع السطر',
      enabled: 'تم تفعيل ارتفاع السطر',
      disabled: 'تم إيقاف ارتفاع السطر'
    },
    pauseAnimations: {
      label: 'إيقاف الرسوم المتحركة',
      enabled: 'تم إيقاف الرسوم المتحركة',
      disabled: 'تم إعادة تشغيل الرسوم المتحركة'
    },
    highlightHover: {
      label: 'تمييز عند التمرير/التركيز',
      enabled: 'تم تفعيل التمييز عند التمرير',
      disabled: 'تم إيقاف التمييز عند التمرير'
    },
    reset: {
      label: 'إعادة تعيين الكل',
      announcement: 'تم إعادة تعيين جميع إعدادات إمكانية الوصول'
    },
    statement: 'بيان إمكانية الوصول',
    hide: 'إخفاء الأداة',
    restore: 'إمكانية الوصول'
  },
  en: {
    openLabel: 'Open accessibility tools',
    closeLabel: 'Close accessibility tools',
    title: 'Accessibility Tools',
    fontSize: {
      label: 'Text Size',
      decrease: 'Decrease font size',
      increase: 'Increase font size'
    },
    contrast: {
      label: 'High Contrast',
      enabled: 'High contrast mode enabled',
      disabled: 'High contrast mode disabled'
    },
    grayscale: {
      label: 'Grayscale',
      enabled: 'Grayscale mode enabled',
      disabled: 'Grayscale mode disabled'
    },
    underlineLinks: {
      label: 'Underline Links',
      enabled: 'Link underlining enabled',
      disabled: 'Link underlining disabled'
    },
    readableFont: {
      label: 'Readable Font',
      enabled: 'Readable font enabled',
      disabled: 'Readable font disabled'
    },
    letterSpacing: {
      label: 'Letter Spacing',
      enabled: 'Letter spacing enabled',
      disabled: 'Letter spacing disabled'
    },
    lineHeight: {
      label: 'Line Height',
      enabled: 'Line height enabled',
      disabled: 'Line height disabled'
    },
    pauseAnimations: {
      label: 'Pause Animations',
      enabled: 'Animations paused',
      disabled: 'Animations resumed'
    },
    highlightHover: {
      label: 'Highlight on Hover',
      enabled: 'Hover highlight enabled',
      disabled: 'Hover highlight disabled'
    },
    reset: {
      label: 'Reset All',
      announcement: 'All accessibility settings have been reset'
    },
    statement: 'Accessibility Statement',
    hide: 'Hide This Tool',
    restore: 'Accessibility'
  },
  ru: {
    openLabel: 'Открыть средства доступности',
    closeLabel: 'Закрыть средства доступности',
    title: 'Средства доступности',
    fontSize: {
      label: 'Размер текста',
      decrease: 'Уменьшить размер шрифта',
      increase: 'Увеличить размер шрифта'
    },
    contrast: {
      label: 'Высокий контраст',
      enabled: 'Высокий контраст включен',
      disabled: 'Высокий контраст выключен'
    },
    grayscale: {
      label: 'Оттенки серого',
      enabled: 'Оттенки серого включены',
      disabled: 'Оттенки серого выключены'
    },
    underlineLinks: {
      label: 'Подчеркнуть ссылки',
      enabled: 'Подчеркивание ссылок включено',
      disabled: 'Подчеркивание ссылок выключено'
    },
    readableFont: {
      label: 'Читаемый шрифт',
      enabled: 'Читаемый шрифт включен',
      disabled: 'Читаемый шрифт выключен'
    },
    letterSpacing: {
      label: 'Межбуквенный интервал',
      enabled: 'Межбуквенный интервал включен',
      disabled: 'Межбуквенный интервал выключен'
    },
    lineHeight: {
      label: 'Высота строки',
      enabled: 'Высота строки включена',
      disabled: 'Высота строки выключена'
    },
    pauseAnimations: {
      label: 'Пауза анимации',
      enabled: 'Анимация приостановлена',
      disabled: 'Анимация возобновлена'
    },
    highlightHover: {
      label: 'Выделение при наведении',
      enabled: 'Выделение при наведении включено',
      disabled: 'Выделение при наведении выключено'
    },
    reset: {
      label: 'Сбросить все',
      announcement: 'Все параметры доступности сброшены'
    },
    statement: 'Заявление о доступности',
    hide: 'Скрыть виджет',
    restore: 'Доступность'
  }
};

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);
  const [lang, setLang] = useState<A11yLanguage>('he');
  const [announcement, setAnnouncement] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);

  // Detect language from browser or document
  useEffect(() => {
    const detectLang = (): A11yLanguage => {
      const docLang = document.documentElement.lang;
      if (docLang?.startsWith('he')) return 'he';
      if (docLang?.startsWith('ar')) return 'ar';
      if (docLang?.startsWith('ru')) return 'ru';
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('he')) return 'he';
      if (browserLang.startsWith('ar')) return 'ar';
      if (browserLang.startsWith('ru')) return 'ru';
      return 'en';
    };
    setLang(detectLang());
  }, []);

  // Check if widget is hidden
  useEffect(() => {
    const hidden = localStorage.getItem(HIDE_WIDGET_KEY);
    if (hidden === 'true') {
      setIsHidden(true);
    }

    // Keyboard shortcut to restore: Ctrl+Alt+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'א')) {
        e.preventDefault();
        localStorage.removeItem(HIDE_WIDGET_KEY);
        setIsHidden(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsed });
          // Apply all settings immediately
          Object.entries(parsed).forEach(([key, value]) => {
            applySetting(key as keyof A11ySettings, value as boolean | number);
          });
        }
      } catch (e) {
        console.error('Failed to load accessibility settings:', e);
      }
    };

    // Apply settings before page renders
    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save accessibility settings:', e);
    }
  }, [settings]);

  // Apply a single setting
  const applySetting = (key: keyof A11ySettings, value: boolean | number) => {
    const body = document.body;
    const html = document.documentElement;

    switch (key) {
      case 'fontSize':
        html.style.setProperty('--base-font-size', `${value}px`);
        break;

      case 'contrast':
        if (value) body.classList.add('a11y-contrast');
        else body.classList.remove('a11y-contrast');
        break;

      case 'grayscale':
        if (value) html.classList.add('a11y-gray');
        else html.classList.remove('a11y-gray');
        break;

      case 'underlineLinks':
        if (value) body.classList.add('a11y-links');
        else body.classList.remove('a11y-links');
        break;

      case 'readableFont':
        if (value) body.classList.add('a11y-font');
        else body.classList.remove('a11y-font');
        break;

      case 'letterSpacing':
        if (value) body.classList.add('a11y-spacing');
        else body.classList.remove('a11y-spacing');
        break;

      case 'lineHeight':
        if (value) body.classList.add('a11y-lh');
        else body.classList.remove('a11y-lh');
        break;

      case 'pauseAnimations':
        if (value) {
          let styleTag = document.getElementById('a11y-no-anim');
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'a11y-no-anim';
            styleTag.innerHTML = `
              *, *::before, *::after {
                animation-play-state: paused !important;
                transition-duration: 0.001ms !important;
              }
            `;
            document.head.appendChild(styleTag);
          }
        } else {
          const styleTag = document.getElementById('a11y-no-anim');
          if (styleTag) styleTag.remove();
        }
        break;

      case 'highlightHover':
        if (value) body.classList.add('a11y-highlight');
        else body.classList.remove('a11y-highlight');
        break;
    }
  };

  // Announce to screen readers
  const announce = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  };

  // Toggle a setting
  const toggleSetting = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    setSettings(prev => {
      const newValue = value;
      const newSettings = { ...prev, [key]: newValue };
      applySetting(key, newValue);

      // Generate announcement
      const t = translations[lang];
      if (key === 'contrast') {
        announce(newValue ? t.contrast.enabled : t.contrast.disabled);
      } else if (key === 'grayscale') {
        announce(newValue ? t.grayscale.enabled : t.grayscale.disabled);
      } else if (key === 'underlineLinks') {
        announce(newValue ? t.underlineLinks.enabled : t.underlineLinks.disabled);
      } else if (key === 'readableFont') {
        announce(newValue ? t.readableFont.enabled : t.readableFont.disabled);
      } else if (key === 'letterSpacing') {
        announce(newValue ? t.letterSpacing.enabled : t.letterSpacing.disabled);
      } else if (key === 'lineHeight') {
        announce(newValue ? t.lineHeight.enabled : t.lineHeight.disabled);
      } else if (key === 'pauseAnimations') {
        announce(newValue ? t.pauseAnimations.enabled : t.pauseAnimations.disabled);
      } else if (key === 'highlightHover') {
        announce(newValue ? t.highlightHover.enabled : t.highlightHover.disabled);
      }

      return newSettings;
    });
  };

  // Font size controls
  const increaseFontSize = () => {
    const newSize = Math.min(settings.fontSize + FONT_STEP, MAX_FONT_SIZE);
    toggleSetting('fontSize', newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(settings.fontSize - FONT_STEP, MIN_FONT_SIZE);
    toggleSetting('fontSize', newSize);
  };

  // Reset all settings
  const resetAll = () => {
    const t = translations[lang];

    // Remove all classes
    document.body.classList.remove(
      'a11y-contrast', 'a11y-links', 'a11y-font', 'a11y-spacing', 'a11y-lh', 'a11y-highlight'
    );
    document.documentElement.classList.remove('a11y-gray');

    // Remove animation style
    const animStyle = document.getElementById('a11y-no-anim');
    if (animStyle) animStyle.remove();

    // Reset font size
    document.documentElement.style.setProperty('--base-font-size', `${DEFAULT_FONT_SIZE}px`);

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Reset state
    setSettings(defaultSettings);

    // Announce
    announce(t.reset.announcement);
  };

  // Hide widget completely
  const hideWidget = () => {
    localStorage.setItem(HIDE_WIDGET_KEY, 'true');
    setIsHidden(true);
    setIsOpen(false);
  };

  // Restore widget
  const restoreWidget = () => {
    localStorage.removeItem(HIDE_WIDGET_KEY);
    setIsHidden(false);
  };

  // Handle keyboard - ESC to close, trap focus in panel
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<
        HTMLButtonElement | HTMLAnchorElement
      >(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    // Focus first element when panel opens
    setTimeout(() => {
      firstFocusRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const t = translations[lang];
  const isRTL = lang === 'he' || lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  // If widget is hidden, show nothing at all
  // User can restore via localStorage: DevTools → Application → Local Storage → delete 'a11yWidgetHidden'
  // Or by pressing Ctrl+Alt+A keyboard shortcut
  if (isHidden) {
    return null;
  }

  return (
    <>
      {/* ARIA Live Region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label={isOpen ? t.closeLabel : t.openLabel}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:bg-yellow-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 hover:scale-110"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <Accessibility size={28} />
      </button>

      {/* Panel Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="a11y-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-panel-title"
          dir={dir}
          className={`fixed bottom-24 right-6 w-80 max-h-[80vh] overflow-y-auto bg-secondary border border-neutral-700 shadow-2xl rounded-lg z-50 transition-all duration-300 ${
            isRTL ? 'rtl' : 'ltr'
          }`}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <h2 id="a11y-panel-title" className="text-lg font-bold text-light font-serif">
              {t.title}
            </h2>
            <button
              ref={firstFocusRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t.closeLabel}
              className="p-2 text-muted hover:text-light transition-colors rounded focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* FEATURE 1: Font Size Control */}
            <div className="p-3 bg-neutral-800/50 rounded-sm">
              <label className="text-sm font-bold text-light block mb-3">{t.fontSize.label}</label>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={decreaseFontSize}
                  aria-label={t.fontSize.decrease}
                  disabled={settings.fontSize <= MIN_FONT_SIZE}
                  className="flex items-center justify-center w-10 h-10 rounded bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <Minus size={18} />
                </button>
                <span className="text-light font-bold min-w-[50px] text-center">
                  {settings.fontSize}px
                </span>
                <button
                  type="button"
                  onClick={increaseFontSize}
                  aria-label={t.fontSize.increase}
                  disabled={settings.fontSize >= MAX_FONT_SIZE}
                  className="flex items-center justify-center w-10 h-10 rounded bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* FEATURE 2: High Contrast */}
            <button
              type="button"
              onClick={() => toggleSetting('contrast', !settings.contrast)}
              aria-pressed={settings.contrast}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.contrast
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.contrast.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.contrast ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.contrast ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 3: Grayscale */}
            <button
              type="button"
              onClick={() => toggleSetting('grayscale', !settings.grayscale)}
              aria-pressed={settings.grayscale}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.grayscale
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.grayscale.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.grayscale ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.grayscale ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 4: Underline Links */}
            <button
              type="button"
              onClick={() => toggleSetting('underlineLinks', !settings.underlineLinks)}
              aria-pressed={settings.underlineLinks}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.underlineLinks
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.underlineLinks.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.underlineLinks ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.underlineLinks ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 5: Readable Font */}
            <button
              type="button"
              onClick={() => toggleSetting('readableFont', !settings.readableFont)}
              aria-pressed={settings.readableFont}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.readableFont
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.readableFont.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.readableFont ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.readableFont ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 6: Letter Spacing */}
            <button
              type="button"
              onClick={() => toggleSetting('letterSpacing', !settings.letterSpacing)}
              aria-pressed={settings.letterSpacing}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.letterSpacing
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.letterSpacing.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.letterSpacing ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.letterSpacing ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 7: Line Height */}
            <button
              type="button"
              onClick={() => toggleSetting('lineHeight', !settings.lineHeight)}
              aria-pressed={settings.lineHeight}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.lineHeight
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.lineHeight.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.lineHeight ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.lineHeight ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 8: Pause Animations */}
            <button
              type="button"
              onClick={() => toggleSetting('pauseAnimations', !settings.pauseAnimations)}
              aria-pressed={settings.pauseAnimations}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.pauseAnimations
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.pauseAnimations.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.pauseAnimations ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.pauseAnimations ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 9: Highlight on Hover/Focus */}
            <button
              type="button"
              onClick={() => toggleSetting('highlightHover', !settings.highlightHover)}
              aria-pressed={settings.highlightHover}
              className={`w-full p-3 rounded-sm transition-colors flex items-center justify-between ${
                settings.highlightHover
                  ? 'bg-accent text-white'
                  : 'bg-neutral-800/50 text-light hover:bg-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-sm font-bold">{t.highlightHover.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.highlightHover ? 'bg-white' : 'bg-neutral-600'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.highlightHover ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* FEATURE 10: Reset All */}
            <button
              type="button"
              onClick={resetAll}
              className="w-full p-3 rounded-sm bg-neutral-700 text-light hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <RotateCcw size={16} />
              <span className="text-sm font-bold">{t.reset.label}</span>
            </button>

            {/* Hide Widget Button */}
            <button
              type="button"
              onClick={hideWidget}
              className="w-full p-3 rounded-sm bg-neutral-700 text-muted hover:text-light transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <X size={16} />
              <span className="font-bold">{t.hide}</span>
            </button>

            {/* Accessibility Statement Link */}
            <a
              href="/accessibility-statement"
              className="block text-center text-sm text-accent hover:text-light underline underline-offset-2 py-2 focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              {t.statement}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityWidget;
