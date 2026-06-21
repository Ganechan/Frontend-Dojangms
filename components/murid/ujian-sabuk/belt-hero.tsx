import { Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BeltSwatch } from "./belt-swatch";
import { formatTanggal, type CurrentBelt } from "@/types/murid/ujian-sabuk";

export function BeltHero({ belt }: { belt: CurrentBelt }) {
  return (
    <Card className="relative overflow-hidden border bg-card p-6 sm:p-8">
      {/* Decorative oversized swatch glow in the corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: "var(--primary)" }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-20"
            aria-hidden="true"
          >
            <Shield className="size-8 sm:size-10" />
          </span>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              Sabuk Saat Ini
            </span>
            <div className="flex items-center gap-3">
              <BeltSwatch nama={belt.namaSabuk} className="size-5" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {belt.namaSabuk || "-"}
              </h2>
            </div>
            {belt.tanggal && (
              <span className="text-sm text-muted-foreground">
                Dicapai pada {formatTanggal(belt.tanggal)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function BeltHeroSkeleton() {
  return (
    <Card className="border p-6 sm:p-8" aria-hidden="true">
      <div className="flex items-center gap-5">
        <Skeleton className="size-16 shrink-0 rounded-2xl sm:size-20" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </Card>
  );
}
