
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const CalculatorPage: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num);
    setExpression(expression + num);
  };

  const handleOperator = (op: string) => {
    setDisplay('0');
    setExpression(expression + ' ' + op + ' ');
  };

  const calculate = () => {
    try {
      // Note: Using eval is generally unsafe for untrusted input, but acceptable for this simple calculator demo
      // eslint-disable-next-line no-eval
      const result = eval(expression).toString();
      setDisplay(result);
      setExpression(result);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const btnClass = "h-14 rounded-lg font-bold text-xl transition-transform active:scale-95 shadow-lg";
  const numBtn = `${btnClass} bg-slate-700 text-white hover:bg-slate-600`;
  const opBtn = `${btnClass} bg-brand-dark text-white hover:bg-brand-primary`;
  const actionBtn = `${btnClass} bg-slate-600 text-slate-200 hover:bg-slate-500`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700">
        <h1 className="text-xl font-bold text-slate-400 mb-4 text-center">React 계산기</h1>
        
        <div className="bg-slate-900 p-4 rounded-xl mb-6 text-right shadow-inner">
          <div className="text-slate-500 text-sm h-6 mb-1">{expression}</div>
          <div className="text-white text-4xl font-mono overflow-hidden">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button onClick={clear} className={`${actionBtn} col-span-3 bg-red-900/50 text-red-200 hover:bg-red-800/50`}>AC</button>
          <button onClick={() => handleOperator('/')} className={opBtn}>÷</button>

          <button onClick={() => handleNumber('7')} className={numBtn}>7</button>
          <button onClick={() => handleNumber('8')} className={numBtn}>8</button>
          <button onClick={() => handleNumber('9')} className={numBtn}>9</button>
          <button onClick={() => handleOperator('*')} className={opBtn}>×</button>

          <button onClick={() => handleNumber('4')} className={numBtn}>4</button>
          <button onClick={() => handleNumber('5')} className={numBtn}>5</button>
          <button onClick={() => handleNumber('6')} className={numBtn}>6</button>
          <button onClick={() => handleOperator('-')} className={opBtn}>-</button>

          <button onClick={() => handleNumber('1')} className={numBtn}>1</button>
          <button onClick={() => handleNumber('2')} className={numBtn}>2</button>
          <button onClick={() => handleNumber('3')} className={numBtn}>3</button>
          <button onClick={() => handleOperator('+')} className={opBtn}>+</button>

          <button onClick={() => handleNumber('0')} className={`${numBtn} col-span-2`}>0</button>
          <button onClick={() => handleNumber('.')} className={numBtn}>.</button>
          <button onClick={calculate} className={`${opBtn} bg-brand-secondary`}>=</button>
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

export default CalculatorPage;
