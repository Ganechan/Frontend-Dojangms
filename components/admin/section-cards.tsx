//components\admin\section-cards.tsx
"use client";

import * as React from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconTrophy,
  IconCalendarEvent,
  IconUsers,
  IconUserPlus,
  IconArrowRight,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function CardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-24 mt-1" />
        <CardAction>
          <Skeleton className="h-8 w-28 rounded-md" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3.5 w-36" />
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalKejuaraan, setTotalKejuaraan] = React.useState<number | null>(
    null,
  );
  const [kejuaraanMendatang, setKejuaraanMendatang] = React.useState<
    number | null
  >(null);
  const [totalAnggota, setTotalAnggota] = React.useState<number | null>(null);
  const [anggotaBaru, setAnggotaBaru] = React.useState<number | null>(null);
  const [anggotaStats, setAnggotaStats] = React.useState<{
    trend: string;
    percentChange: number;
    labelBulan: string;
    labelTahun: string;
  } | null>(null);
  const [kejuaraanSelesai, setKejuaraanSelesai] = React.useState<number | null>(
    null,
  );
  const [tahunKejuaraan, setTahunKejuaraan] = React.useState<number | null>(
    null,
  );
  const [kejuaraan3Months, setKejuaraan3Months] = React.useState<{
    total: number;
    terdekat: {
      name: string;
      start_date: string;
      daysRemaining: number;
    } | null;
  } | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchCounts = async () => {
      try {
        const [
          userRes,
          beltRes,
          statRes,
          championship5yRes,
          championship3mRes,
        ] = await Promise.all([
          fetch(`${BASE_URL}/api/admin/get/user/all`),
          fetch(`${BASE_URL}/api/admin/get/championship`),
          fetch(`${BASE_URL}/api/admin/get/user/stats`),
          fetch(`${BASE_URL}/api/admin/get/championship/5years`),
          fetch(`${BASE_URL}/api/admin/get/championship/3months`),
        ]);

        const userJson = await userRes.json().catch(() => null);
        const beltJson = await beltRes.json().catch(() => null);
        const statsJson = await statRes.json().catch(() => null);
        const championship5yJson = await championship5yRes
          .json()
          .catch(() => null);
        const championship3mJson = await championship3mRes
          .json()
          .catch(() => null);

        if (!mounted) return;

        setIsLoading(false);

        if (championship3mJson) {
          setKejuaraan3Months({
            total: championship3mJson.total ?? 0,
            terdekat: championship3mJson.data?.[0] ?? null,
          });
        }

        if (championship5yJson?.data) {
          const latest =
            championship5yJson.data[championship5yJson.data.length - 1];
          setTahunKejuaraan(latest.year);
          setKejuaraanSelesai(
            latest.rincian ? Number(latest.rincian.selesai) : 0,
          );
        }

        if (statsJson?.data) {
          const { trend, percentChange, labelBulan, labelTahun } =
            statsJson.data;
          setAnggotaStats({ trend, percentChange, labelBulan, labelTahun });
        }

        if (userJson?.totalMuridAktif !== undefined) {
          setTotalAnggota(userJson.totalMuridAktif);
        }

        if (userJson?.muridBaruBulanIni !== undefined) {
          setAnggotaBaru(userJson.muridBaruBulanIni);
        }

        if (beltJson) {
          const totalRaw =
            beltJson.total ??
            (beltJson.data && Array.isArray(beltJson.data)
              ? beltJson.data.length
              : null);
          const total =
            typeof totalRaw === "number" ? totalRaw : Number(totalRaw);
          console.debug(
            "SectionCards: computed totalKejuaraan:",
            totalRaw,
            "->",
            total,
          );

          setTotalKejuaraan(total);

          if (beltJson.data && Array.isArray(beltJson.data)) {
            const now = new Date();
            const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            const upcoming = beltJson.data.filter((k: any) => {
              if (!k.start_date) return false;
              const start = new Date(k.start_date);
              return start >= now && start <= in30days;
            }).length;

            setKejuaraanMendatang(upcoming);
          }
        }
      } catch (error) {
        console.error("Error fetching section counts:", error);
        if (mounted) setIsLoading(false);
      }
    };

    fetchCounts();

    return () => {
      mounted = false;
    };
  }, []);

  const trendLabel = (() => {
    if (!anggotaStats) return "Memuat data....";
    const { trend, percentChange } = anggotaStats;
    if (trend === "up") return `Pendaftaran Meningkat, ${percentChange}%`;
    if (trend === "down") return `Pendaftaran Menurun, ${percentChange}%`;
    return `Pendaftaran Stabil, ${percentChange}%`;
  })();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

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
                Lihat Detail
                <IconArrowRight className="size-3.5" />
              </a>
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {tahunKejuaraan
              ? `Kejuaraan yang telah selesai di tahun ${tahunKejuaraan}`
              : "Memuat data..."}
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
                Lihat Detail
                <IconArrowRight className="size-3.5" />
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
              <a href="/admin/murid">
                Lihat Detail
                <IconArrowRight className="size-3.5" />
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

      {/* Anggota Baru Bulan Ini */}
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
                Lihat Detail
                <IconArrowRight className="size-3.5" />
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
