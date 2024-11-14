import { useEffect, useState } from 'react';

class AudioService {
  private correctSound: HTMLAudioElement;
  private incorrectSound: HTMLAudioElement;
  private loaded: boolean = false;

  constructor() {
    this.correctSound = new Audio();
    this.incorrectSound = new Audio();
    this.init();
  }

  private init() {
    this.correctSound.src = '/sounds/correct.mp3';
    this.incorrectSound.src = '/sounds/incorrect.mp3';
    
    Promise.all([
      this.preloadAudio(this.correctSound),
      this.preloadAudio(this.incorrectSound)
    ]).then(() => {
      this.loaded = true;
    }).catch(error => {
      console.error('Failed to load audio files:', error);
      this.loaded = false;
    });
  }

  private preloadAudio(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => resolve(), { once: true });
      audio.addEventListener('error', reject, { once: true });
      audio.load();
    });
  }

  async playSound(correct: boolean) {
    if (!this.loaded) return;

    try {
      const audio = correct ? this.correctSound : this.incorrectSound;
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
}

const audioService = new AudioService();

export function useAudio() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAudioReady = setInterval(() => {
      if (audioService['loaded']) {
        setIsReady(true);
        clearInterval(checkAudioReady);
      }
    }, 100);

    return () => clearInterval(checkAudioReady);
  }, []);

  return {
    isReady,
    playSound: (correct: boolean) => audioService.playSound(correct)
  };
}