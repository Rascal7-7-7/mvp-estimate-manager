import { notFound } from "next/navigation";
import Link from "next/link";
import { getEstimateDetail, updateEstimateStatus } from "@/lib/actions";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { EstimateStatus } from "@/types";
import { STATUS_LABELS } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `見積 #${id} | 見積管理` };
}

export default async function EstimateDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const estimate = await getEstimateDetail(numId);
  if (!estimate) notFound();

  const nextStatuses: Record<EstimateStatus, EstimateStatus[]> = {
    draft: ["sent"],
    sent: ["approved", "rejected"],
    approved: [],
    rejected: ["draft"],
  };

  const available = nextStatuses[estimate.status];

  return (
    <div className="max-w-3xl mx-auto">
      {/* 戻るリンク */}
      <div className="mb-6">
        <Link
          href="/estimates"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 見積一覧に戻る
        </Link>
      </div>

      {/* 見積書ヘッダー */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* タイトルバー */}
        <div className="bg-blue-600 px-8 py-5 text-white flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-medium mb-1">見積書</p>
            <h1 className="text-xl font-bold">No. {String(estimate.id).padStart(4, "0")}</h1>
          </div>
          <div className="text-right">
            <StatusBadge status={estimate.status} />
            <p className="text-blue-200 text-xs mt-2">
              作成日：{formatDate(estimate.created_at)}
            </p>
          </div>
        </div>

        {/* 本文 */}
        <div className="p-8 space-y-8">
          {/* 顧客・案件情報 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                顧客情報
              </h2>
              <p className="font-semibold text-gray-900 text-lg leading-tight">
                {estimate.customer_name} 様
              </p>
              {estimate.company_name && (
                <p className="text-gray-500 text-sm">{estimate.company_name}</p>
              )}
              {estimate.email && (
                <p className="text-gray-500 text-sm mt-1">{estimate.email}</p>
              )}
              {estimate.phone && (
                <p className="text-gray-500 text-sm">{estimate.phone}</p>
              )}
            </div>
            <div>
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                案件情報
              </h2>
              <p className="font-semibold text-gray-900">{estimate.project_name}</p>
              {estimate.project_description && (
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {estimate.project_description}
                </p>
              )}
            </div>
          </div>

          {/* 見積項目テーブル */}
          <div>
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              見積項目
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="text-left px-4 py-2.5 text-gray-600 font-medium">項目名</th>
                  <th className="text-right px-4 py-2.5 text-gray-600 font-medium">単価</th>
                  <th className="text-center px-4 py-2.5 text-gray-600 font-medium">数量</th>
                  <th className="text-right px-4 py-2.5 text-gray-600 font-medium">小計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estimate.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 font-medium">{item.item_name}</p>
                      {item.note && (
                        <p className="text-gray-400 text-xs mt-0.5">{item.note}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                      {formatCurrency(Number(item.unit_price))}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">
                      {formatCurrency(Number(item.subtotal))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 合計金額 */}
            <div className="border-t-2 border-gray-900 mt-2 pt-3 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-0.5">合計金額（税抜）</p>
                <p className="text-3xl font-bold text-blue-700 tabular-nums">
                  {formatCurrency(Number(estimate.total_amount))}
                </p>
              </div>
            </div>
          </div>

          {/* ステータス変更 */}
          {available.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                ステータス変更
              </h2>
              <div className="flex gap-3 flex-wrap">
                {available.map((status) => (
                  <form
                    key={status}
                    action={async () => {
                      "use server";
                      await updateEstimateStatus(numId, status);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg border-2 border-gray-300 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      {STATUS_LABELS[status]} に変更
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
