import Link from "next/link";
import { getEstimateList, getEstimateSummary } from "@/lib/actions";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "見積一覧 | 見積管理" };
export const dynamic = "force-dynamic";

export default async function EstimatesPage() {
  const [estimates, summary] = await Promise.all([
    getEstimateList(),
    getEstimateSummary(),
  ]);

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">見積一覧</h1>
          <p className="text-gray-500 text-sm mt-1">
            全 {summary.total} 件 ／ 承認合計{" "}
            <span className="text-green-600 font-semibold">
              {formatCurrency(summary.total_amount)}
            </span>
          </p>
        </div>
        <Link
          href="/projects/new"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + 新規見積作成
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="下書き" count={summary.draft} color="gray" />
        <SummaryCard label="送付済み" count={summary.sent} color="blue" />
        <SummaryCard label="承認" count={summary.approved} color="green" />
        <SummaryCard label="却下" count={summary.rejected} color="red" />
      </div>

      {/* 見積一覧テーブル */}
      {estimates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-gray-400 text-lg mb-2">まだ見積がありません</p>
          <p className="text-gray-400 text-sm mb-6">
            顧客・案件を登録して、最初の見積を作成しましょう。
          </p>
          <Link
            href="/projects/new"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + 新規見積作成
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-gray-600 font-medium">顧客名</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">案件名</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">合計金額</th>
                <th className="text-center px-4 py-3 text-gray-600 font-medium">ステータス</th>
                <th className="text-center px-4 py-3 text-gray-600 font-medium">作成日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {estimate.customer_name}
                    </div>
                    {estimate.company_name && (
                      <div className="text-xs text-gray-400">
                        {estimate.company_name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {estimate.project_name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatCurrency(Number(estimate.total_amount))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={estimate.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {formatDate(estimate.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/estimates/${estimate.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      詳細 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "gray" | "blue" | "green" | "red";
}) {
  const colorMap = {
    gray: "bg-gray-50 border-gray-200 text-gray-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };
  const countColorMap = {
    gray: "text-gray-900",
    blue: "text-blue-900",
    green: "text-green-900",
    red: "text-red-900",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${countColorMap[color]}`}>
        {count}
        <span className="text-base font-normal ml-1">件</span>
      </p>
    </div>
  );
}
