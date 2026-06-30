// types/chat.ts
export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;      // ✅ always present in your API
  receiverId: string;
  sender: string | {
    _id: string;
    name: string;
    avatar?: string;
  };
  message: string;
  read: boolean;
  createdAt: string;
}

// types/chat.ts


export interface Conversation {
  _id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role?: string;
// }