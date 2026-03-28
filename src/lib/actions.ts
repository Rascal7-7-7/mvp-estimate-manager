"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "./db";
import type {
  Customer,
  Project,
  ProjectWithCustomer,
  EstimateListItem,
  EstimateDetail,
  EstimateSummary,
  EstimateStatus,
  EstimateItem,
} from "@/types";

// ─── 顧客・案件登録 ───────────────────────────────────────────────

export async function createProjectWithCustomer(formData: FormData) {
  const customerName = String(formData.get("customer_name") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const projectName = String(formData.get("project_name") ?? "").trim();
  const projectDescription =
    String(formData.get("project_description") ?? "").trim() || null;

  if (!customerName) throw new Error("顧客名は必須です");
  if (!projectName) throw new Error("案件名は必須です");

  const [customer] = await query<Customer>(
    `INSERT INTO customers (customer_name, company_name, email, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [customerName, companyName, email, phone]
  );

  const [project] = await query<Project>(
    `INSERT INTO projects (customer_id, project_name, project_description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [customer.id, projectName, projectDescription]
  );

  redirect(`/estimates/new?project_id=${project.id}`);
}

// ─── 案件一覧取得 ─────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectWithCustomer[]> {
  return query<ProjectWithCustomer>(
    `SELECT p.*, c.customer_name, c.company_name
     FROM projects p
     JOIN customers c ON c.id = p.customer_id
     ORDER BY p.created_at DESC`
  );
}

// ─── 見積作成 ─────────────────────────────────────────────────────

export interface EstimateItemInput {
  item_name: string;
  unit_price: number;
  quantity: number;
  note?: string;
}

export async function createEstimate(
  projectId: number,
  items: EstimateItemInput[]
) {
  if (!projectId) throw new Error("案件IDが不正です");
  if (items.length === 0) throw new Error("見積項目を1件以上追加してください");

  for (const item of items) {
    if (!item.item_name.trim()) throw new Error("項目名は必須です");
    if (item.unit_price < 0) throw new Error("単価は0以上にしてください");
    if (item.quantity < 1) throw new Error("数量は1以上にしてください");
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const [estimate] = await query(
    `INSERT INTO estimates (project_id, total_amount, status)
     VALUES ($1, $2, 'draft')
     RETURNING *`,
    [projectId, totalAmount]
  );

  for (const item of items) {
    const subtotal = item.unit_price * item.quantity;
    await query(
      `INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        estimate.id,
        item.item_name.trim(),
        item.unit_price,
        item.quantity,
        subtotal,
        item.note?.trim() || null,
      ]
    );
  }

  revalidatePath("/estimates");
  redirect(`/estimates/${estimate.id}`);
}

// ─── 見積一覧取得 ─────────────────────────────────────────────────

export async function getEstimateList(): Promise<EstimateListItem[]> {
  return query<EstimateListItem>(
    `SELECT e.*, p.project_name, c.customer_name, c.company_name
     FROM estimates e
     JOIN projects p ON p.id = e.project_id
     JOIN customers c ON c.id = p.customer_id
     ORDER BY e.created_at DESC`
  );
}

// ─── 見積サマリー取得 ─────────────────────────────────────────────

export async function getEstimateSummary(): Promise<EstimateSummary> {
  const rows = await query<{
    status: EstimateStatus;
    count: string;
    amount: string;
  }>(
    `SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount
     FROM estimates
     GROUP BY status`
  );

  const summary: EstimateSummary = {
    total: 0,
    draft: 0,
    sent: 0,
    approved: 0,
    rejected: 0,
    total_amount: 0,
  };

  for (const row of rows) {
    const count = parseInt(row.count, 10);
    summary[row.status] = count;
    summary.total += count;
    if (row.status === "approved") {
      summary.total_amount = parseFloat(row.amount);
    }
  }

  return summary;
}

// ─── 見積詳細取得 ─────────────────────────────────────────────────

export async function getEstimateDetail(
  id: number
): Promise<EstimateDetail | null> {
  const estimate = await queryOne<Omit<EstimateDetail, "items">>(
    `SELECT e.*, p.project_name, p.project_description,
            c.customer_name, c.company_name, c.email, c.phone
     FROM estimates e
     JOIN projects p ON p.id = e.project_id
     JOIN customers c ON c.id = p.customer_id
     WHERE e.id = $1`,
    [id]
  );

  if (!estimate) return null;

  const items = await query<EstimateItem>(
    `SELECT * FROM estimate_items WHERE estimate_id = $1 ORDER BY id`,
    [id]
  );

  return { ...estimate, items } as unknown as EstimateDetail;
}

// ─── ステータス更新 ───────────────────────────────────────────────

export async function updateEstimateStatus(
  id: number,
  status: EstimateStatus
) {
  const validStatuses: EstimateStatus[] = [
    "draft",
    "sent",
    "approved",
    "rejected",
  ];
  if (!validStatuses.includes(status)) throw new Error("不正なステータスです");

  await query(
    `UPDATE estimates SET status = $1, updated_at = NOW() WHERE id = $2`,
    [status, id]
  );

  revalidatePath(`/estimates/${id}`);
  revalidatePath("/estimates");
}
