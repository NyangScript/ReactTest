
import React from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { Website } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon';
import ShieldIcon from '../components/icons/ShieldIcon';

interface DashboardContext {
  websites: Website[];
}

const WebViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { websites } = useOutletContext<DashboardContext>();
  
  const website = websites.find(w => w.id === id);

  if (!website) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-white mb-4">웹사이트를 찾을 수 없습니다.</h2>
        <Link to="/" className="text-brand-light hover:text-white">대시보드로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
             <Link to="/" className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
             </Link>
             <h1 className="text-2xl font-bold text-white truncate max-w-md">{website.title}</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11 truncate max-w-lg">{website.url}</p>
        </div>
        
        <a 
          href={website.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span>새 탭에서 열기</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>

      <div className="flex-grow bg-white rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
        {/* iframe 경고 메시지 오버레이 (iframe 로드 전 잠깐 보일 수 있음) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-300 z-0 p-8 text-center">
           <ShieldIcon className="w-16 h-16 mb-4 text-slate-500" />
           <h3 className="text-xl font-semibold mb-2">연결 중...</h3>
           <p className="max-w-md">
             잠시만 기다려주세요. <br/>
             일부 웹사이트(네이버, 유튜브 등)는 보안 정책상 미리보기(Iframe)를 차단할 수 있습니다.<br/>
             화면이 나오지 않는다면 우측 상단의 <strong>'새 탭에서 열기'</strong> 버튼을 눌러주세요.
           </p>
        </div>

        <iframe 
          src={website.url} 
          title={website.title}
          className="w-full h-full z-10 relative bg-white"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default WebViewerPage;
