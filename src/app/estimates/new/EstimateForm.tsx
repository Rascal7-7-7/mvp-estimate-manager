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
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.unit_price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const handleSubmit = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左：入力フォーム */}
      <div className="lg:col-span-2 space-y-5">
        {/* 案件選択 */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm">対象案件</h2>
          <select
            value={projectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}（{p.customer_name}
                {p.company_name ? ` / ${p.company_name}` : ""}）
              </option>
            ))}
          </select>
        </section>

        {/* 見積項目 */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 text-sm">見積項目</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              + 項目を追加
            </button>
          </div>

          <div className="space-y-3">
            {/* ヘッダー */}
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-1">
              <div className="col-span-5">項目名</div>
              <div className="col-span-3 text-right">単価（円）</div>
              <div className="col-span-2 text-center">数量</div>
              <div className="col-span-2 text-right">小計</div>
            </div>

            {items.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => updateItem(index, "item_name", e.target.value)}
                      placeholder="例：デザイン制作"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={item.unit_price === 0 ? "" : item.unit_price}
                      onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                      placeholder="50000"
                      min={0}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      min={1}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-medium text-gray-800 tabular-nums">
                      {formatCurrency(
                        (Number(item.unit_price) || 0) * (Number(item.quantity) || 0)
                      )}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-10">
                    <input
                      type="text"
                      value={item.note ?? ""}
                      onChange={(e) => updateItem(index, "note", e.target.value)}
                      placeholder="備考（任意）"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-600 text-xs transition-colors"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
      </div>

      {/* 右：見積サマリー */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
          <h2 className="font-semibold text-gray-800 mb-4 text-sm">見積サマリー</h2>

          {/* 顧客・案件情報 */}
          {selectedProject && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
              <div className="text-gray-500 text-xs font-medium">顧客</div>
              <div className="font-medium text-gray-800">
                {selectedProject.customer_name}
              </div>
              {selectedProject.company_name && (
                <div className="text-gray-500 text-xs">
                  {selectedProject.company_name}
                </div>
              )}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="text-gray-500 text-xs font-medium">案件</div>
                <div className="font-medium text-gray-800">
                  {selectedProject.project_name}
                </div>
              </div>
            </div>
          )}

          {/* 項目リスト */}
          <div className="space-y-2 mb-4">
            {items.map((item, i) => {
              const subtotal =
                (Number(item.unit_price) || 0) * (Number(item.quantity) || 0);
              return (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.item_name || `項目 ${i + 1}`}
                  </span>
                  <span className="text-gray-800 tabular-nums shrink-0">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 合計 */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">合計金額</span>
              <span className="text-2xl font-bold text-blue-700 tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isPending ? "保存中..." : "見積を保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
