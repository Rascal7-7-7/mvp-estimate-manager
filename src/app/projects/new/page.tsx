import { createProjectWithCustomer } from "@/lib/actions";

export const metadata = { title: "顧客・案件登録 | 見積管理" };

export default function NewProjectPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-2xl mx-auto pb-28 md:pb-10">
      {/* ページヘッダー */}
      <div className="mb-8 text-center">
        <span className="text-primary/50 font-bold tracking-widest text-xs mb-2 block font-headline uppercase">
          Step 01 of 02
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary mb-2 tracking-tight">
          顧客・案件登録
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          基本情報を入力してください。登録後すぐに見積作成へ進めます。
        </p>
      </div>

      <form action={createProjectWithCustomer} className="space-y-5">
        {/* 顧客情報 */}
        <section className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">01</span>
            <h2 className="text-base font-bold font-headline text-slate-900">
              お客様の情報
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                お名前 <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                required
                placeholder="例：山田 太郎"
                className="w-full bg-slate-50 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                会社名{" "}
                <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <input
                type="text"
                name="company_name"
                placeholder="例：株式会社サンプル"
                className="w-full bg-slate-50 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                メールアドレス{" "}
                <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="例：info@example.com"
                className="w-full bg-slate-50 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                電話番号{" "}
                <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="例：03-1234-5678"
                className="w-full bg-slate-50 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* 案件情報 */}
        <section className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">02</span>
            <h2 className="text-base font-bold font-headline text-slate-900">
              案件の詳細
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                案件名 <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="project_name"
                required
                placeholder="例：コーポレートサイト制作"
                className="w-full bg-slate-50 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                案件概要{" "}
                <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <textarea
                name="project_description"
                rows={3}
                placeholder="補足事項があれば入力してください"
                className="w-full bg-slate-50 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all resize-none outline-none"
              />
            </div>
          </div>
        </section>

        {/* アクション */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 rounded-full bg-primary" />
            <div className="w-6 h-1.5 rounded-full bg-slate-200" />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-7 py-3 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            次へ：見積内容を作成
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
