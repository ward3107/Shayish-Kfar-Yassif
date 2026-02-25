/**
 * Accessibility Widget - IS 5568 / WCAG 2.0 AA Compliant
 * Standalone widget for any website
 *
 * Usage:
 *   <link rel="stylesheet" href="accessibility-widget.css">
 *   <script src="accessibility-widget.js" defer></script>
 *
 * Version: 1.0.0
 * License: MIT
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION & CONSTANTS
  // ============================================
  const STORAGE_KEY = 'a11ySettings';
  const DISMISS_KEY = 'a11yDismissed';

  // Font size range (percentage)
  const FONT_MIN = 50;
  const FONT_MAX = 200;
  const FONT_STEP = 10;

  const FONT_DEFAULT = 100;

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  let state = {
    fontPercent: FONT_DEFAULT,
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

  // ============================================
  // DOM ELEMENT REFERENCES
  // ============================================
  let triggerBtn = null;
  let panel = null;
  let closeBtn = null;
  let liveRegion = null;
  let fontDisplay = null;
  let fontDecreaseBtn = null;
  let fontIncreaseBtn = null;
  let firstFocusable = null;
  let lastFocusable = null;

  // Focusable selector for focus trap
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // ============================================
  // TRANSLATIONS
  // ============================================
  const translations = {
    he: {
      panelTitle: 'כלי נגישות / Accessibility',
      openLabel: 'פתח כלי נגישות',
      closeLabel: 'סגור חלונית נגישות',
      dismissLabel: 'הסתר וידג׳ט למשך הסשה',
      fontSize: 'גודל טקסט',
      decreaseLabel: 'הקטן טקסט',
      increaseLabel: 'הגדיל טקסט',
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
      statementUrl: '/accessibility-statement',
      announcements: {
        font: 'גודל הטקסט הוגדר ל-',
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
        highlightOn: 'הדגשה בעכבר ופוקוס הופעלה',
        highlightOff: 'הדגשה בעכבר ופוקוס כובתה',
        reset: 'כל הגדרות הנגישות אופסו'
      }
    },
    en: {
      panelTitle: 'Accessibility',
      openLabel: 'Open accessibility tools',
      closeLabel: 'Close accessibility panel',
      dismissLabel: '× Hide widget for this session',
      fontSize: 'Text Size',
      decreaseLabel: 'Decrease font size',
      increaseLabel: 'Increase font size',
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
      statementUrl: '/accessibility-statement',
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
        lhOn: 'Increased line height enabled',
        lhOff: 'Increased line height disabled',
        animOn: 'Animations paused',
        animOff: 'Animations resumed',
        highlightOn: 'Highlight on hover and focus enabled',
        highlightOff: 'Highlight on hover and focus disabled',
        reset: 'All accessibility settings have been reset'
      }
    }
  };

  let currentLang = 'en';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

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

    if (color.startsWith('#')) {
      return color;
    }

    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      return rgbToHex(rgbMatch[1], rgbMatch[2], rgbMatch[3]);
    }

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
      if (htmlLang.startsWith('he') || htmlLang.startsWith('ar')) return 'he';
    }
    return 'en';
  }

  /**
   * Auto-detect brand color from page
   * Scans: button:not([class*="a11y"]), a, header, nav, .btn, [class*="btn"],
   *        [class*="button"], [class*="primary"], [class*="brand"], h1, h2
   * Skips: near-black (lightness < 0.1), near-white (lightness > 0.92), near-grey (saturation < 0.25)
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
   * Initialize brand color CSS variables
   */
  function initBrandColor() {
    const brandColor = detectBrandColor();
    const brandDark = darkenColor(brandColor, 25);

    document.documentElement.style.setProperty('--a11y-brand', brandColor);
    document.documentElement.style.setProperty('--a11y-brand-dark', brandDark);
  }

  /**
   * Announce to screen readers via ARIA live region
   */
  function announce(message) {
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 50);
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

    // FEATURE 1: Font Size (50% - 200%, shown as percentage, not px)
    const actualPx = (state.fontPercent / 100) * 16;
    html.style.setProperty('--base-font-size', actualPx + 'px');

    // FEATURE 2: High Contrast Mode
    if (state.contrast) {
      body.classList.add('a11y-contrast');
    } else {
      body.classList.remove('a11y-contrast');
    }

    // FEATURE 3: Grayscale Mode
    if (state.grayscale) {
      html.classList.add('a11y-gray');
    } else {
      html.classList.remove('a11y-gray');
    }

    // FEATURE 4: Underline Links
    if (state.links) {
      body.classList.add('a11y-links');
    } else {
      body.classList.remove('a11y-links');
    }

    // FEATURE 5: Readable Font
    if (state.font) {
      body.classList.add('a11y-font');
    } else {
      body.classList.remove('a11y-font');
    }

    // FEATURE 6: Letter Spacing
    if (state.spacing) {
      body.classList.add('a11y-spacing');
    } else {
      body.classList.remove('a11y-spacing');
    }

    // FEATURE 7: Line Height
    if (state.lineHeight) {
      body.classList.add('a11y-lh');
    } else {
      body.classList.remove('a11y-lh');
    }

    // FEATURE 8: Pause Animations
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

    // FEATURE 9: Highlight on Hover/Focus
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
    if (!panel) return;

    const t = translations[currentLang];

    // Font display (Feature 1)
    if (fontDisplay) {
      fontDisplay.textContent = state.fontPercent + '%';
    }

    // Font buttons disabled state (Feature 1)
    if (fontDecreaseBtn) {
      fontDecreaseBtn.disabled = state.fontPercent <= FONT_MIN;
    }
    if (fontIncreaseBtn) {
      fontIncreaseBtn.disabled = state.fontPercent >= FONT_MAX;
    }

    // Update all toggle buttons (Features 2-9)
    const toggles = panel.querySelectorAll('.a11y-toggle-btn');
    toggles.forEach(toggle => {
      const feature = toggle.dataset.feature;
      if (feature && state.hasOwnProperty(feature)) {
        const isPressed = state[feature];
        toggle.setAttribute('aria-pressed', isPressed);
      }
    });
  }

  // ============================================
  // FEATURE HANDLERS (1-10)
  // ============================================

  /**
   * FEATURE 1: Font Size Control
   * MIN=50, MAX=200, STEP=10
   * Shows percentage, NOT px
   */
  function decreaseFont() {
    if (state.fontPercent > FONT_MIN) {
      state.fontPercent -= FONT_STEP;
      applyState();
      saveState();
      announce(translations[currentLang].announcements.font + state.fontPercent + '%');
    }
  }

  function increaseFont() {
    if (state.fontPercent < FONT_MAX) {
      state.fontPercent += FONT_STEP;
      applyState();
      saveState();
      announce(translations[currentLang].announcements.font + state.fontPercent + '%');
    }
  }

  /**
   * FEATURE 2: High Contrast Mode
   * Adds class "a11y-contrast" to <body>
   * Announces: "High contrast mode enabled/disabled"
   */
  function toggleContrast() {
    state.contrast = !state.contrast;
    applyState();
    saveState();
    announce(state.contrast ?
      translations[currentLang].announcements.contrastOn :
      translations[currentLang].announcements.contrastOff);
  }

  /**
   * FEATURE 3: Grayscale Mode
   * Adds class "a11y-gray" to <html>
   * Announces: "Grayscale mode enabled/disabled"
   */
  function toggleGrayscale() {
    state.grayscale = !state.grayscale;
    applyState();
    saveState();
    announce(state.grayscale ?
      translations[currentLang].announcements.grayscaleOn :
      translations[currentLang].announcements.grayscaleOff);
  }

  /**
   * FEATURE 4: Underline Links
   * Adds class "a11y-links" to <body>
   * Announces: "Link underlining enabled/disabled"
   */
  function toggleLinks() {
    state.links = !state.links;
    applyState();
    saveState();
    announce(state.links ?
      translations[currentLang].announcements.linksOn :
      translations[currentLang].announcements.linksOff);
  }

  /**
   * FEATURE 5: Readable Font
   * Adds class "a11y-font" to <body>
   * Announces: "Readable font enabled/disabled"
   */
  function toggleFont() {
    state.font = !state.font;
    applyState();
    saveState();
    announce(state.font ?
      translations[currentLang].announcements.fontOn :
      translations[currentLang].announcements.fontOff);
  }

  /**
   * FEATURE 6: Letter Spacing
   * Adds class "a11y-spacing" to <body>
   * Announces: "Letter spacing enabled/disabled"
   */
  function toggleSpacing() {
    state.spacing = !state.spacing;
    applyState();
    saveState();
    announce(state.spacing ?
      translations[currentLang].announcements.spacingOn :
      translations[currentLang].announcements.spacingOff);
  }

  /**
   * FEATURE 7: Line Height
   * Adds class "a11y-lh" to <body>
   * Announces: "Increased line height enabled/disabled"
   */
  function toggleLineHeight() {
    state.lineHeight = !state.lineHeight;
    applyState();
    saveState();
    announce(state.lineHeight ?
      translations[currentLang].announcements.lhOn :
      translations[currentLang].announcements.lhOff);
  }

  /**
   * FEATURE 8: Pause Animations
   * Injects <style id="a11y-no-anim">
   * On toggle off: remove the style tag
   * Announces: "Animations paused/resumed"
   */
  function togglePauseAnimations() {
    state.pauseAnimations = !state.pauseAnimations;
    applyState();
    saveState();
    announce(state.pauseAnimations ?
      translations[currentLang].announcements.animOn :
      translations[currentLang].announcements.animOff);
  }

  /**
   * FEATURE 9: Highlight on Hover/Focus
   * Adds class "a11y-highlight" to <body>
   * Excludes widget itself from highlight
   * Announces: "Highlight on hover and focus enabled/disabled"
   */
  function toggleHighlight() {
    state.highlight = !state.highlight;
    applyState();
    saveState();
    announce(state.highlight ?
      translations[currentLang].announcements.highlightOn :
      translations[currentLang].announcements.highlightOff);
  }

  /**
   * FEATURE 10: Reset All
   * Removes all a11y classes from <html> and <body>
   * Removes all injected style tags
   * Resets --base-font-size to 16px
   * Sets fontPercent back to 100
   * Sets all aria-pressed to false
   * Clears localStorage
   * Updates all UI elements
   * Announces: "All accessibility settings have been reset"
   */
  function resetAll() {
    const html = document.documentElement;
    const body = document.body;

    // Remove all classes
    html.classList.remove('a11y-gray');
    body.classList.remove('a11y-contrast', 'a11y-links', 'a11y-font', 'a11y-spacing', 'a11y-lh', 'a11y-highlight');

    // Remove injected animation style
    const animStyle = document.getElementById('a11y-no-anim');
    if (animStyle) {
      animStyle.remove();
    }

    // Reset font size
    html.style.removeProperty('--base-font-size');

    // Reset state
    state = {
      fontPercent: FONT_DEFAULT,
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

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Update UI
    applyState();
    closePanel();

    // Announce
    announce(translations[currentLang].announcements.reset);
  }

  // ============================================
  // PANEL CONTROL
  // ============================================

  function openPanel() {
    state.isOpen = true;
    panel.setAttribute('aria-hidden', 'false');

    triggerBtn.setAttribute('aria-expanded', 'true');
    triggerBtn.setAttribute('aria-label', translations[currentLang].closeLabel);

    // Focus first focusable element after opening
    setTimeout(() => {
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);

    // Add escape key listener and focus trap
    document.addEventListener('keydown', handleKeyDown);
  }

  function closePanel() {
    state.isOpen = false;
    panel.setAttribute('aria-hidden', 'true');

    triggerBtn.setAttribute('aria-expanded', 'false');
    triggerBtn.setAttribute('aria-label', translations[currentLang].openLabel);

    // Return focus to trigger button
    setTimeout(() => {
      triggerBtn.focus();
    }, 100);

    // Remove escape key listener and focus trap
    document.removeEventListener('keydown', handleKeyDown);
  }

  /**
   * Handle keyboard events (Escape + Tab focus trap)
   * WCAG 2.1.2: No keyboard trap
   */
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = panel.querySelectorAll(focusableSelector);
      if (focusableElements.length === 0) return;

      firstFocusable = focusableElements[0];
      lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Handle outside click to close panel
   */
  function handleOutsideClick(e) {
    if (panel && state.isOpen &&
        !panel.contains(e.target) &&
        !triggerBtn.contains(e.target)) {
      closePanel();
    }
  }

  /**
   * Dismiss widget for current session
   * sessionStorage.setItem('a11yDismissed', '1')
   * Then close everything
   */
  function dismissWidget() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    if (panel) panel.remove();
    if (triggerBtn) triggerBtn.remove();
  }

  // ============================================
  // CREATE WIDGET HTML
  // ============================================

  function createWidget() {
    const t = translations[currentLang];
    const dir = document.documentElement.dir || 'ltr';

    // Create trigger button with official accessibility icon (white on brand background)
    triggerBtn = document.createElement('button');
    triggerBtn.id = 'a11y-trigger';
    triggerBtn.setAttribute('type', 'button');
    triggerBtn.setAttribute('role', 'button');
    triggerBtn.setAttribute('aria-expanded', 'false');
    triggerBtn.setAttribute('aria-controls', 'a11y-panel');
    triggerBtn.setAttribute('aria-label', t.openLabel);
    // Official international accessibility SVG icon (dynamic wheelchair user symbol)
    triggerBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden="true" focusable="false">
        <circle cx="12" cy="3" r="2"/>
        <path d="M19 13h-4l-2-5H9a2 2 0 0 0-2 2v1h2v-1h2.5l2 5H17l1 4h2l-1-5zM9 17.5A3.5 3.5 0 1 1 5.5 14H7v-2H5.5A5.5 5.5 0 1 0 11 17.5H9z"/>
      </svg>
    `;

    // Create panel with role="dialog", aria-modal="true", aria-labelledby
    panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'a11y-panel-title');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('dir', dir);

    panel.innerHTML = `
      <!-- Header with close button inside (round icon button, NOT rectangle) -->
      <div id="a11y-panel-header">
        <h2 id="a11y-panel-title">♿ ${t.panelTitle}</h2>
        <button type="button" id="a11y-close-btn" aria-label="${t.closeLabel}">×</button>
      </div>

      <!-- Scrollable content area -->
      <div id="a11y-panel-content">

        <!-- FEATURE 1: Font Size Control (50%-200%, shows percentage NOT px) -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm2 8H10v-2h4v2z"/>
            </svg>
            <span>${t.fontSize}</span>
          </div>
          <div class="a11y-btn-group">
            <button type="button" id="a11y-font-decrease" class="a11y-action-btn" aria-label="${t.decreaseLabel}" disabled>−</button>
            <span id="a11y-font-display" class="a11y-font-size-display">100%</span>
            <button type="button" id="a11y-font-increase" class="a11y-action-btn" aria-label="${t.increaseLabel}">+</button>
          </div>
        </div>

        <!-- FEATURE 2: High Contrast -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm2 8H10v-2h4v2z"/>
            </svg>
            <span>${t.contrast}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="contrast" aria-pressed="false" aria-label="${t.contrast}"></button>
        </div>

        <!-- FEATURE 3: Grayscale -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            <span>${t.grayscale}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="grayscale" aria-pressed="false" aria-label="${t.grayscale}"></button>
        </div>

        <!-- FEATURE 4: Underline Links -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
            <span>${t.underlineLinks}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="links" aria-pressed="false" aria-label="${t.underlineLinks}"></button>
        </div>

        <!-- FEATURE 5: Readable Font -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2l-.01 14c0 1.1.89 2 1.99 2h6l4 4 4-4h6c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-2.54-7.22H7.31l-2.54 7.22h-2.5l6.17-16.5h2.34l6.17 16.5h-2.83z"/>
            </svg>
            <span>${t.readableFont}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="font" aria-pressed="false" aria-label="${t.readableFont}"></button>
        </div>

        <!-- FEATURE 6: Letter Spacing -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h4v-4H9v4zm0 5h4v-4H9v4zM9 9h4V5H9v4zm5 5h4v-4h-4v4zm0 5h4v-4h-4v4zM9 9h4V5H9v4zm5 5h4v-4h-4v4zm0 5h4v-4h-4v4zm5-10v4h4V5h-4v9h-2V5h2z"/>
            </svg>
            <span>${t.letterSpacing}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="spacing" aria-pressed="false" aria-label="${t.letterSpacing}"></button>
        </div>

        <!-- FEATURE 7: Line Height -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 16h4v-4H4v4zm0 5h4v-4H4v4zm0-9h4V5H4v7zm5 9h4v-4H9v4zm0-9h4V5H9v7zm5 9h4v-4h-4v4zm0-9h4V5h-4v7z"/>
            </svg>
            <span>${t.lineHeight}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="lineHeight" aria-pressed="false" aria-label="${t.lineHeight}"></button>
        </div>

        <!-- FEATURE 8: Pause Animations -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            <span>${t.pauseAnimations}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="pauseAnimations" aria-pressed="false" aria-label="${t.pauseAnimations}"></button>
        </div>

        <!-- FEATURE 9: Highlight on Hover/Focus -->
        <div class="a11y-feature-row">
          <div class="a11y-feature-label">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2-4H9v-2h6v2z"/>
            </svg>
            <span>${t.highlightHover}</span>
          </div>
          <button type="button" class="a11y-toggle-btn" data-feature="highlight" aria-pressed="false" aria-label="${t.highlightHover}"></button>
        </div>

        <!-- FEATURE 10: Reset All -->
        <button type="button" id="a11y-reset" class="a11y-reset-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          ${t.reset}
        </button>
      </div>

      <!-- Footer with Accessibility Statement link and dismiss link -->
      <div id="a11y-panel-footer">
        <a href="${t.statementUrl}" class="a11y-footer-link">
          ${t.statementLink}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3M21 3l-7 7"/>
          </svg>
        </a>
        <button type="button" id="a11y-dismiss-link" class="a11y-dismiss-link">${t.dismissLabel}</button>
      </div>

      <!-- ARIA Live Region (visually hidden) for screen reader announcements -->
      <div id="a11y-live" aria-live="polite" aria-atomic="true"></div>
    `;

    // Add to DOM
    document.body.appendChild(panel);
    document.body.appendChild(triggerBtn);

    // Get element references
    closeBtn = document.getElementById('a11y-close-btn');
    liveRegion = document.getElementById('a11y-live');
    fontDisplay = document.getElementById('a11y-font-display');
    fontDecreaseBtn = document.getElementById('a11y-font-decrease');
    fontIncreaseBtn = document.getElementById('a11y-font-increase');

    // Collect focusable elements for focus trap
    const focusableElements = panel.querySelectorAll(focusableSelector);
    if (focusableElements.length > 0) {
      firstFocusable = focusableElements[0];
      lastFocusable = focusableElements[focusableElements.length - 1];
    }

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

    // Close button (round icon button in header)
    closeBtn.addEventListener('click', closePanel);

    // Outside click
    document.addEventListener('click', handleOutsideClick);

    // Font size buttons (Feature 1)
    fontDecreaseBtn.addEventListener('click', decreaseFont);
    fontIncreaseBtn.addEventListener('click', increaseFont);

    // Toggle buttons (Features 2-9)
    const toggles = panel.querySelectorAll('.a11y-toggle-btn');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const feature = toggle.dataset.feature;

        switch (feature) {
          case 'contrast':
            toggleContrast();
            break;
          case 'grayscale':
            toggleGrayscale();
            break;
          case 'links':
            toggleLinks();
            break;
          case 'font':
            toggleFont();
            break;
          case 'spacing':
            toggleSpacing();
            break;
          case 'lineHeight':
            toggleLineHeight();
            break;
          case 'pauseAnimations':
            togglePauseAnimations();
            break;
          case 'highlight':
            toggleHighlight();
            break;
        }
      });
    });

    // Reset button (Feature 10)
    document.getElementById('a11y-reset').addEventListener('click', resetAll);

    // Dismiss link
    document.getElementById('a11y-dismiss-link').addEventListener('click', dismissWidget);
  }

  /**
   * Initialize widget
   * Check sessionStorage for dismissed state
   * If dismissed, skip rendering entirely
   */
  function init() {
    // Check if widget was dismissed for this session
    if (sessionStorage.getItem(DISMISS_KEY) === '1') {
      return; // Don't render widget at all
    }

    // Detect language
    currentLang = detectLanguage();

    // Detect and apply brand color (auto from page)
    initBrandColor();

    // Load saved state from localStorage FIRST
    // Apply state before building HTML to prevent flash
    loadState();
    applyState();

    // Create widget HTML
    createWidget();

    // Apply state again after HTML is created to update UI elements
    applyState();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Apply saved state BEFORE page renders to prevent flash
  // This happens during DOMContentLoaded, so styles apply as DOM builds
  if (document.readyState === 'loading') {
    // Check dismissed state early
    if (sessionStorage.getItem(DISMISS_KEY) !== '1') {
      // Load and apply state immediately
      loadState();
      const html = document.documentElement;
      const body = document.body;

      // Apply classes early to prevent flash
      const actualPx = (state.fontPercent / 100) * 16;
      html.style.setProperty('--base-font-size', actualPx + 'px');

      if (state.grayscale) html.classList.add('a11y-gray');
      if (state.contrast) body.classList.add('a11y-contrast');
      if (state.links) body.classList.add('a11y-links');
      if (state.font) body.classList.add('a11y-font');
      if (state.spacing) body.classList.add('a11y-spacing');
      if (state.lineHeight) body.classList.add('a11y-lh');
      if (state.highlight) body.classList.add('a11y-highlight');

      document.addEventListener('DOMContentLoaded', () => {
        // Detect language and brand color
        currentLang = detectLanguage();
        initBrandColor();
        // Create widget and apply final state
        createWidget();
        applyState();
      });
    }
  } else {
    // DOM already loaded
    init();
  }

})();
