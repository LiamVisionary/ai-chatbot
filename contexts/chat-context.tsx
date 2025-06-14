'use client';

import { Attachment } from 'ai';
import { createContext, ReactNode, useContext, useState } from 'react';
import { ChatContextProps, ChatProviderInitialValues } from '@/lib/types';

/**
 * Context for managing chat state and operations
 * This context provides shared state and functionality for chat components
 */
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

/**
 * Provider component for chat functionality
 * Distributes chat state and operations to all children components
 * 
 * @param children - React child components
 * @param initialValues - Initial values for chat session
 */
export function ChatProvider({ 
  children,
  initialValues
}: { 
  children: ReactNode;
  initialValues: ChatProviderInitialValues
}) {
  // Local state for attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // Extract values from initial values
  const { 
    chatId, 
    initialChatModel, 
    initialVisibilityType, 
    isReadonly, 
    votes 
  } = initialValues;
  
  // Extract chat helper functions
  const { 
    messages, 
    setMessages, 
    input, 
    setInput, 
    status, 
    handleSubmit, 
    append, 
    reload, 
    stop 
  } = initialValues.chatHelpers;

  // Combine all values into context
  const contextValue: ChatContextProps = {
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
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Hook to access chat context
 * Throws an error if used outside of a ChatProvider
 * 
 * @returns ChatContextProps - Chat state and operations
 */
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}