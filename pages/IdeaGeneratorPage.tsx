import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { generateWebsiteIdea } from '../services/geminiService';
import SpinnerIcon from '../components/icons/SpinnerIcon';
import { playSound } from '../utils/audio';

const IdeaGeneratorPage: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateIdea = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    playSound('generate');
    try {
      const newIdea = await generateWebsiteIdea();
      setIdea(newIdea);
    } catch (e: any) {
      setError(e.message || '아이디어를 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-4">웹사이트 아이디어 생성기</h1>
        <p className="text-slate-400 mb-8">버튼을 눌러 Gemini AI가 제안하는 멋진 웹사이트 아이디어를 받아보세요!</p>

        <button
          onClick={handleGenerateIdea}
          disabled={isLoading}
          className="bg-brand-secondary hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <SpinnerIcon className="w-5 h-5" />
              <span>생성 중...</span>
            </div>
          ) : (
            '✨ 새로운 아이디어 생성!'
          )}
        </button>

        {error && <p className="text-red-400 mt-6">{error}</p>}
        
        {idea && !isLoading && (
          <div className="mt-8 p-6 bg-slate-700/50 rounded-lg animate-fade-in">
            <p className="text-lg text-white font-semibold">"{idea}"</p>
          </div>
        )}
      </div>
      <Link to="/" className="mt-8 text-brand-light hover:text-white transition-colors">
        &larr; 대시보드로 돌아가기
      </Link>
    </div>
  );
};

export default IdeaGeneratorPage;