"use client";

import { useEffect, useRef, useState } from "react";
import { API_KEY_HEADER } from "@/lib/interview";
import { maskApiKey, onOpenSettings, openSettings, setApiKey, useApiKey } from "@/lib/api-key";

type Status = { tone: "idle" | "ok" | "error"; text: string };

/** Header 上的設定按鈕 + API key 設定視窗 */
export default function ApiKeySettings() {
  const apiKey = useApiKey();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState("");
  const [show, setShow] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<Status>({ tone: "idle", text: "" });

  useEffect(
    () =>
      onOpenSettings(() => {
        setDraft("");
        setShow(false);
        setStatus({ tone: "idle", text: "" });
        dialogRef.current?.showModal();
      }),
    [],
  );

  function close() {
    dialogRef.current?.close();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const key = draft.trim();
    if (!key) return;
    if (!key.startsWith("sk-")) {
      setStatus({ tone: "error", text: "OpenAI API key 通常以 sk- 開頭，請確認是否貼錯" });
      return;
    }

    setVerifying(true);
    setStatus({ tone: "idle", text: "驗證中…" });
    try {
      const res = await fetch("/api/verify-key", { method: "POST", headers: { [API_KEY_HEADER]: key } });
      const data: { ok: boolean; error?: string } = await res.json();
      if (!data.ok) {
        setStatus({ tone: "error", text: data.error ?? "驗證失敗" });
        return;
      }
      setApiKey(key);
      setDraft("");
      setStatus({ tone: "ok", text: "驗證成功，已儲存在這個瀏覽器" });
    } catch {
      setStatus({ tone: "error", text: "無法連線到伺服器" });
    } finally {
      setVerifying(false);
    }
  }

  function remove() {
    setApiKey(null);
    setStatus({ tone: "idle", text: "已從這個瀏覽器移除 API key" });
  }

  return (
    <>
      <button
        type="button"
        onClick={openSettings}
        className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-ink-2 transition hover:border-ink hover:text-ink"
        aria-label="API key 設定"
      >
        <span
          className={`size-2 rounded-full ${apiKey ? "bg-good" : apiKey === null ? "bg-accent" : "bg-line"}`}
          aria-hidden
        />
        <span className="hidden sm:inline">{apiKey ? "API key 已設定" : "設定 API key"}</span>
        <span className="sm:hidden" aria-hidden>
          ⚙
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-line bg-card p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={save} className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-display text-lg italic text-accent">Settings</span>
              <h2 className="text-2xl font-black">OpenAI API key</h2>
            </div>
            <button type="button" onClick={close} className="text-2xl leading-none text-muted hover:text-ink" aria-label="關閉">
              ×
            </button>
          </div>

          <p className="text-sm leading-6 text-ink-2">
            Mock.ai 採用 <b>BYOK（自備金鑰）</b>模式：面試使用你自己的 OpenAI 帳號額度。
            key 只會存在<b>這個瀏覽器</b>的 localStorage，每次面試時隨請求送出，伺服器不會保存。
          </p>

          {apiKey && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3">
              <div className="min-w-0">
                <div className="text-xs text-muted">目前使用</div>
                <div className="truncate font-mono text-sm">{maskApiKey(apiKey)}</div>
              </div>
              <button type="button" onClick={remove} className="shrink-0 text-sm font-medium text-accent hover:underline">
                移除
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="api-key" className="text-sm font-bold">
              {apiKey ? "更換 API key" : "輸入 API key"}
            </label>
            <div className="flex items-center rounded-xl border border-line bg-paper transition focus-within:border-ink focus-within:ring-4 focus-within:ring-accent-soft">
              <input
                id="api-key"
                type={show ? "text" : "password"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="sk-proj-..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-muted"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="px-4 text-xs text-muted hover:text-ink">
                {show ? "隱藏" : "顯示"}
              </button>
            </div>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-xs text-muted underline hover:text-accent"
            >
              還沒有 key？到 OpenAI 後台建立 ↗
            </a>
          </div>

          {status.text && (
            <p
              role="status"
              className={`rounded-lg px-3 py-2 text-sm ${
                status.tone === "ok"
                  ? "bg-good/10 text-good"
                  : status.tone === "error"
                    ? "bg-accent-soft text-accent"
                    : "bg-paper-2 text-ink-2"
              }`}
            >
              {status.text}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-2 hover:border-ink hover:text-ink"
            >
              {status.tone === "ok" ? "完成" : "取消"}
            </button>
            <button
              type="submit"
              disabled={!draft.trim() || verifying}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {verifying ? "驗證中…" : "驗證並儲存"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
