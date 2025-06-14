'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatService } from '../services/chatService';
import { ApiClient } from '../services/apiClient';
import type { Chat, Message, MessageDTO } from '../types';

/**
 * Hook for managing a single chat's data and operations
 */
export function useChat(chatId: string) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create a memoized instance of the chat service
  const chatService = useMemo(() => new ChatService(new ApiClient()), []);

  // Load chat data
  useEffect(() => {
    const loadChat = async () => {
      if (!chatId) return;
      
      try {
        setLoading(true);
        const data = await chatService.getChat(chatId);
        setChat(data);
        setMessages(data.messages || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [chatId, chatService]);

  // Send message function
  const sendMessage = useCallback(async (messageDto: MessageDTO) => {
    try {
      const message = await chatService.sendMessage(chatId, messageDto);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  }, [chatId, chatService]);

  // Delete chat function
  const deleteChat = useCallback(async () => {
    try {
      await chatService.deleteChat(chatId);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }, [chatId, chatService]);

  // Vote on a message
  const voteMessage = useCallback(async (messageId: string, type: 'up' | 'down') => {
    try {
      await chatService.voteMessage(chatId, messageId, type);
      // Could update local state here if we stored votes with messages
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [chatId, chatService]);

  return {
    chat,
    messages,
    loading,
    error,
    sendMessage,
    deleteChat,
    voteMessage,
  };
}
