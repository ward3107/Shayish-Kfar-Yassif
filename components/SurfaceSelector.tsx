import React, { useRef, useState } from 'react';
import type { Point, Region } from '../lib/visualizer';
import { MAX_REGIONS, polygonArea } from '../lib/visualizer';
import { visualizerCopy } from '../lib/visualizerCopy';
import type { Language } from '../translations';

export default function SurfaceSelector({ photo, regions, onChange, language, disabled, onDraft }: { photo: {url: string; width: number; height: number}; regions: Region[]; onChange: (regions: Region[]) => void; language: Language; disabled: boolean; onDraft: (hasDraft: boolean) => void }) {
  const c = visualizerCopy[language];
  const [points, setPoints] = useState<Point[]>([]);
  const [exclude, setExclude] = useState(false);
  const [cursor, setCursor] = useState<Point>({ x: .5, y: .5 });
  const [keyboard, setKeyboard] = useState(false);
  const pointerStart = useRef<{x: number; y: number} | null>(null);
  const update = (next: Point[]) => { setPoints(next); onDraft(next.length > 0); };
  const add = (point: Point) => { if (!disabled && points.length < 40 && regions.length < MAX_REGIONS) update([...points, point]); };
  const close = () => { if (points.length >= 3 && polygonArea(points) >= .0001) { onChange([...regions, { points, exclude }]); update([]); } };
  const coordinates = (values: Point[]) => values.map(p => `${p.x * photo.width},${p.y * photo.height}`).join(' ');
  return <section className="viz-selector" aria-labelledby="viz-mark-title">
    <h2 id="viz-mark-title">{c.mark}</h2><p id="viz-mark-help">{c.markHint}</p>
    <div className="viz-tools"><button type="button" aria-pressed={!exclude} disabled={disabled} onClick={() => { setExclude(false); update([]); }}>{c.add}</button><button type="button" aria-pressed={exclude} disabled={disabled} onClick={() => { setExclude(true); update([]); }}>{c.exclude}</button></div>
    <div className="viz-photo-editor">
      <img src={photo.url} alt="" width={photo.width} height={photo.height} />
      <svg viewBox={`0 0 ${photo.width} ${photo.height}`} role="application" aria-label={c.canvas} aria-describedby="viz-mark-help viz-keyboard-help" tabIndex={disabled ? -1 : 0} onBlur={() => setKeyboard(false)}
        onPointerDown={event => { pointerStart.current = {x: event.clientX, y: event.clientY}; }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onPointerUp={event => { const start = pointerStart.current; pointerStart.current = null; if (disabled || !start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return; setKeyboard(false); const rect = event.currentTarget.getBoundingClientRect(); add({ x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)), y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)) }); }}
        onKeyDown={event => {
          if (disabled) return;
          if (event.key.startsWith('Arrow')) { event.preventDefault(); setKeyboard(true); const delta = event.shiftKey ? .05 : .01; setCursor(p => ({ x: Math.max(0, Math.min(1, p.x + (event.key === 'ArrowRight' ? delta : event.key === 'ArrowLeft' ? -delta : 0))), y: Math.max(0, Math.min(1, p.y + (event.key === 'ArrowDown' ? delta : event.key === 'ArrowUp' ? -delta : 0))) })); }
          if (event.key === 'Enter') { event.preventDefault(); add(cursor); }
          if (event.key === 'Escape') { event.preventDefault(); update([]); }
        }}>
        {regions.map((r, i) => <polygon key={i} points={coordinates(r.points)} className={r.exclude ? 'viz-exclude' : 'viz-replace'} />)}
        {points.length > 0 && <polyline points={coordinates(points)} className={exclude ? 'viz-exclude viz-draft' : 'viz-replace viz-draft'} />}
        {points.map((p, i) => <circle key={i} cx={p.x * photo.width} cy={p.y * photo.height} r={photo.width / 130} className="viz-point" />)}
        {keyboard && <circle cx={cursor.x * photo.width} cy={cursor.y * photo.height} r={photo.width / 90} className="viz-cursor" />}
      </svg>
    </div>
    <div className="viz-tools"><button type="button" disabled={disabled || points.length < 3 || polygonArea(points) < .0001} onClick={close}>{c.close}</button><button type="button" disabled={disabled || (!points.length && !regions.length)} onClick={() => points.length ? update(points.slice(0, -1)) : onChange(regions.slice(0, -1))}>{c.undo}</button><button type="button" disabled={disabled || (!regions.length && !points.length)} onClick={() => { onChange([]); update([]); }}>{c.clear}</button></div>
    <p className="viz-small" role="status">{c.regions}: {regions.length} · {c.points}: {points.length}</p><p className="viz-small" id="viz-keyboard-help">{c.keyboard}</p>
  </section>;
}
