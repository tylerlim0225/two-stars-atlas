// Deterministic 3D layout for memories.
// X axis = time (earlier on left, later on right)
// Y axis = emotion band (light = up, intimate = down)
// Z axis = trip cluster (depth)
//
// Pure math, no randomness sourced from Math.random() at module
// scope — every star's position is reproducible from its data,
// so the layout stays stable across reloads and SSR.

import { memories, trips, type Memory } from './data';

const X_SPAN = 14; // total horizontal spread
const Y_SPAN = 5;
const Z_SPAN = 8;

// Cheap deterministic hash → [0, 1)
function hash01(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % 100000) / 100000;
}

function dateNorm(date: string, anchorEarliest: number, anchorLatest: number) {
  const t = new Date(date).getTime();
  return (t - anchorEarliest) / Math.max(1, anchorLatest - anchorEarliest);
}

export interface StarPosition {
  id: string;
  position: [number, number, number];
}

export const starPositions: StarPosition[] = (() => {
  const dates = memories.map(m => new Date(m.date).getTime());
  const earliest = Math.min(...dates);
  const latest = Math.max(...dates);

  const tripCenters = new Map<string, { y: number; z: number }>();
  trips.forEach((t, idx) => {
    const angle = (idx / trips.length) * Math.PI * 2;
    tripCenters.set(t.id, {
      y: Math.sin(angle) * 0.6,
      z: Math.cos(angle) * 0.6,
    });
  });

  return memories.map<StarPosition>(m => {
    const tx = dateNorm(m.date, earliest, latest); // 0..1
    const x = (tx - 0.5) * X_SPAN;

    const center = tripCenters.get(m.tripId) ?? { y: 0, z: 0 };
    const yJitter = (hash01(m.id + 'y') - 0.5) * 1.2;
    const zJitter = (hash01(m.id + 'z') - 0.5) * 1.2;

    const y = center.y * (Y_SPAN / 2) + yJitter;
    const z = center.z * (Z_SPAN / 2) + zJitter;

    return { id: m.id, position: [x, y, z] };
  });
})();

export function getStarPosition(id: string): [number, number, number] {
  return starPositions.find(p => p.id === id)?.position ?? [0, 0, 0];
}

// Background star field — pure decoration, more numerous, more
// distant. Seeded so it doesn't reshuffle on every render.
export function buildBackgroundStars(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const h1 = hash01(`bg-x-${i}`);
    const h2 = hash01(`bg-y-${i}`);
    const h3 = hash01(`bg-z-${i}`);
    // Wide, distant shell
    const radius = 30 + h3 * 40;
    const theta = h1 * Math.PI * 2;
    const phi = (h2 - 0.5) * Math.PI;
    positions[i * 3]     = radius * Math.cos(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);
  }
  return positions;
}

// Build line segments for trip constellations: connect consecutive
// memories (sorted by date) into a continuous polyline.
export interface TripLine {
  tripId: string;
  color: string;
  positions: Float32Array; // flat (x,y,z) per vertex
}

import { memoriesOfTrip } from './data';

export const tripLines: TripLine[] = trips
  .map<TripLine | null>(t => {
    const ms = memoriesOfTrip(t.id);
    if (ms.length < 2) return null;
    const positions = new Float32Array(ms.length * 3);
    ms.forEach((m, i) => {
      const p = getStarPosition(m.id);
      positions[i * 3]     = p[0];
      positions[i * 3 + 1] = p[1];
      positions[i * 3 + 2] = p[2];
    });
    return { tripId: t.id, color: t.lineColor, positions };
  })
  .filter((x): x is TripLine => x !== null);

// Camera path: a smooth curve through the full atlas.
// Used by scroll-linked progress to fly the camera.
export interface CameraKeyframe {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export const cameraPath: CameraKeyframe[] = [
  { position: [10, 1.5, 18], lookAt: [0, 0, 0] },   // wide opening
  { position: [6, 1.0, 14], lookAt: [-2, 0, 0] },
  { position: [0, 0.5, 12], lookAt: [-4, 0, 0] },
  { position: [-5, 0, 10], lookAt: [-6, 0, -1] },
  { position: [-9, -0.3, 8], lookAt: [-7, 0, 0] },
  { position: [-7, 0.5, 14], lookAt: [-2, 0, 0] },   // pull back
];
