
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
        
        // Ensure tags are an array of strings, even if Gemini returns a single string.
        if (typeof parsedData.tags === 'string') {
            parsedData.tags = parsedData.tags.split(',').map((tag: string) => tag.trim());
        }

        return parsedData as WebsiteInfo;

    } catch (error) {
        console.error("Gemini API 호출 중 오류 발생:", error);
        throw new Error("웹사이트 정보 생성에 실패했습니다. URL을 확인하거나 다시 시도해주세요.");
    }
};
