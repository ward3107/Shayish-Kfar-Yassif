import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundContextType {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY = 'shayish.sound.enabled';

/**
 * Sound preference — off by default. Sound-on-interaction is polarizing;
 * users who opt in via the header toggle stay opted in via localStorage.
 * Respects prefers-reduced-motion as a strong "no auto-sounds" signal.
 */
export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '1') {
        // Reduced-motion users get sound off even if they enabled it in a
        // past session — treats the OS preference as authoritative.
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reducedMotion) setEnabled(true);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — just default to off.
    }
  }, []);

  const persist = (v: boolean) => {
    setEnabled(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
    } catch {
      // ignore write errors — the state still works for the session.
    }
  };

  return (
    <SoundContext.Provider value={{ enabled, toggle: () => persist(!enabled), setEnabled: persist }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within a SoundProvider');
  return ctx;
};
