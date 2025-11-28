
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const WeatherPage: React.FC = () => {
  const [city, setCity] = useState('Seoul');
  
  // Mock data for display
  const weatherData = {
    temp: 24,
    condition: 'Sunny',
    humidity: 45,
    wind: 12
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">오늘의 날씨</h1>
        
        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-brand-primary focus:outline-none"
          />
          <button className="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors">
            검색
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">☀️</div>
          <div className="text-5xl font-bold text-white mb-2">{weatherData.temp}°C</div>
          <div className="text-xl text-brand-light">{weatherData.condition}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-slate-400 text-sm">습도</div>
            <div className="text-white text-lg font-semibold">{weatherData.humidity}%</div>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-slate-400 text-sm">바람</div>
            <div className="text-white text-lg font-semibold">{weatherData.wind} km/h</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default WeatherPage;
