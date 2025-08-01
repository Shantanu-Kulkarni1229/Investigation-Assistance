import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatWindow({ activeChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages || []);
    }
  }, [activeChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");

    // Save to localStorage
    updateChatInStorage(updatedMessages);

    // Simulate bot response
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "This is a sample bot response based on SOP.",
      };
      const updatedWithBot = [...updatedMessages, botReply];
      setMessages(updatedWithBot);
      updateChatInStorage(updatedWithBot);
    }, 1000);
  };

  const updateChatInStorage = (updatedMessages) => {
    const chats = JSON.parse(localStorage.getItem("chats")) || [];
    const updatedChats = chats.map((chat) =>
      chat.id === activeChat.id ? { ...chat, messages: updatedMessages } : chat
    );
    localStorage.setItem("chats", JSON.stringify(updatedChats));
  };

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat or start a new one
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-blue-700 text-white px-4 py-3 font-bold shadow">
        {activeChat.title}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs shadow ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
