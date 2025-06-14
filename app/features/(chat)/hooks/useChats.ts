'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatService } from '../services/chatService';
import { ApiClient } from '../services/apiClient';
import type { Chat, CreateChatDTO } from '../types';

/**
 * Hook for managing multiple chats
 */
export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create a memoized instance of the chat service
  const chatService = useMemo(() => new ChatService(new ApiClient()), []);

  // Load all chats
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatService.getChats();
      setChats(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [chatService]);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Create a new chat
  const createChat = useCallback(async (data: CreateChatDTO) => {
    try {
      const newChat = await chatService.createChat(data);
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [chatService]);

  // Delete a chat
  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await chatService.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }, [chatService]);

  return {
    chats,
    loading,
    error,
    loadChats,
    createChat,
    deleteChat,
  };
}
