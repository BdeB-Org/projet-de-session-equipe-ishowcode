// components/ChatInput.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex p-2 bg-white border-t">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Tapez votre message..."
        className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <motion.button
        onClick={handleSend}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Envoyer
      </motion.button>
    </div>
  );
};

export default ChatInput;
