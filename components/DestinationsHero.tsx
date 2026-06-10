'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { destinations, type Destination } from '@/lib/destinations';

// One destination scene — 100vh, multi-layer parallax.
// Three speeds:
//  · Background image: slowest (y: -8% → +8%, scale 1.18 → 1.05)
//  · Photo grain overlay: medium
//  · Foreground text: fastest counter-direction (y: 32% → -32%)
// Combined, this reads as depth.
function DestinationScene({ d, index }: { d: Destination; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '12%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.07, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ['28%', '-28%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 0.7, 0.55]);
  const numberY = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden"
      style={{ backgroundColor: '#0E0B08' }}
    >
      {/* BG image — slowest */}
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
          backgroundImage: `url("${d.image}")`,
        }}
        className="absolute inset-[-15%] bg-cover bg-center will-change-transform"
        aria-hidden
      />

      {/* Cinematic gradient overlay — keeps text legible */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/55"
        aria-hidden
      />
      {/* Side vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]"
        aria-hidden
      />

      {/* Huge translucent index number — depth via scale */}
      <motion.div
        style={{ y: numberY }}
        className="pointer-events-none absolute top-12 right-8 md:top-16 md:right-16 font-display text-[20vw] md:text-[16vw] text-white/[0.04] leading-none select-none"
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      {/* Foreground text — fastest, counter-direction */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 flex items-end pb-20 md:pb-32 px-6 md:px-16"
      >
        <div className="max-w-4xl">
          <p
            className="text-[10px] tracking-widest3 uppercase mb-4"
            style={{ color: d.accent }}
          >
            {String(index + 1).padStart(2, '0')} · {d.region}
          </p>
          <h2 className="font-display text-[clamp(3.5rem,11vw,9rem)] text-white leading-[0.92] tracking-tight">
            {d.name}
          </h2>
          <p className="mt-3 text-xs md:text-sm tracking-widest2 uppercase text-white/65">
            {d.nameKo}
          </p>
          <p className="mt-7 font-serif italic text-xl md:text-3xl text-white/85 max-w-2xl text-balance leading-snug">
            “{d.tagline}”
          </p>
          <p className="mt-2 text-sm md:text-base text-white/55 text-balance">
            {d.taglineKo}
          </p>
          <p className="mt-6 text-[10px] tracking-widest2 uppercase text-white/40 max-w-md">
            ✦ {d.spec}
          </p>
        </div>
      </motion.div>

      {/* Edge frame ticks */}
      <div className="pointer-events-none absolute top-6 left-6 right-6 flex justify-between text-[10px] tracking-widest3 uppercase text-white/30">
        <span>· Atlas of the world ·</span>
        <span>SHEET · {String(index + 1).padStart(2, '0')} of {destinations.length}</span>
      </div>
    </section>
  );
}

// Opening title overlay — appears over the first destination
function OpeningTitle() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const filter = useTransform(blur, b => `blur(${b}px)`);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden pointer-events-none"
      aria-hidden
    >
      <motion.div
        style={{ opacity, y, filter }}
        className="absolute inset-0 flex items-center justify-center px-6 z-10"
      >
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="text-[10px] tracking-widest3 uppercase text-white/70 mb-8"
          >
            태윤 💛 지은  ·  Volume I  ·  2025—∞
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 1.4 }}
            className="font-display text-[clamp(3.4rem,11vw,9rem)] leading-[0.94] text-white tracking-tight"
          >
            Worlds Worth
            <br />
            <span className="italic font-light">Seeing Together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-8 font-serif italic text-xl md:text-2xl text-white/80 text-balance"
          >
            가고 싶은, 가본, 그리고 갈 곳들.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
            className="mt-16 inline-flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-[10px] tracking-widest2 uppercase">
              Scroll · 여섯 개의 풍경
            </span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default function DestinationsHero() {
  return (
    <div className="relative bg-night-950">
      <OpeningTitle />
      {destinations.map((d, i) => (
        <DestinationScene key={d.id} d={d} index={i} />
      ))}
    </div>
  );
}
