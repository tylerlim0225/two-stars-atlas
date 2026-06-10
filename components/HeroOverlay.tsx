'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { atlas } from '@/lib/data';
import { useAtlas } from '@/lib/atlas-context';

export default function HeroOverlay() {
  const { scrollProgress } = useAtlas();
  const visible = scrollProgress < 0.06;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center"
    >
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.0 }}
          className="text-[10px] tracking-widest3 text-gold-300/80 uppercase mb-10"
        >
          {atlas.period.from} — {atlas.period.to} · Volume I
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.9, duration: 1.4 }}
          className="font-display text-[clamp(2.8rem,9vw,7rem)] leading-[1.02] text-ivory font-medium tracking-wide"
        >
          {atlas.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-3 flex items-center justify-center gap-3 text-ivory/55 text-xs tracking-widest2 uppercase"
        >
          <span className="h-px w-10 bg-gold-500/40" />
          <span>{atlas.titleKo}</span>
          <span className="h-px w-10 bg-gold-500/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="mt-12 font-serif italic text-xl md:text-2xl text-ivory/85 text-balance"
        >
          “{atlas.tagline}”
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="mt-2 text-sm text-ivory/45"
        >
          {atlas.taglineEn}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.9, duration: 1.2 }}
          className="mt-20 inline-flex flex-col items-center gap-2 text-ivory/55"
        >
          <span className="text-[10px] tracking-widest2 uppercase">
            Scroll · 별 사이를 비행하기
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </motion.div>
      </div>

      {/* Top edge tags */}
      <div className="absolute top-6 left-6 right-6 flex justify-between text-[10px] tracking-widest3 uppercase text-ivory/30">
        <span>· {atlas.authors.join(' & ')} ·</span>
        <span>· Constellation Volume I ·</span>
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[10px] tracking-widest3 uppercase text-ivory/30">
        <span>Two Stars</span>
        <span>Atlas · 우리만의 밤하늘</span>
      </div>
    </motion.div>
  );
}
