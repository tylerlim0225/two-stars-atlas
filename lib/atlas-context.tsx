'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface AtlasState {
  selectedId: string | null;
  hoveredId: string | null;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  scrollProgress: number;
  setScrollProgress: (p: number) => void;
  prefersReducedMotion: boolean;
}

const AtlasContext = createContext<AtlasState | null>(null);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPRM] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setPRM(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const select = useCallback((id: string | null) => setSelectedId(id), []);
  const hover = useCallback((id: string | null) => setHoveredId(id), []);

  return (
    <AtlasContext.Provider
      value={{
        selectedId,
        hoveredId,
        select,
        hover,
        scrollProgress,
        setScrollProgress,
        prefersReducedMotion,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('AtlasProvider missing');
  return ctx;
}
