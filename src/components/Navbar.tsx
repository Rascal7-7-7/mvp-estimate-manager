import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/estimates" className="flex items-center gap-2">
          <span className="text-blue-600 font-bold text-lg">📋 見積管理</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/estimates"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            見積一覧
          </Link>
          <Link
            href="/projects/new"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + 新規登録
          </Link>
        </nav>
      </div>
    </header>
  );
}
