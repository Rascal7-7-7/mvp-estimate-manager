import { redirect } from "next/navigation";
import { getProjects } from "@/lib/actions";
import EstimateForm from "./EstimateForm";

export const metadata = { title: "新規見積作成 | 見積管理" };

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
    <div className="flex flex-col h-full">
      {/* サブヘッダー */}
      <div className="px-8 py-4 border-b border-surface-container bg-surface-container-lowest shrink-0">
        <p className="text-xs text-on-surface-variant">
          <span className="font-bold text-primary">STEP 02</span>
          　—　見積項目を入力して、右のプレビューで内容を確認してください。
        </p>
      </div>
      <EstimateForm projects={projects} defaultProjectId={selectedProjectId} />
    </div>
  );
}
