import React from 'react';
import { Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { GameSettings } from '../types/game';
import { clearScores } from '../utils/storage';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
  onScoresCleared: () => void;
}

export function Settings({ settings, onSettingsChange, onClose, onScoresCleared }: SettingsProps) {
  const handleClearScores = () => {
    if (confirm('Ali res želiš izbrisati vse rezultate?')) {
      clearScores();
      onScoresCleared();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Nastavitve
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Število računov v sklopu
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.problemsPerRound}
              onChange={(e) => onSettingsChange({
                ...settings,
                problemsPerRound: Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Število življenj
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.maxLives}
              onChange={(e) => onSettingsChange({
                ...settings,
                maxLives: Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleClearScores}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
              Izbriši vse rezultate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}