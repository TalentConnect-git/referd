export interface Conversation {
  _id: string;
  name: string;
  lastMessage?: string;
  updatedAt: string;
  unreadCount?: number;
  isTemporary?: boolean;
  participants?: any[];
  userId?: string;
  receiverId?: string;
  senderId?: string;
  chatPartnerId?: string;
  profile?: any;
  user?: any;
  receiver?: any;
  sender?: any;
}

export interface Message {
  _id: string;
  sender?: string | { _id: string; name?: string };
  receiver?: string | { _id: string; name?: string };
  senderId?: string;
  receiverId?: string;
  chatPartnerId?: string;
  conversationId?: string;
  message?: string;
  text?: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  read?: boolean;
}