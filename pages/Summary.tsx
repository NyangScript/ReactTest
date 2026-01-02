import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// ----------------------------------------------------------------------
// 1. CONFIGURATION & TYPES
// ----------------------------------------------------------------------

// API Configuration
// process.env.API_KEY는 빌드/실행 환경에서 주입되어야 합니다.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Types
export interface SummaryResult {
  summary: string;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// ----------------------------------------------------------------------
// 2. SERVICE LAYER (API LOGIC)
// ----------------------------------------------------------------------

const summarizeText = async (text: string): Promise<SummaryResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // 수정됨: 입력된 텍스트(text)를 프롬프트에 명시적으로 포함
      contents: `다음 [텍스트]의 내용을 바탕으로 핵심 내용을 요약하고, 주요 키워드와 감성을 분석해줘.\n\n[텍스트 시작]\n${text}\n[텍스트 끝]`,
      config: {
        // 수정됨: 내용 파악에 집중하도록 지침 보강
        systemInstruction: `당신은 위기 상황이나 정보 과부하 상황에서 텍스트의 '실질적인 내용'을 정확하게 파악하여 전달하는 '정보 분석관'입니다. 
        
        지침:
        1. 입력된 텍스트의 사실 관계와 핵심 의미를 파악하는 데 집중하십시오.
        2. 단순한 형식적 요약이 아닌, 글쓴이의 의도나 상황의 핵심을 꿰뚫는 요약을 작성하십시오.
        3. 문장은 간결하고 명확한 한국어로 작성하십시오.
        4. 결과는 반드시 JSON 형식으로 반환해야 합니다.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "텍스트의 내용을 관통하는 핵심 요약문 (한국어, 3~5문장)"
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "텍스트의 내용을 대표하는 핵심 키워드 3~5개"
            },
            sentiment: {
              type: Type.STRING,
              enum: ["positive", "neutral", "negative", "critical"],
              description: "텍스트 내용의 분위기 또는 긴급도"
            }
          },
          required: ["summary", "keywords", "sentiment"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as SummaryResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("정보 분석 중 오류가 발생했습니다. 내용을 다시 확인하거나 잠시 후 시도해주세요.");
  }
};

// ----------------------------------------------------------------------
// 3. UI COMPONENTS (Internal)
// ----------------------------------------------------------------------

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 animate-pulse">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-indigo-600 tracking-wider uppercase">
        Intelligence Processing...
      </p>
    </div>
  );
};

const ResultCard: React.FC<{ data: SummaryResult }> = ({ data }) => {
  const sentimentConfig = {
    positive: { color: 'bg-green-100 text-green-800 border-green-200', label: '긍정적' },
    neutral: { color: 'bg-slate-100 text-slate-800 border-slate-200', label: '중립적' },
    negative: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: '부정적' },
    critical: { color: 'bg-red-100 text-red-800 border-red-200', label: '위기/긴급' },
  };

  const config = sentimentConfig[data.sentiment];

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-500 ease-out animate-fade-in-up">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          분석 리포트
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${config.color}`}>
          {config.label} ({data.sentiment})
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h4>
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-lg font-medium">
            {data.summary}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-default border border-indigo-100">
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

const Summary: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim()) return;

    setAppState(AppState.PROCESSING);
    setError(null);
    setResult(null);

    try {
      const data = await summarizeText(inputText);
      setResult(data);
      setAppState(AppState.COMPLETED);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
      setAppState(AppState.ERROR);
    }
  }, [inputText]);

  const handleReset = useCallback(() => {
    setInputText('');
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <header className="mb-10 text-center sm:text-left border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Intel<span className="text-indigo-600">Brief</span>
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Cognitive Summarization System
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <section className="flex flex-col space-y-4">
          <div className={`
            bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300
            ${appState === AppState.PROCESSING ? 'opacity-50 pointer-events-none' : 'opacity-100'}
            focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500
            border-slate-200
          `}>
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                Raw Data Input
              </span>
              <span className={`text-xs ${inputText.length > 1000 ? 'text-orange-500' : 'text-slate-400'}`}>
                {inputText.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              className="w-full h-[400px] p-5 resize-none border-none focus:ring-0 text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 outline-none"
              placeholder="분석이 필요한 텍스트를 입력하세요."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={appState === AppState.PROCESSING}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSummarize}
              disabled={!inputText.trim() || appState === AppState.PROCESSING}
              className={`
                flex-1 py-4 px-6 rounded-xl font-bold shadow-md text-white transition-all transform active:scale-95 flex justify-center items-center gap-2
                ${!inputText.trim() || appState === AppState.PROCESSING 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'}
              `}
            >
               {appState === AppState.PROCESSING ? (
                 <span>분석 엔진 가동 중...</span>
               ) : (
                 <>
                   <span>핵심 정보 추출 (Summarize)</span>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </>
               )}
            </button>
            
            {appState !== AppState.IDLE && (
              <button
                onClick={handleReset}
                className="px-5 py-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                title="입력 초기화"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>
        </section>

        {/* Output Section */}
        <section aria-live="polite" className="min-h-[400px] flex flex-col">
          {appState === AppState.IDLE && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl p-10 text-center select-none bg-slate-50/50">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-400">대기 중 (IDLE)</h3>
              <p className="text-sm mt-1 max-w-xs">텍스트를 입력하고 분석 버튼을 눌러 인사이트를 확인하세요.</p>
            </div>
          )}

          {appState === AppState.PROCESSING && (
             <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
               <LoadingIndicator />
             </div>
          )}

          {appState === AppState.ERROR && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600 animate-fade-in shadow-sm">
              <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="font-bold text-lg">시스템 오류</p>
              <p className="mt-1">{error}</p>
              <button 
                onClick={handleSummarize}
                className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {appState === AppState.COMPLETED && result && (
            <ResultCard data={result} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Summary;