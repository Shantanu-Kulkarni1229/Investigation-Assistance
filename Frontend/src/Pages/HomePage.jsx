import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';


const HomePage = () => {
  const [activeChat, setActiveChat] = useState(null);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleNewChat = (chat) => {
    setActiveChat(chat);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays on top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar onSelectChat={handleSelectChat} onNewChat={handleNewChat} />

        {/* Main Chat Window */}
        <div className="flex-1 bg-gray-100">
          <ChatWindow activeChat={activeChat} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
