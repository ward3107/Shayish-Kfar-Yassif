import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'fadeIn' | 'fadeInUp' | 'stagger' | 'parallax' | 'scaleIn';

interface UseScrollAnimationOptions {
  type?: AnimationType;
  delay?: number;
  duration?: number;
  stagger?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      type = 'fadeInUp',
      delay = 0,
      duration = 0.8,
      stagger = 0.15,
      scrub = false,
      start = 'top 80%',
      end = 'bottom 20%',
    } = options;

    let ctx = gsap.context(() => {
      switch (type) {
        case 'fadeIn':
          gsap.fromTo(
            element,
            { opacity: 0 },
            {
              opacity: 1,
              duration,
              delay,
              scrollTrigger: { trigger: element, start },
            }
          );
          break;

        case 'fadeInUp':
          gsap.fromTo(
            element,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration,
              delay,
              ease: 'power3.out',
              scrollTrigger: { trigger: element, start },
            }
          );
          break;

        case 'stagger':
          gsap.fromTo(
            element.children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              ease: 'power3.out',
              scrollTrigger: { trigger: element, start },
            }
          );
          break;

        case 'scaleIn':
          gsap.fromTo(
            element,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration,
              ease: 'power2.out',
              scrollTrigger: { trigger: element, start },
            }
          );
          break;

        case 'parallax':
          gsap.to(element, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: typeof scrub === 'number' ? scrub : 1,
            },
          });
          break;
      }
    }, element);

    return () => ctx.revert();
  }, [options]);

  return elementRef;
};
