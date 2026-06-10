'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Cinematic transition from "world destinations" → "our personal constellation".
// Fades from photography into deep night so the 3D canvas reveals seamlessly.
export default function BridgeSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%']);

  return (
    <section
      ref={ref}
      className="relative h-[110vh] grid place-items-center px-6 overflow-hidden"
    >
      {/* Gradient: black → deep night (matches constellation bg) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-night-900 to-night-950" />
      {/* Star whispers — tiny dots */}
      <div className="absolute inset-0 opacity-50">
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i * 37) % 100;
          const y = (i * 73) % 100;
          return (
            <span
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-white/60 animate-twinkle"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${(i % 7) * 0.4}s`,
              }}
            />
          );
        })}
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative text-center max-w-3xl"
      >
        <p className="text-[10px] tracking-widest3 uppercase text-gold-300/80 mb-7">
          But our own atlas
        </p>
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.05] text-ivory text-balance">
          is much closer
          <br />
          <span className="italic font-light text-gold-300">to home.</span>
        </h2>
        <p className="mt-9 font-serif italic text-xl md:text-2xl text-ivory/70 text-balance">
          가본 적 없는 풍경 너머에,
          <br />
          우리만 아는 작은 별들이 있다.
        </p>

        <motion.div
          style={{ width: lineWidth }}
          className="mx-auto mt-12 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent max-w-md"
        />

        <p className="mt-6 text-[10px] tracking-widest2 uppercase text-ivory/50">
          ✦ Our Constellation begins ✦
        </p>
      </motion.div>
    </section>
  );
}
