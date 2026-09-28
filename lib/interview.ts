// 前後端共用的面試設定與型別（不可 import 伺服器端套件，會被打包進瀏覽器）
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
export const DEFAULT_QUESTIONS = 3;

// BYOK：使用者的 OpenAI API key 由前端以這個 header 帶到後端
export const API_KEY_HEADER = "x-openai-api-key";

export type ChatMessage = { role: "interviewer" | "candidate"; content: string };

export type Evaluation = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  questionReviews: {
    question: string;
    feedback: string;
    betterAnswer: string;
  }[];
};
