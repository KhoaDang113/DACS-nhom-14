import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatBody from "./ChatBody";
import socket from "../../lib/socket";
import axios from "axios";

type UserData = {
  user?: {
    _id?: string;
    name?: string;
  };
};

interface MobileChatProps {
  currentUser: UserData | null;
}

export default function MobileChat({ currentUser }: MobileChatProps) {
  const { id } = useParams();
  const [showChatList, setShowChatList] = useState(true);
  const navigate = useNavigate();

  // Xử lý chuyển đến conversation cho url id
  useEffect(() => {
    const fetchConversation = async () => {
      if (!currentUser || !id || id === "null") return;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/conversation/create-or-get",
          {
            to: id,
            from: currentUser?.user?._id,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.conversation) {
          // Chỉ điều hướng nếu conversation ID khác với ID hiện tại
          if (response.data.conversation._id !== id) {
            navigate(`/inbox/${response.data.conversation._id}`);
          }
        }
      } catch (error) {
        console.error("Error fetching or creating conversation:", error);
      }
    };

    if (id && id !== "null") {
      fetchConversation();
    }
  }, [currentUser, id, navigate]);

  useEffect(() => {
    // Nếu có id cuộc trò chuyện, hiện phần chat
    if (id && id !== "null") {
      setShowChatList(false);
    } else {
      // Ngược lại, hiện phần danh sách chat
      setShowChatList(true);
    }
  }, [id]);

  const handleBackToList = () => {
    setShowChatList(true);
    navigate("/inbox/null");
  };

  const handleSelectChat = () => {
    setShowChatList(false);
  };

  // Nếu đang hiển thị danh sách chat
  if (showChatList) {
    return (
      <div className="h-full w-full">
        <Sidebar
          socket={socket}
          currentUser={currentUser}
          onSelectChat={handleSelectChat}
          isMobile={true}
        />
      </div>
    );
  }

  // Nếu đang hiển thị phần chat
  return (
    <div className="h-full w-full">
      <ChatBody
        socket={socket}
        onBackToList={handleBackToList}
        isMobile={true}
      />
    </div>
  );
}
