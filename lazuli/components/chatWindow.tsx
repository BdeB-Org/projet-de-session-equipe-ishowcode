// components/ChatWindow.tsx

import React from 'react';
import Image from 'next/image';
import ChatInput from './chatInput';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  fromUser: boolean;
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSend: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, onSend }) => {
  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <div className="flex-grow overflow-y-auto mb-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-2 ${
                msg.fromUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!msg.fromUser && (
                <Image
                  src="/bot-avatar.png"
                  alt="Bot Avatar"
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-xs ${
                  msg.fromUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                {msg.text}
              </div>
              {msg.fromUser && (
                <Image
                  src="/user-avatar.png"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full ml-2"
                />
              )}
            </motion.div>
          ))}

          {/* Indicateur de typing */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex mb-2 justify-start"
            >
              <Image
                src="/bot-avatar.png"
                alt="Bot Avatar"
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
              <div className="rounded-lg px-4 py-2 bg-white text-gray-800 border animate-pulse">
                ...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
};

export default ChatWindow;
