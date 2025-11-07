import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface HeaderProps {
  onAddWebsite: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddWebsite }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Links
        </h1>
        <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">홈</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">소개</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">연락처</a>
        </nav>
        <button
          onClick={onAddWebsite}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">사이트 추가</span>
        </button>
      </div>
    </header>
  );
};

export default Header;