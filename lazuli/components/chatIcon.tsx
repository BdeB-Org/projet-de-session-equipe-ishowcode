// /app/components/ChatIcon.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';

interface Message {
  text: string;
  fromUser: boolean;
  timestamp: Date;
}

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Bonjour ! Je suis Gemini. Comment puis-je vous aider ?',
      fromUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    const newMessage: Message = {
      text: message,
      fromUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/gemini', {
        message,
        messages,
      });

      if (response.data.reply) {
        const botMessage: Message = {
          text: response.data.reply,
          fromUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          text: 'Erreur : Pas de réponse de Gemini',
          fromUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Erreur :', error);
      const errorMessage: Message = {
        text: 'Erreur : Impossible d\'envoyer le message',
        fromUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Icône de chat flottante */}
      <div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-4 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
        onClick={handleToggle}
        aria-label="Chat avec Gemini"
        role="button"
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

      {/* Fenêtre de chat */}
      {isOpen && (
        <Draggable>
          <div
            className={`fixed bottom-20 right-6 bg-white text-black rounded-lg shadow-lg flex flex-col transition-transform duration-300 ease-in-out transform ${
              isAnimating ? 'animate-scaleDown' : 'animate-fadeIn'
            }`}
            style={{ width: '350px', height: '500px' }}
          >
            {/* En-tête de la fenêtre de chat */}
            <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg cursor-move">
              <h3 className="text-lg font-semibold">Chat avec Gemini</h3>
              <button
                onClick={handleToggle}
                className="text-white"
                aria-label="Fermer le chat"
              >
                ✖️
              </button>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 p-4 overflow-auto" id="chat-window">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col max-w-xs">
                    <div
                      className={`p-2 rounded-lg ${
                        msg.fromUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-2 flex justify-start">
                  <div className="p-2 rounded-lg max-w-xs bg-gray-200 text-black">
                    <em>Gemini est en train de répondre...</em>
                  </div>
                </div>
              )}
            </div>

            {/* Zone de saisie du message */}
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
                className={`ml-2 text-xl ${
                  !message.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Envoyer le message"
                disabled={!message.trim()}
              >
                ✈️
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
