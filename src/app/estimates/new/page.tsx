import { redirect } from "next/navigation";
import { getProjects } from "@/lib/actions";
import EstimateForm from "./EstimateForm";

export const metadata = { title: "見積作成 | 見積管理" };

interface Props {
  searchParams: Promise<{ project_id?: string }>;
}

export default async function NewEstimatePage({ searchParams }: Props) {
  const params = await searchParams;
  const projects = await getProjects();

  if (projects.length === 0) {
    redirect("/projects/new");
  }

  const selectedProjectId = params.project_id
    ? parseInt(params.project_id, 10)
    : projects[0].id;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">見積作成</h1>
        <p className="text-gray-500 mt-1 text-sm">
          案件を選択し、見積項目を追加してください。金額は自動で計算されます。
        </p>
      </div>
      <EstimateForm projects={projects} defaultProjectId={selectedProjectId} />
    </div>
  );
}
