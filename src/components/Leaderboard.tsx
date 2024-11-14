import React, { useState } from 'react';
import { Trophy, SortAsc } from 'lucide-react';
import { Score, SortType } from '../types/game';

interface LeaderboardProps {
  scores: Score[];
}

export function Leaderboard({ scores }: LeaderboardProps) {
  const [sortType, setSortType] = useState<SortType>('percentage');

  if (scores.length === 0) {
    return null;
  }

  const sortedScores = [...scores].sort((a, b) => {
    if (sortType === 'percentage') {
      return (b.correctAnswers / b.totalAnswers) - (a.correctAnswers / a.totalAnswers);
    }
    return b.correctAnswers - a.correctAnswers;
  });

  return (
    <div className="mt-8 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Najboljši rezultati
        </h2>
        <button
          onClick={() => setSortType(prev => prev === 'percentage' ? 'total' : 'percentage')}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <SortAsc className="w-4 h-4" />
          {sortType === 'percentage' ? 'Razvrsti po številu' : 'Razvrsti po deležu'}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-600">#</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-600">Ime</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-indigo-600">Rezultat</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-indigo-600">Delež</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-indigo-600">Datum</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map((score, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{score.name}</td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {score.correctAnswers}/{score.totalAnswers}
                </td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {Math.round((score.correctAnswers / score.totalAnswers) * 100)}%
                </td>
                <td className="px-4 py-2 text-right text-sm text-gray-500">
                  {new Date(score.date).toLocaleDateString('sl')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}