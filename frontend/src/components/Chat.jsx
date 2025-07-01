import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const sender = "user"; // Replace with dynamic sender
  const chatEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/chats/get");
      setChatMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post("http://localhost:4000/api/chats/send", {
        message,
        sender,
      });
      setMessage("");
      fetchChat();
    } catch (err) {
      console.error("Send failed");
    }
  };

  const handleEditMessage = (id, msg) => {
    setEditingId(id);
    setEditedMessage(msg);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/chats/update/${id}`, {
        message: editedMessage,
      });
      setEditingId(null);
      fetchChat();
    } catch (err) {
      console.error("Update failed");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg border border-gray-300">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg text-lg font-semibold">
        Private Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-100">
        {chatMessages.map((msg) => {
          const isOwn = msg.sender === sender;
          return (
            <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                  relative px-4 py-2 max-w-[75%] rounded-2xl shadow-md
                  ${isOwn
                    ? "bg-blue-500 text-white rounded-br-none text-right"
                    : "bg-gray-300 text-gray-900 rounded-bl-none text-left"}
                `}
              >
                {editingId === msg._id ? (
                  <>
                    <textarea
                      className="w-full text-black p-1 rounded"
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                    />
                    <button
                      className="text-xs text-white mt-1 underline"
                      onClick={() => handleSaveEdit(msg._id)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p>{msg.message}</p>
                    <small className="block text-[10px] mt-1 opacity-70">
                      {formatDate(msg.createdAt)}
                    </small>
                    {isOwn && (
                      <button
                        onClick={() => handleEditMessage(msg._id, msg.message)}
                        className="absolute top-0 right-0 text-[10px] text-white bg-blue-700 hover:bg-blue-800 px-1 rounded-bl-lg"
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-300 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
