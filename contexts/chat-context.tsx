'use client';

import { UIMessage, Attachment } from 'ai';
import { Vote } from '@/lib/db/schema';
import { UseChatHelpers } from '@ai-sdk/react';
import { VisibilityType } from '@/components/visibility-selector';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextProps {
  // Chat state
  chatId: string;
  messages: UIMessage[];
  setMessages: UseChatHelpers['setMessages'];
  input: string;
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  
  // Chat actions
  handleSubmit: UseChatHelpers['handleSubmit'];
  append: UseChatHelpers['append'];
  reload: UseChatHelpers['reload'];
  stop: () => void;
  
  // Attachments 
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[] | ((current: Attachment[]) => Attachment[])) => void;
  
  // Chat configuration
  isReadonly: boolean;
  initialChatModel: string;
  selectedVisibilityType: VisibilityType;
  
  // Chat related data
  votes: Vote[] | undefined;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ 
  children,
  initialValues
}: { 
  children: ReactNode;
  initialValues: {
    chatId: string;
    initialMessages: UIMessage[];
    initialChatModel: string;
    initialVisibilityType: VisibilityType;
    isReadonly: boolean;
    chatHelpers: Pick<UseChatHelpers, 'messages' | 'setMessages' | 'input' | 'setInput' | 'status' | 'handleSubmit' | 'append' | 'reload' | 'stop'>;
    votes?: Vote[];
  }
}) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { chatId, initialChatModel, initialVisibilityType, isReadonly, votes } = initialValues;
  const { messages, setMessages, input, setInput, status, handleSubmit, append, reload, stop } = initialValues.chatHelpers;

  return (
    <ChatContext.Provider value={{
      chatId,
      messages,
      setMessages,
      input,
      setInput,
      status,
      handleSubmit,
      append,
      reload,
      stop,
      attachments,
      setAttachments,
      isReadonly,
      initialChatModel,
      selectedVisibilityType: initialVisibilityType,
      votes
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}