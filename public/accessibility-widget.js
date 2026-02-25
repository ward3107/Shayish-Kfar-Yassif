/**
 * ACCESSIBILITY WIDGET
 * IS 5568 (Israel) & WCAG 2.0 AA Compliant
 *
 * NO DEPENDENCIES - Plain HTML/CSS/JS
 * Works on any website
 *
 * USAGE:
 *   <link rel="stylesheet" href="accessibility-widget.css">
 *   <script src="accessibility-widget.js" defer></script>
 *
 * Version: 1.0.0
 * Last Updated: 2025-02-25
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION & CONSTANTS
  // ========================================
  const STORAGE_KEY = 'a11ySettings';
  const DISMISS_KEY = 'a11yDismissed';

  const MIN_FONT = 100;
  const MAX_FONT = 180;
  const FONT_STEP = 10;

  const TRANSITIONS = {
    he: {
      panelTitle: 'כלי נגישות',
      openLabel: 'פתח כלי נגישות',
      closeLabel: 'סגור כלי נגישות',
      dismissLabel: 'הסתר כלי ×',
      fontSize: 'גודל טקסט',
      decrease: 'הקטן טקסט',
      increase: 'הגדיל טקסט',
      contrast: 'ניגודיות גבוהה',
      grayscale: 'גווני אפור',
      underlineLinks: 'הדגשת קישורים',
      readableFont: 'פונט קריא',
      letterSpacing: 'ריווח אותיות',
      lineHeight: 'גובה שורה',
      pauseAnimations: 'השהה אנימציות',
      highlightHover: 'הדגשה בעכבר/פוקוס',
      reset: 'אפס הכל',
      statementLink: 'הצהרת נגישות',
      enabled: 'מופעל',
      disabled: 'כבוי',
      announcements: {
        font: 'גודל הטקסט הוגדל ל-',
        contrastOn: 'מצב ניגודיות גבוהה הופעל',
        contrastOff: 'מצב ניגודיות גבוהה כובה',
        grayscaleOn: 'מצב גווני אפור הופעל',
        grayscaleOff: 'מצב גווני אפור כובה',
        linksOn: 'הדגשת קישורים הופעלה',
        linksOff: 'הדגשת קישורים כובתה',
        fontOn: 'פונט קריא הופעל',
        fontOff: 'פונט קריא כובה',
        spacingOn: 'ריווח אותיות הופעל',
        spacingOff: 'ריווח אותיות כובה',
        lhOn: 'גובה שורה הופעל',
        lhOff: 'גובה שורה כובה',
        animOn: 'האנימציות הושהו',
        animOff: 'האנימציות חודשו',
        highlightOn: 'הדגשה בעכבר הופעלה',
        highlightOff: 'הדגשה בעכבר כובתה',
        reset: 'כל הגדרות הנגישות אופסו'
      }
    },
    en: {
      panelTitle: 'Accessibility',
      openLabel: 'Open accessibility tools',
      closeLabel: 'Close accessibility tools',
      dismissLabel: 'Hide widget ×',
      fontSize: 'Text Size',
      decrease: 'Decrease font size',
      increase: 'Increase font size',
      contrast: 'High Contrast',
      grayscale: 'Grayscale',
      underlineLinks: 'Underline Links',
      readableFont: 'Readable Font',
      letterSpacing: 'Letter Spacing',
      lineHeight: 'Line Height',
      pauseAnimations: 'Pause Animations',
      highlightHover: 'Highlight on Hover/Focus',
      reset: 'Reset All',
      statementLink: 'Accessibility Statement',
      enabled: 'enabled',
      disabled: 'disabled',
      announcements: {
        font: 'Text size set to ',
        contrastOn: 'High contrast mode enabled',
        contrastOff: 'High contrast mode disabled',
        grayscaleOn: 'Grayscale mode enabled',
        grayscaleOff: 'Grayscale mode disabled',
        linksOn: 'Link underlining enabled',
        linksOff: 'Link underlining disabled',
        fontOn: 'Readable font enabled',
        fontOff: 'Readable font disabled',
        spacingOn: 'Letter spacing enabled',
        spacingOff: 'Letter spacing disabled',
        lhOn: 'Line height enabled',
        lhOff: 'Line height disabled',
        animOn: 'Animations paused',
        animOff: 'Animations resumed',
        highlightOn: 'Highlight on hover and focus enabled',
        highlightOff: 'Highlight on hover and focus disabled',
        reset: 'All accessibility settings have been reset'
      }
    }
  };

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  let state = {
    fontPercent: 100,
    contrast: false,
    grayscale: false,
    links: false,
    font: false,
    spacing: false,
    lineHeight: false,
    pauseAnimations: false,
    highlight: false,
    isOpen: false
  };

  let currentLang = 'en';

  // ========================================
  // DOM ELEMENT REFERENCES
  // ========================================
  let triggerBtn = null;
  let dismissBtn = null;
  let panel = null;
  let overlay = null;
  let closeBtn = null;
  let liveRegion = null;
  let fontDisplay = null;
  let fontDecreaseBtn = null;
  let fontIncreaseBtn = null;

  // Focusable elements for focus trap
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Convert RGB to Hex
   */
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Convert computed color to hex (handles rgb() and rgba())
   */
  function colorToHex(color) {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      return null;
    }

    // Already hex
    if (color.startsWith('#')) {
      return color;
    }

    // RGB format
    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      return rgbToHex(rgbMatch[1], rgbMatch[2], rgbMatch[3]);
    }

    // RGBA format
    const rgbaMatch = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
    if (rgbaMatch) {
      return rgbToHex(rgbaMatch[1], rgbaMatch[2], rgbaMatch[3]);
    }

    return null;
  }

  /**
   * Calculate color lightness (HSL)
   * Returns 0-1 value
   */
  function getLightness(r, g, b) {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    return (max + min) / 2;
  }

  /**
   * Calculate color saturation
   * Returns 0-1 value
   */
  function getSaturation(r, g, b) {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const delta = max - min;

    if (max === min) return 0;
    const l = (max + min) / 2;
    return l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  }

  /**
   * Darken hex color by percentage
   */
  function darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max(((num >> 8) & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  /**
   * Detect page language
   */
  function detectLanguage() {
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      if (htmlLang.startsWith('he')) return 'he';
      if (htmlLang.startsWith('ar')) return 'he'; // Use Hebrew translations for Arabic too
    }
    return 'en';
  }

  /**
   * Get brand color from page
   */
  function detectBrandColor() {
    const selectors = [
      'button:not([class*="a11y"])',
      'a:not([class*="a11y"])',
      'header',
      'nav',
      '.btn',
      '[class*="btn"]',
      '[class*="button"]',
      '[class*="primary"]',
      '[class*="brand"]',
      'h1',
      'h2'
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);

      for (const element of elements) {
        const computed = window.getComputedStyle(element);

        // Check background color first
        let bgHex = colorToHex(computed.backgroundColor);
        if (bgHex) {
          const r = parseInt(bgHex.slice(1, 3), 16);
          const g = parseInt(bgHex.slice(3, 5), 16);
          const b = parseInt(bgHex.slice(5, 7), 16);

          const lightness = getLightness(r, g, b);
          const saturation = getSaturation(r, g, b);

          // Skip near-black, near-white, and near-grey
          if (lightness > 0.1 && lightness < 0.92 && saturation > 0.25) {
            return bgHex;
          }
        }

        // Check text color
        let textHex = colorToHex(computed.color);
        if (textHex && textHex !== '#000000' && textHex !== '#ffffff') {
          const r = parseInt(textHex.slice(1, 3), 16);
          const g = parseInt(textHex.slice(3, 5), 16);
          const b = parseInt(textHex.slice(5, 7), 16);

          const lightness = getLightness(r, g, b);
          const saturation = getSaturation(r, g, b);

          if (lightness > 0.1 && lightness < 0.92 && saturation > 0.25) {
            return textHex;
          }
        }

        // Check border color
        let borderHex = colorToHex(computed.borderColor);
        if (borderHex && borderHex !== 'transparent' && borderHex !== '#000000') {
          return borderHex;
        }
      }
    }

    // Fallback to default blue
    return '#2563EB';
  }

  /**
   * Announce to screen readers
   */
  function announce(message) {
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Save state to localStorage
   */
  function saveState() {
    const { isOpen, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }

  /**
   * Load state from localStorage
   */
  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
      } catch (e) {
        console.error('Failed to load accessibility settings:', e);
      }
    }
  }

  /**
   * Apply all state to DOM
   */
  function applyState() {
    const html = document.documentElement;
    const body = document.body;

    // Font size (Feature 1)
    const actualPx = (state.fontPercent / 100) * 16;
    html.style.setProperty('--base-font-size', actualPx + 'px');

    // High contrast (Feature 2)
    if (state.contrast) {
      body.classList.add('a11y-contrast');
    } else {
      body.classList.remove('a11y-contrast');
    }

    // Grayscale (Feature 3)
    if (state.grayscale) {
      html.classList.add('a11y-gray');
    } else {
      html.classList.remove('a11y-gray');
    }

    // Underline links (Feature 4)
    if (state.links) {
      body.classList.add('a11y-links');
    } else {
      body.classList.remove('a11y-links');
    }

    // Readable font (Feature 5)
    if (state.font) {
      body.classList.add('a11y-font');
    } else {
      body.classList.remove('a11y-font');
    }

    // Letter spacing (Feature 6)
    if (state.spacing) {
      body.classList.add('a11y-spacing');
    } else {
      body.classList.remove('a11y-spacing');
    }

    // Line height (Feature 7)
    if (state.lineHeight) {
      body.classList.add('a11y-lh');
    } else {
      body.classList.remove('a11y-lh');
    }

    // Pause animations (Feature 8)
    let animStyle = document.getElementById('a11y-no-anim');
    if (state.pauseAnimations) {
      if (!animStyle) {
        animStyle = document.createElement('style');
        animStyle.id = 'a11y-no-anim';
        animStyle.textContent = `
          *, *::before, *::after {
            animation-play-state: paused !important;
            transition-duration: 0.001ms !important;
          }
        `;
        document.head.appendChild(animStyle);
      }
    } else {
      if (animStyle) {
        animStyle.remove();
      }
    }

    // Highlight on hover/focus (Feature 9)
    if (state.highlight) {
      body.classList.add('a11y-highlight');
    } else {
      body.classList.remove('a11y-highlight');
    }

    // Update UI elements
    updateUI();
  }

  /**
   * Update UI elements to reflect current state
   */
  function updateUI() {
    const t = TRANSITIONS[currentLang];

    // Skip if panel not created yet (during initial load)
    if (!panel) return;

    // Font display
    if (fontDisplay) {
      fontDisplay.textContent = state.fontPercent + '%';
    }

    // Font buttons disabled state
    if (fontDecreaseBtn) {
      fontDecreaseBtn.disabled = state.fontPercent <= MIN_FONT;
    }
    if (fontIncreaseBtn) {
      fontIncreaseBtn.disabled = state.fontPercent >= MAX_FONT;
    }

    // Update all toggle buttons
    const toggles = panel.querySelectorAll('.a11y-toggle');
    toggles.forEach(toggle => {
      const feature = toggle.dataset.feature;
      const isPressed = state[feature];
      toggle.setAttribute('aria-pressed', isPressed);
      toggle.setAttribute('aria-label',
        t[feature.replace('pauseAnimations', 'anim').replace('lineHeight', 'lh')] +
        ' - ' + (isPressed ? t.enabled : t.disabled)
      );
    });
  }

  // ========================================
  // FEATURE HANDLERS
  // ========================================

  function decreaseFont() {
    if (state.fontPercent > MIN_FONT) {
      state.fontPercent -= FONT_STEP;
      applyState();
      saveState();
      announce(t.announcements.font + state.fontPercent + '%');
    }
  }

  function increaseFont() {
    if (state.fontPercent < MAX_FONT) {
      state.fontPercent += FONT_STEP;
      applyState();
      saveState();
      announce(t.announcements.font + state.fontPercent + '%');
    }
  }

  function toggleFeature(featureName, onMsg, offMsg) {
    state[featureName] = !state[featureName];
    applyState();
    saveState();
    announce(state[featureName] ? onMsg : offMsg);
  }

  function resetAll() {
    state = {
      fontPercent: 100,
      contrast: false,
      grayscale: false,
      links: false,
      font: false,
      spacing: false,
      lineHeight: false,
      pauseAnimations: false,
      highlight: false,
      isOpen: false
    };

    localStorage.removeItem(STORAGE_KEY);
    applyState();
    closePanel();
    announce(TRANSITIONS[currentLang].announcements.reset);
  }

  // ========================================
  // PANEL CONTROL
  // ========================================

  function openPanel() {
    state.isOpen = true;
    panel.classList.add('a11y-visible');
    overlay.classList.add('a11y-visible');

    triggerBtn.setAttribute('aria-expanded', 'true');
    triggerBtn.setAttribute('aria-label', TRANSITIONS[currentLang].closeLabel);

    // Focus first element after animation
    setTimeout(() => {
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 100);

    // Add focus trap
    document.addEventListener('keydown', handleFocusTrap);
  }

  function closePanel() {
    state.isOpen = false;
    panel.classList.remove('a11y-visible');
    overlay.classList.remove('a11y-visible');

    triggerBtn.setAttribute('aria-expanded', 'false');
    triggerBtn.setAttribute('aria-label', TRANSITIONS[currentLang].openLabel);

    // Return focus to trigger
    setTimeout(() => {
      triggerBtn.focus();
    }, 100);

    // Remove focus trap
    document.removeEventListener('keydown', handleFocusTrap);
  }

  /**
   * Focus trap for panel (WCAG 2.1.2)
   */
  function handleFocusTrap(e) {
    if (e.key !== 'Tab' && e.key !== 'Tab' && e.key !== 'Escape') return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      return;
    }

    const focusableElements = panel.querySelectorAll(focusableSelector);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Dismiss widget for current session
   */
  function dismissWidget() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    if (triggerBtn) triggerBtn.remove();
    if (dismissBtn) dismissBtn.remove();
  }

  // ========================================
  // CREATE WIDGET HTML
  // ========================================

  function createWidget() {
    const t = TRANSITIONS[currentLang];
    const dir = document.documentElement.dir || 'ltr';

    // Create trigger button
    triggerBtn = document.createElement('button');
    triggerBtn.id = 'a11y-trigger';
    triggerBtn.setAttribute('type', 'button');
    triggerBtn.setAttribute('role', 'button');
    triggerBtn.setAttribute('aria-expanded', 'false');
    triggerBtn.setAttribute('aria-controls', 'a11y-panel');
    triggerBtn.setAttribute('aria-label', t.openLabel);
    triggerBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20ZM8 12C8 10.9 8.9 10 10 10H14C15.1 10 16 10.9 16 12C16 13.1 15.1 14 14 14H10C8.9 14 8 13.1 8 12Z"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
      </svg>
    `;

    // Create dismiss button
    dismissBtn = document.createElement('button');
    dismissBtn.id = 'a11y-dismiss';
    dismissBtn.setAttribute('type', 'button');
    dismissBtn.setAttribute('aria-label', t.dismissLabel);
    dismissBtn.textContent = '× ' + (currentLang === 'he' ? 'הסתר' : 'Hide');

    // Create overlay
    overlay = document.createElement('div');
    overlay.id = 'a11y-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    // Create panel
    panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'a11y-panel-title');
    panel.setAttribute('dir', dir);
    panel.innerHTML = `
      <!-- Header -->
      <div id="a11y-header">
        <h2 id="a11y-panel-title">${t.panelTitle}</h2>
        <button type="button" id="a11y-close" aria-label="${t.closeLabel}">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div id="a11y-content">
        <!-- Feature 1: Font Size -->
        <div class="a11y-feature">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm2 8H10v-2h4v2z"/>
            </svg>
            ${t.fontSize}
          </span>
          <div id="a11y-font-controls">
            <button type="button" id="a11y-font-decrease" class="a11y-font-btn" aria-label="${t.decrease}" disabled>−</button>
            <span id="a11y-font-display">100%</span>
            <button type="button" id="a11y-font-increase" class="a11y-font-btn" aria-label="${t.increase}">+</button>
          </div>
        </div>

        <!-- Feature 2: High Contrast -->
        <button type="button" class="a11y-toggle" data-feature="contrast" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm2 8H10v-2h4v2z"/>
            </svg>
            ${t.contrast}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 3: Grayscale -->
        <button type="button" class="a11y-toggle" data-feature="grayscale" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            ${t.grayscale}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 4: Underline Links -->
        <button type="button" class="a11y-toggle" data-feature="links" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
            ${t.underlineLinks}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 5: Readable Font -->
        <button type="button" class="a11y-toggle" data-feature="font" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2l-.01 14c0 1.1.89 2 1.99 2h6l4 4 4-4h6c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-2.54-7.22H7.31l-2.54 7.22h-2.5l6.17-16.5h2.34l6.17 16.5h-2.83z"/>
            </svg>
            ${t.readableFont}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 6: Letter Spacing -->
        <button type="button" class="a11y-toggle" data-feature="spacing" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h4v-4H9v4zm0 5h4v-4H9v4zM9 9h4V5H9v4zm5 5h4v-4h-4v4zm0 5h4v-4h-4v4zM9 9h4V5H9v4zm5 5h4v-4h-4v4zm0 5h4v-4h-4v4zm5-10v4h4V5h-4v9h-2V5h2z"/>
            </svg>
            ${t.letterSpacing}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 7: Line Height -->
        <button type="button" class="a11y-toggle" data-feature="lineHeight" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 16h4v-4H4v4zm0 5h4v-4H4v4zm0-9h4V5H4v7zm5 9h4v-4H9v4zm0-9h4V5H9v7zm5 9h4v-4h-4v4zm0-9h4V5h-4v7z"/>
            </svg>
            ${t.lineHeight}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 8: Pause Animations -->
        <button type="button" class="a11y-toggle" data-feature="pauseAnimations" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            ${t.pauseAnimations}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 9: Highlight on Hover/Focus -->
        <button type="button" class="a11y-toggle" data-feature="highlight" aria-pressed="false">
          <span class="a11y-feature-label">
            <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2-4H9v-2h6v2z"/>
            </svg>
            ${t.highlightHover}
          </span>
          <span class="a11y-switch">
            <span class="a11y-switch-handle"></span>
          </span>
        </button>

        <!-- Feature 10: Reset All -->
        <button type="button" id="a11y-reset">
          <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          ${t.reset}
        </button>

                <!-- Accessibility Statement Link -->
        <a id="a11y-statement-link" href="#/accessibility-statement">
          ${t.statementLink}
        </a>
      </div>

      <!-- ARIA Live Region (hidden) -->
      <div id="a11y-live" class="a11y-sr-only" aria-live="polite" aria-atomic="true" role="status"></div>
    `;

    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    document.body.appendChild(triggerBtn);
    document.body.appendChild(dismissBtn);

    // Get element references
    closeBtn = document.getElementById('a11y-close');
    liveRegion = document.getElementById('a11y-live');
    fontDisplay = document.getElementById('a11y-font-display');
    fontDecreaseBtn = document.getElementById('a11y-font-decrease');
    fontIncreaseBtn = document.getElementById('a11y-font-increase');

    // Attach event listeners
    attachEventListeners();
  }

  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    // Trigger button
    triggerBtn.addEventListener('click', () => {
      if (state.isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    // Close button
    closeBtn.addEventListener('click', closePanel);

    // Overlay click
    overlay.addEventListener('click', closePanel);

    // Dismiss button
    dismissBtn.addEventListener('click', dismissWidget);

    // Font size buttons
    fontDecreaseBtn.addEventListener('click', decreaseFont);
    fontIncreaseBtn.addEventListener('click', increaseFont);

    // Toggle buttons
    const toggles = panel.querySelectorAll('.a11y-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const feature = toggle.dataset.feature;
        const t = TRANSITIONS[currentLang];

        switch (feature) {
          case 'contrast':
            toggleFeature('contrast', t.announcements.contrastOn, t.announcements.contrastOff);
            break;
          case 'grayscale':
            toggleFeature('grayscale', t.announcements.grayscaleOn, t.announcements.grayscaleOff);
            break;
          case 'links':
            toggleFeature('links', t.announcements.linksOn, t.announcements.linksOff);
            break;
          case 'font':
            toggleFeature('font', t.announcements.fontOn, t.announcements.fontOff);
            break;
          case 'spacing':
            toggleFeature('spacing', t.announcements.spacingOn, t.announcements.spacingOff);
            break;
          case 'lineHeight':
            toggleFeature('lineHeight', t.announcements.lhOn, t.announcements.lhOff);
            break;
          case 'pauseAnimations':
            toggleFeature('pauseAnimations', t.announcements.animOn, t.announcements.animOff);
            break;
          case 'highlight':
            toggleFeature('highlight', t.announcements.highlightOn, t.announcements.highlightOff);
            break;
        }
      });
    });

    // Reset button
    document.getElementById('a11y-reset').addEventListener('click', resetAll);
  }

  /**
   * Detect and apply brand color
   */
  function initBrandColor() {
    const brandColor = detectBrandColor();
    const brandDark = darkenColor(brandColor, 25);

    // Set CSS variables
    document.documentElement.style.setProperty('--a11y-brand', brandColor);
    document.documentElement.style.setProperty('--a11y-brand-dark', brandDark);
  }

  /**
   * Initialize widget
   */
  function init() {
    // Check if dismissed for this session
    if (sessionStorage.getItem(DISMISS_KEY) === '1') {
      return; // Don't render widget
    }

    // Detect language
    currentLang = detectLanguage();

    // Detect and apply brand color
    initBrandColor();

    // Load saved state first
    loadState();

    // Create widget HTML BEFORE applying state
    // This ensures DOM elements exist when updateUI() is called
    createWidget();

    // Apply state after widget is created (updates UI elements)
    applyState();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
