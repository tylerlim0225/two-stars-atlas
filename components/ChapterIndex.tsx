'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { trips, memoriesOfTrip } from '@/lib/data';
import { useAtlas } from '@/lib/atlas-context';

// Determine which trip is "in focus" based on scrollProgress.
// We slice the journey into equal phases: opening + N trips + closing.
function currentChapterIdx(progress: number): number {
  const phases = trips.length + 2; // opening + trips + closing
  const idx = Math.floor(progress * phases) - 1; // -1=opening, 0..N-1=trips, N=closing
  return Math.max(-1, Math.min(trips.length, idx));
}

export default function ChapterIndex() {
  const { scrollProgress, selectedId } = useAtlas();
  const idx = currentChapterIdx(scrollProgress);
  const showOpening = idx === -1;
  const showClosing = idx === trips.length;
  const tripInFocus = !showOpening && !showClosing ? trips[idx] : null;

  return (
    <AnimatePresence>
      {!selectedId && tripInFocus && (
        <motion.aside
          key={tripInFocus.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute top-1/2 left-6 md:left-10 -translate-y-1/2 z-10 max-w-[240px] md:max-w-[320px]"
        >
          <div className="text-[10px] tracking-widest3 uppercase text-gold-300/80">
            Constellation · {String(idx + 1).padStart(2, '0')}
          </div>
          <h2 className="mt-2 font-display text-3xl md:text-5xl text-ivory leading-tight">
            {tripInFocus.nameKo ?? tripInFocus.name}
          </h2>
          <p className="mt-2 text-xs md:text-sm italic font-serif text-ivory/55">
            “{tripInFocus.emotionTheme}”
          </p>
          <p className="mt-3 text-[10px] tracking-widest2 uppercase text-ivory/40">
            {tripInFocus.date}
            {tripInFocus.endDate && tripInFocus.endDate !== tripInFocus.date
              ? ` — ${tripInFocus.endDate}`
              : ''}
            {' · '}
            {memoriesOfTrip(tripInFocus.id).length} stars
          </p>
        </motion.aside>
      )}

      {!selectedId && showClosing && (
        <motion.div
          key="closing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-x-0 bottom-24 md:bottom-32 z-10 text-center px-6"
        >
          <p className="text-[10px] tracking-widest3 uppercase text-gold-300/70 mb-2">
            End of sheet
          </p>
          <p className="font-display text-2xl md:text-4xl text-ivory/85 italic">
            다음 별을 함께 그리러 가자
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
