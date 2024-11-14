import { Score } from '../types/game';

const SCORES_KEY = 'math_game_scores';
const SETTINGS_KEY = 'math_game_settings';

export const saveScore = (score: Score): void => {
  const scores = getScores();
  scores.push(score);
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
};

export const getScores = (): Score[] => {
  const scores = localStorage.getItem(SCORES_KEY);
  return scores ? JSON.parse(scores) : [];
};

export const clearScores = (): void => {
  localStorage.removeItem(SCORES_KEY);
};

export const saveSettings = (settings: any): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : null;
};