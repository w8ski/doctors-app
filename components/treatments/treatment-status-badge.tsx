import { Badge } from "@/components/ui/badge";
import type { TreatmentStatus } from "@/lib/treatments-schema";

interface TreatmentStatusBadgeProps {
  status?: TreatmentStatus;
}

const STATUS_CONFIG: Record<
  TreatmentStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
  },
};

export const TreatmentStatusBadge = ({ status }: TreatmentStatusBadgeProps) => {
  if (!status) {
    return (
      <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        Unknown
      </Badge>
    );
  }

  const config = STATUS_CONFIG[status];

  return <Badge className={config.className}>{config.label}</Badge>;
};
