// import { createContext, useContext, useState, ReactNode } from "react";

// type UnreadMessagesContextType = {
//   unreadCounts: Record<string, number>;
//   incrementUnread: (conversationId: string) => void;
//   resetUnread: (conversationId: string) => void;
// };

// const UnreadMessagesContext = createContext<
//   UnreadMessagesContextType | undefined
// >(undefined);

// export function UnreadMessagesProvider({ children }: { children: ReactNode }) {
//   const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

//   const incrementUnread = (conversationId: string) => {
//     setUnreadCounts((prev) => ({
//       ...prev,
//       [conversationId]: (prev[conversationId] || 0) + 1,
//     }));
//   };

//   const resetUnread = (conversationId: string) => {
//     setUnreadCounts((prev) => ({
//       ...prev,
//       [conversationId]: 0,
//     }));
//   };

//   return (
//     <UnreadMessagesContext.Provider
//       value={{ unreadCounts, incrementUnread, resetUnread }}
//     >
//       {children}
//     </UnreadMessagesContext.Provider>
//   );
// }

// export function useUnreadMessages() {
//   const context = useContext(UnreadMessagesContext);
//   if (context === undefined) {
//     throw new Error(
//       "useUnreadMessages must be used within a UnreadMessagesProvider"
//     );
//   }
//   return context;
// }
