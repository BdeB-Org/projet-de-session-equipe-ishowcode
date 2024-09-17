'use client'

import { useState } from 'react';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  
  return (
    <>
      <div
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg cursor-pointer hover:bg-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat avec nous"
      >
        💬
      </div>
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 h-96 bg-white text-black rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg">Chat avec GPT</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white"
              aria-label="Close chat"
            >
              ✖️
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto" id="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                {msg}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-300">
            <ChatInput setMessages={setMessages} />
          </div>
        </div>
      )}
    </>
  );
}

function ChatInput({ setMessages }: { setMessages: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [message, setMessage] = useState('');
  
  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, `User: ${message}`]);

    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      setMessages(prev => [...prev, `GPT: ${data.reply}`]);
      
    } catch (error) {
      setMessages(prev => [...prev, 'Error: Could not send message']);
    }

    setMessage('');
  };

  return (
    <div className="flex">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-l-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-500"
      >
        Send
      </button>
    </div>
  );
}
