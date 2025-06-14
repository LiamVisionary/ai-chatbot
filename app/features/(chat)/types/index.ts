import { Attachment } from 'ai';

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface ChatSettings {
  model: string;
  visibility: VisibilityType;
  temperature?: number;
  maxTokens?: number;
}

export type VisibilityType = 'private' | 'public' | 'unlisted';

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  participants: User[];
  settings: ChatSettings;
  visibility: VisibilityType;
}

export interface MessagePart {
  type: 'text' | 'image' | 'file';
  text?: string;
  url?: string;
  fileType?: string;
}

export interface Message {
  id: string;
  chatId: string;
  content?: string;
  parts: MessagePart[];
  role: 'user' | 'assistant' | 'system';
  sender?: User;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: Attachment[];
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  isError?: boolean;
  reasoningSteps?: string[];
  modelName?: string;
  tokens?: {
    input: number;
    output: number;
    total: number;
  }
}

export interface CreateChatDTO {
  title: string;
  visibility?: VisibilityType;
  model?: string;
}

export interface MessageDTO {
  content: string;
  attachments?: File[];
  model?: string;
  visibility?: VisibilityType;
}

export interface Vote {
  id: string;
  messageId: string;
  chatId: string;
  type: 'up' | 'down';
  createdAt: Date;
}

// Type guards
export const isUserMessage = (message: Message): boolean => {
  return message.role === 'user';
};

export const isAssistantMessage = (message: Message): boolean => {
  return message.role === 'assistant';
};

export const isSystemMessage = (message: Message): boolean => {
  return message.role === 'system';
};

export const isTextPart = (part: MessagePart): boolean => {
  return part.type === 'text';
};

export const isImagePart = (part: MessagePart): boolean => {
  return part.type === 'image';
};

export const isFilePart = (part: MessagePart): boolean => {
  return part.type === 'file';
};
