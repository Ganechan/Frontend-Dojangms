import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AbsensiStatus } from "@/types/murid/kelas";

const STATUS_CONFIG: Record<
  AbsensiStatus,
  { label: string; className: string }
> = {
  hadir: {
    label: "Hadir",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  izin: {
    label: "Izin",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  sakit: {
    label: "Sakit",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  alpha: {
    label: "Alpha",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

export function AbsensiBadge({ status }: { status: AbsensiStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
