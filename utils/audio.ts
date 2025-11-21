let audioCtx: AudioContext | null = null;

const initializeAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

type SoundType = 'add' | 'update' | 'delete' | 'generate';

export const playSound = (type: SoundType) => {
  initializeAudio();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);

  switch (type) {
    case 'add':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      break;
    case 'update':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
      break;
    case 'delete':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
      break;
    case 'generate':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
      break;
  }
  
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.1);
};