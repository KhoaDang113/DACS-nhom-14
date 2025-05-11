import { SearchIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
// import { useUnreadMessages } from "../../contexts/UnreadMessagesContext";

type User = {
  _id: string;
  fullName: string;
  avatar: string;
  isOnline?: boolean;
};
type Conversation = {
  _id: string;
  user: User;
  lastMessage: string;
  lastMessageSender: string;
  updatedAt: Date;
  unread?: boolean;
};
const formatTimeAgo = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export default function Sidebar({ socket, currentUser }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchConversation, setSearchConversation] = useState("");
  // const { unreadCounts, resetUnread } = useUnreadMessages();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const focu = () => {
    inputRef.current?.focus();
  };

  const inboxNavigate = (conversation: Conversation) => {
    setActiveConversationId(conversation._id);
    // resetUnread(conversation._id);
    navigate(`/inbox/${conversation._id}`);
  };

  useEffect(() => {
    const fetchConversation = async () => {
      // Chỉ thực hiện request khi Clerk đã tải xong và người dùng đã đăng nhập
      if (!isLoaded || !isSignedIn) return;

      // Thêm retry logic để tránh lỗi 401
      let retried = false;

      while (!retried) {
        try {
          const token = await getToken({ template: "TemplateClaim" });
          if (!token) {
            throw new Error("Không thể lấy token");
          }

          const response = await axios.get(
            "http://localhost:5000/api/conversation/get-conversations",
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.data.conversationList;
          setConversations(data);
          if (conversations) {
            retried = true;
          }
          break; // Thoát vòng lặp nếu thành công
        } catch (err) {
          // Đợi 2 giây trước khi thử lại
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    };

    fetchConversation();
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    socket.on("return_new_message", (data) => {
      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          const isLastSender = data.sender === currentUser?.user?._id;
          if (conversation._id === data.conversationId) {
            return {
              ...conversation,
              lastMessage: data.message,
              lastMessageSender: isLastSender ? "Me: " : "",
              updatedAt: new Date(),
            };
          }
          return conversation;
        });
      });
    });

    return () => {
      socket.off("return_new_message");
    };
  }, [socket]);

  const filterConversation = conversations.filter((conversation) => {
    return conversation.user.fullName
      ?.toLowerCase()
      .includes(searchConversation.toLowerCase().trim());
  });

  const displayedConversations =
    searchConversation.trim() === "" ? conversations : filterConversation;
  // Hiển thị loading state khi Clerk chưa tải xong
  if (!isLoaded) {
    return (
      <div className="w-80 border-r bg-gray-50 hidden md:block overflow-x-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">All messages</span>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-200">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="h-[calc(100%-60px)] overflow-auto flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-gray-50 hidden md:block">
      <div className="p-4 border-b flex justify-between items-center gap-2">
        <button className="p-1 rounded-full hover:bg-gray-200">
          <SearchIcon className="h-5 w-5 text-gray-500" onClick={focu} />
        </button>
        <input
          type="text"
          ref={inputRef}
          placeholder="Tìm kiếm hội thoại..."
          value={searchConversation}
          onChange={(e) => setSearchConversation(e.target.value)}
          className="w-full p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="h-[calc(100%-60px)] overflow-auto">
        {displayedConversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => inboxNavigate(conversation)}
            className={`p-4 hover:bg-gray-100 cursor-pointer border-b transition-colors duration-200 ${
              activeConversationId === conversation._id
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : ""
            }`}
          >
            <div className="flex gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img
                    src={conversation.user.avatar || "/placeholder.svg"}
                    alt={conversation.user.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                {conversation.user.isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p
                    className={`font-medium truncate ${
                      activeConversationId === conversation._id
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    {conversation.user.fullName}
                  </p>
                  <div className="flex items-center gap-2">
                    {/* {unreadCounts[conversation._id] > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCounts[conversation._id]}
                      </span>
                    )} */}
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(conversation.updatedAt)}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm truncate ${
                    activeConversationId === conversation._id
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {conversation.lastMessageSender}
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
