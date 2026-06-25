import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  totalAktif: number;
  totalNonaktif: number;
}

interface SummaryItem {
  label: string;
  value: number;
  icon: LucideIcon;
}

function SummaryCard({ label, value, icon: Icon }: SummaryItem) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({
  total,
  totalAktif,
  totalNonaktif,
}: SummaryCardsProps) {
  const items: SummaryItem[] = [
    { label: "Total Kelas", value: total, icon: GraduationCap },
    { label: "Kelas Aktif", value: totalAktif, icon: CheckCircle2 },
    { label: "Kelas Nonaktif", value: totalNonaktif, icon: XCircle },
  ];

  return (
    <section
      aria-label="Ringkasan kelas"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {items.map((item) => (
        <SummaryCard key={item.label} {...item} />
      ))}
    </section>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <section
      aria-label="Memuat ringkasan kelas"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {[0, 1, 2].map((i) => (
        <Card key={i} className="shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
