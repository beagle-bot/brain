"use client";

import { RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { useBrain } from "@/components/BrainProvider";

const pageTitles: Record<string, string> = {
  "/": "推荐流",
  "/profile": "Me",
  "/saved": "已记住",
  "/output": "输出"
};

function titleFor(pathname: string) {
  return pageTitles[pathname] ?? "brain";
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetDemo, state, feedItems } = useBrain();

  function confirmReset() {
    if (window.confirm("重置 Demo 会清空本机浏览器里的 brain v0.1 数据，确定继续吗？")) {
      resetDemo();
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/92 backdrop-blur">
        <div className="mx-auto flex max-w-screen-sm items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/icons/brain-mark.svg" alt="" className="h-9 w-9 shrink-0 rounded-md" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-normal text-mint">brain v0.1</div>
              <h1 className="truncate text-lg font-semibold text-ink">{titleFor(pathname)}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={confirmReset}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-zinc-600 shadow-sm"
            title="重置 Demo"
            aria-label="重置 Demo"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto flex max-w-screen-sm items-center gap-2 px-4 pb-3 text-xs text-zinc-500">
          <span>{feedItems.length} 条 AIHOT</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          <span>{state.memories.length} 条已记住</span>
        </div>
      </header>
      <main className="mx-auto max-w-screen-sm px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
