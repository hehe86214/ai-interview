import Link from "next/link";
import { Logo } from "./site-header";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-ink-2">
            讓 AI 旅遊規劃師了解你的喜好，把煩惱留在出發前，把期待帶上旅途。
          </p>
        </div>
        <FooterColumn
          title="產品"
          links={[
            { href: "/plan", label: "開始規劃" },
            { href: "/#features", label: "功能" },
            { href: "/#report", label: "旅行報告" },
          ]}
        />
        <FooterColumn
          title="資源"
          links={[
            { href: "/#how", label: "運作方式" },
            { href: "/#faq", label: "常見問題" },
          ]}
        />
        <FooterColumn
          title="關於"
          links={[
            { href: "/#faq", label: "隱私說明" },
            { href: "/#faq", label: "使用條款" },
          ]}
        />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Tripmate.ai. All rights reserved.</span>
          <span className="font-display text-sm italic">Plan less, wander more.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <h4 className="font-bold">{title}</h4>
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="text-ink-2 hover:text-accent">
          {l.label}
        </Link>
      ))}
    </div>
  );
}
