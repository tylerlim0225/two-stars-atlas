'use client';

import { trips } from '@/lib/data';

// The 3D canvas is fixed; we need actual scrollable height so the
// page has scroll progress for Lenis/Camera to map onto.
// One "viewport-height" per trip + opening + closing.
export default function ScrollSpacer() {
  const total = trips.length + 2; // opening + N trips + closing
  return (
    <div
      aria-hidden
      style={{ height: `${total * 100}vh` }}
      className="relative pointer-events-none"
    />
  );
}
