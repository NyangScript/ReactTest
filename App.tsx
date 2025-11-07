import React, { useState, useCallback } from 'react';
import { Website } from './types';
import Header from './components/Header';
import WebsiteCard from './components/WebsiteCard';
import AddWebsiteModal from './components/AddWebsiteModal';
import Footer from './components/Footer';

// 초기 목업 데이터
const initialWebsites: Website[] = [
  {
    id: '1',
    title: '나만의 포트폴리오',
    description: 'React와 Tailwind CSS로 제작된 개인 프로젝트 포트폴리오 사이트입니다. 저의 작업물과 기술 스택을 소개합니다.',
    url: 'https://example.com/portfolio',
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    tags: ['React', 'Portfolio', 'WebDev'],
  },
  {
    id: '2',
    title: '요리 레시피 블로그',
    description: '쉽고 맛있는 요리 레시피를 공유하는 블로그입니다. 주간 메뉴와 요리 팁을 확인하세요.',
    url: 'https://example.com/recipes',
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    tags: ['Cooking', 'Food', 'Blog'],
  },
  {
    id: '3',
    title: '여행 사진 갤러리',
    description: '세계 각지를 여행하며 찍은 사진들을 모아놓은 갤러리입니다. 아름다운 풍경을 감상하세요.',
    url: 'https://example.com/travel',
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    tags: ['Travel', 'Photography', 'Gallery'],
  },
];

const App: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingWebsite(null);
  }, []);

  const handleAddWebsite = useCallback((website: Omit<Website, 'id'>) => {
    setWebsites(prev => [
      { ...website, id: new Date().toISOString(), imageUrl: `https://picsum.photos/seed/${new Date().getTime()}/600/400` },
      ...prev
    ]);
    closeModal();
  }, [closeModal]);

  const handleUpdateWebsite = useCallback((updatedWebsite: Website) => {
    setWebsites(prev => prev.map(w => w.id === updatedWebsite.id ? updatedWebsite : w));
    closeModal();
  }, [closeModal]);

  const handleDeleteWebsite = useCallback((id: string) => {
    if(window.confirm('정말로 이 웹사이트를 삭제하시겠습니까?')) {
      setWebsites(prev => prev.filter(w => w.id !== id));
    }
  }, []);

  const handleEditWebsite = useCallback((website: Website) => {
    setEditingWebsite(website);
    openModal();
  }, [openModal]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header onAddWebsite={openModal} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {websites.map(website => (
            <WebsiteCard
              key={website.id}
              website={website}
              onEdit={() => handleEditWebsite(website)}
              onDelete={() => handleDeleteWebsite(website.id)}
            />
          ))}
        </div>
      </main>
      {isModalOpen && (
        <AddWebsiteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingWebsite ? handleUpdateWebsite : handleAddWebsite}
          websiteToEdit={editingWebsite}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;
