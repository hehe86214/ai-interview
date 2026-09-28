"use client";

import { useSyncExternalStore } from "react";

// BYOK：使用者的 OpenAI API key 只存在瀏覽器的 localStorage，呼叫 API 時以 API_KEY_HEADER 帶上
const STORAGE_KEY = "tripmate:openai-api-key";
const LEGACY_STORAGE_KEY = "mock-ai:openai-api-key"; // 改名前（AI 面試版）使用的 key
const CHANGE_EVENT = "tripmate:api-key-change";

export function getApiKey(): string | null {
  try {
    const key = localStorage.getItem(STORAGE_KEY);
    if (key) return key;
    // 搬移舊版存的 key，避免使用者要重新輸入
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    return legacy;
  } catch {
    return null;
  }
}

export function setApiKey(key: string | null) {
  try {
    if (key) localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 無痕模式等情況可能無法寫入，忽略
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // 其他分頁修改時同步
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** 回傳目前的 key；伺服器端渲染時為 undefined（代表尚未讀取） */
export function useApiKey(): string | null | undefined {
  return useSyncExternalStore(subscribe, getApiKey, () => undefined);
}

export function maskApiKey(key: string) {
  return key.length <= 12 ? "••••" : `${key.slice(0, 7)}…${key.slice(-4)}`;
}

// 讓任何元件都能打開設定視窗
const OPEN_SETTINGS_EVENT = "tripmate:open-settings";

export function openSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenSettings(callback: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, callback);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, callback);
}
