//components\admin\section-cards.tsx
import {
  IconTrendingDown,
  IconTrendingUp,
  IconTrophy,
  IconCalendarEvent,
  IconUsers,
  IconUserPlus,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardData = {
  userJson: any;
  beltJson: any;
  statsJson: any;
  championship5yJson: any;
  championship3mJson: any;
} | null;

export function SectionCards({ data }: { data: DashboardData }) {
  // Proses data langsung, tidak perlu state
  const totalAnggota = data?.userJson?.totalMuridAktif ?? null;
  const anggotaBaru = data?.userJson?.muridBaruBulanIni ?? null;

  const anggotaStats = data?.statsJson?.data ?? null;

  const championship5yLatest = data?.championship5yJson?.data?.at(-1) ?? null;
  const tahunKejuaraan = championship5yLatest?.year ?? null;
  const kejuaraanSelesai = championship5yLatest?.rincian
    ? Number(championship5yLatest.rincian.selesai)
    : null;

  const kejuaraan3Months = data?.championship3mJson
    ? {
        total: data.championship3mJson.total ?? 0,
        terdekat: data.championship3mJson.data?.[0] ?? null,
      }
    : null;

  const trendLabel = (() => {
    if (!anggotaStats) return "Data tidak tersedia";
    const { trend, percentChange } = anggotaStats;
    if (trend === "up") return `Pendaftaran Meningkat, ${percentChange}%`;
    if (trend === "down") return `Pendaftaran Menurun, ${percentChange}%`;
    return `Pendaftaran Stabil, ${percentChange}%`;
  })();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Kejuaraan */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <IconTrophy className="size-5 text-blue-500" />
            </div>
            <CardDescription>Total Kejuaraan</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kejuaraanSelesai === null
              ? "—"
              : kejuaraanSelesai.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-blue-500/20 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
              asChild
            >
              <a href="/admin/kejuaraan">
                Lihat Detail <IconArrowRight className="size-3.5" />
              </a>
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {tahunKejuaraan
              ? `Kejuaraan yang telah selesai di tahun ${tahunKejuaraan}`
              : "—"}
          </div>
        </CardFooter>
      </Card>

      {/* Kejuaraan Mendatang */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-500/10 p-2">
              <IconCalendarEvent className="size-5 text-orange-500" />
            </div>
            <CardDescription>Kejuaraan Mendatang</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kejuaraan3Months === null
              ? "—"
              : kejuaraan3Months.total.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 hover:text-orange-700"
              asChild
            >
              <a href="/admin/kejuaraan">
                Lihat Detail <IconArrowRight className="size-3.5" />
              </a>
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {kejuaraan3Months?.terdekat ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Terdekat: {kejuaraan3Months.terdekat.name}
              </div>
              <div className="text-muted-foreground">
                Mulai{" "}
                {new Date(
                  kejuaraan3Months.terdekat.start_date,
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                • {kejuaraan3Months.terdekat.daysRemaining} hari lagi
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">
              Tidak ada kejuaraan dalam 3 bulan ke depan
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Total Anggota */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-500/10 p-2">
              <IconUsers className="size-5 text-green-500" />
            </div>
            <CardDescription>Total Jeja</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAnggota === null ? "—" : totalAnggota.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-green-500/20 text-green-600 hover:bg-green-500/10 hover:text-green-700"
              asChild
            >
              <a href="/admin/user">
                Lihat Detail <IconArrowRight className="size-3.5" />
              </a>
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Jeja saat ini
          </div>
          <div className="text-muted-foreground">Jeja aktif terdaftar</div>
        </CardFooter>
      </Card>

      {/* Anggota Baru */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <IconUserPlus className="size-5 text-purple-500" />
            </div>
            <CardDescription>Jeja Baru</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {anggotaBaru === null ? "—" : anggotaBaru.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-purple-500/20 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700"
              asChild
            >
              <a href="/admin/murid">
                Lihat Detail <IconArrowRight className="size-3.5" />
              </a>
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium items-center">
            {anggotaStats?.trend === "up" && (
              <IconTrendingUp className="size-4 text-green-500" />
            )}
            {anggotaStats?.trend === "down" && (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
            {trendLabel}
          </div>
          <div className="text-muted-foreground">
            {anggotaStats
              ? `Jeja bergabung di ${anggotaStats.labelBulan} ${anggotaStats.labelTahun}`
              : "Jeja bergabung bulan ini"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
