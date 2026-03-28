import { notFound } from "next/navigation";
import Link from "next/link";
import { getEstimateDetail, updateEstimateStatus } from "@/lib/actions";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STATUS_LABELS } from "@/types";
import type { EstimateStatus } from "@/types";

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
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto pb-32 md:pb-24">
      {/* ナビゲーション & アクション */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/estimates"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          一覧へ戻る
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/estimates/new?project_id=${estimate.project_id}`}
            className="inline-flex items-center gap-2 bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-4 py-2 rounded-lg text-sm hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span className="hidden sm:inline">再見積を作成</span>
          </Link>
        </div>
      </div>

      {/* ステータス & 金額サマリー */}
      <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <StatusBadge status={estimate.status} />
          <div>
            <p className="font-bold text-slate-900 text-sm">
              EST-{String(estimate.id).padStart(4, "0")}
            </p>
            <p className="text-xs text-slate-500">
              作成日：{formatDate(estimate.created_at)}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">
            お見積総額（税抜）
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-primary">¥</span>
            <span className="text-3xl sm:text-4xl font-headline font-extrabold text-primary tracking-tighter leading-none">
              {Number(estimate.total_amount).toLocaleString("ja-JP")}
            </span>
          </div>
        </div>
      </div>

      {/* 見積書（帳票風） */}
      <div className="bg-white shadow-xl rounded-sm p-5 sm:p-8 md:p-12 border border-slate-100">
        {/* 書類ヘッダー */}
        <div className="flex justify-between items-start mb-8 sm:mb-14">
          <div>
            <h3 className="text-2xl sm:text-4xl font-bold font-headline tracking-[0.1em] sm:tracking-[0.15em] text-slate-900 border-b-4 border-slate-900 pb-2 mb-1">
              御見積書
            </h3>
            <p className="text-slate-400 text-xs font-medium tracking-widest">
              QUOTATION DOCUMENT
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
              見積番号：
              <span className="font-headline">
                EST-{String(estimate.id).padStart(4, "0")}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              発行日：{formatDate(estimate.created_at)}
            </p>
          </div>
        </div>

        {/* 顧客情報 & 案件情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-14">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">
              請求先
            </p>
            <h4 className="text-xl font-bold text-slate-900 mb-1">
              {estimate.customer_name} 御中
            </h4>
            {estimate.company_name && (
              <p className="text-slate-600 text-sm mb-3">
                {estimate.company_name}
              </p>
            )}
            {estimate.email && (
              <p className="text-sm text-slate-500">{estimate.email}</p>
            )}
            {estimate.phone && (
              <p className="text-sm text-slate-500">{estimate.phone}</p>
            )}
            <div className="mt-4 bg-slate-50 p-4 border-l-4 border-primary">
              <p className="text-[10px] text-slate-400 mb-1">案件名</p>
              <p className="font-bold text-slate-900 text-sm">
                {estimate.project_name}
              </p>
              {estimate.project_description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {estimate.project_description}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1 text-right">
              発行元
            </p>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Digital Curator
            </h4>
            <div className="flex justify-end mt-6">
              <div className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-300 text-[10px] font-bold rotate-12 text-center p-1 select-none">
                印影省略
              </div>
            </div>
          </div>
        </div>

        {/* 見積項目テーブル */}
        <div className="mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-3 px-4 text-xs font-bold uppercase">
                  項目 / 仕様
                </th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right w-32">
                  単価
                </th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-center w-20">
                  数量
                </th>
                <th className="py-3 px-4 text-xs font-bold uppercase text-right w-36">
                  小計
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {estimate.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-5 px-4">
                    <p className="font-bold text-slate-900 mb-0.5">
                      {item.item_name}
                    </p>
                    {item.note && (
                      <p className="text-xs text-slate-400">{item.note}</p>
                    )}
                  </td>
                  <td className="py-5 px-4 text-right font-headline font-bold text-slate-900 tabular-nums">
                    {formatCurrency(Number(item.unit_price))}
                  </td>
                  <td className="py-5 px-4 text-center text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="py-5 px-4 text-right font-headline font-bold text-slate-900 tabular-nums">
                    {formatCurrency(Number(item.subtotal))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 合計 */}
        <div className="flex justify-end pt-6 border-t-2 border-slate-900">
          <div className="w-72 space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-4 border-y-2 border-slate-900">
              <span className="text-sm font-bold text-slate-900">
                合計金額（税抜）
              </span>
              <span className="text-2xl font-headline font-extrabold text-slate-900 tabular-nums">
                {formatCurrency(Number(estimate.total_amount))}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 px-1 leading-relaxed">
              ※お支払い手数料はお客様にてご負担ください。
            </p>
          </div>
        </div>
      </div>

      {/* ステータス変更フローター */}
      {available.length > 0 && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 glass-effect border border-white/20 shadow-2xl px-4 sm:px-6 py-3 sm:py-3.5 rounded-full flex items-center gap-3 sm:gap-5 max-w-[calc(100vw-2rem)]">
          <div className="hidden sm:flex items-center gap-2 pr-5 border-r border-outline-variant/30">
            <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
            <span className="text-xs font-bold text-on-surface-variant">
              承認済みドキュメント
            </span>
          </div>
          <div className="flex items-center gap-3">
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
                  className={
                    status === "approved"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 rounded-full text-sm font-bold hover:brightness-95 active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-lg"
                      : "bg-surface-container-lowest text-on-surface border border-outline-variant px-5 py-2.5 rounded-full text-sm font-bold hover:bg-surface-container active:scale-95 transition-all inline-flex items-center gap-1.5"
                  }
                >
                  <span className="material-symbols-outlined text-base">
                    {status === "approved"
                      ? "check_circle"
                      : status === "rejected"
                      ? "cancel"
                      : status === "sent"
                      ? "mark_email_read"
                      : "edit"}
                  </span>
                  {STATUS_LABELS[status]} に変更
                </button>
              </form>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
