import OpenAI from "openai";
import { API_KEY_HEADER } from "@/lib/plan";

// 驗證使用者提供的 OpenAI API key 是否可用（不會儲存 key）
export async function POST(request: Request) {
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim();
  if (!apiKey) {
    return Response.json({ ok: false, error: "請提供 OpenAI API key" }, { status: 401 });
  }

  try {
    await new OpenAI({ apiKey }).models.list();
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof OpenAI.AuthenticationError) {
      return Response.json({ ok: false, error: "API key 無效或已過期" }, { status: 401 });
    }
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return Response.json({ ok: false, error: "這組 key 的額度不足或請求過於頻繁" }, { status: 429 });
    }
    return Response.json({ ok: false, error: "暫時無法驗證，請稍後再試" }, { status: 502 });
  }
}
