import React, { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../translations';

/**
 * Dropdown language switcher.
 *  - Anchor button shows Globe + current language code.
 *  - Opens a floating menu with all four languages in their native scripts.
 *  - Outside click / Escape closes the menu.
 *  - Marks the active language with a check.
 *
 * Both desktop and mobile use this same component; sizing prop tweaks the
 * anchor to fit the header context.
 */

const LANGUAGES: Array<{ code: Language; label: string; flag: string; dir: 'ltr' | 'rtl' }> = [
  { code: 'en', label: 'English',  flag: 'EN', dir: 'ltr' },
  { code: 'he', label: 'עברית',    flag: 'HE', dir: 'rtl' },
  { code: 'ar', label: 'العربية',  flag: 'AR', dir: 'rtl' },
  { code: 'ru', label: 'Русский',  flag: 'RU', dir: 'ltr' },
];

interface Props {
  /** Anchor colour class (e.g. `text-white`) — matches surrounding header text. */
  anchorClass?: string;
  /** Icon size */
  size?: number;
  /** When true, render a slimmer variant suited for the mobile bar. */
  compact?: boolean;
}

const LanguageSwitcher: React.FC<Props> = ({ anchorClass = '', size = 18, compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
        className={`flex items-center gap-1.5 hover:text-accent transition-colors ${anchorClass}`}
      >
        <Globe size={size} />
        {!compact && <span className="text-xs font-bold uppercase">{language}</span>}
        <ChevronDown size={size - 4} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className="absolute end-0 top-full mt-3 min-w-[180px] bg-secondary border border-divider rounded-sm shadow-2xl overflow-hidden z-[60]"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(l.code)}
                dir={l.dir}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-start transition-colors ${
                  active ? 'bg-accent/15 text-accent' : 'text-light hover:bg-primary/60'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted min-w-[24px]">
                  {l.flag}
                </span>
                <span className="flex-1 text-base">{l.label}</span>
                {active && <Check size={16} className="text-accent flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
