
import React from 'react';
import { Website } from '../types';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface WebsiteViewerProps {
  website: Website;
  onClose: () => void;
}

const WebsiteViewer: React.FC<WebsiteViewerProps> = ({ website, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in border border-slate-700">
      <div className="flex justify-between items-center py-3 px-4 border-b border-slate-700 bg-slate-900/50">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">목록으로</span>
        </button>
        
        <h2 className="text-lg font-bold text-white truncate max-w-md px-4">
          {website.title}
        </h2>

        <a 
          href={website.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-sm text-brand-light hover:text-brand-primary hover:bg-slate-700/50 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          <span>새 창에서 열기</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>
      
      <div className="flex-grow bg-white relative min-h-[600px]">
        <iframe
            src={website.url}
            className="absolute inset-0 w-full h-full border-0"
            title={website.title}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default WebsiteViewer;
