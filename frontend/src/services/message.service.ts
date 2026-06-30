// services/message.service.ts
import axiosInstance from "@/lib/axiosInstance";
import { Conversation, Message } from '@/types/chat';



// Local storage keys
const READ_MESSAGES_KEY = 'read_messages';

// Get read messages from local storage
const getReadMessages = (): Set<string> => {
  try {
    const stored = localStorage.getItem(READ_MESSAGES_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
};

// Save read messages to local storage
const saveReadMessages = (readIds: Set<string>) => {
  try {
    localStorage.setItem(READ_MESSAGES_KEY, JSON.stringify([...readIds]));
  } catch (error) {
    console.error('Error saving read messages:', error);
  }
};

export const messageService = {
  async createConversation(receiverId: string): Promise<Conversation> {
    const { data } = await axiosInstance.post('/api/messages/conversation', { receiverId });
    return data;
  },

  async getAllConversations(): Promise<Conversation[]> {
    try {
      const { data } = await axiosInstance.get('/api/messages/allusers');
      return data.map((conv: any) => ({
        ...conv,
        lastMessage: conv.last_message || conv.lastMessage || "",
        updatedAt: conv.updatedAt || conv.updated_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },

  async getMessages(chatPartnerId: string): Promise<Message[]> {
    try {
      const { data } = await axiosInstance.get(`/api/messages/get/${chatPartnerId}`);
      
      // Mark messages as read in local storage
      const readIds = getReadMessages();
      data.forEach((msg: Message) => {
        if (msg.sender !== chatPartnerId && !msg.read) {
          readIds.add(msg._id);
        }
      });
      saveReadMessages(readIds);
      
      return data;
    } catch {
      return [];
    }
  },

  async sendMessage(receiverId: string, message: string): Promise<Message> {
    const { data } = await axiosInstance.post(`/api/messages/send/${receiverId}`, { message });
    return data;
  },

  async getUnreadCounts(): Promise<Record<string, number>> {
    try {
      const { data } = await axiosInstance.get('/api/messages/unread-count');
      if (Array.isArray(data)) {
        const map: Record<string, number> = {};
        data.forEach((item: any) => {
          if (item._id && item.count > 0) map[item._id] = item.count;
        });
        return map;
      }
      return data || {};
    } catch {
      return {};
    }
  },

  // Mark message as read in local storage (no API call)
  markMessageAsReadLocally(messageId: string): void {
    const readIds = getReadMessages();
    readIds.add(messageId);
    saveReadMessages(readIds);
  },

  // Check if message is read
  isMessageRead(messageId: string): boolean {
    const readIds = getReadMessages();
    return readIds.has(messageId);
  },

  // Clear read messages for a conversation
  clearReadMessagesForConversation(conversationId: string): void {
    // We'll handle this by filtering when displaying
  },
};