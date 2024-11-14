import React, { useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { saveScore } from '../utils/storage';

interface GameStatsProps {
  correctAnswers: number;
  totalAnswers: number;
  onContinue: () => void;
  onReset: () => void;
  onExit: () => void;
  gameEnded: boolean;
}

export function GameStats({ 
  correctAnswers, 
  totalAnswers, 
  onContinue, 
  onReset, 
  onExit,
  gameEnded 
}: GameStatsProps) {
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  
  const percentage = Math.round((correctAnswers / totalAnswers) * 100);
  
  const getAchievement = () => {
    if (percentage === 100) return { icon: Trophy, color: 'text-yellow-500', text: 'Popolno!' };
    if (percentage >= 80) return { icon: Medal, color: 'text-blue-500', text: 'Odlično!' };
    if (percentage >= 50) return { icon: Medal, color: 'text-blue-500', text: 'Dobro opravljeno!' };
    return { icon: Star, color: 'text-purple-500', text: 'Bolj se potrudi!' };
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveScore({
        name: name.trim(),
        correctAnswers,
        totalAnswers,
        date: new Date().toISOString(),
      });
      onExit();
    }
  };

  const achievement = getAchievement();
  const AchievementIcon = achievement.icon;

  if (showNameInput) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Shrani rezultat</h2>
        <form onSubmit={handleSaveScore} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tvoje ime"
            className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            autoFocus
          />
          <div className="space-x-4">
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
            >
              Shrani
            </button>
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Prekliči
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <AchievementIcon className={`w-16 h-16 mx-auto mb-4 ${achievement.color}`} />
      
      <h2 className="text-2xl font-bold mb-4">{achievement.text}</h2>
      
      <div className="text-lg mb-6">
        Pravilno si rešil(a) <span className="font-bold text-indigo-600">{correctAnswers}</span> od{' '}
        <span className="font-bold text-indigo-600">{totalAnswers}</span> računov!
      </div>

      <div className="space-x-4">
        {!gameEnded && (
          <button
            onClick={onContinue}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Nadaljuj
          </button>
        )}
        <button
          onClick={() => setShowNameInput(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          Shrani rezultat
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Nova igra
        </button>
      </div>
    </div>
  );
}