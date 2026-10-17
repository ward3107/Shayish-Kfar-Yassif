import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, MoveHorizontal, RotateCcw } from 'lucide-react';
import type { Language } from '../../translations';
import { localPhoto } from '../../lib/localPhotos';
import { clampVase, vaseLayout } from './vaseLayout';
import './InteractiveVase.css';

const copy = {
  he: { name: 'מיקום הכד', hint: 'הזיזו את הכד', help: 'גררו ימינה ושמאלה, או השתמשו במקשי החצים. Home ו-End לקצוות.', left: 'הזזת הכד שמאלה', right: 'הזזת הכד ימינה', reset: 'החזרת הכד למיקום ההתחלתי' },
  ar: { name: 'موضع المزهرية', hint: 'حرّكوا المزهرية', help: 'اسحبوا يمينًا ويسارًا أو استخدموا مفاتيح الأسهم. Home وEnd للوصول إلى الطرفين.', left: 'تحريك المزهرية لليسار', right: 'تحريك المزهرية لليمين', reset: 'إعادة المزهرية إلى موضعها الأصلي' },
  en: { name: 'Vase position', hint: 'Move the vase', help: 'Drag left and right, or use the arrow keys. Home and End move to either edge.', left: 'Move vase left', right: 'Move vase right', reset: 'Reset vase position' },
  ru: { name: 'Положение вазы', hint: 'Передвиньте вазу', help: 'Перетаскивайте влево и вправо или используйте стрелки. Home и End перемещают к краям.', left: 'Сдвинуть вазу влево', right: 'Сдвинуть вазу вправо', reset: 'Вернуть вазу на место' },
};
const asset = '/cinematic/interactive-vase';
const defaultPosition = 25;

export default function InteractiveVase({ language, reduced }: { language: Language; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; position: number } | null>(null);
  const [position, setPosition] = useState(defaultPosition);
  const [dragging, setDragging] = useState(false);
  const [layout, setLayout] = useState<(ReturnType<typeof vaseLayout> & { controlsTop: number }) | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const helpId = useId();
  const c = copy[language];

  useEffect(() => {
    const node = root.current!;
    const intro = node.parentElement?.querySelector<HTMLElement>('.ch-intro');
    const measure = () => {
      // A resize invalidates the pointer's original coordinate system.
      drag.current = null;
      setDragging(false);
      const copyLeft = intro ? intro.getBoundingClientRect().left - node.getBoundingClientRect().left : node.clientWidth;
      const next = vaseLayout(node.clientWidth, node.clientHeight, copyLeft);
      const mobile = node.clientWidth <= 750;
      const afterCopy = intro && mobile ? intro.getBoundingClientRect().bottom - node.getBoundingClientRect().top + 12 : 0;
      setLayout({ ...next, controlsTop: Math.max(100, next.bottom - next.height - (mobile ? 52 : 72), afterCopy) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (intro) observer.observe(intro);
    return () => observer.disconnect();
  }, [language]);

  const move = (value: number) => setPosition(clampVase(value));
  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const x = layout ? layout.minX + (layout.maxX - layout.minX) * position / 100 : 0;
  const style = layout ? {
    '--vase-x': `${x}px`, '--vase-top': `${layout.bottom - layout.height}px`,
    '--vase-width': `${layout.width}px`, '--vase-height': `${layout.height}px`,
    '--vase-reflection': `${layout.reflectionHeight}px`,
    '--vase-controls-top': `${layout.controlsTop}px`,
  } as React.CSSProperties : undefined;

  return <div ref={root} className="ch-stone ch-vase-scene" data-dragging={dragging} data-ready={Boolean(layout && loaded)} data-reduced={reduced} style={style}>
    {failed ? <picture aria-hidden="true"><source media="(max-width:750px)" srcSet={localPhoto('/cinematic/hero-green-vase-mobile.webp')} /><img src={localPhoto('/cinematic/hero-green-vase.webp')} alt="" width="1672" height="941" /></picture> : <picture aria-hidden="true">
      <source media="(max-width:750px)" srcSet={`${asset}/plate-mobile-480.webp 480w, ${asset}/plate-mobile-941.webp 941w`} sizes="100vw" />
      <img className="ch-vase-plate" src={`${asset}/plate-desktop-1672.webp`} srcSet={`${asset}/plate-desktop-800.webp 800w, ${asset}/plate-desktop-1672.webp 1672w`} sizes="100vw" alt="" width="1672" height="941" fetchPriority="high" onError={() => setFailed(true)} />
    </picture>}
    {!failed && <div className="ch-vase-object">
      <div className="ch-vase-cast-shadow" aria-hidden="true" />
      <div className="ch-vase-reflection" aria-hidden="true"><img src={`${asset}/vase-1000.webp`} alt="" draggable={false} /></div>
      <div className="ch-vase-contact" aria-hidden="true" />
      <div className="ch-vase-grab" role="slider" tabIndex={0} aria-label={c.name} aria-describedby={helpId} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} aria-orientation="horizontal"
        onPointerDown={event => {
          if (!layout || !event.isPrimary || event.button !== 0) return;
          drag.current = { id: event.pointerId, x: event.clientX, position };
          event.currentTarget.dataset.pointer = 'true';
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.focus({ preventScroll: true });
        }}
        onPointerMove={event => {
          const active = drag.current;
          if (!layout || !active || active.id !== event.pointerId) return;
          move(active.position + (event.clientX - active.x) / Math.max(1, layout.maxX - layout.minX) * 100);
        }}
        onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
        onBlur={event => { event.currentTarget.dataset.pointer = 'false'; }}
        onKeyDown={event => {
          event.currentTarget.dataset.pointer = 'false';
          const values: Record<string, number> = { ArrowLeft: position - 5, ArrowRight: position + 5, ArrowDown: position - 5, ArrowUp: position + 5, Home: 0, End: 100, Escape: defaultPosition };
          if (!(event.key in values)) return;
          event.preventDefault();
          move(values[event.key]);
        }}>
        <img className="ch-vase-cutout" src={`${asset}/vase-1000.webp`} srcSet={`${asset}/vase-600.webp 600w, ${asset}/vase-1000.webp 1000w, ${asset}/vase-1431.webp 1431w`} sizes="(max-width:750px) 72vw, 43vw" alt="" width="1431" height="1099" draggable={false} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      </div>
    </div>}
    {!failed && <div className="ch-vase-controls">
      <span><MoveHorizontal size={15} aria-hidden="true" />{c.hint}</span>
      <div dir="ltr">
        <button type="button" aria-label={c.left} onClick={() => move(position - 15)} disabled={position === 0}><ArrowLeft size={17} /></button>
        <button type="button" aria-label={c.reset} onClick={() => move(defaultPosition)}><RotateCcw size={15} /></button>
        <button type="button" aria-label={c.right} onClick={() => move(position + 15)} disabled={position === 100}><ArrowRight size={17} /></button>
      </div>
      <p className="ch-vase-sr" id={helpId}>{c.help}</p>
    </div>}
  </div>;
}
