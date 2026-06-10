'use client';

import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { useAtlas } from '@/lib/atlas-context';

/**
 * Smooth scroll provider. Only sets up Lenis — section-relative
 * scroll progress is tracked by each section (e.g. ConstellationExperience)
 * via framer-motion's useScroll, then pushed into AtlasContext.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion } = useAtlas();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
