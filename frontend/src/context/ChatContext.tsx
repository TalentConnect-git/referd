// "use client";

// import {createContext,useContext,useState,
// ReactNode,
// } from "react";

// import { Conversation, Message } from "@/types/chat";

// interface ChatContextType {
//   selectedConversation: Conversation | null;
//   setSelectedConversation: React.Dispatch<
//     React.SetStateAction<Conversation | null>
//   >;

//   showFloatingChat: boolean;
//   setShowFloatingChat: React.Dispatch<
//     React.SetStateAction<boolean>
//   >;

//   messages: Message[];
//   setMessages: React.Dispatch<
//     React.SetStateAction<Message[]>
//   >;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [selectedConversation, setSelectedConversation] =
//     useState<Conversation | null>(null);

//   const [showFloatingChat, setShowFloatingChat] =
//     useState(false);

//   const [messages, setMessages] =
//     useState<Message[]>([]);

//   return (
//     <ChatContext.Provider
//       value={{
//         selectedConversation,
//         setSelectedConversation,
//         showFloatingChat,
//         setShowFloatingChat,
//         messages,
//         setMessages,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);

//   if (!context) {
//     throw new Error(
//       "useChat must be used within a ChatProvider"
//     );
//   }

//   return context;
// };