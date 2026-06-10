import DestinationsHero from '@/components/DestinationsHero';
import BridgeSection from '@/components/BridgeSection';
import ConstellationExperience from '@/components/ConstellationExperience';
import MemoryPortal from '@/components/MemoryPortal';

export default function Page() {
  return (
    <>
      {/* Act I — cinematic destinations parallax (the "world worth seeing") */}
      <DestinationsHero />

      {/* Transition into our own atlas */}
      <BridgeSection />

      {/* Act II — our personal constellation (3D star map of trips taken) */}
      <ConstellationExperience />

      {/* Global modal (works across both acts) */}
      <MemoryPortal />
    </>
  );
}
