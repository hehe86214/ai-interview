// 前後端共用的旅遊規劃設定與型別（不可 import 伺服器端套件，會被打包進瀏覽器）
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
export const DEFAULT_QUESTIONS = 3;

// BYOK：使用者的 OpenAI API key 由前端以這個 header 帶到後端
export const API_KEY_HEADER = "x-openai-api-key";

export type ChatMessage = { role: "planner" | "traveler"; content: string };

export type TripReport = {
  score: number;
  summary: string;
  highlights: string[];
  reminders: string[];
  questionReviews: {
    question: string;
    insight: string;
    recommendation: string;
  }[];
};
