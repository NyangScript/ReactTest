
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const SpaceShooterPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 게임 상태 refs (렌더링 없이 업데이트를 위함)
  const gameState = useRef({
    player: { x: 0, y: 0, width: 30, height: 30, speed: 5 },
    bullets: [] as { x: number; y: number; speed: number }[],
    enemies: [] as { x: number; y: number; speed: number; width: number; height: number }[],
    keys: {} as { [key: string]: boolean },
    lastShot: 0,
    animationId: 0,
    score: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        gameState.current.width = parent.clientWidth;
        gameState.current.height = parent.clientHeight;
        // 플레이어 초기 위치
        gameState.current.player.x = canvas.width / 2 - 15;
        gameState.current.player.y = canvas.height - 50;
      }
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    gameState.current.bullets = [];
    gameState.current.enemies = [];
    gameState.current.score = 0;
    gameState.current.player.x = canvas.width / 2 - 15;
    gameState.current.player.y = canvas.height - 50;

    // 키보드 이벤트 리스너
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.current.keys[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = (timestamp: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const state = gameState.current;

      // Clear canvas
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, state.width, state.height);

      // Player Movement
      if ((state.keys['ArrowLeft'] || state.keys['KeyA']) && state.player.x > 0) {
        state.player.x -= state.player.speed;
      }
      if ((state.keys['ArrowRight'] || state.keys['KeyD']) && state.player.x < state.width - state.player.width) {
        state.player.x += state.player.speed;
      }
      if (state.keys['Space']) {
        if (timestamp - state.lastShot > 300) {
          state.bullets.push({ 
            x: state.player.x + state.player.width / 2, 
            y: state.player.y, 
            speed: 7 
          });
          state.lastShot = timestamp;
        }
      }

      // Draw Player
      ctx.fillStyle = '#4f46e5'; // brand-primary
      ctx.beginPath();
      ctx.moveTo(state.player.x + state.player.width / 2, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + state.player.height);
      ctx.lineTo(state.player.x + state.player.width, state.player.y + state.player.height);
      ctx.fill();

      // Update and Draw Bullets
      ctx.fillStyle = '#fbbf24'; // yellow
      state.bullets = state.bullets.filter(b => b.y > 0);
      state.bullets.forEach(b => {
        b.y -= b.speed;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn Enemies
      if (Math.random() < 0.02) {
        state.enemies.push({
          x: Math.random() * (state.width - 30),
          y: -30,
          speed: 2 + Math.random() * 2,
          width: 30,
          height: 30
        });
      }

      // Update and Draw Enemies
      ctx.fillStyle = '#ef4444'; // red
      let hitEnemy = false;
      
      state.enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Collision detection (Bullet hitting Enemy)
        state.bullets.forEach((bullet, bIndex) => {
          if (
            bullet.x > enemy.x && 
            bullet.x < enemy.x + enemy.width && 
            bullet.y > enemy.y && 
            bullet.y < enemy.y + enemy.height
          ) {
             state.enemies.splice(eIndex, 1);
             state.bullets.splice(bIndex, 1);
             state.score += 10;
             setScore(state.score);
          }
        });

        // Game Over check
        if (
           enemy.x < state.player.x + state.player.width &&
           enemy.x + enemy.width > state.player.x &&
           enemy.y < state.player.y + state.player.height &&
           enemy.height + enemy.y > state.player.y
        ) {
           hitEnemy = true;
        }
        
        if (enemy.y > state.height) {
           state.enemies.splice(eIndex, 1);
        }
      });

      if (hitEnemy) {
        setGameOver(true);
        setIsPlaying(false);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        return;
      }

      state.animationId = requestAnimationFrame(gameLoop);
    };

    gameState.current.animationId = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
        <div className="mb-4 flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-bold text-white">스페이스 슈터</h1>
                <p className="text-slate-400">적들을 물리치고 최고 점수를 기록하세요!</p>
             </div>
             <div className="text-2xl font-bold text-brand-light">
                SCORE: {score}
             </div>
        </div>

      <div className="relative flex-grow bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl" style={{ minHeight: '500px' }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-10 backdrop-blur-sm">
             <h2 className="text-5xl font-bold text-white mb-4 tracking-tighter">
                 {gameOver ? 'GAME OVER' : 'SPACE SHOOTER'}
             </h2>
             {gameOver && <p className="text-2xl text-brand-light mb-8">Final Score: {score}</p>}
             <p className="text-slate-300 mb-8 max-w-md">
                방향키(←, →)로 이동하고 스페이스바로 공격하세요.<br/>
                다가오는 붉은 적들을 모두 제거하세요!
             </p>
             <button 
                onClick={startGame}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-xl"
             >
                {gameOver ? '다시 시작' : '게임 시작'}
             </button>
          </div>
        )}
      </div>
      
       <div className="mt-6">
         <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>대시보드로 돌아가기</span>
         </Link>
       </div>
    </div>
  );
};

export default SpaceShooterPage;
