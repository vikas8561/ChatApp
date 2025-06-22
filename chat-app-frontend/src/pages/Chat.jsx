import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [viewOnce, setViewOnce] = useState(false);

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchChats = async () => {
    if (!user || !user.token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chats/my", config);
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/messages/${chatId}`, config);
      setMessages(data);
      socket.emit("join-chat", chatId);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const body = {
        content: newMessage,
        chatId: selectedChat._id,
        viewOnce,
      };
      const { data } = await axios.post("/api/messages", body, config);
      socket.emit("send-message", { ...data, chatId: selectedChat._id });
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setViewOnce(false);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      if (msg.chat._id === selectedChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receive-message");
  }, [selectedChat]);

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                fetchMessages(chat._id);
              }}
              className={`cursor-pointer p-3 rounded-lg transition ${
                selectedChat?._id === chat._id
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {chat.isGroupChat
                ? chat.chatName
                : chat.users.find((u) => u._id !== user._id)?.name}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex flex-col w-3/4">
        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          {selectedChat ? (
            <h3 className="text-lg font-semibold">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : selectedChat.users.find((u) => u._id !== user._id)?.name}
            </h3>
          ) : (
            <h3 className="text-lg text-gray-400">Select a chat</h3>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-800 space-y-2">
          {selectedChat &&
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  msg.sender._id === user._id
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-600 text-white"
                }`}
              >
                <strong>{msg.sender.name}</strong>
                <div>{msg.content}</div>
              </div>
            ))}
        </div>

        {/* Input Box */}
        {selectedChat && (
          <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message"
              className="flex-1 p-2 bg-gray-700 text-white rounded outline-none"
            />
            <label className="text-sm flex items-center gap-1">
              <input
                type="checkbox"
                checked={viewOnce}
                onChange={(e) => setViewOnce(e.target.checked)}
              />
              View Once
            </label>
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
