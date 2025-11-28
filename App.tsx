
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Website } from './types';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import IdeaGeneratorPage from './pages/IdeaGeneratorPage';
import SpaceShooterPage from './pages/SpaceShooterPage';
import WeatherPage from './pages/WeatherPage';
import TodoPage from './pages/TodoPage';
import CalculatorPage from './pages/CalculatorPage';
import AddWebsiteModal from './components/AddWebsiteModal';

// 초기 목업 데이터 - 4개의 독립적인 페이지로 교체
const initialWebsites: Website[] = [
  {
    id: '1',
    title: '스페이스 슈터',
    description: 'React와 Canvas로 직접 구현한 우주 슈팅 게임입니다. 적들을 물리치고 최고 점수에 도전하세요!',
    url: '', // 내부 페이지이므로 비워둠
    imageUrl: 'https://picsum.photos/seed/shooter/600/400',
    tags: ['게임', 'Canvas', '액션'],
    path: '/space-shooter'
  },
  {
    id: '2',
    title: '날씨 대시보드',
    description: '실시간 날씨 정보를 확인할 수 있는 깔끔한 대시보드입니다. 원하는 도시를 검색해보세요.',
    url: '',
    imageUrl: 'https://picsum.photos/seed/weather/600/400',
    tags: ['유틸리티', '정보', 'API'],
    path: '/weather'
  },
  {
    id: '3',
    title: '할 일 목록 (Todo)',
    description: '오늘의 할 일을 기록하고 관리하는 생산성 도구입니다. 완료된 항목을 체크하여 관리하세요.',
    url: '',
    imageUrl: 'https://picsum.photos/seed/todo/600/400',
    tags: ['생산성', '관리', '유틸리티'],
    path: '/todo'
  },
  {
    id: '4',
    title: '간편 계산기',
    description: '빠르고 간편하게 사칙연산을 수행할 수 있는 웹 계산기입니다.',
    url: '',
    imageUrl: 'https://picsum.photos/seed/calc/600/400',
    tags: ['도구', '수학', '계산'],
    path: '/calculator'
  }
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
    // 내부 페이지 추가는 코드 수정이 필요하므로, 여기서는 커스텀 카드만 추가됨 (path가 없으면 동작하지 않을 수 있음)
    setWebsites(prev => [
      { ...website, id: new Date().toISOString(), imageUrl: `https://picsum.photos/seed/${new Date().getTime()}/600/400`, path: website.path || '/' },
      ...prev
    ]);
    closeModal();
  }, [closeModal]);

  const handleUpdateWebsite = useCallback((updatedWebsite: Website) => {
    setWebsites(prev => prev.map(w => w.id === updatedWebsite.id ? updatedWebsite : w));
    closeModal();
  }, [closeModal]);

  const handleDeleteWebsite = useCallback((id: string) => {
    if(window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      setWebsites(prev => prev.filter(w => w.id !== id));
    }
  }, []);

  const handleEditWebsite = useCallback((website: Website) => {
    setEditingWebsite(website);
    openModal();
  }, [openModal]);

  const dashboardContext = {
    websites,
    handleEditWebsite,
    handleDeleteWebsite
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout onAddWebsite={openModal} outletContext={dashboardContext} />}>
          <Route index element={<DashboardPage />} />
          <Route path="idea-generator" element={<IdeaGeneratorPage />} />
          
          {/* 4개의 내부 페이지 라우트 */}
          <Route path="space-shooter" element={<SpaceShooterPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="calculator" element={<CalculatorPage />} />
        </Route>
      </Routes>
      {isModalOpen && (
        <AddWebsiteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingWebsite ? handleUpdateWebsite : handleAddWebsite}
          websiteToEdit={editingWebsite}
        />
      )}
    </HashRouter>
  );
};

export default App;
