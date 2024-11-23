// components/Quiz.tsx

import React, { useState } from 'react';
import { quizQuestions, QuizQuestion } from '../app/quizData';
import { motion } from 'framer-motion';

interface QuizProps {
  onComplete: (answers: string[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleOptionSelect = (option: string) => {
    setAnswers([...answers, option]);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete([...answers, option]);
    }
  };

  const currentQuestion: QuizQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div>
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>
      <div className="mt-4 text-right text-gray-500">
        Question {currentQuestionIndex + 1} sur {quizQuestions.length}
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Quiz;
