import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTanggalSingkat } from "@/types/murid/format";
import type { Jadwal, JadwalProgress } from "@/types/murid/jadwal";

const PROGRESS_LABEL: Record<JadwalProgress, string> = {
  berlangsung: "Berlangsung",
  akan_datang: "Akan Datang",
  selesai: "Selesai",
};

const PROGRESS_CLASS: Record<JadwalProgress, string> = {
  berlangsung:
    "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  akan_datang:
    "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400",
  selesai: "border-transparent bg-muted text-muted-foreground",
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon
        className="h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export function JadwalCard({ jadwal }: { jadwal: Jadwal }) {
  const isAktif = jadwal.status === "aktif";

  return (
    <Card className="flex flex-col shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold leading-tight text-balance">
              {jadwal.nama}
            </h3>
            <p className="text-sm text-muted-foreground">{jadwal.kelasNama}</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0",
              isAktif
                ? "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "border-transparent bg-muted text-muted-foreground",
            )}
          >
            {isAktif ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
          <InfoRow icon={CalendarDays} label="Hari" value={jadwal.hari} />
          <InfoRow icon={Clock} label="Jam Mulai" value={jadwal.jamMulai} />
          <InfoRow icon={Clock} label="Jam Selesai" value={jadwal.jamSelesai} />
          <InfoRow icon={MapPin} label="Lokasi" value={jadwal.lokasi} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={PROGRESS_CLASS[jadwal.progress]}>
            {PROGRESS_LABEL[jadwal.progress]}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <span>Berlaku sejak: </span>
          <span className="font-medium text-foreground">
            {formatTanggalSingkat(jadwal.berlakuMulai)}
          </span>
          {jadwal.berlakuSampai ? (
            <>
              <span> · Sampai: </span>
              <span className="font-medium text-foreground">
                {formatTanggalSingkat(jadwal.berlakuSampai)}
              </span>
            </>
          ) : null}
        </div>

        <div className="mt-auto border-t pt-3 text-xs text-muted-foreground">
          {jadwal.tipeJadwal
            ? `Tipe Jadwal: ${jadwal.tipeJadwal}`
            : "Latihan rutin"}
        </div>
      </CardContent>
    </Card>
  );
}

export function JadwalCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-3/4" />
          ))}
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}
