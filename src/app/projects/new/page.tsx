import { createProjectWithCustomer } from "@/lib/actions";

export const metadata = { title: "顧客・案件登録 | 見積管理" };

export default function NewProjectPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto pb-28 md:pb-10">
      {/* ページヘッダー */}
      <div className="mb-10 text-center">
        <span className="text-on-primary-container font-bold tracking-widest text-xs mb-2 block font-headline">
          STEP 01
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-primary mb-3 tracking-tight">
          顧客・案件登録
        </h1>
        <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
          まずは基本情報を入力してください。ここで入力した内容は後からいつでも変更可能です。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* 左：ヒントパネル */}
        <div className="hidden md:block md:col-span-3">
          <div className="p-5 rounded-xl bg-primary-container/5 border border-primary-container/10 space-y-3">
            <h3 className="text-sm font-bold font-headline text-primary">
              入力のヒント
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">
                  check
                </span>
                <span className="text-xs text-secondary leading-tight">
                  顧客名は後で見積書に反映されます。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">
                  check
                </span>
                <span className="text-xs text-secondary leading-tight">
                  案件名は社内管理用の名前でOKです。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">
                  check
                </span>
                <span className="text-xs text-secondary leading-tight">
                  登録後、すぐに見積作成へ進めます。
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 右：フォーム */}
        <div className="md:col-span-9">
          <form action={createProjectWithCustomer} className="space-y-5">
            {/* 顧客情報 */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    person
                  </span>
                </div>
                <h2 className="text-lg font-bold font-headline text-primary">
                  お客様の情報
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    お名前 <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder="例：山田 太郎"
                    className="w-full bg-slate-50 border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
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
                    className="w-full bg-slate-50 border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
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
                    className="w-full bg-slate-50 border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
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
                    className="w-full bg-slate-50 border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
                  />
                </div>
              </div>
            </section>

            {/* 案件情報 */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    assignment
                  </span>
                </div>
                <h2 className="text-lg font-bold font-headline text-primary">
                  案件の詳細
                </h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    案件名 <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    required
                    placeholder="例：コーポレートサイト制作"
                    className="w-full bg-slate-50 border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
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
                    className="w-full bg-slate-50 border-transparent rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* アクション */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  進捗
                </span>
                <div className="flex gap-1.5">
                  <div className="w-10 h-1.5 rounded-full bg-primary" />
                  <div className="w-10 h-1.5 rounded-full bg-slate-200" />
                  <div className="w-10 h-1.5 rounded-full bg-slate-200" />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                次へ：見積内容の作成へ
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
