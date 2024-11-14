import React, { useEffect, useRef, useState } from 'react';
import { Problem } from '../types/game';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../services/audioService';

interface MathProblemProps extends Problem {
  onAnswer: (isCorrect: boolean) => void;
  difficulty: 'easy' | 'medium';
  soundEnabled: boolean;
}

export function MathProblem({ 
  num1, 
  num2, 
  operation, 
  onAnswer, 
  difficulty, 
  soundEnabled: initialSoundEnabled 
}: MathProblemProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout>();
  const { playSound } = useAudio();

  const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;

  useEffect(() => {
    if (!showFeedback) {
      inputRef.current?.focus();
    }
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [showFeedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = parseInt(userAnswer) === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (soundEnabled) {
      playSound(correct);
    }
    
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    onAnswer(correct);
    feedbackTimeoutRef.current = setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer('');
      inputRef.current?.focus();
    }, 1000);
  };

  const getFeedbackMessage = () => {
    if (isCorrect) {
      const messages = [
        "Odlično! 🌟",
        "Super delo! ⭐",
        "Bravo! 🎉",
        "Fantastično! 🌈",
        "Ti si matematik! 🧮",
        "Woohooo! 🚀",
        "Pametna glava! 🧠",
        "Matematični genij! 💫",
        "Neverjetno! 🌠",
        "Računski mojster! 🏆",
        "Matematika je tvoj BFF! 🤗",
        "Einstein bi bil ponosen! 👨‍🔬",
        "Številke so tvoji prijatelji! 🔢",
        "Matematični ninja! 🥷",
        "Računi trepetajo pred teboj! 💪"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return `Nepravilno. Pravilen odgovor je ${correctAnswer}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full min-h-[200px] flex flex-col">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-indigo-600 hover:text-indigo-700 transition-colors"
          type="button"
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 text-3xl mb-4">
        <span className="font-bold text-indigo-600">
          {num1} {operation} {num2}
        </span>
        <span className="font-bold text-indigo-600">=</span>
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-24 px-3 py-1 text-center border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="?"
          disabled={showFeedback}
        />
      </form>

      <div className="flex-grow flex items-center justify-center">
        {showFeedback && (
          <div className={`text-center text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
            {getFeedbackMessage()}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 text-center">
        {difficulty === 'easy' ? 'Števila od 1 do 10' : 'Števila do 20'}
      </div>
    </div>
  );
}