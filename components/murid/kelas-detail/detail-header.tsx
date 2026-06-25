import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatTanggal } from "@/types/murid/format";
import type { KelasStatus } from "@/types/murid/kelas";

interface DetailHeaderProps {
  nama: string;
  status: KelasStatus;
  tanggalBergabung: string;
}

export function DetailHeader({
  nama,
  status,
  tanggalBergabung,
}: DetailHeaderProps) {
  const isAktif = status === "aktif";

  return (
    <header className="flex flex-col gap-4">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kelas Saya
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {nama}
          </h1>
          <Badge
            variant="secondary"
            className={cn(
              "font-medium",
              isAktif
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {isAktif ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Terdaftar sejak {formatTanggal(tanggalBergabung)}
        </p>
      </div>
    </header>
  );
}

export function DetailHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-28" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
