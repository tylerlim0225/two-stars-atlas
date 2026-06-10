'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { memories, PALETTE } from '@/lib/data';
import {
  starPositions,
  tripLines,
  buildBackgroundStars,
  cameraPath,
} from '@/lib/star-layout';
import { useAtlas } from '@/lib/atlas-context';

// ─────────────────────────────────────────────────────────────
// Background star field (particles)
// ─────────────────────────────────────────────────────────────
function BackgroundStars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => buildBackgroundStars(count), [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#F4EEE3"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────
// One interactive memory star
// ─────────────────────────────────────────────────────────────
function MemoryStar({
  id,
  position,
  color,
  size,
  selected,
  hovered,
}: {
  id: string;
  position: [number, number, number];
  color: string;
  size: number;
  selected: boolean;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { select, hover } = useAtlas();

  useFrame(state => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const baseScale =
      size * (0.95 + Math.sin(t * 1.3 + position[0]) * 0.08);
    const targetScale = selected ? baseScale * 2.4 : hovered ? baseScale * 1.6 : baseScale;
    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    );
  });

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[size * 0.45, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      {/* Core */}
      <mesh
        ref={ref}
        onClick={e => {
          e.stopPropagation();
          select(id);
        }}
        onPointerOver={e => {
          e.stopPropagation();
          hover(id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[size * 0.16, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Constellation lines (per trip)
// ─────────────────────────────────────────────────────────────
function TripLines() {
  return (
    <>
      {tripLines.map(tl => {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(tl.positions, 3));
        const mat = new THREE.LineBasicMaterial({
          color: tl.color,
          transparent: true,
          opacity: 0.35,
        });
        const line = new THREE.Line(geom, mat);
        return <primitive key={tl.tripId} object={line} />;
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Scroll-driven camera flight along cameraPath
// + zoom into selected star
// ─────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const { scrollProgress, selectedId } = useAtlas();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(10, 1.5, 18));

  useFrame((_, dt) => {
    let posTarget: THREE.Vector3;
    let lookTarget: THREE.Vector3;

    if (selectedId) {
      // Warp into selected star
      const p = starPositions.find(sp => sp.id === selectedId);
      if (p) {
        const [x, y, z] = p.position;
        posTarget = new THREE.Vector3(x, y, z + 1.6);
        lookTarget = new THREE.Vector3(x, y, z);
      } else {
        posTarget = desiredPos.current.clone();
        lookTarget = target.current.clone();
      }
    } else {
      // Glide along cameraPath using scrollProgress
      const segs = cameraPath.length - 1;
      const t = Math.min(0.999, Math.max(0, scrollProgress)) * segs;
      const i = Math.floor(t);
      const frac = t - i;
      const a = cameraPath[i];
      const b = cameraPath[Math.min(segs, i + 1)];
      posTarget = new THREE.Vector3(
        a.position[0] + (b.position[0] - a.position[0]) * frac,
        a.position[1] + (b.position[1] - a.position[1]) * frac,
        a.position[2] + (b.position[2] - a.position[2]) * frac,
      );
      lookTarget = new THREE.Vector3(
        a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * frac,
        a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * frac,
        a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * frac,
      );
    }

    const damp = selectedId ? 0.06 : 0.04;
    camera.position.lerp(posTarget, damp);
    target.current.lerp(lookTarget, damp);
    camera.lookAt(target.current);
  });

  return null;
}

// ─────────────────────────────────────────────────────────────
// Subtle mouse parallax for the whole scene
// ─────────────────────────────────────────────────────────────
function MouseParallax() {
  const { camera, mouse } = useThree();
  const offset = useRef(new THREE.Vector3());

  useFrame(() => {
    offset.current.lerp(
      new THREE.Vector3(mouse.x * 0.4, mouse.y * 0.25, 0),
      0.06
    );
    camera.position.x += (offset.current.x - (camera.position.x % 0.0001));
    camera.position.y += (offset.current.y - (camera.position.y % 0.0001));
  });

  return null;
}

// ─────────────────────────────────────────────────────────────
// Main canvas
// ─────────────────────────────────────────────────────────────
export default function ConstellationCanvas() {
  const { selectedId, hoveredId, prefersReducedMotion } = useAtlas();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const bgCount = isMobile ? 350 : 1200;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      camera={{ position: [10, 1.5, 18], fov: 55, near: 0.1, far: 200 }}
      dpr={dpr}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#06050A', 1);
        scene.fog = new THREE.FogExp2('#06050A', 0.02);
      }}
    >
      <Suspense fallback={null}>
        <BackgroundStars count={bgCount} />
        <TripLines />
        {memories.map(m => {
          const sp = starPositions.find(p => p.id === m.id);
          if (!sp) return null;
          return (
            <MemoryStar
              key={m.id}
              id={m.id}
              position={sp.position}
              color={PALETTE[m.star.palette]}
              size={m.star.size ?? 1}
              selected={selectedId === m.id}
              hovered={hoveredId === m.id}
            />
          );
        })}

        <CameraRig />
        {!prefersReducedMotion && !isMobile && <MouseParallax />}

        {!isMobile && !prefersReducedMotion && (
          <EffectComposer>
            <Bloom
              intensity={0.9}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
