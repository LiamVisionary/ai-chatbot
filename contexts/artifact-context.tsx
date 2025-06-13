'use client';

import { UIArtifact, initialArtifactData } from '@/hooks/use-artifact';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface ArtifactContextProps {
  artifact: UIArtifact;
  setArtifact: (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => void;
  metadata: any;
  setMetadata: (metadata: any) => void;
  isArtifactVisible: boolean; 
}

const ArtifactContext = createContext<ArtifactContextProps | undefined>(undefined);

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifact, setLocalArtifact] = useState<UIArtifact>(initialArtifactData);
  const [metadata, setLocalMetadata] = useState<any>(null);

  const setArtifact = useCallback(
    (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
      setLocalArtifact((currentArtifact) => {
        if (typeof updaterFn === 'function') {
          return updaterFn(currentArtifact);
        }
        return updaterFn;
      });
    },
    []
  );

  const setMetadata = useCallback((newMetadata: any) => {
    setLocalMetadata(newMetadata);
  }, []);

  const isArtifactVisible = useMemo(() => artifact.isVisible, [artifact.isVisible]);

  const value = useMemo(
    () => ({
      artifact,
      setArtifact,
      metadata,
      setMetadata,
      isArtifactVisible
    }),
    [artifact, setArtifact, metadata, setMetadata, isArtifactVisible]
  );

  return (
    <ArtifactContext.Provider value={value}>
      {children}
    </ArtifactContext.Provider>
  );
}

export const useArtifactContext = () => {
  const context = useContext(ArtifactContext);
  if (context === undefined) {
    throw new Error('useArtifactContext must be used within an ArtifactProvider');
  }
  return context;
};