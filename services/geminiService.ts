import { GoogleGenAI, Type } from "@google/genai";

export interface WebsiteInfo {
    title: string;
    description: string;
    tags: string[];
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateWebsiteInfo = async (url: string): Promise<WebsiteInfo> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `웹사이트 URL(${url})을 분석해주세요. 웹사이트에 적합한 제목, 150자 이내의 간결하고 매력적인 설명, 그리고 관련 태그 3~5개를 JSON 형식으로 제공해주세요.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "웹사이트의 제목입니다."
                        },
                        description: {
                            type: Type.STRING,
                            description: "웹사이트에 대한 간결한 설명입니다."
                        },
                        tags: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description: "웹사이트와 관련된 태그 배열입니다."
                        }
                    },
                    required: ["title", "description", "tags"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        if (typeof parsedData.tags === 'string') {
            parsedData.tags = parsedData.tags.split(',').map((tag: string) => tag.trim());
        }

        return parsedData as WebsiteInfo;

    } catch (error) {
        console.error("Gemini API 호출 중 오류 발생:", error);
        throw new Error("웹사이트 정보 생성에 실패했습니다. URL을 확인하거나 다시 시도해주세요.");
    }
};

// FIX: Added `generateWebsiteIdea` function to resolve the import error in `pages/IdeaGeneratorPage.tsx`.
export const generateWebsiteIdea = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "중학생(10대)들이 흥미를 느낄 만한 독창적이고 재미있는 웹사이트 아이디어를 한 문장으로 간결하게 제안해주세요. 예를 들어, '나만의 웹툰 캐릭터를 만들고 스토리를 공유하는 플랫폼'처럼요.",
        });

        if (response.text) {
             return response.text.trim();
        } else {
             throw new Error("API로부터 유효한 응답을 받지 못했습니다.");
        }
    } catch (error) {
        console.error("Gemini API (아이디어 생성) 호출 중 오류 발생:", error);
        throw new Error("웹사이트 아이디어 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
};
