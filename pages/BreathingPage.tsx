
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const BreathingPage: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [instruction, setInstruction] = useState('숨을 들이마세요');

  useEffect(() => {
    const breathe = () => {
      // Inhale 4s
      setPhase('Inhale');
      setInstruction('숨을 들이마세요 (4초)');
      
      setTimeout(() => {
        // Hold 4s
        setPhase('Hold');
        setInstruction('숨을 참으세요 (4초)');
        
        setTimeout(() => {
          // Exhale 4s
          setPhase('Exhale');
          setInstruction('숨을 내쉬세요 (4초)');
        }, 4000);
      }, 4000);
    };

    breathe();
    const interval = setInterval(breathe, 12000); // 4+4+4 = 12s cycle

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-fade-in relative overflow-hidden">
      {/* Background circles effect */}
      <div className={`absolute w-64 h-64 bg-brand-primary/30 rounded-full blur-3xl transition-all duration-[4000ms] ease-in-out
        ${phase === 'Inhale' ? 'scale-150 opacity-80' : phase === 'Exhale' ? 'scale-50 opacity-30' : 'scale-125 opacity-60'}
      `}></div>

      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-12">마음 챙김 호흡</h1>
        
        <div className="relative w-80 h-80 mx-auto flex items-center justify-center mb-12">
           <div className={`absolute inset-0 border-4 border-white/20 rounded-full transition-all duration-[4000ms] ease-in-out
             ${phase === 'Inhale' ? 'scale-110 border-brand-light' : phase === 'Exhale' ? 'scale-75 border-slate-600' : 'scale-100'}
           `}></div>
           <div className={`w-40 h-40 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold text-2xl shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-[4000ms] ease-in-out
             ${phase === 'Inhale' ? 'scale-150' : phase === 'Exhale' ? 'scale-75 bg-slate-300' : 'scale-125'}
           `}>
             {phase}
           </div>
        </div>

        <p className="text-2xl text-brand-light font-medium animate-pulse">
          {instruction}
        </p>
      </div>

      <div className="mt-16 z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default BreathingPage;
