
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const PomodoroPage: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Simple alert or sound could go here
            alert(mode === 'work' ? '휴식 시간입니다!' : '다시 집중할 시간입니다!');
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const setWorkMode = () => {
    setMode('work');
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const setBreakMode = () => {
    setMode('break');
    setIsActive(false);
    setMinutes(5);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">뽀모도로 타이머</h1>
        <p className="text-slate-400 mb-8">{mode === 'work' ? '집중 시간' : '휴식 시간'}</p>

        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={setWorkMode}
            className={`px-4 py-2 rounded-full transition-colors ${mode === 'work' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Work (25분)
          </button>
          <button 
             onClick={setBreakMode}
             className={`px-4 py-2 rounded-full transition-colors ${mode === 'break' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Break (5분)
          </button>
        </div>

        <div className="text-8xl font-mono font-bold text-white mb-10 tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleTimer} 
            className={`w-32 py-3 rounded-xl font-bold text-lg transition-transform active:scale-95 ${isActive ? 'bg-slate-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-secondary'}`}
          >
            {isActive ? '일시정지' : '시작'}
          </button>
          <button 
            onClick={resetTimer} 
            className="w-32 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-lg transition-transform active:scale-95"
          >
            리셋
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default PomodoroPage;
