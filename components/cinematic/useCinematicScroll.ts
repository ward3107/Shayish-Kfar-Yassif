import { useEffect, type RefObject } from 'react';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, p: number) => { const t = clamp((p - a) / (b - a)); return t*t*(3-2*t); };
/** Scroll-driven transitions between stone textures and project details. */
export function useCinematicScroll(root: RefObject<HTMLDivElement | null>, reduced: boolean) {
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const hero = node.querySelector<HTMLElement>('.ch-hero');
    const chapters = [...node.querySelectorAll<HTMLElement>('.ch-project')];
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (hero) {
        const stage = hero.querySelector<HTMLElement>('.ch-hero-stage')!;
        const p = reduced ? 0 : clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight-stage.offsetHeight));
        hero.style.setProperty('--stone-opacity', String(1-smooth(.24,.7,p)));
        hero.style.setProperty('--intro-opacity', String(1-smooth(.16,.38,p)));
        hero.style.setProperty('--reveal-opacity', String(smooth(.54,.82,p)));
        hero.style.setProperty('--stone-scale', String(reduced ? 1 : 1.08-smooth(.35,1,p)*.08));
        hero.style.setProperty('--progress', `${p*100}%`);
        const reveal = hero.querySelector<HTMLElement>('.ch-reveal');
        if (reveal) reveal.inert = reduced || p < .65;
        const intro = hero.querySelector<HTMLElement>('.ch-intro');
        if (intro) intro.inert = !reduced && p > .38;
      }
      chapters.forEach(chapter => {
        const stage = chapter.querySelector<HTMLElement>('.ch-project-stage')!;
        const p = reduced ? 0 : clamp(-chapter.getBoundingClientRect().top/Math.max(1,chapter.offsetHeight-stage.offsetHeight));
        const detail = smooth(.26,.66,p);
        chapter.style.setProperty('--detail',String(detail));
        chapter.style.setProperty('--photo-scale',String(1+p*.035));
        chapter.style.setProperty('--photo-shift',`${p*-1.2}%`);
        chapter.style.setProperty('--progress',`${p*100}%`);
        const copy = chapter.querySelector<HTMLElement>('.ch-project-copy');
        if (copy) copy.inert = detail > .6;
      });
    };
    const schedule = () => { if (!frame) frame=requestAnimationFrame(paint); };
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    paint();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule); };
  },[root,reduced]);
}
