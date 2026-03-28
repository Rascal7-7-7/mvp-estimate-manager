import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import type { EstimateStatus } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  status: EstimateStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        STATUS_COLORS[status],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
