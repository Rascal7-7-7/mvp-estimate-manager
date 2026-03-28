"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/estimates", icon: "description", label: "見積一覧" },
  { href: "/estimates/new", icon: "add_circle", label: "新規見積作成" },
  { href: "/projects/new", icon: "groups", label: "顧客・案件登録" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/estimates") return pathname === "/estimates";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-slate-50 py-6 px-4 shrink-0">
      {/* ロゴ */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight font-headline">
          見積管理
        </h1>
        <p className="text-xs text-slate-500 font-medium">営業自動化ツール</p>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150",
              isActive(item.href)
                ? "text-slate-900 font-bold border-r-4 border-slate-900 bg-slate-200/50"
                : "text-slate-500 font-medium hover:bg-slate-200/50"
            )}
          >
            <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* フッター */}
      <div className="mt-auto pt-6 border-t border-slate-200 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-on-primary-container">
              person
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">管理者</p>
            <p className="text-[10px] text-slate-500 truncate">admin@curator.jp</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/estimates") return pathname === "/estimates";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center gap-0.5 py-2 px-4 min-w-0 flex-1 transition-colors duration-150",
            isActive(item.href)
              ? "text-slate-900"
              : "text-slate-400"
          )}
        >
          <span className={cn(
            "material-symbols-outlined text-2xl",
            isActive(item.href) && "text-primary"
          )}>
            {item.icon}
          </span>
          <span className={cn(
            "text-[10px] font-bold truncate w-full text-center",
            isActive(item.href) ? "text-primary" : "text-slate-400"
          )}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
