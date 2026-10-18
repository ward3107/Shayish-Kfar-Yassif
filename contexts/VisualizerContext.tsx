import React, { createContext, useContext, useEffect, useState } from 'react';
const Context = createContext(false);
export function VisualizerProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => { fetch('/api/visualizer', { cache: 'no-store', signal: controller.signal }).then(r => r.ok ? r.json() : null).then(d => setEnabled(d?.enabled === true)).catch(() => { if (!controller.signal.aborted) setEnabled(false); }); };
    refresh(); window.addEventListener('focus', refresh);
    return () => { controller.abort(); window.removeEventListener('focus', refresh); };
  }, []);
  return <Context.Provider value={enabled}>{children}</Context.Provider>;
}
export const useVisualizerEnabled = () => useContext(Context);
