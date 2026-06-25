import { Award, BadgeCheck, GraduationCap, Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { UjianStatistik } from "@/types/murid/ujian-sabuk";

interface StatItem {
  key: keyof UjianStatistik;
  label: string;
  icon: typeof GraduationCap;
  iconClasses: string;
}

const STATS: StatItem[] = [
  {
    key: "totalUjian",
    label: "Total Ujian",
    icon: GraduationCap,
    iconClasses: "bg-primary/10 text-primary",
  },
  {
    key: "lulus",
    label: "Lulus",
    icon: BadgeCheck,
    iconClasses: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "tidakLulus",
    label: "Tidak Lulus",
    icon: Award,
    iconClasses: "bg-destructive/10 text-destructive",
  },
  {
    key: "sabukSaatIni",
    label: "Sabuk Saat Ini",
    icon: Shield,
    iconClasses: "bg-gold/15 text-gold-foreground",
  },
];

export function StatistikUjian({ data }: { data: UjianStatistik }) {
  return (
    <section
      aria-label="Statistik ujian"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const value = data[stat.key];
        const isNumeric = typeof value === "number";
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
              <div className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "truncate font-semibold tracking-tight",
                    isNumeric ? "text-2xl tabular-nums" : "text-xl",
                  )}
                >
                  {isNumeric ? value.toLocaleString("id-ID") : value || "-"}
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

export function StatistikUjianSkeleton() {
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
