import {
  BadgeCheck,
  Calendar,
  CalendarCheck,
  MapPin,
  Trophy,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BeltProgression } from "./belt-swatch";
import { formatTanggal, isLulus, type Ujian } from "@/types/murid/ujian-sabuk";

function StatusBadge({ status }: { status: string }) {
  const lulus = isLulus(status);
  if (lulus) {
    return (
      <Badge className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        <BadgeCheck data-icon="inline-start" />
        Lulus
      </Badge>
    );
  }
  return (
    <Badge className="border-transparent bg-destructive/15 text-destructive">
      <XCircle data-icon="inline-start" />
      {status || "Tidak Lulus"}
    </Badge>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="sr-only">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export function UjianCard({ ujian }: { ujian: Ujian }) {
  const lulus = isLulus(ujian.status);

  const tanggalRange =
    ujian.tanggalMulai && ujian.tanggalSelesai
      ? `${formatTanggal(ujian.tanggalMulai)} – ${formatTanggal(ujian.tanggalSelesai)}`
      : formatTanggal(ujian.tanggalMulai || ujian.tanggalSelesai);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug text-balance">
            {ujian.deskripsi}
          </CardTitle>
          <StatusBadge status={ujian.status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <InfoRow icon={Trophy} label="Level" value={ujian.level} />
          <InfoRow icon={MapPin} label="Lokasi" value={ujian.lokasi} />
          <InfoRow icon={Calendar} label="Tanggal" value={tanggalRange} />
        </div>

        {/* Belt progression — the most prominent info on the card */}
        {(ujian.sabukAwal || ujian.sabukTujuan) && (
          <div className="rounded-lg border bg-muted/40 p-3">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Kenaikan Sabuk
            </span>
            <BeltProgression from={ujian.sabukAwal} to={ujian.sabukTujuan} />
          </div>
        )}

        {lulus && ujian.tanggalLulus && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarCheck
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">
              Tanggal Lulus:{" "}
              <span className="font-medium text-foreground">
                {formatTanggal(ujian.tanggalLulus)}
              </span>
            </span>
          </div>
        )}
      </CardContent>

      <Separator />
      <CardFooter>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Kenaikan Tingkat
        </span>
      </CardFooter>
    </Card>
  );
}

export function UjianCardSkeleton() {
  return (
    <Card className="h-full" aria-hidden="true">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
      </CardContent>
      <Separator />
      <CardFooter>
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}
