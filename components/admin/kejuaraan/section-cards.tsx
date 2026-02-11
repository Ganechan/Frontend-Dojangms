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
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const [totalKejuaraan, setTotalKejuaraan] = React.useState<number | null>(
    null,
  );
  const [kejuaraanMendatang, setKejuaraanMendatang] = React.useState<
    number | null
  >(null);
  const [totalAnggota, setTotalAnggota] = React.useState<number | null>(null);
  const [anggotaBaru, setAnggotaBaru] = React.useState<number | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchCounts = async () => {
      try {
        const [userRes, beltRes] = await Promise.all([
          fetch(`${BASE_URL}/api/admin/get/user`),
          fetch(`${BASE_URL}/api/admin/get/championship`),
        ]);

        const userJson = await userRes.json().catch(() => null);
        const beltJson = await beltRes.json().catch(() => null);

        // debug: tunjukkan payload untuk membantu diagnosis
        console.debug("SectionCards: userJson:", userJson);
        console.debug("SectionCards: beltJson:", beltJson);

        if (!mounted) return;

        // Hitung murid aktif (roles === 'murid' && status === 'active')
        if (userJson?.data && Array.isArray(userJson.data)) {
          const muridAktif = userJson.data.filter(
            (u: any) => u.roles === "murid" && u.status === "active",
          );

          setTotalAnggota(muridAktif.length);

          // Anggota baru bulan ini (created_at dalam bulan & tahun sekarang)
          const now = new Date();
          const anggotaBaruCount = muridAktif.filter((u: any) => {
            if (!u.created_at) return false;
            const created = new Date(u.created_at);
            return (
              created.getFullYear() === now.getFullYear() &&
              created.getMonth() === now.getMonth()
            );
          }).length;

          setAnggotaBaru(anggotaBaruCount);
        }

        // Hitung kejuaraan
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

          // Kejuaraan mendatang dalam 30 hari
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
        // jika gagal, biarkan nilai tetap null
        console.error("Error fetching section counts:", error);
      }
    };

    fetchCounts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Kejuaraan */}
      <Card className="@container/card border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <IconTrophy className="size-5 text-blue-500" />
            </div>
            <CardDescription>Total Kejuaraan</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalKejuaraan === null ? "—" : totalKejuaraan.toLocaleString()}
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
            Meningkat dari tahun lalu
          </div>
          <div className="text-muted-foreground">
            Total kejuaraan yang terdaftar
          </div>
        </CardFooter>
      </Card>

      {/* Kejuaraan Mendatang */}
      <Card className="@container/card border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-500/10 p-2">
              <IconCalendarEvent className="size-5 text-orange-500" />
            </div>
            <CardDescription>Kejuaraan Mendatang</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kejuaraanMendatang === null
              ? "—"
              : kejuaraanMendatang.toLocaleString()}
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
          <div className="line-clamp-1 flex gap-2 font-medium">
            Persiapan sedang berjalan
          </div>
          <div className="text-muted-foreground">
            Kejuaraan dalam 30 hari ke depan
          </div>
        </CardFooter>
      </Card>

      {/* Total Anggota */}
      <Card className="@container/card border-l-4 border-l-green-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-500/10 p-2">
              <IconUsers className="size-5 text-green-500" />
            </div>
            <CardDescription>Total Anggota</CardDescription>
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
            Pertumbuhan anggota stabil
          </div>
          <div className="text-muted-foreground">Anggota aktif terdaftar</div>
        </CardFooter>
      </Card>

      {/* Anggota Baru Bulan Ini */}
      <Card className="@container/card border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <IconUserPlus className="size-5 text-purple-500" />
            </div>
            <CardDescription>Anggota Baru</CardDescription>
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
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pendaftaran meningkat
          </div>
          <div className="text-muted-foreground">
            Anggota bergabung di Februari 2026
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
