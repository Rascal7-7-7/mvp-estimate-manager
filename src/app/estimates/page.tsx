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
    <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-1">
            見積一覧
          </h2>
          <p className="text-on-surface-variant text-sm">
            現在進行中の案件と見積ステータスを確認・管理します。
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all editorial-shadow"
        >
          <span className="material-symbols-outlined text-base">post_add</span>
          新規見積作成
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryCard
          label="下書き"
          count={summary.draft}
          amount={null}
          colorClass="border-slate-300"
          badgeClass="bg-slate-100 text-slate-600"
          icon="edit_note"
          iconClass="text-slate-300"
        />
        <SummaryCard
          label="送付済み"
          count={summary.sent}
          amount={null}
          colorClass="border-primary"
          badgeClass="bg-primary-fixed text-on-primary-fixed"
          icon="outgoing_mail"
          iconClass="text-primary/20"
        />
        <SummaryCard
          label="承認済み"
          count={summary.approved}
          amount={summary.total_amount}
          colorClass="border-tertiary-fixed-dim"
          badgeClass="bg-tertiary-fixed text-on-tertiary-fixed"
          icon="verified"
          iconClass="text-tertiary-fixed-dim/40"
        />
      </div>

      {/* 一覧テーブル */}
      {estimates.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-surface-container">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    顧客名 / 案件名
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    合計金額
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">
                    ステータス
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {estimates.map((estimate) => (
                  <tr
                    key={estimate.id}
                    className="hover:bg-surface-container-low transition-colors duration-200"
                  >
                    <td className="px-6 py-5">
                      <p className="font-bold text-on-surface">
                        {estimate.customer_name}
                        {estimate.company_name && (
                          <span className="text-on-surface-variant font-normal text-sm ml-1">
                            / {estimate.company_name}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {estimate.project_name}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-base font-extrabold font-headline text-on-surface tabular-nums">
                        {formatCurrency(Number(estimate.total_amount))}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge status={estimate.status} size="sm" />
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-on-surface-variant">
                        {formatDate(estimate.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/estimates/${estimate.id}`}
                        className="inline-flex items-center gap-1 text-primary font-bold text-sm hover:underline"
                      >
                        詳細
                        <span className="material-symbols-outlined text-sm">
                          chevron_right
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-surface-container flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              全 {estimates.length} 件
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  count,
  amount,
  colorClass,
  badgeClass,
  icon,
  iconClass,
}: {
  label: string;
  count: number;
  amount: number | null;
  colorClass: string;
  badgeClass: string;
  icon: string;
  iconClass: string;
}) {
  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-l-4 ${colorClass}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${badgeClass}`}>
          {label}
        </span>
        <span className={`material-symbols-outlined ${iconClass}`}>{icon}</span>
      </div>
      <p className="text-3xl font-extrabold font-headline text-on-surface">
        {count}
        <span className="text-sm font-medium ml-1">件</span>
      </p>
      {amount !== null && (
        <p className="text-sm text-on-surface-variant mt-1">
          承認合計: {new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount)}
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-16 text-center">
      <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">
        description
      </span>
      <p className="text-on-surface-variant font-medium mb-1">
        まだ見積がありません
      </p>
      <p className="text-sm text-on-surface-variant mb-6">
        顧客・案件を登録して、最初の見積を作成しましょう。
      </p>
      <Link
        href="/projects/new"
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined text-base">add</span>
        新規見積作成
      </Link>
    </div>
  );
}
