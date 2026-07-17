import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BUSINESS_HOURS, BUSINESS_TIMEZONE } from '../constants';

interface Snapshot {
  isOpen: boolean;
  /** "16:32" — the current time in the business timezone */
  now: string;
  /** For "open": today's closing time. For "closed": the next opening time. */
  edge: string;
  /** For "closed": is the next opening today, tomorrow, or another day. */
  edgeDayOffset: number;
}

/**
 * Reads the current time in the business's local timezone (Asia/Jerusalem
 * regardless of where the visitor is), compares it against BUSINESS_HOURS,
 * and returns whether the showroom is open right now + the nearest edge.
 */
const computeStatus = (): Snapshot => {
  const now = new Date();
  const nowStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  const [nowH, nowM] = nowStr.split(':').map(Number);
  const nowMinutes = nowH * 60 + nowM;

  const weekdayShort = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    weekday: 'short',
  }).format(now);
  const todayDow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayShort);

  const todayHours = BUSINESS_HOURS[todayDow] ?? null;
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  if (todayHours && nowMinutes >= toMinutes(todayHours.open) && nowMinutes < toMinutes(todayHours.close)) {
    return { isOpen: true, now: nowStr, edge: todayHours.close, edgeDayOffset: 0 };
  }

  // Closed. Find the next opening.
  for (let offset = 0; offset <= 7; offset++) {
    const dow = (todayDow + offset) % 7;
    const day = BUSINESS_HOURS[dow];
    if (!day) continue;
    if (offset === 0 && nowMinutes >= toMinutes(day.close)) continue;
    if (offset === 0 && nowMinutes < toMinutes(day.open)) {
      return { isOpen: false, now: nowStr, edge: day.open, edgeDayOffset: 0 };
    }
    if (offset > 0) {
      return { isOpen: false, now: nowStr, edge: day.open, edgeDayOffset: offset };
    }
  }
  return { isOpen: false, now: nowStr, edge: '', edgeDayOffset: 0 };
};

const ShowroomStatus: React.FC = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Snapshot | null>(null);

  useEffect(() => {
    setStatus(computeStatus());
    // Recompute every minute so edge transitions (open→closed at 18:00) update
    // without needing a page refresh.
    const id = window.setInterval(() => setStatus(computeStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return null;

  const dotColor = status.isOpen ? 'bg-emerald-500' : 'bg-neutral-500';
  const label = status.isOpen ? t('showroom.open_now') : t('showroom.closed_now');
  const detail = status.isOpen
    ? `${t('showroom.until')} ${status.edge}`
    : status.edgeDayOffset === 0
      ? `${t('showroom.opens_at')} ${status.edge}`
      : status.edgeDayOffset === 1
        ? `${t('showroom.opens_tomorrow')} ${status.edge}`
        : `${t('showroom.opens_in_days').replace('{days}', String(status.edgeDayOffset))} ${status.edge}`;

  return (
    <div
      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {status.isOpen && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-60`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span className="font-bold">{label}</span>
      <span className="text-muted normal-case tracking-normal">· {detail}</span>
    </div>
  );
};

export default ShowroomStatus;
