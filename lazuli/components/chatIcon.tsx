'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; fromUser: boolean }[]>([{ text: 'Comment puis-je peux vous aider?', fromUser: false }]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight; 
    }
  }, [messages]);

  const handleToggle = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add the user message
    setMessages(prev => [...prev, { text: message, fromUser: true }]);

    try {
      const response = await axios.post('/api/gemini', { message });
      if (response.data.reply) {
        setMessages(prev => [...prev, { text: response.data.reply, fromUser: false }]); 
      } else {
        setMessages(prev => [...prev, { text: 'Erreur : Pas de réponse de Gemini', fromUser: false }]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur :', error.response ? error.response.data : error.message);
      } else {
        console.error('Erreur :', error);
      }
      setMessages(prev => [...prev, { text: 'Erreur : Impossible d\'envoyer le message', fromUser: false }]);
    }

    // Clear the input box
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-4 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
        onClick={handleToggle}
        aria-label="Chat avec nous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8 animate-bounce"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18m-7 5h7" />
        </svg>
      </div>

      {isOpen && (
        <div className={`fixed bottom-20 right-6 chatbox-container bg-white text-black rounded-lg shadow-lg flex flex-col transition-transform duration-300 ease-in-out transform ${isAnimating ? 'animate-scaleDown' : 'animate-fadeIn'}`}>
          <div className="flex justify-between items-center p-4">
            <h3 className="text-lg">Chat avec Gemini</h3>
            <button 
              onClick={handleToggle} 
              className="text-black"
              aria-label="Fermer le chat"
            >
              ✖️
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto" id="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 text-lg ${msg.fromUser ? 'text-right' : 'text-left'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-300 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez un message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 text-xl"
              aria-label="Envoyer le message"
            >
              ✈️
            </button>
          </div>
        </div>
      )}
    </>
  );
}
