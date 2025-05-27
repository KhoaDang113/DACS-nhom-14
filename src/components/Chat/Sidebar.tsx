import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

type Conversation = {
  _id: string;
  lastMessage: string;
  lastMessageSender?: string;
  updatedAt: string;
  user: {
    _id: string;
    fullName: string;
    avatar: string;
    isOnline?: boolean;
  };
};

type UserType = {
  user?: {
    _id?: string;
    name?: string;
  };
};

type MessageData = {
  conversationId: string;
  sender: string;
  message: string;
  timestamp?: string;
};

interface SidebarProps {
  socket: {
    on: (event: string, callback: (data: MessageData) => void) => void;
    off: (event: string) => void;
  };
  currentUser: UserType | null;
  onSelectChat?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({
  socket,
  currentUser,
  onSelectChat,
  isMobile = false,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/conversation/get-conversations",
        { withCredentials: true }
      );
      if (response.data?.conversationList) {
        setConversations(response.data.conversationList);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();

    socket.on("return_new_message", (data: MessageData) => {
      setConversations((prev) => {
        const isCurrentUserSender = currentUser?.user?._id === data.sender._id;

        const updated = prev.map((conv) =>
          conv._id === data.conversationId
            ? {
                ...conv,
                lastMessage: data.message,
                lastMessageSender: isCurrentUserSender ? "Me: " : "",
                updatedAt: new Date().toISOString(),
              }
            : conv
        );

        return updated.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    });

    return () => {
      socket.off("return_new_message");
    };
  }, [currentUser, socket, id]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim())
  );

  const handleConversationClick = (conversationId: string) => {
    navigate(`/inbox/${conversationId}`);
    if (isMobile && onSelectChat) onSelectChat();
    fetchConversations();
  };

  return (
    <div className="w-full h-full border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="text-lg font-semibold">Tin nhắn</div>
      </div>

      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Không có cuộc trò chuyện nào
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => handleConversationClick(conversation._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={conversation.user.avatar || "/placeholder.svg"}
                        alt={conversation.user.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {conversation.user.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">
                        {conversation.user.fullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {dayjs(conversation.updatedAt).calendar()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessageSender || ""}
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
