import React, { useEffect, useState } from 'react';
type Settings = { enabled: boolean; configured: boolean; missing: string[]; dailyLimit: number; monthlyLimit: number; perNetworkLimit: number };

export default function VisualizerAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const load = async () => {
    setError('');
    try {
      const response = await fetch('/api/admin/visualizer', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      setSettings(await response.json());
    } catch { setError('לא הצלחנו לקרוא את ההגדרה. ההדמיה נשארת חסומה ללקוחות עד לבדיקה.'); }
  };
  useEffect(() => { void load(); }, []);
  const toggle = async () => {
    if (!settings || saving) return;
    setSaving(true); setError('');
    try {
      const response = await fetch('/api/admin/visualizer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: !settings.enabled }) });
      if (!response.ok) throw new Error();
      setSettings(await response.json());
    } catch { setError('השינוי לא נשמר. יש לבדוק את החיבור ולנסות שוב.'); }
    finally { setSaving(false); }
  };
  return <section className="border border-divider bg-secondary p-5 md:p-7 space-y-4" dir="rtl" aria-labelledby="visualizer-admin-title">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 id="visualizer-admin-title" className="text-xl font-serif text-light">הדמיית אבן במטבח של הלקוח</h2><p className="text-sm text-muted mt-2">העלאת תמונת מטבח והחלפת המשטח בלוח שנבחר מהאתר.</p></div>
      <button type="button" role="switch" aria-checked={settings?.enabled ?? false} aria-label="הפעלת הדמיית מטבח ללקוחות" disabled={!settings || saving || (!settings.enabled && !settings.configured)} onClick={toggle} className="min-h-12 border border-divider px-5 py-3 text-light bg-primary disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        {saving ? 'שומר…' : settings?.enabled ? 'ON · פעיל ללקוחות' : 'OFF · כבוי ללקוחות'}
      </button>
    </div>
    <p className="text-sm text-muted">{settings?.enabled ? 'לקוחות יכולים לפתוח את ההדמיה. כיבוי יחסום בקשות חדשות; בקשה שכבר התחילה עשויה להסתיים.' : 'האפשרות מוסתרת מהלקוחות. גם קישור ישיר לא יאפשר ליצור הדמיה בתשלום.'}</p>
    {settings && <p className="text-sm text-muted">{settings.configured ? 'מכסות שימוש:' : 'מכסות התחלתיות לחיבור השירות:'} עד {settings.perNetworkLimit} הדמיות ביום מאותה כתובת רשת, {settings.dailyLimit} ביום בכל האתר ו־{settings.monthlyLimit} בחודש. אימות נגד בוטים נדרש בכל בקשה. המכסות נאכפות בשרת; שינוי שלהן נעשה בהגדרות השירות.</p>}
    {settings && !settings.configured && <div className="text-sm text-muted border-s-2 border-accent ps-4"><strong className="text-light">ממתין לחיבור שירות התמונות ולהגדרת מכסת שימוש.</strong><p className="mt-1">לאחר אישור בעל המפעל וחיבור השירות, אפשר יהיה להדליק כאן. שום שירות בתשלום לא הופעל.</p></div>}
    <a href="/visualizer?preview=1" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">פתיחת תצוגה מקדימה פרטית</a>
    {error && <div role="alert" className="text-red-400 text-sm">{error}<button className="underline ms-3 min-h-11" onClick={load}>נסה שוב</button></div>}
    {!settings && !error && <p role="status">טוען את ההגדרה…</p>}
  </section>;
}
