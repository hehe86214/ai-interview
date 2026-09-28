import Link from "next/link";

const steps = [
  {
    no: "01",
    title: "貼上職缺描述",
    body: "把 JD 直接貼進來，再選擇想練習幾題。AI 會從職責與技能需求中抓出重點。",
  },
  {
    no: "02",
    title: "一問一答，真實對話",
    body: "面試官一次只問一題，會根據你的回答追問細節，就像坐在真正的面試桌前。",
  },
  {
    no: "03",
    title: "拿到評分與示範回答",
    body: "結束後取得總分、優缺點分析，以及每一題「更好的回答方式」。",
  },
];

const features = [
  {
    icon: "◎",
    title: "為職缺量身出題",
    body: "不是題庫抽籤。每一題都根據你貼上的 JD 生成，技術題、經驗題、情境題都有。",
  },
  {
    icon: "↻",
    title: "會追問的面試官",
    body: "回答太籠統？面試官會像真人一樣往下挖，逼你把經驗講清楚。",
  },
  {
    icon: "✦",
    title: "逐題示範回答",
    body: "每題附上具體點評與示範答案，用 STAR 結構改寫你的經驗，照著練就會進步。",
  },
  {
    icon: "⌗",
    title: "自訂練習題數",
    body: "通勤時快速練 1–3 題，週末完整模擬 10 題，節奏由你決定。",
  },
];

const faqs = [
  {
    q: "需要註冊帳號嗎？",
    a: "不需要。打開就能直接開始模擬面試。",
  },
  {
    q: "為什麼需要自己的 OpenAI API key？",
    a: "Mock.ai 採用 BYOK（Bring Your Own Key）模式，使用你自己的 OpenAI 帳號額度。點右上角「設定 API key」貼上即可，費用由 OpenAI 依用量向你收取。",
  },
  {
    q: "我的 API key 和回答會被保存嗎？",
    a: "API key 只存在你瀏覽器的 localStorage，每次面試時隨請求送出、伺服器不會保存，也可以隨時在設定中移除。面試內容只存在目前的分頁，重新整理就會清除。",
  },
  {
    q: "支援哪些職缺？",
    a: "任何職缺都可以——工程、設計、行銷、PM、業務皆可，只要貼上職缺描述即可。",
  },
  {
    q: "評分的標準是什麼？",
    a: "AI 會依照職缺要求，綜合回答的完整度、具體程度、邏輯結構與相關經驗給出 0–100 分。",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-rise flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs text-ink-2">
              <span className="size-1.5 rounded-full bg-accent" />
              AI 模擬面試 · 免註冊
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight sm:text-6xl">
              下一場面試，
              <br />
              先在這裡
              <span className="relative mx-1 inline-block">
                <span className="relative z-10 font-display text-[1.15em] font-normal italic text-accent">
                  練習
                </span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-accent-soft" aria-hidden />
              </span>
              過。
            </h1>
            <p className="max-w-lg text-lg leading-8 text-ink-2">
              貼上職缺描述，AI 面試官會為你量身出題、即時追問，結束後給你評分，還有每一題的示範回答。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/interview"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink shadow-[0_8px_24px_-8px_var(--accent)] transition hover:-translate-y-0.5"
              >
                立即開始模擬面試
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="#how"
                className="rounded-full border border-line px-6 py-3.5 font-medium text-ink-2 transition hover:border-ink hover:text-ink"
              >
                看看怎麼運作
              </a>
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-8 border-t border-line pt-6">
              <Stat value="1–10" label="自訂題數" />
              <Stat value="~5 分" label="完成一場" />
              <Stat value="BYOK" label="自備 OpenAI key" />
            </dl>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="How it works" title="三個步驟，完成一場模擬面試" />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.no} className="flex flex-col gap-4 bg-card p-8">
                <span className="font-display text-5xl italic text-accent">{s.no}</span>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="leading-7 text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="Features" title="不只是出題，是陪你練到會" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group flex gap-5 rounded-2xl border border-line bg-card p-7 transition hover:-translate-y-1 hover:border-ink"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper-2 text-2xl text-accent transition group-hover:bg-accent group-hover:text-accent-ink">
                  {f.icon}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="leading-7 text-ink-2">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report preview */}
      <section id="report" className="scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <span className="font-display text-lg italic text-accent">The report</span>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              每一題都告訴你：
              <br />
              哪裡可以講得更好。
            </h2>
            <p className="leading-8 text-paper/70">
              面試結束後，你會拿到一份完整報告：總分、整體評語、優點與待改進之處，
              以及逐題的點評和示範回答，讓下一次練習有明確方向。
            </p>
            <Link
              href="/interview"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink transition hover:-translate-y-0.5"
            >
              立即取得我的報告 →
            </Link>
          </div>
          <ReportPreview />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="FAQ" title="常見問題" />
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <span className="text-xl text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-7 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-accent px-6 py-16 text-center text-accent-ink sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-3xl font-black sm:text-5xl">
              準備好了嗎？<span className="font-display font-normal italic">Let&apos;s practice.</span>
            </h2>
            <p className="max-w-md opacity-85">不用註冊、不用下載，設定好 API key、貼上職缺，就能開始第一場模擬面試。</p>
            <Link
              href="/interview"
              className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition hover:-translate-y-0.5"
            >
              開始模擬面試 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-3xl">{value}</dt>
      <dd className="text-xs text-muted">{label}</dd>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-display text-lg italic text-accent">{eyebrow}</span>
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="animate-rise relative [animation-delay:150ms]">
      <div className="absolute -right-4 -top-4 size-full rounded-3xl border border-line bg-paper-2" aria-hidden />
      <div className="relative flex flex-col gap-4 rounded-3xl border border-line bg-card p-6 shadow-xl shadow-ink/5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-ink font-display text-lg italic text-paper">
              AI
            </span>
            <div>
              <div className="text-sm font-bold">面試官</div>
              <div className="text-xs text-muted">前端工程師 · 第 2 / 5 題</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-good">
            <span className="size-1.5 rounded-full bg-good" /> 進行中
          </span>
        </div>
        <Bubble who="ai">
          你提到重構過結帳流程，能具體說說你怎麼衡量這次重構的成效嗎？
        </Bubble>
        <Bubble who="me">
          我們在重構前後追蹤了轉換率和 LCP，LCP 從 3.8 秒降到 1.9 秒，結帳轉換率提升了 12%…
        </Bubble>
        <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-paper-2 px-4 py-3">
          <span className="typing-dot size-1.5 rounded-full bg-ink-2" />
          <span className="typing-dot size-1.5 rounded-full bg-ink-2 [animation-delay:0.2s]" />
          <span className="typing-dot size-1.5 rounded-full bg-ink-2 [animation-delay:0.4s]" />
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 rotate-[-4deg] rounded-2xl border border-line bg-card px-4 py-3 shadow-lg sm:-left-8">
        <div className="text-xs text-muted">總分</div>
        <div className="font-display text-4xl leading-none text-accent">
          86<span className="text-base text-muted">/100</span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ who, children }: { who: "ai" | "me"; children: React.ReactNode }) {
  return (
    <p
      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
        who === "ai"
          ? "self-start rounded-tl-sm bg-paper-2 text-ink"
          : "self-end rounded-tr-sm bg-ink text-paper"
      }`}
    >
      {children}
    </p>
  );
}

function ReportPreview() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-paper p-6 text-ink shadow-2xl">
      <div className="flex items-end justify-between border-b border-line pb-4">
        <div>
          <div className="text-xs text-muted">整體評分</div>
          <div className="font-display text-6xl leading-none">
            86<span className="text-xl text-muted">/100</span>
          </div>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">表現優秀</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-card p-4">
          <div className="mb-1 text-xs font-bold text-good">優點</div>
          <p className="text-sm text-ink-2">能用具體數據佐證成果</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="mb-1 text-xs font-bold text-warn">待改進</div>
          <p className="text-sm text-ink-2">團隊協作的角色可以說得更清楚</p>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span className="rounded bg-ink px-1.5 py-0.5 font-bold text-paper">Q2</span>
          如何衡量重構的成效？
        </div>
        <div className="text-xs font-bold text-accent">✦ 示範回答</div>
        <p className="mt-1 text-sm leading-6 text-ink-2">
          「重構前我先和 PM 對齊了兩個指標：LCP 與結帳轉換率。上線後兩週，LCP 從 3.8 秒降到 1.9 秒，轉換率提升 12%……」
        </p>
      </div>
    </div>
  );
}
