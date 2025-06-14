import { ApiClient } from './apiClient';
import type { Chat, CreateChatDTO, Message, MessageDTO } from '../types';

/**
 * Service responsible for chat-related API operations
 */
export class ChatService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient = new ApiClient()) {
    this.apiClient = apiClient;
  }

  /**
   * Get all chats for a user
   */
  async getChats(): Promise<Chat[]> {
    return this.apiClient.get<Chat[]>('/history');
  }

  /**
   * Get a specific chat by ID
   */
  async getChat(chatId: string): Promise<Chat> {
    return this.apiClient.get<Chat>(`/chat/${chatId}`);
  }

  /**
   * Create a new chat
   */
  async createChat(data: CreateChatDTO): Promise<Chat> {
    return this.apiClient.post<Chat>('/chat', data);
  }

  /**
   * Send a message in a specific chat
   */
  async sendMessage(chatId: string, message: MessageDTO): Promise<Message> {
    return this.apiClient.post<Message>('/chat', {
      id: chatId,
      message: {
        id: crypto.randomUUID(),
        role: 'user',
        parts: [{ type: 'text', text: message.content }],
        experimental_attachments: message.attachments,
      },
      selectedChatModel: message.model || 'gpt-4o',
      selectedVisibilityType: message.visibility || 'private'
    });
  }

  /**
   * Delete a chat by ID
   */
  async deleteChat(chatId: string): Promise<void> {
    return this.apiClient.delete<void>(`/chat?id=${chatId}`);
  }

  /**
   * Get votes for a specific chat
   */
  async getVotes(chatId: string): Promise<any[]> {
    return this.apiClient.get<any[]>(`/vote?chatId=${chatId}`);
  }

  /**
   * Vote on a message in a chat
   */
  async voteMessage(chatId: string, messageId: string, type: 'up' | 'down'): Promise<void> {
    return this.apiClient.patch<void>('/vote', {
      chatId,
      messageId,
      type
    });
  }

  /**
   * Upload a file attachment
   */
  async uploadFile(file: File): Promise<{ url: string; pathname: string; contentType: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    return response.json();
  }
}
