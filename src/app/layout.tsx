import type { Metadata } from "next";
import "./globals.css";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "見積管理",
  description: "顧客・案件に紐づいた見積を一覧で管理できる業務アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* トップバー */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-4 md:px-8 h-14 md:h-16 bg-white/80 backdrop-blur-xl shadow-sm shrink-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 tracking-tight font-headline">
                見積管理システム
              </h2>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center bg-surface-container px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-slate-400 text-sm mr-2">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="見積を検索..."
                    className="bg-transparent border-none focus:ring-0 text-sm w-40 font-body"
                  />
                </div>
              </div>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
              {children}
            </main>
          </div>
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
