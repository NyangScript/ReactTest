import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Website } from '../types';
import WebsiteCard from '../components/WebsiteCard';
import LightbulbIcon from '../components/icons/LightbulbIcon';

interface DashboardContext {
  websites: Website[];
  handleEditWebsite: (website: Website) => void;
  handleDeleteWebsite: (id: string) => void;
}

const DashboardPage: React.FC = () => {
  const { websites, handleEditWebsite, handleDeleteWebsite } = useOutletContext<DashboardContext>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {websites.map(website => (
        <WebsiteCard
          key={website.id}
          website={website}
          onEdit={() => handleEditWebsite(website)}
          onDelete={() => handleDeleteWebsite(website.id)}
        />
      ))}
      <Link to="/idea-generator" className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-brand-secondary/50 hover:scale-[1.02] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <LightbulbIcon className="w-16 h-16 text-white/80 mb-4 transition-transform duration-300 group-hover:scale-110" />
        <h3 className="text-xl font-bold text-white mb-2">새로운 아이디어 발견</h3>
        <p className="text-slate-300 text-sm">Gemini AI가 추천하는 웹사이트 아이디어를 확인해보세요!</p>
      </Link>
    </div>
  );
};

export default DashboardPage;