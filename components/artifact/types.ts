/**
 * Types for artifacts in the chat application
 */

export type ArtifactKind = 'text' | 'code' | 'image' | 'sheet';

export interface ArtifactMetadata {
  id: string;
  title: string;
  kind: ArtifactKind;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
