
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const UnitConverterPage: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [inputVal, setInputVal] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  // Conversion rates relative to a base unit (m for length, kg for weight)
  const rates: any = {
    length: {
      m: 1,
      km: 0.001,
      cm: 100,
      mm: 1000,
      ft: 3.28084,
      inch: 39.3701,
      yd: 1.09361
    },
    weight: {
      kg: 1,
      g: 1000,
      mg: 1000000,
      lb: 2.20462,
      oz: 35.274
    }
  };

  const calculate = () => {
    const val = parseFloat(inputVal);
    if (isNaN(val)) return '---';
    
    const base = val / rates[category][fromUnit];
    const result = base * rates[category][toUnit];
    
    // Format to avoid long decimals but keep precision if needed
    return result % 1 === 0 ? result.toString() : result.toFixed(4);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">단위 변환기</h1>

        <div className="flex justify-center gap-2 mb-6">
          <button 
            onClick={() => { setCategory('length'); setFromUnit('m'); setToUnit('ft'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${category === 'length' ? 'bg-brand-primary text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            길이
          </button>
          <button 
            onClick={() => { setCategory('weight'); setFromUnit('kg'); setToUnit('lb'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${category === 'weight' ? 'bg-brand-primary text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            무게
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-slate-400 text-xs mb-1">입력값</label>
                <input 
                  type="number" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-brand-primary focus:outline-none"
                />
             </div>
             <div>
                <label className="block text-slate-400 text-xs mb-1">단위</label>
                <select 
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-brand-primary focus:outline-none"
                >
                  {Object.keys(rates[category]).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
             </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-slate-700 p-2 rounded-full">⬇️</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-slate-400 text-xs mb-1">결과값</label>
                <div className="w-full bg-slate-600/50 border border-slate-600 rounded-lg p-3 text-brand-light font-bold">
                  {calculate()}
                </div>
             </div>
             <div>
                <label className="block text-slate-400 text-xs mb-1">단위</label>
                <select 
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-brand-primary focus:outline-none"
                >
                  {Object.keys(rates[category]).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
             </div>
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

export default UnitConverterPage;
