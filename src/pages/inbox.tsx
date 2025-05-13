import Sidebar from "../components/Chat/Sidebar";
import ChatBody from "../components/Chat/ChatBody";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../lib/socket";
// Initialize Socket.IO

export default function Inbox() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/me`, {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!currentUser) return;
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
        console.log(
          "response.data.conversation",
          response.data.conversation._id
        );

        setConversationId(response.data.conversation._id);
        console.log("conversationId", conversationId);
        navigate(`/inbox/${conversationId}`);
      } catch (error) {
        console.error("Error fetching or creating conversation:", error);
      }
    };
    fetchConversation();
  }, [currentUser, id, navigate]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <Sidebar socket={socket} currentUser={currentUser} />
          <div className="flex-1 p-4 mt-[-12px] bg-gray-50 items-center justify-center">
            {id === "null" ? (
              <div className="text-gray-500 italic">
                Chưa chọn cuộc hội thoại...
              </div>
            ) : (
              <ChatBody socket={socket} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
