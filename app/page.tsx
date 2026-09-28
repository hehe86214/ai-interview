import Link from "next/link";

const steps = [
  {
    no: "01",
    title: "描述你的旅行",
    body: "寫下目的地、日期、同行者和大概的想法，再選擇想回答幾個問題。",
  },
  {
    no: "02",
    title: "和規劃師聊聊",
    body: "規劃師一次只問一題，會根據你的回答追問細節，慢慢拼湊出最適合你的旅程。",
  },
  {
    no: "03",
    title: "拿到旅行報告",
    body: "取得準備度評分、整體行程建議、行前提醒，以及每個面向的具體安排。",
  },
];

const features = [
  {
    icon: "◎",
    title: "為你的旅程量身提問",
    body: "不是制式問卷。每個問題都根據你的目的地與想法生成，預算、節奏、住宿、美食都會問到。",
  },
  {
    icon: "↻",
    title: "會追問的規劃師",
    body: "回答太模糊？規劃師會像真人一樣往下問，幫你把「想放鬆一下」變成具體的安排。",
  },
  {
    icon: "✦",
    title: "逐項行程建議",
    body: "每個問題都附上規劃師的解讀與建議安排：景點、住宿區域、交通方式，照著排就好。",
  },
  {
    icon: "⌗",
    title: "自訂問題數",
    body: "週末小旅行快速問 3 題，出國長假深度聊 10 題，細節程度由你決定。",
  },
];

const faqs = [
  {
    q: "需要註冊帳號嗎？",
    a: "不需要。打開就能直接開始規劃旅行。",
  },
  {
    q: "為什麼需要自己的 OpenAI API key？",
    a: "Tripmate.ai 採用 BYOK（Bring Your Own Key）模式，使用你自己的 OpenAI 帳號額度。點右上角「設定 API key」貼上即可，費用由 OpenAI 依用量向你收取。",
  },
  {
    q: "我的 API key 和旅行資料會被保存嗎？",
    a: "API key 只存在你瀏覽器的 localStorage，每次規劃時隨請求送出、伺服器不會保存，也可以隨時在設定中移除。對話內容只存在目前的分頁，重新整理就會清除。",
  },
  {
    q: "支援哪些目的地？",
    a: "國內外都可以——城市漫遊、海島度假、登山健行、親子旅遊皆可，只要描述你的想法即可。",
  },
  {
    q: "準備度分數代表什麼？",
    a: "AI 會依照你的回答，綜合需求明確度、預算與時間安排、交通住宿等面向，評估這趟旅行目前的準備程度（0–100 分）。",
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
              AI 旅遊規劃 · 免註冊
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight sm:text-6xl">
              下一趟旅行，
              <br />
              先在這裡
              <span className="relative mx-1 inline-block">
                <span className="relative z-10 font-display text-[1.15em] font-normal italic text-accent">
                  規劃
                </span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-accent-soft" aria-hidden />
              </span>
              好。
            </h1>
            <p className="max-w-lg text-lg leading-8 text-ink-2">
              描述你的旅行想法，AI 旅遊規劃師會一步步了解你的喜好、即時追問，最後給你一份包含準備度評分與逐項建議的旅行報告。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/plan"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink shadow-[0_8px_24px_-8px_var(--accent)] transition hover:-translate-y-0.5"
              >
                立即開始規劃
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
              <Stat value="1–10" label="自訂問題數" />
              <Stat value="~5 分" label="完成規劃" />
              <Stat value="BYOK" label="自備 OpenAI key" />
            </dl>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="How it works" title="三個步驟，規劃好一趟旅行" />
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
          <SectionTitle eyebrow="Features" title="不只是給行程，是真的懂你想怎麼玩" />
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
              每個面向都幫你想好：
              <br />
              該怎麼安排最順。
            </h2>
            <p className="leading-8 text-paper/70">
              聊完之後，你會拿到一份完整的旅行報告：準備度評分、整體行程建議、已規劃好的部分與行前提醒，
              以及每個問題的解讀和具體安排，出發前心裡就有底。
            </p>
            <Link
              href="/plan"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink transition hover:-translate-y-0.5"
            >
              立即取得我的旅行報告 →
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
              準備好出發了嗎？<span className="font-display font-normal italic">Let&apos;s go.</span>
            </h2>
            <p className="max-w-md opacity-85">不用註冊、不用下載，設定好 API key、寫下你的旅行想法，就能開始規劃。</p>
            <Link
              href="/plan"
              className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition hover:-translate-y-0.5"
            >
              開始規劃旅行 →
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
              <div className="text-sm font-bold">旅遊規劃師</div>
              <div className="text-xs text-muted">京都賞楓 5 日 · 第 2 / 5 題</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-good">
            <span className="size-1.5 rounded-full bg-good" /> 規劃中
          </span>
        </div>
        <Bubble who="ai">
          你提到想避開人潮賞楓，比較能接受早起出門，還是傾向去比較冷門的景點？
        </Bubble>
        <Bubble who="me">
          早起沒問題！我們喜歡安靜的寺廟和庭園，中午想找間有特色的咖啡廳休息…
        </Bubble>
        <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-paper-2 px-4 py-3">
          <span className="typing-dot size-1.5 rounded-full bg-ink-2" />
          <span className="typing-dot size-1.5 rounded-full bg-ink-2 [animation-delay:0.2s]" />
          <span className="typing-dot size-1.5 rounded-full bg-ink-2 [animation-delay:0.4s]" />
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 rotate-[-4deg] rounded-2xl border border-line bg-card px-4 py-3 shadow-lg sm:-left-8">
        <div className="text-xs text-muted">準備度</div>
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
          <div className="text-xs text-muted">旅行準備度</div>
          <div className="font-display text-6xl leading-none">
            86<span className="text-xl text-muted">/100</span>
          </div>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">準備萬全</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-card p-4">
          <div className="mb-1 text-xs font-bold text-good">已規劃好的部分</div>
          <p className="text-sm text-ink-2">行程節奏寬鬆，每天保留休息時間</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="mb-1 text-xs font-bold text-warn">行前建議</div>
          <p className="text-sm text-ink-2">楓葉季住宿搶手，建議盡早訂房</p>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span className="rounded bg-ink px-1.5 py-0.5 font-bold text-paper">Q2</span>
          如何避開賞楓人潮？
        </div>
        <div className="text-xs font-bold text-accent">✦ 建議安排</div>
        <p className="mt-1 text-sm leading-6 text-ink-2">
          開門時間一到就先去東福寺通天橋，避開旅行團；上午再轉往人潮較少的詩仙堂與圓光寺，午餐在一乘寺一帶的咖啡廳……
        </p>
      </div>
    </div>
  );
}
