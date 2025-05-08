import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

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

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const inboxNavigate = (conversation: Conversation) => {
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
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium">All messages</span>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-200">
          <SearchIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="h-[calc(100%-60px)] overflow-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => inboxNavigate(conversation)}
            className={`p-4 hover:bg-gray-100 cursor-pointer border-b ${
              conversation._id === "1" ? "bg-gray-100" : ""
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
                <div className="flex justify-between">
                  <p className="font-medium truncate">
                    {conversation.user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(conversation.updatedAt)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 truncate">
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
