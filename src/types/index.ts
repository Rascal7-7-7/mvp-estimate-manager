export type EstimateStatus = "draft" | "sent" | "approved" | "rejected";

export const STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "下書き",
  sent: "送付済み",
  approved: "承認",
  rejected: "却下",
};

export const STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export interface Customer {
  id: number;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  customer_id: number;
  project_name: string;
  project_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectWithCustomer extends Project {
  customer_name: string;
  company_name: string | null;
}

export interface Estimate {
  id: number;
  project_id: number;
  total_amount: number;
  status: EstimateStatus;
  created_at: Date;
  updated_at: Date;
}

export interface EstimateItem {
  id: number;
  estimate_id: number;
  item_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EstimateListItem extends Estimate {
  project_name: string;
  customer_name: string;
  company_name: string | null;
}

export interface EstimateDetail extends Estimate {
  project_name: string;
  project_description: string | null;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  items: EstimateItem[];
}

export interface EstimateSummary {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  total_amount: number;
}
