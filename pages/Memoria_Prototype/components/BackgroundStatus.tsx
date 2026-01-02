import React from 'react';
import { BehaviorLogEntry, BehaviorType } from '../memoriaTypes';
import { BEHAVIOR_TYPE_KOREAN, mapDescriptionToCategory } from '../constants';
import { InformationCircleIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon } from './icons';

interface BackgroundStatusProps {
    lastLog: BehaviorLogEntry;
}

const BackgroundStatus: React.FC<BackgroundStatusProps> = ({ lastLog }) => {
    if (!lastLog) {
        return null;
    }

    const { type, description } = lastLog;

    const Icon =
        type === BehaviorType.ABNORMAL ? QuestionMarkCircleIcon :
        type === BehaviorType.DANGEROUS ? ExclamationTriangleIcon :
        InformationCircleIcon;
    
    const colorClass = 
        type === BehaviorType.DANGEROUS ? 'bg-red-500' : 
        type === BehaviorType.ABNORMAL ? 'bg-yellow-500' :
        'bg-sky-500';

    let logText: string;

    try {
        if (type === BehaviorType.ABNORMAL || type === BehaviorType.DANGEROUS) {
            const category = mapDescriptionToCategory(description, type);
            const typeKorean = BEHAVIOR_TYPE_KOREAN[type];
            logText = `${typeKorean} (${category}): ${description}`;
        } else {
            // This now safely handles NORMAL and any other unexpected types.
            const typeKorean = BEHAVIOR_TYPE_KOREAN[type as keyof typeof BEHAVIOR_TYPE_KOREAN] || '정보';
            logText = `${typeKorean}: ${description}`;
        }
    } catch (error) {
        console.error("Error creating log text in BackgroundStatus:", error, lastLog);
        logText = "로그를 표시하는 중 오류가 발생했습니다.";
    }
    
    return (
        <div 
            className={`fixed bottom-16 left-0 right-0 ${colorClass} text-white px-4 py-2 shadow-lg-top z-[60] transition-transform duration-300 ease-in-out`}
            aria-live="polite"
            role="status"
        >
            <div className="max-w-md mx-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold whitespace-nowrap flex-shrink-0">상황 감지</span>
                    <span className="truncate" title={logText}>
                        {logText}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BackgroundStatus;
