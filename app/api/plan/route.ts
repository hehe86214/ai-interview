import OpenAI from "openai";
import {
  API_KEY_HEADER,
  DEFAULT_QUESTIONS,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  type ChatMessage,
  type TripReport,
} from "@/lib/plan";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function systemPrompt(tripDescription: string, totalQuestions: number) {
  return `你是一位經驗豐富、親切又細心的旅遊規劃師，正在協助旅客規劃以下這趟旅行：

---
${tripDescription}
---

規則：
- 全程使用繁體中文。
- 你要透過 ${totalQuestions} 個問題了解旅客的需求，每次只問一題。
- 問題要貼近這趟旅行，涵蓋預算、旅行節奏、興趣偏好、住宿、交通、飲食、同行者等面向。
- 旅客回答後，先用一兩句話簡短回應，再視情況針對回答追問細節，或換到下一個面向提問。
- 在提問過程中不要直接給出完整行程，也不要一次列出多個問題。`;
}

function toOpenAIMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "planner" ? ("assistant" as const) : ("user" as const),
    content: m.content,
  }));
}

export async function POST(request: Request) {
  // BYOK：使用使用者自己的 key，伺服器不儲存也不使用環境變數
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "請先在設定中輸入你的 OpenAI API key", code: "missing_api_key" },
      { status: 401 },
    );
  }

  let body: { tripDescription?: string; totalQuestions?: number; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const tripDescription = body.tripDescription?.trim();
  const messages = body.messages ?? [];
  if (!tripDescription) {
    return Response.json({ error: "請描述你想規劃的旅行" }, { status: 400 });
  }

  const totalQuestions = Number(body.totalQuestions ?? DEFAULT_QUESTIONS);
  if (!Number.isInteger(totalQuestions) || totalQuestions < MIN_QUESTIONS || totalQuestions > MAX_QUESTIONS) {
    return Response.json(
      { error: `問題數需為 ${MIN_QUESTIONS} 到 ${MAX_QUESTIONS} 的整數` },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey });
  const answered = messages.filter((m) => m.role === "traveler").length;
  const history = toOpenAIMessages(messages);

  try {
    if (answered < totalQuestions) {
      const instruction =
        answered === 0
          ? "請簡短自我介紹並開場，然後提出第 1 個問題。"
          : `旅客已回答第 ${answered} 題，請簡短回應後提出第 ${answered + 1} 個問題（可以是追問或新面向）。`;

      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt(tripDescription, totalQuestions) },
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
        { role: "system", content: systemPrompt(tripDescription, totalQuestions) },
        ...history,
        {
          role: "system",
          content: `提問已結束。請根據旅客在 ${totalQuestions} 題中的回答，整理出這趟旅行的規劃報告：
- score：旅行準備度，0 到 100 的整數（需求越明確、規劃越完整分數越高）
- summary：整體規劃建議，包含推薦的行程方向與節奏
- highlights：這趟旅行已經規劃得不錯、值得保留的部分
- reminders：行前需要注意或補強的具體建議（例如訂票時機、預算、天氣、證件）
questionReviews 必須依序對應每一題，共 ${totalQuestions} 筆：
- question：該題問題（只保留問題本身，去掉開場或回應的話）
- insight：規劃師對旅客這題回答的解讀
- recommendation：根據這題回答給出的具體建議安排（例如景點、住宿區域、交通方式、餐廳類型，結構清楚、可直接照著安排）

只輸出以下 JSON：
{"score": 0 到 100 的整數, "summary": "...", "highlights": ["...", ...], "reminders": ["...", ...], "questionReviews": [{"question": "...", "insight": "...", "recommendation": "..."}, ...]}`,
        },
      ],
    });

    const report = JSON.parse(completion.choices[0]?.message.content ?? "{}") as TripReport;
    return Response.json({ type: "report", report });
  } catch (error) {
    if (error instanceof OpenAI.AuthenticationError) {
      return Response.json(
        { error: "你的 OpenAI API key 無效或已過期，請到設定更新", code: "invalid_api_key" },
        { status: 401 },
      );
    }
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return Response.json({ error: "你的 OpenAI 額度不足或請求過於頻繁，請稍後再試" }, { status: 429 });
    }
    // 只記錄錯誤訊息，並遮蔽任何 sk- 開頭的字串，避免使用者的 key 出現在 log
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/plan]", message.replace(/sk-[\w-]+/g, "sk-***"));
    return Response.json({ error: "AI 服務暫時無法回應，請稍後再試" }, { status: 502 });
  }
}
