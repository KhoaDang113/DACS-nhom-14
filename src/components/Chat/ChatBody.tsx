import {
  PinIcon,
  MoreVerticalIcon,
  ArrowUpIcon,
  SmileIcon,
  ImageIcon,
  SendIcon,
  XCircleIcon,
  SearchIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import EmojiPicker from "emoji-picker-react";
// import { useUnreadMessages } from "../../contexts/UnreadMessagesContext";

dayjs.extend(calendar);

type Message = {
  _id?: string;
  conversationId: string;
  userId?: string;
  content?: string;
  attachment?: string;
  createdAt: string;
};

type User = {
  _id: string;
  fullName: string;
  avatar: string;
  isOnline?: boolean;
};

type EmojiClickData = {
  emoji: string;
  activeSkinTone: string;
  names: string[];
  unified: string;
};

type CurrentUser = {
  user: {
    _id: string;
    fullName: string;
    avatar: string;
  };
};

export default function ChatBody({ socket }) {
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [freelancer, setFreelancer] = useState<User | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { incrementUnread } = useUnreadMessages();
  const { id } = useParams();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Scroll to bottom after sending message
  useEffect(() => {
    if (hasSentMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasSentMessage(false);
    }
  }, [chatMessages, hasSentMessage]);

  // Fetch current user
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

  // Fetch conversation
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/conversation/get-conversation/${id}`,
          { withCredentials: true }
        );
        setFreelancer(response.data.conversation.user);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };
    fetchConversation();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    socket.emit("join_conversation", id);
    socket.on("receive_message", (message: Message) => {
      setChatMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
      setHasSentMessage(true);

      // Increment unread count if message is from other user
      // if (message.userId !== currentUser?.user?._id) {
      //   incrementUnread(id);
      // }
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
      alert(error.message);
    });

    // Fetch initial messages
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/message/${id}/get-all`,
          {
            withCredentials: true,
          }
        );
        setChatMessages(response.data.messages);
        setHasSentMessage(true);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    fetchChatMessages();
    return () => {
      socket.emit("leave_conversation", id);
      socket.off("receive_message");
      socket.off("error");
    };
  }, [id]);
  // }, [id, socket, currentUser, incrementUnread]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if ((messageInput.trim() === "" && !selectedFile) || !id) return;

    const formData = new FormData();
    formData.append("conversationId", id);
    if (messageInput.trim()) {
      formData.append("content", messageInput);
    }
    if (selectedFile) {
      formData.append("attachment", selectedFile);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/message/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const savedMessage = response.data.message;

      // Add message to local state (for sender)
      setChatMessages((prev) => {
        if (prev.some((msg) => msg._id === savedMessage._id)) {
          return prev;
        }
        return [...prev, savedMessage];
      });

      // Emit socket event to update last message in sidebar
      socket.emit("new_message", {
        conversationId: id,
        message: savedMessage.content || "Đã gửi một hình ảnh",
        sender: currentUser?.user?._id,
      });

      setMessageInput("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setHasSentMessage(true);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle emoji click
  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter messages based on search query
  const filteredMessages = chatMessages.filter((message) =>
    message.content?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-800 font-medium">
              {freelancer?.fullName || "Loading..."}
            </span>
            <span className="text-gray-500">
              @{freelancer?.fullName || "user"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setShowSearch(!showSearch)}
          >
            <SearchIcon className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <PinIcon className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <MoreVerticalIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="absolute top-[50px] w-full p-2 bg-white border-b">
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
      )}

      {/* Messages */}
      <div className="h-[390px]">
        <div className="flex-1 p-4 h-full overflow-y-scroll scrollbar-hide">
          <div className="space-y-6">
            {(searchQuery ? filteredMessages : chatMessages).map((message) => {
              const isUser = message?.userId === currentUser?.user?._id;
              const sender = isUser ? currentUser?.user : freelancer;
              return (
                <div
                  key={message._id}
                  className={`flex gap-3 group ${
                    isUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 mt-1">
                    <img
                      src={sender?.avatar || "/placeholder.svg"}
                      alt={sender?.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className={`flex-1 ${isUser ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-1 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="font-medium">{sender?.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {dayjs(message.createdAt).calendar()}
                      </span>
                    </div>
                    <div
                      className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                        isUser
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {message.content && <p>{message.content}</p>}
                      {message.attachment && (
                        <div className="mt-2">
                          <img
                            src={message.attachment}
                            alt="Attachment"
                            className="max-w-full max-h-64 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="relative flex flex-col gap-2">
          {previewUrl && (
            <div className="absolute bottom-[120px] left-0 mb-2 z-10 bg-white rounded-lg shadow-lg p-2">
              <div className="relative w-32 h-32">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <XCircleIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <textarea
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex justify-between">
            <div className="flex gap-2 relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <SmileIcon className="h-5 w-5 text-gray-500" />
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full left-0 mb-2"
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <button
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                messageInput.trim() === "" && !selectedFile
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={messageInput.trim() === "" && !selectedFile}
              onClick={handleSendMessage}
            >
              <SendIcon className="h-4 w-4" />
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
