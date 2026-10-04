import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';

/** Touch uses the browser's free scrolling; mouse dragging adds gentle inertia. */
export function useSlabScroll(reduced: boolean) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const frame = useRef(0);
  const scrollFrame = useRef(0);
  const suppressClickUntil = useRef(0);
  const drag = useRef<{ x: number; scroll: number; lastX: number; time: number; velocity: number; moved: boolean } | null>(null);

  const stop = () => cancelAnimationFrame(frame.current);
  useEffect(() => () => {
    cancelAnimationFrame(frame.current);
    cancelAnimationFrame(scrollFrame.current);
  }, []);
  useEffect(() => { if (reduced) stop(); }, [reduced]);

  const onScroll = () => {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(() => {
      const el = stage.current;
      if (!el) return;
      const bounds = el.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      let nearest = 0;
      let distance = Infinity;
      Array.from(el.children).forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const next = Math.abs(rect.left + rect.width / 2 - center);
        if (next < distance) { distance = next; nearest = index; }
      });
      setActive(nearest);
    });
  };

  const goTo = (index: number) => {
    stop();
    const el = stage.current;
    const card = el?.children[Math.max(0, Math.min((el?.children.length ?? 1) - 1, index))];
    if (!el || !card) return;
    const bounds = el.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    el.scrollBy({ left: rect.left + rect.width / 2 - bounds.left - bounds.width / 2, behavior: reduced ? 'instant' : 'smooth' });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    stop();
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, lastX: event.clientX, time: performance.now(), velocity: 0, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    if (!start.moved && Math.abs(event.clientX - start.x) < 6) return;
    if (!start.moved) {
      start.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    const now = performance.now();
    const elapsed = Math.max(1, now - start.time);
    start.velocity = .65 * start.velocity + .35 * (start.lastX - event.clientX) / elapsed;
    start.lastX = event.clientX;
    start.time = now;
    event.currentTarget.scrollLeft = start.scroll - (event.clientX - start.x);
    event.preventDefault();
  };
  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = drag.current;
    drag.current = null;
    setDragging(false);
    if (!start?.moved) return;
    suppressClickUntil.current = Date.now() + 350;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (cancelled || reduced || performance.now() - start.time > 100) return;
    const el = event.currentTarget;
    let velocity = Math.max(-2, Math.min(2, start.velocity));
    let last = performance.now();
    const coast = (now: number) => {
      const elapsed = Math.min(32, now - last);
      last = now;
      const previous = el.scrollLeft;
      el.scrollLeft += velocity * elapsed;
      velocity *= Math.exp(-elapsed / 240);
      if (Math.abs(velocity) > .02 && Math.abs(el.scrollLeft - previous) > .1) frame.current = requestAnimationFrame(coast);
    };
    frame.current = requestAnimationFrame(coast);
  };

  return { stage, active, dragging, goTo, onScroll, onPointerDown, onPointerMove,
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => finish(event),
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => finish(event, true),
    onWheel: stop, canOpen: () => Date.now() >= suppressClickUntil.current };
}
