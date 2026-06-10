'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useAtlas } from '@/lib/atlas-context';

// Sits *under* the scrollable spacer. Reveals only at the bottom
// so the cinematic flight isn't interrupted.
export default function SiteFooter() {
  const { scrollProgress, selectedId } = useAtlas();
  const visible = scrollProgress > 0.94 && !selectedId;

  return (
    <motion.footer
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute bottom-6 left-6 right-6 z-10 flex flex-wrap items-end justify-between gap-4"
    >
      <div className="text-[10px] tracking-widest3 uppercase text-ivory/40">
        Two Stars Atlas · made with 💛
      </div>
      <Link
        href="/plan"
        className="pointer-events-auto inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold-500 text-night-950 text-xs tracking-widest2 uppercase font-semibold hover:bg-gold-300 transition"
      >
        Plan next constellation
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </motion.footer>
  );
}
