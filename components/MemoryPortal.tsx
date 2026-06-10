'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin, Calendar, Heart, Quote, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { getMemory, getTrip } from '@/lib/data';
import { useAtlas } from '@/lib/atlas-context';

export default function MemoryPortal() {
  const { selectedId, select } = useAtlas();
  const memory = selectedId ? getMemory(selectedId) : null;
  const trip = memory ? getTrip(memory.tripId) : null;

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          key="portal-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-30 grid place-items-center pointer-events-none"
        >
          {/* Soft veil over the 3D scene */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => select(null)}
            className="absolute inset-0 bg-night-950/55 backdrop-blur-[3px] pointer-events-auto"
          />

          {/* Memory scene card */}
          <motion.article
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-3xl mx-4 w-[min(96vw,720px)] pointer-events-auto"
          >
            {/* Back button */}
            <button
              onClick={() => select(null)}
              className="mb-4 inline-flex items-center gap-2 text-ivory/70 hover:text-ivory text-[10px] tracking-widest2 uppercase transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to the sky
            </button>

            <div className="relative rounded-3xl overflow-hidden border border-ivory/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
              {/* Photo placeholder area */}
              <div
                className={`relative h-72 md:h-96 bg-gradient-to-br ${
                  memory.photoColor ?? 'from-night-700 to-night-900'
                } overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
                {/* Particle grain */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-25"
                  aria-hidden
                >
                  <defs>
                    <pattern
                      id="grain"
                      x="0"
                      y="0"
                      width="80"
                      height="80"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="10" cy="10" r="0.5" fill="#fff" opacity="0.5" />
                      <circle cx="40" cy="32" r="0.6" fill="#fff" opacity="0.4" />
                      <circle cx="60" cy="60" r="0.4" fill="#fff" opacity="0.6" />
                      <circle cx="20" cy="55" r="0.5" fill="#fff" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grain)" />
                </svg>

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-night-950/55 text-ivory text-[10px] tracking-widest2 uppercase backdrop-blur">
                  <MapPin className="w-3 h-3" /> {memory.region}
                </div>
                {memory.favorite && (
                  <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-burgundy/85 text-ivory text-[10px] tracking-widest2 uppercase">
                    <Heart className="w-3 h-3 fill-current" /> Favorite
                  </div>
                )}
                {/* Constellation badge */}
                {trip && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-night-950/55 text-ivory text-[10px] tracking-widest2 uppercase backdrop-blur">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: trip.lineColor }}
                    />
                    {trip.nameKo ?? trip.name}
                  </div>
                )}

                {/* Close */}
                <button
                  onClick={() => select(null)}
                  className="absolute bottom-4 left-4 grid place-items-center w-9 h-9 rounded-full bg-night-950/60 backdrop-blur text-ivory hover:bg-night-950/85 transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="bg-night-900/95 backdrop-blur p-7 md:p-10 text-ivory">
                <div className="flex items-center gap-2 text-[10px] tracking-widest2 uppercase text-ivory/55">
                  <Calendar className="w-3 h-3" />
                  <span>{memory.date}</span>
                </div>

                <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
                  {memory.name}
                </h2>
                {memory.nameEn && (
                  <p className="mt-1 italic text-sm text-ivory/40">
                    {memory.nameEn}
                  </p>
                )}

                {memory.quote && (
                  <figure className="mt-7 relative pl-7 border-l-2 border-gold-500/40">
                    <Quote className="absolute -left-3 top-0 w-5 h-5 text-gold-500 bg-night-900 rounded-full p-0.5" />
                    <blockquote className="font-serif italic text-xl md:text-2xl text-ivory/90 leading-relaxed">
                      “{memory.quote}”
                    </blockquote>
                  </figure>
                )}

                {memory.emotion.length > 0 && (
                  <div className="mt-7">
                    <p className="text-[10px] tracking-widest2 uppercase text-ivory/45 mb-3">
                      Emotion · 감정
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {memory.emotion.map(e => (
                        <span
                          key={e}
                          className="px-3 py-1 text-xs rounded-full bg-ivory/8 text-ivory/85"
                        >
                          # {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {memory.memories.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[10px] tracking-widest2 uppercase text-ivory/45 mb-3">
                      Memories · 기억
                    </p>
                    <ul className="space-y-2.5">
                      {memory.memories.map((m, i) => (
                        <li
                          key={i}
                          className="text-sm md:text-base leading-relaxed text-ivory/85 pl-4 relative before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:rounded-full before:bg-gold-500"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
