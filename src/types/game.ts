export type Difficulty = 'easy' | 'medium';
export type Operation = '+' | '-';
export type GameMode = 'addition' | 'subtraction' | 'mixed';
export type SortType = 'percentage' | 'total';

export interface Score {
  name: string;
  correctAnswers: number;
  totalAnswers: number;
  date: string;
}

export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
}

export interface GameSettings {
  problemsPerRound: number;
  maxLives: number;
  soundEnabled: boolean;
}