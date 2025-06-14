import { ReactNode } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';
import { ArtifactKind } from '../artifact/artifact-types';
import { nanoid } from 'nanoid';

// ===== TOOLBAR CONSTANTS =====
// For reading level selector dots
export const randomArr = [...Array(6)].map((x) => nanoid(5));

export const READING_LEVELS = [
  { id: 'elementary', label: 'Elementary', description: 'Simple explanations for young readers' },
  { id: 'middle', label: 'Middle School', description: 'Clear explanations with basic concepts' },
  { id: 'current', label: 'Keep current level', description: 'Continue with the current style' },
  { id: 'high', label: 'High School', description: 'More detailed with some technical terms' },
  { id: 'college', label: 'College', description: 'In-depth coverage with technical details' },
  { id: 'graduate', label: 'Graduate', description: 'Advanced analysis with specialized vocabulary' }
];

// ===== TOOLBAR TYPES =====
export interface ToolProps {
  tool: ArtifactToolbarItem;
  selectedTool: string | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<string | null>>;
  isToolbarVisible?: boolean;
  setIsToolbarVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  isAnimating: boolean;
  append: UseChatHelpers['append'];
  isCompact?: boolean;
}

export interface ReadingLevelSelectorProps {
  setSelectedTool: React.Dispatch<React.SetStateAction<string | null>>;
  isAnimating: boolean;
  append: UseChatHelpers['append'];
}

export interface ToolsProps {
  isToolbarVisible: boolean;
  selectedTool: string | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<string | null>>;
  append: UseChatHelpers['append'];
  isAnimating: boolean;
  setIsToolbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tools: Array<ArtifactToolbarItem>;
}

export interface ToolbarProps {
  isToolbarVisible: boolean;
  setIsToolbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  status: UseChatHelpers['status'];
  append: UseChatHelpers['append'];
  stop: UseChatHelpers['stop'];
  setMessages: UseChatHelpers['setMessages'];
  artifactKind: ArtifactKind;
}

export interface ArtifactToolbarItem {
  id: string;
  description: string;
  icon: ReactNode;
  prompt?: string;
  onClick?: (context: { appendMessage: UseChatHelpers['append'] }) => void;
}
