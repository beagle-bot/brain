"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkCheck, FilePenLine, Home, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/saved", label: "Saved", icon: BookmarkCheck },
  { href: "/output", label: "Output", icon: FilePenLine },
  { href: "/profile", label: "Me", icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-screen-sm grid-cols-4 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium ${
                active ? "bg-ink text-white" : "text-zinc-500"
              }`}
              aria-label={item.label}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
