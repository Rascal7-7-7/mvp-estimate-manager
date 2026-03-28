"use client";

import { useState, useTransition } from "react";
import { createEstimate } from "@/lib/actions";
import type { EstimateItemInput } from "@/lib/actions";
import type { ProjectWithCustomer } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  projects: ProjectWithCustomer[];
  defaultProjectId: number;
}

const emptyItem = (): EstimateItemInput => ({
  item_name: "",
  unit_price: 0,
  quantity: 1,
  note: "",
});

export default function EstimateForm({ projects, defaultProjectId }: Props) {
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [items, setItems] = useState<EstimateItemInput[]>([emptyItem()]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedProject = projects.find((p) => p.id === projectId);

  const updateItem = (
    index: number,
    field: keyof EstimateItemInput,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + (Number(item.unit_price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const handleSave = () => {
    setError(null);
    const validated = items.map((item) => ({
      ...item,
      unit_price: Number(item.unit_price) || 0,
      quantity: Number(item.quantity) || 1,
    }));
    if (validated.some((item) => !item.item_name.trim())) {
      setError("項目名を入力してください");
      return;
    }
    startTransition(async () => {
      try {
        await createEstimate(projectId, validated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "保存に失敗しました");
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
      {/* 左：入力エリア */}
      <section className="w-full lg:w-[46%] flex flex-col bg-surface-container-low p-4 sm:p-6 lg:p-8 lg:overflow-y-auto custom-scrollbar">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-primary font-headline">
                見積項目の入力
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                入力内容が右の見積プレビューに反映されます
              </p>
            </div>
          </div>

          {/* 案件選択 */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 shadow-sm">
            <label className="text-xs font-bold text-outline mb-1.5 block">
              対象案件
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full bg-surface-container-low border-none ring-1 ring-outline-variant/30 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary transition-all"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}（{p.customer_name}
                  {p.company_name ? ` / ${p.company_name}` : ""}）
                </option>
              ))}
            </select>
          </div>

          {/* 見積項目 */}
          <div className="space-y-4">
            {items.map((item, index) => {
              const subtotal =
                (Number(item.unit_price) || 0) * (Number(item.quantity) || 0);
              return (
                <div
                  key={index}
                  className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border-l-4 border-primary border border-outline-variant/20 space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-outline mb-1 block">
                      項目名
                    </label>
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) =>
                        updateItem(index, "item_name", e.target.value)
                      }
                      placeholder="例：デザイン制作"
                      className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 rounded-lg px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-outline mb-1 block">
                        単価（¥）
                      </label>
                      <input
                        type="number"
                        value={item.unit_price === 0 ? "" : item.unit_price}
                        onChange={(e) =>
                          updateItem(index, "unit_price", e.target.value)
                        }
                        placeholder="100000"
                        min={0}
                        className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 rounded-lg px-3 py-2.5 text-sm font-bold font-headline focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-outline mb-1 block">
                        数量
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        min={1}
                        className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 rounded-lg px-3 py-2.5 text-sm font-bold font-headline focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-on-surface-variant">
                      小計：
                      <span className="font-bold text-on-surface ml-1">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-xs text-error hover:opacity-70 transition-opacity"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 項目追加 */}
            <button
              type="button"
              onClick={addItem}
              className="w-full py-3.5 border-2 border-dashed border-outline-variant/40 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-white transition-all"
            >
              <span className="material-symbols-outlined text-xl">
                add_circle
              </span>
              <span className="font-bold text-sm">項目を追加する</span>
            </button>
          </div>

          {error && (
            <p className="text-error text-sm bg-error-container/30 border border-error/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
        </div>
      </section>

      {/* 右：見積プレビュー */}
      <section className="flex-1 bg-surface p-4 sm:p-6 lg:p-10 lg:overflow-y-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* 合計金額ヒーロー */}
          <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium opacity-80 mb-1">
                  御見積合計金額（税抜）
                </p>
                <p className="text-xs opacity-60">
                  合計金額が自動で更新されます
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold align-top mr-1">¥</span>
                <span className="text-5xl font-black font-headline tracking-tighter">
                  {totalAmount.toLocaleString("ja-JP")}
                </span>
              </div>
            </div>
          </div>

          {/* 見積書プレビュー */}
          <div className="bg-surface-container-lowest shadow-lg rounded-sm p-12 border border-outline-variant/20 min-h-[600px] flex flex-col">
            {/* ヘッダー */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="text-xl font-bold tracking-tighter text-primary mb-0.5">
                  DIGITAL CURATOR
                </div>
                <div className="text-[10px] text-outline tracking-widest uppercase">
                  Creative Solutions
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-primary tracking-[0.2em] mb-2">
                  御 見 積 書
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  QUOTATION DOCUMENT
                </p>
              </div>
            </div>

            {/* 顧客・案件情報 */}
            {selectedProject && (
              <div className="mb-10">
                <p className="text-sm text-on-surface-variant mb-0.5">
                  {selectedProject.customer_name}
                  {selectedProject.company_name
                    ? ` / ${selectedProject.company_name}`
                    : ""}{" "}
                  御中
                </p>
                <p className="text-base font-bold border-b-2 border-primary inline-block pb-1">
                  {selectedProject.project_name} 御見積
                </p>
              </div>
            )}

            {/* 項目テーブル */}
            <div className="flex-1">
              <div className="grid grid-cols-12 gap-3 py-2.5 border-b-2 border-on-surface text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="col-span-6">項目内容</div>
                <div className="col-span-2 text-right">数量</div>
                <div className="col-span-2 text-right">単価</div>
                <div className="col-span-2 text-right text-on-surface">金額</div>
              </div>
              {items.map((item, i) => {
                const sub =
                  (Number(item.unit_price) || 0) *
                  (Number(item.quantity) || 0);
                return (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-3 py-4 border-b border-outline-variant/30 items-center"
                  >
                    <div className="col-span-6">
                      {item.item_name ? (
                        <p className="font-bold text-sm text-on-surface">{item.item_name}</p>
                      ) : (
                        <p className="text-sm text-outline italic">未入力</p>
                      )}
                    </div>
                    <div className="col-span-2 text-right text-sm font-headline">
                      {Number(item.quantity) || 1}
                    </div>
                    <div className="col-span-2 text-right text-sm font-headline">
                      {formatCurrency(Number(item.unit_price) || 0)}
                    </div>
                    <div className="col-span-2 text-right font-bold text-sm font-headline">
                      {formatCurrency(sub)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 合計 */}
            <div className="mt-8 flex justify-end">
              <div className="w-56 space-y-2">
                <div className="flex justify-between items-center pt-3 border-t-2 border-primary">
                  <span className="text-sm font-bold">合計金額</span>
                  <span className="text-xl font-headline font-bold text-primary tabular-nums">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 固定フッター：保存ボタン */}
      <footer className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 glass-effect border border-white/20 shadow-2xl px-5 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 pr-6 border-r border-outline-variant/30">
          <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
          <span className="text-xs font-medium text-on-surface-variant">
            内容を編集中です
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary text-on-primary px-10 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? "保存中..." : "見積を保存する"}
          </button>
        </div>
      </footer>
    </div>
  );
}
