import React, { useState, useCallback, useEffect } from 'react';
import { MathProblem } from './components/MathProblem';
import { GameStats } from './components/GameStats';
import { Lives } from './components/Lives';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { GraduationCap, Calculator, Plus, Minus, Settings as SettingsIcon } from 'lucide-react';
import { getScores, getSettings, saveSettings } from './utils/storage';
import { Difficulty, GameMode, Problem, GameSettings } from './types/game';

const DEFAULT_SETTINGS: GameSettings = {
  problemsPerRound: 5,
  maxLives: 5,
  soundEnabled: true,
};

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [scores, setScores] = useState(() => getScores());
  const [gameEnded, setGameEnded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => {
    const savedSettings = getSettings();
    return savedSettings || DEFAULT_SETTINGS;
  });
  const [lives, setLives] = useState(settings.maxLives);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const generateProblem = useCallback((diff: Difficulty, mode: GameMode) => {
    const max = diff === 'easy' ? 10 : 20;
    const min = diff === 'easy' ? 1 : 5;
    
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const operation = mode === 'mixed' 
      ? (Math.random() < 0.5 ? '+' : '-')
      : mode === 'addition' ? '+' : '-';

    if (operation === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1];
    } else if (operation === '+' && diff === 'medium') {
      while (num1 + num2 > 20) {
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }

    return { num1, num2, operation };
  }, []);

  const [problem, setProblem] = useState<Problem | null>(null);

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      setLives(prev => prev - 1);
    }
    if (isCorrect) setCorrectAnswers(prev => prev + 1);
    setTotalAnswers(prev => prev + 1);
  
    const isLastProblem = currentProblem === settings.problemsPerRound - 1;
    const isGameOver = lives <= 1 && !isCorrect;
  
    if (isLastProblem || isGameOver) {
      // Dodamo zamik, preden prikažemo povzetek, da omogočimo prikaz povratne informacije
      setTimeout(() => {
        setShowStats(true);
        if (isGameOver) setGameEnded(true);
      }, 1000); // Zamuda za prikaz povratne informacije (2 sekundi)
    } else {
      setCurrentProblem(prev => prev + 1);
      setProblem(generateProblem(difficulty!, gameMode!));
    }
  };

  const handleContinue = () => {
    if (!gameEnded) {
      setCurrentProblem(0);
      setShowStats(false);
      setProblem(generateProblem(difficulty!, gameMode!));
    }
  };

  const handleReset = () => {
    setDifficulty(null);
    setGameMode(null);
    setCurrentProblem(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setShowStats(false);
    setLives(settings.maxLives);
    setGameEnded(false);
    setScores(getScores());
    setProblem(null);
  };

  const startGame = (diff: Difficulty, mode: GameMode) => {
    setDifficulty(diff);
    setGameMode(mode);
    setProblem(generateProblem(diff, mode));
    setLives(settings.maxLives);
    setCurrentProblem(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setGameEnded(false);
  };

  if (!difficulty || !gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center relative">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>

          <h1 className="text-3xl font-bold text-indigo-600 mb-6">Matematična pustolovščina</h1>
          
          {!difficulty ? (
            <div className="space-y-4">
              <button
                onClick={() => setDifficulty('easy')}
                className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center space-x-2"
              >
                <GraduationCap className="w-6 h-6" />
                <span>Začetnik (1-10)</span>
              </button>
              
              <button
                onClick={() => setDifficulty('medium')}
                className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center space-x-2"
              >
                <Calculator className="w-6 h-6" />
                <span>Napredni (do 20)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => startGame(difficulty, 'addition')}
                className="w-full p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-6 h-6" />
                <span>Seštevanje</span>
              </button>
              
              <button
                onClick={() => startGame(difficulty, 'subtraction')}
                className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200 flex items-center justify-center space-x-2"
              >
                <Minus className="w-6 h-6" />
                <span>Odštevanje</span>
              </button>

              <button
                onClick={() => startGame(difficulty, 'mixed')}
                className="w-full p-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200 flex items-center justify-center space-x-2"
              >
                <Calculator className="w-6 h-6" />
                <span>Mešano</span>
              </button>
            </div>
          )}
        </div>
        
        <Leaderboard scores={scores} />

        {showSettings && (
          <Settings
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setShowSettings(false)}
            onScoresCleared={() => setScores([])}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      {showStats ? (
        <GameStats
          correctAnswers={correctAnswers}
          totalAnswers={totalAnswers}
          onContinue={handleContinue}
          onReset={handleReset}
          onExit={handleReset}
          gameEnded={gameEnded}
        />
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-indigo-800">
              Račun {currentProblem + 1} od {settings.problemsPerRound}
            </div>
            <div className="text-sm text-indigo-600">
              Pravilni odgovori: {correctAnswers} od {totalAnswers}
            </div>
            <Lives lives={lives} maxLives={settings.maxLives} />
          </div>
          
          {problem && (
            <MathProblem
              {...problem}
              onAnswer={handleAnswer}
              difficulty={difficulty}
              soundEnabled={settings.soundEnabled}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;