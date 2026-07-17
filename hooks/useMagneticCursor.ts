import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticOptions {
  /** How far (px) into the element the pointer can pull it. */
  strength?: number;
  /** How close (px) to the element edge the effect activates. */
  radius?: number;
}

/**
 * Magnetic-cursor effect for CTA buttons. When the pointer gets close, the
 * element slides gently toward it. Feels premium; costs almost nothing.
 *
 * Desktop / hover-capable devices only — touchscreens have no pointer to
 * track, and the effect would just fire on tap and look janky.
 */
export const useMagneticCursor = <T extends HTMLElement>(opts: MagneticOptions = {}) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Bail on touch-first / no-hover devices so we don't run the loop on
    // mobile. matchMedia is the standards-blessed way to detect this.
    const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!hoverable.matches) return;

    const strength = opts.strength ?? 12;
    const radius = opts.radius ?? 80;

    // gsap.quickTo compiles to a single tween that we can spam every mousemove
    // — much cheaper than gsap.to() per frame.
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const activeRange = Math.max(rect.width, rect.height) / 2 + radius;
      if (dist > activeRange) {
        xTo(0);
        yTo(0);
        return;
      }
      const pull = 1 - Math.min(dist / activeRange, 1);
      xTo(dx * pull * (strength / 100));
      yTo(dy * pull * (strength / 100));
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [opts.strength, opts.radius]);

  return ref;
};
