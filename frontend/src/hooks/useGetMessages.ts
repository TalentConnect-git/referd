// "use client";

// import { useEffect, useState } from "react";
// import { useChat } from "@/context/ChatContext";
// import { getMessages } from "@/services/chat.service";
// import { Message } from "@/types/chat";

// const useGetMessages = () => {
//   const [loading, setLoading] = useState(false);

//   const {selectedConversation,messages,setMessages} = useChat();

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedConversation?._id) {
//         setMessages([]);
//         return;
//       }

//       setLoading(true);

//       try {
//         const data = await getMessages(selectedConversation._id);
//         const formattedMessages: Message[] = (
//           Array.isArray(data) ? data : []
//         ).map((msg: Message) => ({
//           ...msg,
//           sender:
//             String(msg.senderId) === String(selectedConversation._id)
//               ? "them"
//               : "you",
//         }));

//         setMessages(formattedMessages);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//         setMessages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedConversation, setMessages]);

//   return {
//     loading,
//     messages,
//   };
// };

// export default useGetMessages;