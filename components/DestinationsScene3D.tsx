'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { destinations } from '@/lib/destinations';

// ─────────────────────────────────────────────────────────────
// Layout — cards arranged along a curving path through 3D space.
// Z spacing chosen so camera can travel "between" them with room
// to slow & look around each.
// ─────────────────────────────────────────────────────────────
const Z_STEP = 14;
const X_SWAY = 4.5;
const Y_SWAY = 1.3;
const CARD_W = 11;
const CARD_H = 6.875; // 16:10
const CAMERA_FOV = 50;

interface CardPose {
  position: [number, number, number];
  rotation: [number, number, number];
}

const cardPoses: CardPose[] = destinations.map((_, i) => {
  const side = i % 2 === 0 ? 1 : -1;
  const phase = (i / destinations.length) * Math.PI * 2;
  return {
    position: [side * X_SWAY, Math.sin(phase) * Y_SWAY, -i * Z_STEP],
    // Tilt slightly toward the camera's expected approach path
    rotation: [0, -side * 0.22, side * 0.04],
  };
});

const Z_END = -(destinations.length - 1) * Z_STEP;

// ─────────────────────────────────────────────────────────────
// One destination card — textured plane + dark frame + faint
// reflective underbelly. useTexture is wrapped in Suspense per card.
// ─────────────────────────────────────────────────────────────
function DestinationCard({
  url,
  pose,
  index,
}: {
  url: string;
  pose: CardPose;
  index: number;
}) {
  const texture = useTexture(url);

  // Color space + filter tuning for nicer photos
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating animation, organic feel
  useFrame(state => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y =
      pose.position[1] + Math.sin(t * 0.45 + index * 1.2) * 0.18;
    groupRef.current.rotation.z =
      pose.rotation[2] + Math.sin(t * 0.35 + index * 0.7) * 0.012;
  });

  return (
    <group ref={groupRef} position={pose.position} rotation={pose.rotation}>
      {/* Dark frame behind */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[CARD_W + 0.35, CARD_H + 0.35]} />
        <meshBasicMaterial color="#06050A" />
      </mesh>

      {/* Photo plane */}
      <mesh>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Subtle gradient glow behind for halo */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[CARD_W * 1.3, CARD_H * 1.3]} />
        <meshBasicMaterial color="#C4A661" transparent opacity={0.08} />
      </mesh>

      {/* Faded mirror reflection underneath */}
      <mesh
        position={[0, -CARD_H / 2 - 0.05, -0.02]}
        rotation={[Math.PI, 0, 0]}
      >
        <planeGeometry args={[CARD_W * 0.92, CARD_H * 0.35]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Camera flight along the cards' path. Reads scrollProgress from
// a MotionValue every frame (no React re-render needed).
// ─────────────────────────────────────────────────────────────
function CameraRig({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);

    // Z position interpolates from in-front-of-first card to past-last-card
    const startZ = 14;
    const endZ = Z_END - 14;
    const camZ = startZ + (endZ - startZ) * p;

    // Find nearest cards (smooth blend)
    const float = p * (destinations.length - 1); // 0..N-1
    const lo = Math.floor(float);
    const hi = Math.min(destinations.length - 1, lo + 1);
    const frac = float - lo;

    // Camera x sways gently OPPOSITE to current card (so it looks "around" it)
    const cardA = cardPoses[lo].position;
    const cardB = cardPoses[hi].position;
    const camX = -(cardA[0] * (1 - frac) + cardB[0] * frac) * 0.3;
    const camY = (cardA[1] * (1 - frac) + cardB[1] * frac) * 0.4;

    targetPos.current.set(camX, camY, camZ);

    // Look slightly AHEAD — at the upcoming card center
    const aheadIdx = Math.min(destinations.length - 1, lo + (frac > 0.4 ? 1 : 0));
    const ahead = cardPoses[aheadIdx].position;
    lookTarget.current.set(ahead[0] * 0.6, ahead[1] * 0.6, ahead[2] + 1);

    camera.position.lerp(targetPos.current, 1 - Math.exp(-dt * 4));
    camera.lookAt(lookTarget.current);
  });

  return null;
}

// ─────────────────────────────────────────────────────────────
// Background — faint moving stars + soft fog
// ─────────────────────────────────────────────────────────────
function Atmosphere() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.008;
  });
  return (
    <group ref={ref}>
      <Stars radius={120} depth={80} count={600} factor={3} fade speed={0.3} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Loader-aware scene wrapper
// ─────────────────────────────────────────────────────────────
function Scene({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <Atmosphere />
      {destinations.map((d, i) => (
        <Suspense key={d.id} fallback={null}>
          <DestinationCard url={d.image} pose={cardPoses[i]} index={i} />
        </Suspense>
      ))}
      <CameraRig progress={progress} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Main canvas component
// ─────────────────────────────────────────────────────────────
export default function DestinationsScene3D({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: CAMERA_FOV, near: 0.1, far: 300 }}
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#0A080C', 1);
        scene.fog = new THREE.FogExp2('#0A080C', 0.018);
      }}
    >
      <Scene progress={progress} />

      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
