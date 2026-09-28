import OpenAI from "openai";
import {
  DEFAULT_QUESTIONS,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  type ChatMessage,
  type Evaluation,
} from "@/lib/interview";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function systemPrompt(jobDescription: string, totalQuestions: number) {
  return `你是一位專業、友善但嚴謹的面試官，正在針對以下職缺進行面試：

---
${jobDescription}
---

規則：
- 全程使用繁體中文。
- 本場面試共 ${totalQuestions} 題，每次只問一題。
- 題目要貼近職缺需求，涵蓋技術能力、實務經驗與情境題。
- 候選人回答後，先用一兩句話簡短回應其回答，再視情況針對回答追問，或換到下一個主題出題。
- 不要在面試過程中打分數，也不要一次列出多個問題。`;
}

function toOpenAIMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "interviewer" ? ("assistant" as const) : ("user" as const),
    content: m.content,
  }));
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "伺服器未設定 OPENAI_API_KEY" }, { status: 500 });
  }

  let body: { jobDescription?: string; totalQuestions?: number; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const jobDescription = body.jobDescription?.trim();
  const messages = body.messages ?? [];
  if (!jobDescription) {
    return Response.json({ error: "請提供職缺描述" }, { status: 400 });
  }

  const totalQuestions = Number(body.totalQuestions ?? DEFAULT_QUESTIONS);
  if (!Number.isInteger(totalQuestions) || totalQuestions < MIN_QUESTIONS || totalQuestions > MAX_QUESTIONS) {
    return Response.json(
      { error: `題數需為 ${MIN_QUESTIONS} 到 ${MAX_QUESTIONS} 的整數` },
      { status: 400 },
    );
  }

  // 每次請求才建立 client，修改 .env.local 後不必重啟就會用到新的 key
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const answered = messages.filter((m) => m.role === "candidate").length;
  const history = toOpenAIMessages(messages);

  try {
    if (answered < totalQuestions) {
      const instruction =
        answered === 0
          ? "請簡短自我介紹並開場，然後提出第 1 題。"
          : `候選人已回答第 ${answered} 題，請簡短回應後提出第 ${answered + 1} 題（可以是追問或新題目）。`;

      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt(jobDescription, totalQuestions) },
          ...history,
          { role: "system", content: instruction },
        ],
      });

      return Response.json({
        type: "question",
        questionNumber: answered + 1,
        totalQuestions,
        content: completion.choices[0]?.message.content ?? "",
      });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt(jobDescription, totalQuestions) },
        ...history,
        {
          role: "system",
          content: `面試已結束。請根據候選人在 ${totalQuestions} 題中的表現給出評分與建議。
questionReviews 必須依序對應每一題，共 ${totalQuestions} 筆：
- question：該題題目（只保留問題本身，去掉開場或回應的話）
- feedback：針對候選人這題回答的具體點評
- betterAnswer：示範一個更好的回答（以第一人稱撰寫，結構清楚，可參考 STAR 法則，盡量沿用候選人提到的經驗）

只輸出以下 JSON：
{"score": 0 到 100 的整數, "summary": "整體評語", "strengths": ["優點", ...], "improvements": ["具體改進建議", ...], "questionReviews": [{"question": "...", "feedback": "...", "betterAnswer": "..."}, ...]}`,
        },
      ],
    });

    const evaluation = JSON.parse(completion.choices[0]?.message.content ?? "{}") as Evaluation;
    return Response.json({ type: "evaluation", evaluation });
  } catch (error) {
    console.error("[/api/interview]", error);
    if (error instanceof OpenAI.AuthenticationError) {
      return Response.json({ error: "OpenAI API key 無效或已過期，請更新 .env.local" }, { status: 502 });
    }
    return Response.json({ error: "AI 服務暫時無法回應，請稍後再試" }, { status: 502 });
  }
}
