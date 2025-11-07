
import React, { useState, useEffect, useCallback } from 'react';
import { Website } from '../types';
import { generateWebsiteInfo, WebsiteInfo } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Website | Omit<Website, 'id' | 'imageUrl'>) => void;
  websiteToEdit?: Website | null;
}

const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({ isOpen, onClose, onSave, websiteToEdit }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (websiteToEdit) {
      setUrl(websiteToEdit.url);
      setTitle(websiteToEdit.title);
      setDescription(websiteToEdit.description);
      setTags(websiteToEdit.tags.join(', '));
    } else {
      setUrl('');
      setTitle('');
      setDescription('');
      setTags('');
    }
  }, [websiteToEdit]);

  const handleGenerateInfo = useCallback(async () => {
    if (!url || !url.startsWith('http')) {
      setError('유효한 URL을 입력해주세요 (http:// 또는 https:// 포함).');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const info: WebsiteInfo = await generateWebsiteInfo(url);
      setTitle(info.title);
      setDescription(info.description);
      setTags(info.tags.join(', '));
    } catch (e: any) {
      setError(e.message || '정보를 생성하는 데 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      setError('URL과 제목은 필수 항목입니다.');
      return;
    }
    const websiteData = {
      title,
      description,
      url,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (websiteToEdit) {
      onSave({ ...websiteToEdit, ...websiteData });
    } else {
      onSave(websiteData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {websiteToEdit ? '웹사이트 수정' : '새 웹사이트 추가'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">웹사이트 URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerateInfo}
                    disabled={isGenerating}
                    className="w-40 flex justify-center items-center bg-brand-secondary hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <SpinnerIcon className="w-5 h-5" /> : '정보 자동 생성'}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">제목</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">설명</label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
                ></textarea>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-2">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-brand-primary hover:bg-brand-dark text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWebsiteModal;
