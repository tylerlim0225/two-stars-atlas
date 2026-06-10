'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { getMemory } from '@/lib/data';
import { useAtlas } from '@/lib/atlas-context';

export default function HoverQuote() {
  const { hoveredId, selectedId } = useAtlas();
  if (selectedId) return null;
  const m = hoveredId ? getMemory(hoveredId) : null;

  return (
    <AnimatePresence>
      {m && (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute bottom-24 md:top-1/2 md:right-10 md:bottom-auto md:-translate-y-1/2 z-10 max-w-[280px] md:max-w-[340px] right-6 left-6 md:left-auto"
        >
          <div className="text-[10px] tracking-widest3 uppercase text-gold-300/80 mb-2 text-right">
            {m.date}
          </div>
          <h3 className="font-display text-xl md:text-2xl text-ivory text-right leading-tight">
            {m.name}
          </h3>
          {m.quote && (
            <p className="mt-2 font-serif italic text-sm md:text-base text-ivory/70 text-right text-balance">
              “{m.quote}”
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
