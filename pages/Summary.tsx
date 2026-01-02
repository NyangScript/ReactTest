import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

// ----------------------------------------------------------------------
// 1. CONFIGURATION & TYPES
// ----------------------------------------------------------------------

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      contents: `다음 [텍스트]의 내용을 바탕으로 핵심 내용을 요약하고, 주요 키워드와 감성을 분석해줘.\n\n[텍스트 시작]\n${text}\n[텍스트 끝]`,
      config: {
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

// 2차 가공을 위한 함수 (이메일, 보고서 등 변환)
const transformContent = async (summary: string, format: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `다음 요약된 내용을 바탕으로 [${format}] 형식의 글을 작성해줘.\n\n[요약 내용]\n${summary}`,
    config: {
      systemInstruction: "당신은 유능한 비즈니스 에디터입니다. 요청된 형식(이메일, 보고서, SNS 등)에 맞춰 전문적이고 깔끔하게 텍스트를 재구성하십시오. Markdown 형식으로 출력하지 마십시오.",
    }
  });
  return response.text || "";
};

// ----------------------------------------------------------------------
// 3. UI COMPONENTS (Internal)
// ----------------------------------------------------------------------

const LoadingIndicator: React.FC<{ message?: string }> = ({ message = "Intelligence Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 animate-pulse">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-400 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-indigo-400 tracking-wider uppercase">
        {message}
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

const Summary: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 2차 가공 상태 관리
  const [transforming, setTransforming] = useState(false);
  const [transformedText, setTransformedText] = useState<{ type: string; content: string } | null>(null);

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim()) return;
    setAppState(AppState.PROCESSING);
    setError(null);
    setResult(null);
    setTransformedText(null); // 초기화

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
    setTransformedText(null);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("클립보드에 복사되었습니다.");
  };

  const handleTransform = async (format: string) => {
    if (!result) return;
    setTransforming(true);
    try {
      const text = await transformContent(result.summary, format);
      setTransformedText({ type: format, content: text });
    } catch (e) {
      alert("변환 중 오류가 발생했습니다.");
    } finally {
      setTransforming(false);
    }
  };

  const handleKeywordSearch = (keyword: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, '_blank');
  };

  // Sentiment UI Logic (Dark Mode Compatible)
  const sentimentConfig = result ? {
    positive: { color: 'bg-green-900/50 text-green-200 border-green-700', label: '긍정적' },
    neutral: { color: 'bg-slate-700 text-slate-200 border-slate-600', label: '중립적' },
    negative: { color: 'bg-orange-900/50 text-orange-200 border-orange-700', label: '부정적' },
    critical: { color: 'bg-red-900/50 text-red-200 border-red-700', label: '위기/긴급' },
  }[result.sentiment] : { color: '', label: '' };

  return (
    // Main Background: Dark Slate (bg-slate-900)
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header with Back Button */}
        <header className="mb-8 flex flex-col sm:flex-row items-center justify-between border-b border-slate-700 pb-6 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors group"
              title="메인으로 돌아가기"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Intel<span className="text-indigo-400">Brief</span>
              </h1>
              <p className="text-sm text-slate-400">Cognitive Summarization System</p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input */}
          <section className="flex flex-col space-y-4">
            <div className={`
              bg-slate-800 rounded-xl shadow-lg border overflow-hidden transition-all duration-300 relative
              ${appState === AppState.PROCESSING ? 'opacity-70 pointer-events-none' : 'opacity-100'}
              focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500
              border-slate-700
            `}>
              <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  Raw Data Input
                </span>
                <div className="flex items-center gap-3">
                  {inputText.length > 0 && (
                    <button 
                      onClick={() => setInputText('')} 
                      className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                    >
                      지우기
                    </button>
                  )}
                  <span className={`text-xs ${inputText.length > 1000 ? 'text-orange-400' : 'text-slate-500'}`}>
                    {inputText.length.toLocaleString()} chars
                  </span>
                </div>
              </div>
              <textarea
                className="w-full h-[500px] p-5 resize-none border-none focus:ring-0 text-slate-200 bg-slate-800 text-lg leading-relaxed placeholder:text-slate-600 outline-none scrollbar-thin scrollbar-thumb-slate-600"
                placeholder="분석이 필요한 텍스트를 붙여넣으세요..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={appState === AppState.PROCESSING}
              />
              {appState === AppState.PROCESSING && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-10">
                  <LoadingIndicator />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSummarize}
                disabled={!inputText.trim() || appState === AppState.PROCESSING}
                className={`
                  flex-1 py-4 px-6 rounded-xl font-bold shadow-lg text-white transition-all transform active:scale-[0.98] flex justify-center items-center gap-2
                  ${!inputText.trim() || appState === AppState.PROCESSING 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-500 shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20 hover:-translate-y-0.5'}
                `}
              >
                <span>핵심 정보 추출 (Summarize)</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
              
              {result && (
                <button
                  onClick={handleReset}
                  className="px-5 py-4 rounded-xl font-bold text-slate-400 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-red-400 hover:border-red-900/30 transition-colors shadow-sm"
                >
                  초기화
                </button>
              )}
            </div>
          </section>

          {/* Right Column: Output & Actions */}
          <section aria-live="polite" className="flex flex-col gap-6">
            
            {/* Idle State */}
            {appState === AppState.IDLE && (
              <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-10 text-center select-none bg-slate-800/30">
                <svg className="w-16 h-16 mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <h3 className="text-lg font-semibold text-slate-400">대기 중</h3>
                <p className="text-sm mt-1 max-w-xs text-slate-500">텍스트를 입력하면 AI가 핵심 내용과 실행 가능한 인사이트를 제공합니다.</p>
              </div>
            )}

            {/* Error State */}
            {appState === AppState.ERROR && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 flex flex-col items-center text-center text-red-400 animate-fade-in shadow-sm">
                <svg className="w-10 h-10 mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="font-bold">분석 실패</p>
                <p className="text-sm mt-1 text-red-300">{error}</p>
              </div>
            )}

            {/* Success State: Main Result */}
            {result && (
              <div className="space-y-6 animate-fade-in-up">
                {/* 1. Summary Card */}
                <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      분석 리포트
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${sentimentConfig.color}`}>
                      {sentimentConfig.label}
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Executive Summary</h4>
                        <button 
                          onClick={() => handleCopy(result.summary)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          복사
                        </button>
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg font-medium bg-slate-900/50 p-4 rounded-lg border border-slate-700 shadow-inner">
                        {result.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actionable Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((keyword, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleKeywordSearch(keyword)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-indigo-300 hover:bg-slate-600 hover:text-indigo-200 border border-slate-600 transition-all shadow-sm group"
                            title="구글 검색"
                          >
                            <span className="opacity-50 mr-1 text-indigo-500">#</span>
                            {keyword}
                            <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="bg-slate-900/50 px-6 py-4 border-t border-slate-700 grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleTransform('비즈니스 이메일 초안')}
                      disabled={transforming}
                      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-700 hover:text-indigo-400 transition-all text-slate-400 text-xs gap-1 border border-transparent hover:border-slate-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span>이메일 작성</span>
                    </button>
                    <button 
                      onClick={() => handleTransform('보고서 포맷')}
                      disabled={transforming}
                      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-700 hover:text-indigo-400 transition-all text-slate-400 text-xs gap-1 border border-transparent hover:border-slate-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span>보고서 변환</span>
                    </button>
                    <button 
                      onClick={() => handleTransform('SNS 요약 게시글')}
                      disabled={transforming}
                      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-700 hover:text-indigo-400 transition-all text-slate-400 text-xs gap-1 border border-transparent hover:border-slate-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                      <span>SNS 공유글</span>
                    </button>
                  </div>
                </div>

                {/* 2. Secondary Result (Transformation) */}
                {transforming && (
                  <div className="bg-slate-800 rounded-xl shadow-sm border border-indigo-900/50 p-8 flex justify-center items-center">
                    <LoadingIndicator message="콘텐츠 재구성 중..." />
                  </div>
                )}
                
                {!transforming && transformedText && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-indigo-900 overflow-hidden animate-fade-in">
                    <div className="px-6 py-3 border-b border-indigo-900/50 bg-indigo-900/20 flex justify-between items-center">
                      <span className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {transformedText.type}
                      </span>
                      <button 
                        onClick={() => handleCopy(transformedText.content)}
                        className="text-xs bg-slate-800 px-3 py-1 rounded-md border border-slate-600 text-indigo-300 hover:bg-slate-700 shadow-sm transition-colors"
                      >
                        복사하기
                      </button>
                    </div>
                    <div className="p-6">
                      <textarea 
                        readOnly
                        className="w-full h-48 bg-transparent border-none resize-none focus:ring-0 text-slate-300 text-sm leading-relaxed"
                        value={transformedText.content}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Summary;