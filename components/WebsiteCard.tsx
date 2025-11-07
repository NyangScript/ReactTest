
import React from 'react';
import { Website } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface WebsiteCardProps {
  website: Website;
  onEdit: () => void;
  onDelete: () => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-brand-primary/40 hover:scale-[1.02] flex flex-col animate-fade-in">
      <div className="relative">
        <img src={website.imageUrl} alt={website.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={onEdit} className="p-2 bg-slate-900/70 rounded-full text-slate-300 hover:text-white hover:bg-brand-primary transition-colors">
            <EditIcon className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="p-2 bg-slate-900/70 rounded-full text-slate-300 hover:text-white hover:bg-red-500 transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{website.title}</h3>
        <p className="text-slate-400 text-sm mb-4 flex-grow">
          {website.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {website.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-brand-secondary/30 text-brand-light text-xs font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-5 pt-0 mt-auto">
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          <span>방문하기</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default WebsiteCard;
