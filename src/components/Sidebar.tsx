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
        <p className="text-xs text-slate-500 font-medium">Digital Curator</p>
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
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{item.label}</span>
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
