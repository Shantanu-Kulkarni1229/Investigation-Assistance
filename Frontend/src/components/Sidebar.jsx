import React, { useEffect, useState } from "react";
import { FaPlus, FaComments } from "react-icons/fa";

export default function Sidebar({ onSelectChat, onNewChat }) {
  const [chats, setChats] = useState([]);

  // Load previous chats from localStorage
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setChats(savedChats);
  }, []);

  // Select a chat
  const handleSelectChat = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) onSelectChat(chat);
  };

  // Create a new chat
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    onNewChat(newChat);
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen shadow-lg">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-bold">Chats</h2>
        <button
          onClick={handleNewChat}
          className="flex items-center space-x-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
        >
          <FaPlus /> <span>New</span>
        </button>
      </div>

      {/* List of previous chats */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center mt-4 text-gray-400">No previous chats</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800 border-b border-gray-700"
            >
              <FaComments className="mr-3" />
              <span className="truncate">{chat.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
