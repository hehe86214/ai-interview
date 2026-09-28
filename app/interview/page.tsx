"use client";

import { useEffect, useRef, useState } from "react";
import { getApiKey, openSettings, useApiKey } from "@/lib/api-key";
import {
  API_KEY_HEADER,
  DEFAULT_QUESTIONS,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  type ChatMessage,
  type Evaluation,
} from "@/lib/interview";

type InterviewResponse =
  | { type: "question"; questionNumber: number; totalQuestions: number; content: string }
  | { type: "evaluation"; evaluation: Evaluation }
  | { error: string; code?: string };

export default function InterviewPage() {
  const apiKey = useApiKey();
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(DEFAULT_QUESTIONS);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [started, messages, loading, evaluation]);

  async function callInterview(history: ChatMessage[]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json", [API_KEY_HEADER]: getApiKey() ?? "" },
        body: JSON.stringify({ jobDescription, totalQuestions, messages: history }),
      });
      const data: InterviewResponse = await res.json();

      if ("error" in data) {
        setError(data.error);
        if (data.code === "missing_api_key" || data.code === "invalid_api_key") openSettings();
      } else if (data.type === "question") {
        setMessages([...history, { role: "interviewer", content: data.content }]);
        setCurrentQuestion(data.questionNumber);
      } else {
        setMessages(history);
        setEvaluation(data.evaluation);
      }
    } catch {
      setError("無法連線到伺服器");
    } finally {
      setLoading(false);
    }
  }

  function start() {
    if (!jobDescription.trim()) return;
    if (!getApiKey()) {
      openSettings();
      return;
    }
    setStarted(true);
    callInterview([]);
  }

  function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    const text = answer.trim();
    if (!text || loading) return;
    setAnswer("");
    const history = [...messages, { role: "candidate" as const, content: text }];
    setMessages(history);
    callInterview(history);
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setAnswer("");
    setEvaluation(null);
    setError("");
    setCurrentQuestion(0);
  }

  const answeredCount = messages.filter((m) => m.role === "candidate").length;
  const awaitingAnswer = started && !evaluation && messages.at(-1)?.role === "interviewer";

  if (!started) {
    return (
      <main className="relative flex flex-1 items-start justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="animate-rise relative w-full max-w-2xl">
          <div className="mb-8 flex flex-col gap-2">
            <span className="font-display text-lg italic text-accent">New session</span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">設定你的模擬面試</h1>
            <p className="text-ink-2">貼上職缺描述並選擇題數，面試官會根據內容為你出題。</p>
          </div>

          {apiKey === null && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm leading-6">
                <b>先設定你的 OpenAI API key</b>
                <div className="text-ink-2">本服務採 BYOK 模式，key 只存在你的瀏覽器。</div>
              </div>
              <button
                type="button"
                onClick={openSettings}
                className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-accent hover:text-accent-ink"
              >
                設定 API key
              </button>
            </div>
          )}

          <div className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 shadow-xl shadow-ink/5 sm:p-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="jd" className="text-sm font-bold">
                職缺描述 <span className="text-accent">*</span>
              </label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={9}
                placeholder={"例如：\n前端工程師\n・熟悉 React、Next.js、TypeScript\n・2 年以上開發經驗\n・有效能優化經驗者佳"}
                className="resize-y rounded-xl border border-line bg-paper p-4 text-sm leading-6 outline-none transition placeholder:text-muted focus:border-ink focus:ring-4 focus:ring-accent-soft"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">題數</span>
                <span className="text-xs text-muted">
                  {MIN_QUESTIONS}–{MAX_QUESTIONS} 題
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-xl border border-line bg-paper">
                  <StepButton
                    label="減少題數"
                    onClick={() => setTotalQuestions((n) => Math.max(MIN_QUESTIONS, n - 1))}
                    disabled={totalQuestions <= MIN_QUESTIONS}
                  >
                    −
                  </StepButton>
                  <span className="w-12 text-center font-display text-3xl tabular-nums">{totalQuestions}</span>
                  <StepButton
                    label="增加題數"
                    onClick={() => setTotalQuestions((n) => Math.min(MAX_QUESTIONS, n + 1))}
                    disabled={totalQuestions >= MAX_QUESTIONS}
                  >
                    +
                  </StepButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[3, 5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTotalQuestions(n)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        totalQuestions === n
                          ? "border-ink bg-ink text-paper"
                          : "border-line text-ink-2 hover:border-ink"
                      }`}
                    >
                      {n === 3 ? "快速 3 題" : n === 5 ? "標準 5 題" : "完整 10 題"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={start}
              disabled={!jobDescription.trim()}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              開始面試
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        {/* 進度列 */}
        <div className="sticky top-16 z-20 -mx-4 flex flex-col gap-3 border-b border-line bg-paper/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-muted">模擬面試</div>
              <div className="truncate font-bold">
                {evaluation ? "面試完成 · 評分報告" : `第 ${currentQuestion || 1} / ${totalQuestions} 題`}
              </div>
            </div>
            <button
              onClick={reset}
              className="shrink-0 rounded-full border border-line px-4 py-1.5 text-sm text-ink-2 transition hover:border-ink hover:text-ink"
            >
              重新開始
            </button>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < answeredCount ? "bg-accent" : i === answeredCount && !evaluation ? "bg-ink/30" : "bg-line"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {messages.map((m, i) =>
            m.role === "interviewer" ? (
              <div key={i} className="animate-rise flex max-w-[88%] gap-3 self-start">
                <Avatar />
                <p className="whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-line bg-card px-4 py-3 text-sm leading-7">
                  {m.content}
                </p>
              </div>
            ) : (
              <p
                key={i}
                className="animate-rise max-w-[80%] self-end whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-sm leading-7 text-paper"
              >
                {m.content}
              </p>
            ),
          )}

          {loading && (
            <div className="flex items-center gap-3 self-start">
              <Avatar />
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-line bg-card px-4 py-3 text-sm text-muted">
                <span className="flex gap-1">
                  <span className="typing-dot size-1.5 rounded-full bg-ink-2" />
                  <span className="typing-dot size-1.5 rounded-full bg-ink-2 [animation-delay:0.2s]" />
                  <span className="typing-dot size-1.5 rounded-full bg-ink-2 [animation-delay:0.4s]" />
                </span>
                {answeredCount >= totalQuestions ? "面試官正在撰寫評分報告…" : "面試官思考中…"}
              </div>
            </div>
          )}
        </div>

        {evaluation && <EvaluationReport evaluation={evaluation} onRestart={reset} />}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-ink">
            <span>{error}</span>
            <div className="flex shrink-0 gap-3">
              <button onClick={openSettings} className="font-bold text-ink-2 underline">
                設定 API key
              </button>
              <button onClick={() => callInterview(messages)} className="font-bold text-accent underline">
                重試
              </button>
            </div>
          </div>
        )}

        {awaitingAnswer && (
          <form
            onSubmit={submitAnswer}
            className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-line bg-card p-3 shadow-xl shadow-ink/10"
          >
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitAnswer(e);
              }}
              rows={3}
              autoFocus
              placeholder="輸入你的回答…"
              disabled={loading}
              className="resize-none bg-transparent px-2 pt-1 text-sm leading-6 outline-none placeholder:text-muted"
            />
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-muted">⌘ / Ctrl + Enter 送出</span>
              <button
                type="submit"
                disabled={!answer.trim() || loading}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                送出回答
              </button>
            </div>
          </form>
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  );
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 place-items-center text-xl text-ink-2 transition hover:text-accent disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Avatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-display text-sm italic text-paper">
      AI
    </span>
  );
}

function scoreLabel(score: number) {
  if (score >= 85) return "表現優秀";
  if (score >= 70) return "表現良好";
  if (score >= 50) return "尚有進步空間";
  return "需要加強";
}

function EvaluationReport({ evaluation, onRestart }: { evaluation: Evaluation; onRestart: () => void }) {
  const score = Math.max(0, Math.min(100, Math.round(evaluation.score ?? 0)));
  const circumference = 2 * Math.PI * 52;

  return (
    <section className="animate-rise flex flex-col gap-5">
      <div className="grid gap-6 rounded-3xl bg-ink p-6 text-paper sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
        <div className="relative mx-auto size-36">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score / 100)}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display text-5xl leading-none">{score}</div>
              <div className="text-xs opacity-60">/ 100</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
            {scoreLabel(score)}
          </span>
          <p className="leading-7 opacity-85">{evaluation.summary}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ListCard title="優點" tone="good" items={evaluation.strengths} />
        <ListCard title="改進建議" tone="warn" items={evaluation.improvements} />
      </div>

      {evaluation.questionReviews?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="mt-2 flex items-baseline gap-3 text-xl font-black">
            逐題檢討
            <span className="font-display text-base font-normal italic text-accent">& better answers</span>
          </h2>
          {evaluation.questionReviews.map((r, i) => (
            <details
              key={i}
              open={i === 0}
              className="group overflow-hidden rounded-2xl border border-line bg-card"
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 p-5">
                <span className="shrink-0 rounded-md bg-ink px-2 py-0.5 text-xs font-bold text-paper">Q{i + 1}</span>
                <span className="flex-1 font-bold leading-6">{r.question}</span>
                <span className="text-xl leading-6 text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="flex flex-col gap-4 border-t border-line px-5 pb-5 pt-4">
                <div>
                  <div className="mb-1 text-xs font-bold text-muted">點評</div>
                  <p className="text-sm leading-7 text-ink-2">{r.feedback}</p>
                </div>
                <div className="rounded-xl border-l-4 border-accent bg-accent-soft/60 p-4">
                  <div className="mb-1 text-xs font-bold text-accent">✦ 示範回答</div>
                  <p className="whitespace-pre-wrap text-sm leading-7">{r.betterAnswer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      <button
        onClick={onRestart}
        className="mx-auto mt-2 rounded-full bg-accent px-7 py-3.5 font-medium text-accent-ink transition hover:-translate-y-0.5"
      >
        再練一場 →
      </button>
    </section>
  );
}

function ListCard({ title, tone, items }: { title: string; tone: "good" | "warn"; items?: string[] }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className={`mb-3 text-sm font-bold ${tone === "good" ? "text-good" : "text-warn"}`}>{title}</h3>
      <ul className="flex flex-col gap-2 text-sm leading-6 text-ink-2">
        {items?.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className={tone === "good" ? "text-good" : "text-warn"}>{tone === "good" ? "✓" : "→"}</span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
