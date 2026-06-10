'use client';

import dynamic from 'next/dynamic';
import HeroOverlay from '@/components/HeroOverlay';
import ChapterIndex from '@/components/ChapterIndex';
import HoverQuote from '@/components/HoverQuote';
import MemoryPortal from '@/components/MemoryPortal';
import ScrollSpacer from '@/components/ScrollSpacer';
import SiteFooter from '@/components/SiteFooter';

const ConstellationCanvas = dynamic(
  () => import('@/components/ConstellationCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 grid place-items-center text-ivory/30 text-[10px] tracking-widest3 uppercase">
        ✦ drawing the sky ✦
      </div>
    ),
  },
);

export default function Page() {
  return (
    <>
      {/* The 3D canvas occupies the viewport, fixed */}
      <div className="fixed inset-0 z-0">
        <ConstellationCanvas />
      </div>

      {/* Floating overlays */}
      <HeroOverlay />
      <ChapterIndex />
      <HoverQuote />
      <MemoryPortal />
      <SiteFooter />

      {/* Scroll body — gives the page actual height so scroll progress works */}
      <ScrollSpacer />
    </>
  );
}
