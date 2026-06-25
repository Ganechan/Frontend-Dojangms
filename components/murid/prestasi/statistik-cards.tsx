import { Award, Medal, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PrestasiStatistik } from "@/types/murid/prestasi";

interface StatItem {
  key: keyof PrestasiStatistik;
  label: string;
  icon: typeof Trophy;
  iconClasses: string;
}

// ✅ Perbaikan: key "total_kejuaraan" sesuai dengan tipe
const STATS: StatItem[] = [
  {
    key: "total_kejuaraan", // ← sebelumnya "totalKejuaraan"
    label: "Total Kejuaraan",
    icon: Trophy,
    iconClasses: "bg-primary/10 text-primary",
  },
  {
    key: "juara1",
    label: "Juara 1",
    icon: Trophy,
    iconClasses: "bg-gold/15 text-gold-foreground",
  },
  {
    key: "juara2",
    label: "Juara 2",
    icon: Medal,
    iconClasses: "bg-silver/15 text-silver-foreground",
  },
  {
    key: "juara3",
    label: "Juara 3",
    icon: Award,
    iconClasses: "bg-bronze/15 text-bronze-foreground",
  },
];

export function StatistikCards({ data }: { data: PrestasiStatistik }) {
  return (
    <section
      aria-label="Statistik prestasi"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.key} className="overflow-hidden">
            <CardContent className="flex items-center gap-4">
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  stat.iconClasses,
                )}
                aria-hidden="true"
              >
                <Icon className="size-6" />
              </span>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight tabular-nums">
                  {data[stat.key].toLocaleString("id-ID")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

export function StatistikCardsSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
