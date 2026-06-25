"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Kelas } from "@/types/murid/kelas";
import Link from "next/link";

function formatTanggal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

interface InfoRowProps {
  icon: typeof Calendar;
  label: string;
  value: string | number;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon
        className="h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium text-foreground">{value}</span>
    </div>
  );
}

export function KelasCard({ kelas }: { kelas: Kelas }) {
  const isAktif = kelas.status === "aktif";

  return (
    <Card className="flex flex-col shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <h3 className="text-base font-semibold leading-snug text-balance">
          {kelas.nama}
        </h3>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 font-medium",
            isAktif
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isAktif ? "Aktif" : "Nonaktif"}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {kelas.deskripsi}
        </p>

        <div className="mt-auto flex flex-col gap-2.5 border-t pt-4">
          <InfoRow
            icon={Calendar}
            label="Tanggal Bergabung"
            value={formatTanggal(kelas.tanggalBergabung)}
          />
          <InfoRow
            icon={Clock}
            label="Jadwal Aktif"
            value={kelas.jumlahJadwalAktif}
          />
          <InfoRow
            icon={Users}
            label="Jumlah Pelatih"
            value={kelas.jumlahPelatih}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-0 items-stretch">
        <hr className="border-muted/60" />
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground truncate">
            Terdaftar sejak {formatTanggal(kelas.tanggalBergabung)}
          </p>
          <Link href={`/murid/kelas/${kelas.id}`} passHref>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-xs shrink-0"
            >
              Detail
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function KelasCardSkeleton() {
  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-col gap-2.5 border-t pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-0 items-stretch">
        <hr className="border-muted/60" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
