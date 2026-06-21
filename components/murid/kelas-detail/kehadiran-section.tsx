import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { StatistikKehadiran } from "@/types/murid/kelas";

interface SummaryItem {
  label: string;
  value: number;
  className: string;
}

export function KehadiranSection({
  statistik,
}: {
  statistik: StatistikKehadiran;
}) {
  const items: SummaryItem[] = [
    {
      label: "Total Pertemuan",
      value: statistik.totalPertemuan,
      className: "text-foreground",
    },
    {
      label: "Hadir",
      value: statistik.hadir,
      className: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Izin",
      value: statistik.izin,
      className: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Sakit",
      value: statistik.sakit,
      className: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Alpha",
      value: statistik.alpha,
      className: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby="kehadiran-heading"
    >
      <h2
        id="kehadiran-heading"
        className="text-lg font-semibold tracking-tight"
      >
        Statistik Kehadiran
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="flex flex-col gap-1 p-5">
              <span
                className={cn(
                  "text-2xl font-semibold tabular-nums leading-tight",
                  item.className,
                )}
              >
                {item.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Persentase Kehadiran</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <span className="text-4xl font-semibold tabular-nums leading-none">
            {statistik.persentaseKehadiran}%
          </span>
          <Progress
            value={statistik.persentaseKehadiran}
            aria-label="Persentase kehadiran"
          />
        </CardContent>
      </Card>
    </section>
  );
}

export function KehadiranSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="flex flex-col gap-2 p-5">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-3 w-full rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}
