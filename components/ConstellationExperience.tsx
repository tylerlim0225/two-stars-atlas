'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useScroll } from 'framer-motion';
import HeroOverlay from './HeroOverlay';
import ChapterIndex from './ChapterIndex';
import HoverQuote from './HoverQuote';
import SiteFooter from './SiteFooter';
import { useAtlas } from '@/lib/atlas-context';
import { trips } from '@/lib/data';

const ConstellationCanvas = dynamic(() => import('./ConstellationCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center text-ivory/30 text-[10px] tracking-widest3 uppercase">
      ✦ drawing the sky ✦
    </div>
  ),
});

/**
 * Wraps the 3D constellation into a single tall scrollable section.
 *
 * Layout:
 *   - outer <section> = tall (configurable) → provides scroll runway
 *   - inner sticky wrapper = 100vh, holds the canvas + UI overlays
 *
 * Progress mapping:
 *   - useScroll(ref) computes 0..1 across this section
 *   - we publish it to AtlasContext.scrollProgress so CameraRig /
 *     HeroOverlay / ChapterIndex react to it.
 */
export default function ConstellationExperience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const { setScrollProgress } = useAtlas();

  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      setScrollProgress(Math.min(1, Math.max(0, v)));
    });
    return () => unsub();
  }, [scrollYProgress, setScrollProgress]);

  // height in viewport units — controls pacing of the camera flight.
  // ~50vh per phase keeps tight cinematic pacing.
  const phases = trips.length + 2;
  const heightVh = Math.round(phases * 50);

  return (
    <section
      ref={ref}
      id="constellation"
      className="relative bg-night-950"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ConstellationCanvas />
        <HeroOverlay />
        <ChapterIndex />
        <HoverQuote />
        <SiteFooter />
      </div>
    </section>
  );
}
