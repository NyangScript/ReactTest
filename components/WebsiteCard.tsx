
import React from 'react';
import { Link } from 'react-router-dom';
import { Website } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface WebsiteCardProps {
  website: Website;
  onEdit: () => void;
  onDelete: () => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onEdit, onDelete }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <Link
      to={website.path}
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-brand-primary/40 hover:scale-[1.02] flex flex-col animate-fade-in block relative"
    >
      <div className="relative">
        <img src={website.imageUrl} alt={website.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleEditClick} 
            className="p-2 bg-slate-900/70 rounded-full text-slate-300 hover:text-white hover:bg-brand-primary transition-colors z-20"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDeleteClick} 
            className="p-2 bg-slate-900/70 rounded-full text-slate-300 hover:text-white hover:bg-red-500 transition-colors z-20"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{website.title}</h3>
        <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-3">
          {website.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {website.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-brand-secondary/30 text-brand-light text-xs font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default WebsiteCard;
