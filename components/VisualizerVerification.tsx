import React, { useEffect, useRef, useState } from 'react';
type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
let scriptReady: Promise<void> | undefined;
function load() {
  if (!scriptReady) scriptReady = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true;
    script.onload = () => resolve(); script.onerror = () => { script.remove(); scriptReady = undefined; reject(new Error()); };
    document.head.appendChild(script);
  });
  return scriptReady;
}
export default function VisualizerVerification({ siteKey, onToken, label }: { siteKey: string; onToken: (token: string) => void; label: string }) {
  const node = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let stopped = false; let id: string | undefined;
    const api = () => (window as unknown as {turnstile?: Turnstile}).turnstile;
    onToken(''); setFailed(false);
    load().then(() => { if (stopped || !node.current) return; id = api()?.render(node.current, { sitekey: siteKey, action: 'kitchen-visualizer', size: 'flexible', theme: 'auto', callback: onToken, 'expired-callback': () => onToken(''), 'error-callback': () => { onToken(''); setFailed(true); } }); }).catch(() => { if (!stopped) setFailed(true); });
    return () => { stopped = true; if (id) api()?.remove(id); onToken(''); };
  }, [siteKey, attempt, onToken]);
  return <div className="my-4"><div ref={node}/>{failed && <button className="viz-text-button" type="button" onClick={() => setAttempt(n => n + 1)}>{label}</button>}</div>;
}
