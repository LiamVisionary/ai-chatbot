import { Document } from '@/lib/db/schema';
import { Dispatch, SetStateAction } from 'react';
import { imageArtifact } from '@/app/features/artifacts/image/client';
import { codeArtifact } from '@/app/features/artifacts/code/client';
import { sheetArtifact } from '@/app/features/artifacts/sheet/client';
import { textArtifact } from '@/app/features/artifacts/text/client';

// ===== ARTIFACT DEFINITIONS =====
export const artifactDefinitions = [
  textArtifact,
  codeArtifact,
  imageArtifact,
  sheetArtifact,
];

// ===== ARTIFACT TYPES =====
export type ArtifactKind = (typeof artifactDefinitions)[number]['kind'];

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: 'streaming' | 'idle';
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface ArtifactVersionHandlerProps {
  type: 'next' | 'prev' | 'toggle' | 'latest';
}

export interface ArtifactAnimationProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  windowWidth: number | null;
  windowHeight: number | null;
  artifact: UIArtifact;
}

export interface DocumentContextProps {
  artifact: UIArtifact;
  setArtifact: Dispatch<SetStateAction<UIArtifact>>;
  saveContent: (updatedContent: string, debounce: boolean) => void;
  isContentDirty: boolean;
  document: Document | null;
  documents: Document[] | undefined;
  isDocumentsFetching: boolean;
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  getDocumentContentById: (index: number) => string;
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
}

// Types for component props
export interface ArtifactHeaderProps {
  artifact: UIArtifact;
  isContentDirty: boolean;
  document: Document | null;
  currentVersionIndex: number;
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
  isCurrentVersion: boolean;
  mode: string;
}

export interface ArtifactContentProps {
  artifact: UIArtifact;
  isCurrentVersion: boolean;
  getDocumentContentById: (index: number) => string;
  currentVersionIndex: number;
  documents: Document[] | undefined;
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
  isDocumentsFetching: boolean;
  saveContent: (updatedContent: string, debounce: boolean) => void;
  metadata: any;
  setMetadata: Dispatch<SetStateAction<any>>;
  mode: string;
}
