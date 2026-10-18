import React, { createContext, useContext, useEffect, useState } from 'react';
import { canonicalSelection, MAX_SELECTIONS, readSelections, SELECTION_STORAGE_KEY, toggleSelection } from '../lib/selections';

const SelectionContext = createContext<{ refs: string[]; toggle: (ref: string) => void; persisted: boolean } | null>(null);
export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [refs, setRefs] = useState<string[]>(() => { try { return readSelections(localStorage.getItem(SELECTION_STORAGE_KEY)); } catch { return []; } });
  const [persisted, setPersisted] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(refs)); setPersisted(true); } catch { setPersisted(false); }
  }, [refs]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === SELECTION_STORAGE_KEY || event.key === null) {
        const next = readSelections(event.newValue);
        setRefs(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return <SelectionContext.Provider value={{ refs, persisted, toggle: value => setRefs(current => toggleSelection(current, value)) }}>{children}</SelectionContext.Provider>;
}
export function useSelections() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('SelectionProvider missing');
  return context;
}
export function useSelection(value: string) {
  const { refs, toggle } = useSelections();
  const ref = canonicalSelection(value);
  const selected = ref !== null && refs.includes(ref);
  return { selected, full: !selected && refs.length >= MAX_SELECTIONS, toggle: () => ref && toggle(ref) };
}
