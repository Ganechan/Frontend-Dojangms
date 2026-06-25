// components/murid/prestasi/prestasi-card.tsx
import { CalendarDays, MapPin, ShieldCheck, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MedalBadge } from "./medal-badge";
import { cn } from "@/lib/utils";
import { formatTanggal, type Prestasi } from "@/types/murid/prestasi";

// Helper lokal (tidak diekspor dari tipe)
function rankFromHasil(hasil: string): number | null {
  const match = hasil.match(/[1-3]/);
  return match ? Number(match[0]) : null;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">
          {value || "-"}
        </span>
      </div>
    </div>
  );
}

export function PrestasiCard({ prestasi }: { prestasi: Prestasi }) {
  const rank = rankFromHasil(prestasi.hasil);
  const accent =
    rank === 1
      ? "bg-gold"
      : rank === 2
        ? "bg-silver"
        : rank === 3
          ? "bg-bronze"
          : "bg-border";

  const kategori = [
    prestasi.cabang,
    prestasi.kategori_usia,
    prestasi.gender,
    prestasi.level_kompetisi,
  ]
    .filter(Boolean)
    .join(" • ");

  const kelasDetail =
    prestasi.kelas_kejuaraan_detail ||
    (prestasi.label_berat
      ? `${prestasi.label_berat} (${prestasi.batas_bawah} - ${prestasi.batas_atas} kg)`
      : "");

  return (
    <Card className="relative h-full">
      <span
        className={cn("absolute inset-y-0 left-0 w-1", accent)}
        aria-hidden="true"
      />
      <CardHeader className="flex flex-row items-start justify-between gap-3 pl-5">
        <CardTitle className="text-balance">
          {prestasi.kejuaraan_nama}
        </CardTitle>
        <MedalBadge rank={rank} hasil={prestasi.hasil} />
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pl-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoRow
            icon={Trophy}
            label="Level Kejuaraan"
            value={prestasi.level}
          />
          <InfoRow
            icon={CalendarDays}
            label="Tahun"
            value={String(prestasi.year)}
          />
          <InfoRow icon={MapPin} label="Lokasi" value={prestasi.location} />
        </div>

        <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3">
          <span className="text-xs text-muted-foreground">
            Jadwal Pertandingan
          </span>
          <span className="text-sm font-medium">
            {formatTanggal(prestasi.start_date)}
            {prestasi.end_date && (
              <>
                {" – "}
                {formatTanggal(prestasi.end_date)}
              </>
            )}
          </span>
        </div>

        {kategori && (
          <p className="text-sm text-muted-foreground">{kategori}</p>
        )}

        {kelasDetail && (
          <div className="rounded-lg bg-primary/5 px-3 py-2 ring-1 ring-primary/10">
            <span className="text-xs text-muted-foreground">
              Kelas Pertandingan
            </span>
            <p className="text-base font-semibold tracking-tight text-foreground text-balance">
              {kelasDetail}
            </p>
          </div>
        )}

        {prestasi.belt_saat_itu && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Sabuk Saat Bertanding
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-border">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {prestasi.belt_saat_itu}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pl-5 text-xs text-muted-foreground">
        Hasil Resmi Kejuaraan
      </CardFooter>
    </Card>
  );
}

export function PrestasiCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-32" />
      </CardFooter>
    </Card>
  );
}
