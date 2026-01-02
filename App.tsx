
import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Website } from './types';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import IdeaGeneratorPage from './pages/IdeaGeneratorPage';
import SpaceShooterPage from './pages/SpaceShooterPage';
import WeatherPage from './pages/WeatherPage';
import TodoPage from './pages/TodoPage';
import CalculatorPage from './pages/CalculatorPage';
import MemoriaPage from './pages/MemoriaPage';
import PomodoroPage from './pages/PomodoroPage';
import UnitConverterPage from './pages/UnitConverterPage';
import TextAnalyzerPage from './pages/TextAnalyzerPage';
import BreathingPage from './pages/BreathingPage';
import WorldClockPage from './pages/WorldClockPage';
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
  },
  {
    id: '5',
    title: 'Memoria',
    description: '보호자용 어플리케이션으로 환자의 행동을 모니터링하고 이상 상황을 감지합니다.',
    url: '',
    imageUrl: 'https://picsum.photos/seed/memoria/600/400',
    tags: ['헬스케어', '모니터링', 'AI'],
    path: '/memoria'
  },
  {
    id: '6',
    title: '뽀모도로 타이머',
    description: '25분 집중, 5분 휴식으로 효율을 높이세요.',
    url: '',
    imageUrl: 'https://picsum.photos/seed/pomodoro/600/400',
    tags: ['생산성', '타이머'],
    path: '/pomodoro'
  },
  {
    id: '7',
    title: '단위 변환기',
    description: '길이, 무게 등 다양한 단위를 쉽게 변환하세요.',
    url: '',
    imageUrl: 'https://picsum.photos/seed/unit/600/400',
    tags: ['도구', '변환'],
    path: '/unit-converter'
  },
  {
    id: '8',
    title: '텍스트 분석기',
    description: '글자 수, 단어 수를 세고 텍스트를 변환하세요.',
    url: ' ',
    imageUrl: 'https://picsum.photos/seed/text/600/400',
    tags: ['도구', '텍스트'],
    path: '/text-analyzer'
  },
  {
    id: '9',
    title: '호흡 운동',
    description: '가이드를 따라 호흡하며 마음을 안정시키세요.',
    url: ' ',
    imageUrl: 'https://picsum.photos/seed/breathe/600/400',
    tags: ['건강', '명상'],
    path: '/breathing'
  },
  {
    id: '10',
    title: '세계 시계',
    description: '뉴욕, 런던 등 세계 주요 도시의 시간을 확인하세요.',
    url: ' ',
    imageUrl: 'https://picsum.photos/seed/clock/600/400',
    tags: ['정보', '시간'],
    path: '/world-clock'
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
    <BrowserRouter basename="/ReactTest">
      <Routes>
        <Route path="/" element={<Layout onAddWebsite={openModal} outletContext={dashboardContext} />}>
          <Route index element={<DashboardPage />} />
          <Route path="idea-generator" element={<IdeaGeneratorPage />} />
          
          {/* 내부 페이지 라우트 */}
          <Route path="space-shooter" element={<SpaceShooterPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="memoria/*" element={<MemoriaPage />} />
          <Route path="pomodoro" element={<PomodoroPage />} />
          <Route path="unit-converter" element={<UnitConverterPage />} />
          <Route path="text-analyzer" element={<TextAnalyzerPage />} />
          <Route path="breathing" element={<BreathingPage />} />
          <Route path="world-clock" element={<WorldClockPage />} />
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
    </BrowserRouter>
  );
};

export default App;
