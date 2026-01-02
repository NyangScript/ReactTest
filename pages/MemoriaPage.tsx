import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import MainPage from './Memoria_Prototype/pages/MainPage';
import AbnormalLogPage from './Memoria_Prototype/pages/AbnormalLogPage';
import DangerousLogPage from './Memoria_Prototype/pages/DangerousLogPage';
import ReportEmergencyPage from './Memoria_Prototype/pages/ReportEmergencyPage';
import ReportErrorPage from './Memoria_Prototype/pages/ReportErrorPage';
import SettingsPage from './Memoria_Prototype/pages/SettingsPage';
import ProfileSettingsPage from './Memoria_Prototype/pages/ProfileSettingsPage'; 
import BluetoothSettingsPage from './Memoria_Prototype/pages/BluetoothSettingsPage';
import Esp32UrlSettingsPage from './Memoria_Prototype/pages/Esp32UrlSettingsPage';
import ChatPage from './Memoria_Prototype/pages/ChatPage';
import BottomNav from './Memoria_Prototype/components/BottomNav';
import BackgroundStatus from './Memoria_Prototype/components/BackgroundStatus';
import { BehaviorLogProvider, useBehaviorLogs } from './Memoria_Prototype/contexts/BehaviorLogContext';
import { UserProfileProvider } from './Memoria_Prototype/contexts/UserProfileContext';
import { CameraSettingsProvider } from './Memoria_Prototype/contexts/CameraSettingsContext'; 
import { Esp32ConfigProvider, useEsp32Config } from './Memoria_Prototype/contexts/Esp32ConfigContext';
import { ChatHistoryProvider } from './Memoria_Prototype/contexts/ChatHistoryContext';
import { ROUTES, DEFAULT_ANALYSIS_LOCATION } from './Memoria_Prototype/constants';
import { AnalysisResponse, BehaviorType } from './Memoria_Prototype/memoriaTypes';
import ForegroundService, { addAnalysisResultListener } from './Memoria_Prototype/plugins/ForegroundServicePlugin';
import { playNativeTTS } from './Memoria_Prototype/services/ttsService';

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-cyan-300 z-[100]">
    <svg className="w-24 h-24 text-white mb-6 animate-pulse" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 5C25.16 5 5 25.16 5 50s20.16 45 45 45 45-20.16 45-45S74.84 5 50 5zm0 82.5c-20.68 0-37.5-16.82-37.5-37.5S29.32 12.5 50 12.5s37.5 16.82 37.5 37.5-16.82 37.5-37.5 37.5z"/>
        <path d="M50 22.5c-3.45 0-6.25 2.8-6.25 6.25s2.8 6.25 6.25 6.25 6.25-2.8 6.25-6.25-2.8-6.25-6.25-6.25zm0 30c-10.35 0-18.75 8.4-18.75 18.75h37.5c0-10.35-8.4-18.75-18.75-18.75z"/>
    </svg>
    <h1 className="text-3xl font-bold text-white">Memoria</h1>
    <p className="text-white text-opacity-80 mt-2">보호자용 어플리케이션</p>
  </div>
);

const MemoriaContent: React.FC = () => {
  const { logs, addLog } = useBehaviorLogs();
  const { esp32Url, flaskUrl, isDefaultEsp32Url, isDefaultFlaskUrl } = useEsp32Config();
  const location = useLocation();
  const navigate = useNavigate();
  // NORMAL은 상태바에 표시하지 않음: 이상/위험 로그일 때만 상태바 표시
  const lastLog = logs.find(l => l.type === BehaviorType.ABNORMAL || l.type === BehaviorType.DANGEROUS) || null;

  // 포그라운드 서비스 시작
  useEffect(() => {
    const startForegroundService = async () => {
      try {
        await ForegroundService.startForegroundService();
      } catch (error) {
        console.error('포그라운드 서비스 시작 실패:', error);
      }
    };

    startForegroundService();
  }, []);

  // 네이티브 Android에서 전송되는 분석 결과 리스너
  useEffect(() => {
    const handleNativeAnalysisResult = async (data: any) => {
      try {
        console.log('네이티브에서 분석 결과 수신:', data);
        
        if (data.behaviorType && data.description) {
          // BehaviorType enum으로 변환
          let behaviorType: BehaviorType;
          switch (data.behaviorType) {
            case 'Abnormal':
              behaviorType = BehaviorType.ABNORMAL;
              break;
            case 'Dangerous':
              behaviorType = BehaviorType.DANGEROUS;
              break;
            default:
              behaviorType = BehaviorType.NORMAL;
              break;
          }

          // 로그 추가
          addLog({
            type: behaviorType,
            description: data.description,
            location: data.location || DEFAULT_ANALYSIS_LOCATION,
            warningMessage: data.warningMessage,
          });

          // 위험 상황이면 TTS 재생
          if (behaviorType === BehaviorType.DANGEROUS && data.warningMessage) {
            playNativeTTS(data.warningMessage);
          }
        }
      } catch (error) {
        console.error('네이티브 분석 결과 처리 오류:', error);
      }
    };

    // 네이티브 이벤트 리스너 등록
    addAnalysisResultListener(handleNativeAnalysisResult);

    // 앱 시작 시 로컬 로그 불러오기
    const loadLocalLogs = async () => {
      try {
        const result = await ForegroundService.getLocalLogs();
        if (result.logs && result.logs.length > 0) {
          console.log('로컬 로그 불러오기:', result.logs.length, '개');
          
          // 로컬 로그를 앱 로그에 추가
          for (const logStr of result.logs) {
            try {
              const logData = JSON.parse(logStr);
              if (logData.type && logData.description) {
                let behaviorType: BehaviorType;
                switch (logData.type) {
                  case 'Abnormal':
                    behaviorType = BehaviorType.ABNORMAL;
                    break;
                  case 'Dangerous':
                    behaviorType = BehaviorType.DANGEROUS;
                    break;
                  default:
                    behaviorType = BehaviorType.NORMAL;
                    break;
                }

                addLog({
                  type: behaviorType,
                  description: logData.description,
                  location: logData.location || DEFAULT_ANALYSIS_LOCATION,
                });
              }
            } catch (parseError) {
              console.error('로컬 로그 파싱 오류:', parseError);
            }
          }

          // 로컬 로그 삭제 (중복 방지)
          await ForegroundService.clearLocalLogs();
        }
      } catch (error) {
        console.error('로컬 로그 불러오기 오류:', error);
      }
    };

    loadLocalLogs();
  }, [addLog]);

  // 최신 로그가 변경될 때마다 포그라운드 서비스 업데이트
  useEffect(() => {
    if (lastLog) {
      const updateForegroundService = async () => {
        try {
          await ForegroundService.startForegroundService({
            behaviorType: lastLog.type,
            description: lastLog.description,
            location: lastLog.location,
            timestamp: lastLog.timestamp ? lastLog.timestamp.toString() : undefined,
          });
        } catch (error) {
          console.error('포그라운드 서비스 업데이트 실패:', error);
        }
      };

      updateForegroundService();
    }
  }, [lastLog]);

  useEffect(() => {
    // Do not set up listener if URL is not configured
    if (isDefaultEsp32Url) return;

    const handleIframeMessage = (event: MessageEvent) => {
      try {
        // flaskUrl/esp32Url 둘 다 허용
        const flaskHost = flaskUrl ? new URL(flaskUrl).hostname : null;
        const esp32Host = esp32Url ? new URL(esp32Url).hostname : null;
        const eventHost = new URL(event.origin).hostname;
        if (
          event.origin !== window.origin &&
          eventHost !== flaskHost &&
          eventHost !== esp32Host
        ) {
          return;
        }
      } catch (e) {
        console.warn("Could not validate message origin:", event.origin);
        return;
      }

      if (event.data && event.data.type === 'MEMORIA_ANALYSIS_RESULT') {
        const result = event.data.payload as AnalysisResponse;

        if (result && result.behaviorType && result.description) {
          // Log only if it's not a normal, generic "no activity" message.
          if (result.behaviorType !== BehaviorType.NORMAL || !result.description.includes("특정 활동/상황 감지 안됨")) {
            addLog({
              type: result.behaviorType,
              description: result.description,
              location: result.locationGuess || DEFAULT_ANALYSIS_LOCATION,
              warningMessage: result.warningMessage, // 경고 메시지 추가
            });
            // 경고 메시지가 있으면 네이티브 TTS로 즉시 재생
            if (result.warningMessage && result.warningMessage.trim() !== '') {
              playNativeTTS(result.warningMessage);
            }
          }
        }
      }
    };

    window.addEventListener('message', handleIframeMessage);

    // Cleanup function
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [addLog, flaskUrl, esp32Url, isDefaultEsp32Url, isDefaultFlaskUrl]);

  // 알림에서 '주소 설정' 버튼 클릭 시 이동 처리
  useEffect(() => {
    const handler = (event: any) => {
      try {
        const detail = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail;
        if (detail && detail.openEsp32Settings) {
          navigate(ROUTES.ESP32_URL_SETTINGS);
        }
      } catch (e) {}
    };
    window.addEventListener('openEsp32Settings', handler);
    return () => window.removeEventListener('openEsp32Settings', handler);
  }, [navigate]);

  // Memoria 내부 경로 매핑 (ROUTES는 절대 경로이므로 상대 경로로 변환)
  const getRelativePath = (absolutePath: string) => {
    // ROUTES.HOME은 index로 처리
    if (absolutePath === ROUTES.HOME) return '';
    return absolutePath.replace(/^\//, '');
  };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
       <div className={`flex-grow ${lastLog ? 'pb-32' : 'pb-16'}`} style={{ position: 'relative' }}>
        <Routes>
          <Route index element={<MainPage />} />
          <Route path="abnormal-log" element={<AbnormalLogPage />} />
          <Route path="dangerous-log" element={<DangerousLogPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="report" element={<ReportEmergencyPage />} />
          <Route path="report-error" element={<ReportErrorPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/profile" element={<ProfileSettingsPage />} />
          <Route path="settings/bluetooth" element={<BluetoothSettingsPage />} />
          <Route path="settings/esp32-url-config" element={<Esp32UrlSettingsPage />} />
        </Routes>
      </div>
      {lastLog && <BackgroundStatus lastLog={lastLog} />}
      <BottomNav />
    </div>
  );
}

const MemoriaPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <UserProfileProvider>
      <BehaviorLogProvider>
        <CameraSettingsProvider> 
          <Esp32ConfigProvider>
            <ChatHistoryProvider>
              <MemoriaContent />
            </ChatHistoryProvider>
          </Esp32ConfigProvider>
        </CameraSettingsProvider>
      </BehaviorLogProvider>
    </UserProfileProvider>
  );
};

export default MemoriaPage;

