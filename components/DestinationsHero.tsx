'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import { destinations } from '@/lib/destinations';

const DestinationsScene3D = dynamic(() => import('./DestinationsScene3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-[#0A080C] text-white/30 text-[10px] tracking-widest3 uppercase">
      ✦ drawing the world ✦
    </div>
  ),
});

// ─────────────────────────────────────────────────────────────
// Opening title screen — non-3D, sets the tone before the journey
// ─────────────────────────────────────────────────────────────
function OpeningTitle() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const filter = useTransform(blur, b => `blur(${b}px)`);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden pointer-events-none bg-night-950"
      aria-hidden
    >
      {/* Soft warm radial behind so it's not pure black */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(196,166,97,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(92,42,42,0.15),transparent_60%)]" />

      <motion.div
        style={{ opacity, y, filter }}
        className="absolute inset-0 flex items-center justify-center px-6 z-10"
      >
        <div className="text-center max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="text-[10px] tracking-widest3 uppercase text-white/70 mb-8"
          >
            태윤 💛 지은 · Volume I · 2025—∞
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="font-display text-[clamp(3.4rem,11vw,9rem)] leading-[0.94] text-white tracking-tight"
          >
            Worlds Worth
            <br />
            <span className="italic font-light text-gold-300">
              Seeing Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
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
              Scroll · 여섯 개의 풍경을 비행하기
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

// ─────────────────────────────────────────────────────────────
// Text overlay synced with current destination via scroll progress.
// AnimatePresence handles smooth crossfade between destinations.
// ─────────────────────────────────────────────────────────────
function DestinationOverlay({
  progress,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  useMotionValueEvent(progress, 'change', v => {
    const idx = Math.min(
      destinations.length - 1,
      Math.max(0, Math.floor(v * destinations.length)),
    );
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  const d = destinations[activeIdx];

  return (
    <>
      {/* Edge frame ticks */}
      <div className="pointer-events-none absolute top-6 left-6 right-6 flex justify-between text-[10px] tracking-widest3 uppercase text-white/35 z-20">
        <span>· Atlas of the world ·</span>
        <span>
          SHEET · {String(activeIdx + 1).padStart(2, '0')} of{' '}
          {String(destinations.length).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom legible gradient — keeps text readable over photo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/40 to-transparent z-10" />

      {/* Text card */}
      <div className="pointer-events-none absolute bottom-16 md:bottom-24 left-6 md:left-16 right-6 z-20 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[10px] tracking-widest3 uppercase mb-4"
              style={{ color: d.accent }}
            >
              {String(activeIdx + 1).padStart(2, '0')} · {d.region}
            </p>
            <h2 className="font-display text-[clamp(3rem,10vw,8rem)] text-white leading-[0.92] tracking-tight">
              {d.name}
            </h2>
            <p className="mt-3 text-xs md:text-sm tracking-widest2 uppercase text-white/65">
              {d.nameKo}
            </p>
            <p className="mt-6 font-serif italic text-xl md:text-3xl text-white/85 max-w-2xl text-balance leading-snug">
              “{d.tagline}”
            </p>
            <p className="mt-2 text-sm md:text-base text-white/55 text-balance">
              {d.taglineKo}
            </p>
            <p className="mt-5 text-[10px] tracking-widest2 uppercase text-white/40 max-w-md">
              ✦ {d.spec}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots (right side, desktop only) */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-20 hidden md:flex flex-col gap-2">
        {destinations.map((_, i) => (
          <span
            key={i}
            className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i === activeIdx
                ? 'bg-gold-300 scale-150 shadow-[0_0_12px_rgba(196,166,97,0.7)]'
                : 'bg-white/25'
            }`}
          />
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 3D Destinations section — one tall scrollable area with sticky
// inner viewport. Camera in DestinationsScene3D reads scroll
// progress from a MotionValue (no React re-render storm).
// ─────────────────────────────────────────────────────────────
function Destinations3DSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Generous scroll runway — gives each destination ~100vh of focus
  const heightVh = (destinations.length + 1) * 100;

  return (
    <section
      ref={ref}
      className="relative bg-night-950"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <DestinationsScene3D progress={scrollYProgress} />
        <DestinationOverlay progress={scrollYProgress} />
      </div>
    </section>
  );
}

export default function DestinationsHero() {
  return (
    <div className="relative">
      <OpeningTitle />
      <Destinations3DSection />
    </div>
  );
}
