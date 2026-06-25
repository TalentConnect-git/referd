// "use client";

// import { useEffect, useState } from "react";
// import { Conversation } from "@/types/chat";
// import {getAllUsers,getUnreadCounts} from "@/services/chat.service";

// interface UnreadCount {
//   _id: string;
//   count: number;
// }

// const useGetAllUsers = () => {
//   const [allUsers, setAllUsers] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

//   const refreshUsers = async () => {
//     setLoading(true);

//     try {
//       const [usersResponse, unreadResponse] = await Promise.all([
//         getAllUsers(),getUnreadCounts()
//       ]);

//       const unreadMap: Record<string, number> = {};

//       unreadResponse.data.forEach((item: UnreadCount) => {
//         unreadMap[item._id] = item.count;
//       });

//       setAllUsers(usersResponse.data);
//       setUnreadCounts(unreadMap);
//     } catch (error) {
//       console.error("Error in useGetAllUsers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshUsers();
//   }, []);

//   return {
//     allUsers,
//     loading,
//     unreadCounts,
//     refreshUsers,
//   };
// };

// export default useGetAllUsers;