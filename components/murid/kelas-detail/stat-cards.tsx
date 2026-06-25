import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, CalendarDays, BarChart3 } from "lucide-react";
import type { KelasStatistik } from "@/types/murid/kelas";

interface StatItem {
  label: string;
  value: string | number;
  icon: typeof Users;
}

export function StatCards({ statistik }: { statistik: KelasStatistik }) {
  const items: StatItem[] = [
    { label: "Murid Aktif", value: statistik.muridAktif, icon: Users },
    { label: "Pelatih Aktif", value: statistik.pelatihAktif, icon: UserCheck },
    { label: "Total Jadwal", value: statistik.totalJadwal, icon: CalendarDays },
    {
      label: "Persentase Kehadiran",
      value: `${statistik.persentaseKehadiran}%`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
              <item.icon
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tabular-nums leading-tight">
                {item.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
