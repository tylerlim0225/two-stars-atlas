'use client';

import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { useAtlas } from '@/lib/atlas-context';

export default function LenisProvider({ children }: { children: ReactNode }) {
  const { setScrollProgress, prefersReducedMotion } = useAtlas();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(Math.min(1, Math.max(0, p)));
    };
    lenis.on('scroll', updateProgress);
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setScrollProgress, prefersReducedMotion]);

  // Fallback for reduced-motion: still report progress via native scroll
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(Math.min(1, Math.max(0, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [setScrollProgress, prefersReducedMotion]);

  return <>{children}</>;
}
