import { UIMessage, Attachment } from 'ai';
import { VisibilityType } from '@/components/visibility-selector';
import { Vote } from '@/lib/db/schema';
import { UseChatHelpers } from '@ai-sdk/react';

// Original type
export type DataPart = { type: 'append-message'; message: string };

// Common application types
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Enhanced chat types
export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  visibility: VisibilityType;
  model: string;
}

export interface ChatContextProps {
  chatId: string;
  messages: UIMessage[];
  setMessages: UseChatHelpers['setMessages'];
  input: string;
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  
  handleSubmit: UseChatHelpers['handleSubmit'];
  append: UseChatHelpers['append'];
  reload: UseChatHelpers['reload'];
  stop: () => void;
  
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[] | ((current: Attachment[]) => Attachment[])) => void;
  
  isReadonly: boolean;
  initialChatModel: string;
  selectedVisibilityType: VisibilityType;
  
  votes: Vote[] | undefined;
}

export interface ChatProviderInitialValues {
  chatId: string;
  initialMessages: UIMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  chatHelpers: Pick<UseChatHelpers, 'messages' | 'setMessages' | 'input' | 'setInput' | 'status' | 'handleSubmit' | 'append' | 'reload' | 'stop'>;
  votes?: Vote[];
}

// Error types
export interface ApiError extends Error {
  status?: number;
  info?: Record<string, any>;
}

// Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
