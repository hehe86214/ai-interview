import Link from "next/link";
import ApiKeySettings from "./api-key-settings";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-ink text-paper transition-transform group-hover:-rotate-6">
        <span className="font-display text-xl italic leading-none">M</span>
      </span>
      <span className="text-lg font-bold tracking-tight">
        Mock<span className="text-accent">.ai</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-ink-2 md:flex">
          <Link href="/#how" className="hover:text-ink">運作方式</Link>
          <Link href="/#features" className="hover:text-ink">功能</Link>
          <Link href="/#report" className="hover:text-ink">評分報告</Link>
          <Link href="/#faq" className="hover:text-ink">常見問題</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ApiKeySettings />
          <Link
            href="/interview"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-accent hover:text-accent-ink"
          >
            <span className="hidden sm:inline">開始模擬面試</span>
            <span className="sm:hidden">開始面試</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
