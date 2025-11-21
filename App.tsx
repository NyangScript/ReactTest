
import React, { useState, useCallback } from 'react';
import { Website } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import WebsiteCard from './components/WebsiteCard';
import AddWebsiteModal from './components/AddWebsiteModal';
import WebsiteViewer from './components/WebsiteViewer';

// 초기 목업 데이터
const initialWebsites: Website[] = [
  {
    id: '1',
    title: '네이버',
    description: '대한민국 대표 검색 엔진. 뉴스, 쇼핑, 커뮤니티 등 다양한 서비스를 제공합니다.',
    url: 'https://www.naver.com',
    imageUrl: `https://picsum.photos/seed/naver/600/400`,
    tags: ['포털', '검색', '뉴스'],
  },
  {
    id: '2',
    title: '나무위키',
    description: '누구나 기여할 수 있는 위키. 다양한 주제에 대한 깊이 있는 정보를 담고 있습니다.',
    url: 'https://namu.wiki',
    imageUrl: `https://picsum.photos/seed/namu/600/400`,
    tags: ['위키', '백과사전', '정보'],
  },
  {
    id: '3',
    title: 'YouTube',
    description: '전 세계 최대 동영상 공유 플랫폼. 다양한 콘텐츠를 시청하고 공유할 수 있습니다.',
    url: 'https://www.youtube.com',
    imageUrl: `https://picsum.photos/seed/youtube/600/400`,
    tags: ['동영상', '스트리밍', '엔터테인먼트'],
  },
];

const App: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [viewingWebsite, setViewingWebsite] = useState<Website | null>(null);

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
      // 만약 삭제된 웹사이트를 보고 있었다면 뷰어 닫기
      if (viewingWebsite?.id === id) {
        setViewingWebsite(null);
      }
    }
  }, [viewingWebsite]);

  const handleEditWebsite = useCallback((website: Website) => {
    setEditingWebsite(website);
    openModal();
  }, [openModal]);

  const handleVisitWebsite = useCallback((website: Website) => {
    setViewingWebsite(website);
  }, []);

  const closeViewer = useCallback(() => {
    setViewingWebsite(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header onAddWebsite={openModal} />
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        {viewingWebsite ? (
          <div className="flex-grow h-full">
             <WebsiteViewer website={viewingWebsite} onClose={closeViewer} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {websites.map(website => (
              <WebsiteCard
                key={website.id}
                website={website}
                onEdit={() => handleEditWebsite(website)}
                onDelete={() => handleDeleteWebsite(website.id)}
                onVisit={() => handleVisitWebsite(website)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      {isModalOpen && (
        <AddWebsiteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingWebsite ? handleUpdateWebsite : handleAddWebsite}
          websiteToEdit={editingWebsite}
        />
      )}
    </div>
  );
};

export default App;
