// "use client";

// import { useState } from "react";
// import toast from "react-hot-toast";

// import { useChat } from "@/context/ChatContext";
// import { sendMessage } from "@/services/chat.service";
// import { Message } from "@/types/chat";

// export default function useSendMessage() {
//   const [loading, setLoading] = useState(false);

//   const { selectedConversation, setMessages } = useChat();

//   const send = async (message: string) => {
//     if (!selectedConversation?._id) {
//       toast.error("No conversation selected");
//       return;
//     }

//     if (!message.trim()) {
//       toast.error("Message cannot be empty");
//       return;
//     }

//     setLoading(true);

//     try {
//       const data: Message = await sendMessage(
//         selectedConversation._id,
//         message
//       );

//       setMessages((prev) => [
//         ...prev,
//         {
//           ...data,
//           sender: "you",
//         },
//       ]);
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.error || "Failed to send message"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     send,
//   };
// }