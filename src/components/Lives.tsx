import React from 'react';
import { Heart } from 'lucide-react';

interface LivesProps {
  lives: number;
  maxLives: number;
}

export function Lives({ lives, maxLives }: LivesProps) {
  return (
    <div className="flex justify-center gap-1 mt-2">
      {Array.from({ length: maxLives }).map((_, index) => (
        <Heart
          key={index}
          className={`w-6 h-6 ${
            index < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}