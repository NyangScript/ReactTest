
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const TextAnalyzerPage: React.FC = () => {
  const [text, setText] = useState('');

  const stats = {
    chars: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
    noSpaces: text.replace(/\s/g, '').length
  };

  const handleUpperCase = () => setText(text.toUpperCase());
  const handleLowerCase = () => setText(text.toLowerCase());
  const handleClear = () => setText('');
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다.');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-white">텍스트 분석기</h1>
           <div className="flex gap-2">
              <button onClick={handleUpperCase} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm">대문자 변환</button>
              <button onClick={handleLowerCase} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm">소문자 변환</button>
              <button onClick={handleCopy} className="px-3 py-1 bg-brand-primary hover:bg-brand-secondary text-white rounded text-sm">복사</button>
              <button onClick={handleClear} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">지우기</button>
           </div>
        </div>
        
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
          className="w-full h-64 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none mb-6 font-mono resize-y"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.chars}</div>
            <div className="text-slate-400 text-sm">총 글자 수</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.noSpaces}</div>
            <div className="text-slate-400 text-sm">공백 제외 글자 수</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.words}</div>
            <div className="text-slate-400 text-sm">단어 수</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.lines}</div>
            <div className="text-slate-400 text-sm">줄 수</div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default TextAnalyzerPage;
