
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const ClockCard: React.FC<{ city: string; zone: string; label: string }> = ({ city, zone, label }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(time);

  const dateString = new Intl.DateTimeFormat('ko-KR', {
    timeZone: zone,
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  }).format(time);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center hover:border-brand-primary transition-colors">
      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">{label}</h3>
      <div className="text-4xl font-bold text-white mb-2 font-mono">{timeString}</div>
      <div className="text-brand-light text-sm">{dateString}</div>
    </div>
  );
};

const WorldClockPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">세계 시계</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClockCard city="seoul" zone="Asia/Seoul" label="서울 (Seoul)" />
        <ClockCard city="ny" zone="America/New_York" label="뉴욕 (New York)" />
        <ClockCard city="london" zone="Europe/London" label="런던 (London)" />
        <ClockCard city="paris" zone="Europe/Paris" label="파리 (Paris)" />
        <ClockCard city="tokyo" zone="Asia/Tokyo" label="도쿄 (Tokyo)" />
        <ClockCard city="sydney" zone="Australia/Sydney" label="시드니 (Sydney)" />
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default WorldClockPage;
