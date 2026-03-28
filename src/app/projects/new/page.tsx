import { createProjectWithCustomer } from "@/lib/actions";

export const metadata = { title: "顧客・案件登録 | 見積管理" };

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">顧客・案件登録</h1>
        <p className="text-gray-500 mt-1 text-sm">
          顧客情報と案件情報を入力して、見積作成の準備をします。
        </p>
      </div>

      <form action={createProjectWithCustomer} className="space-y-6">
        {/* 顧客情報 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-base flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            顧客情報
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              顧客名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customer_name"
              required
              placeholder="例：山田 太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会社名 <span className="text-gray-400 text-xs font-normal">（任意）</span>
            </label>
            <input
              type="text"
              name="company_name"
              placeholder="例：株式会社サンプル"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-gray-400 text-xs font-normal">（任意）</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話番号 <span className="text-gray-400 text-xs font-normal">（任意）</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="090-0000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* 案件情報 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-base flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            案件情報
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              案件名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              required
              placeholder="例：コーポレートサイト制作"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              案件概要 <span className="text-gray-400 text-xs font-normal">（任意）</span>
            </label>
            <textarea
              name="project_description"
              rows={3}
              placeholder="例：5ページ構成のコーポレートサイト。デザイン・コーディング・CMS導入を含む。"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          登録して見積作成へ →
        </button>
      </form>
    </div>
  );
}
