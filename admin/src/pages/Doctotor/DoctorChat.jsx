import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const DoctorChat = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  const sender = "doctor";
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
    // Scroll to bottom when messages update
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return alert("Please enter a message");
    try {
      const res = await axios.post("http://localhost:4000/api/chats/send", {
        message,
        sender,
      });

      setChatMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message");
    }
  };

  const handleEditMessage = (id, currentMessage) => {
    setEditingId(id);
    setEditedMessage(currentMessage);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/chats/update/${id}`, {
        message: editedMessage,
      });

      // Update locally
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, message: editedMessage } : msg
        )
      );

      setEditingId(null);
      setEditedMessage("");
    } catch (err) {
      console.error("Failed to update message");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg border border-gray-300">
      {/* Chat Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg text-lg font-semibold">
        Doctor Chat
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50">
        {chatMessages.length === 0 && (
          <p className="text-center text-gray-500">No messages yet</p>
        )}

        {chatMessages.map((chat) => {
          const isSentByMe = chat.sender === sender;

          return (
            <div
              key={chat._id}
              className={`flex ${isSentByMe ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md text-sm shadow break-words ${
                  isSentByMe
                    ? "bg-blue-500 text-white rounded-bl-none"
                    : "bg-gray-300 text-gray-900 rounded-br-none"
                }`}
              >
                {editingId === chat._id ? (
                  <>
                    <textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      rows={2}
                      className="w-full text-sm p-1 rounded-md"
                    />
                    <button
                      onClick={() => handleSaveEdit(chat._id)}
                      className="mt-1 px-3 py-1 bg-green-500 text-white rounded-md text-xs"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-1">{chat.message}</p>
                    {isSentByMe && (
                      <button
                        onClick={() => handleEditMessage(chat._id, chat.message)}
                        className="text-xs text-blue-200 hover:text-blue-100"
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

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-300 flex gap-2">
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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

export default DoctorChat;
