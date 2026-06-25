import { Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BeltSwatch } from "./belt-swatch";
import { formatTanggal, type SabukProgress } from "@/types/murid/ujian-sabuk";

export function BeltTimeline({ items }: { items: SabukProgress[] }) {
  if (items.length === 0) {
    return <BeltTimelineEmpty />;
  }

  return (
    <Card>
      <CardContent>
        <ol className="relative flex flex-col">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Connector line */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[11px] top-7 bottom-0 w-px bg-border"
                  />
                )}

                {/* Marker */}
                <span
                  className={cn(
                    "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border",
                    item.isCurrent && "ring-2 ring-primary",
                  )}
                  aria-hidden="true"
                >
                  <BeltSwatch nama={item.namaSabuk} size="sm" />
                </span>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{item.namaSabuk}</span>
                    {item.isCurrent && (
                      <Badge variant="secondary">Sabuk Saat Ini</Badge>
                    )}
                  </div>
                  {item.tanggal && (
                    <time className="text-sm text-muted-foreground">
                      {formatTanggal(item.tanggal)}
                    </time>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

function BeltTimelineEmpty() {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Route className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">Belum ada riwayat sabuk</EmptyTitle>
        <EmptyDescription>
          Perjalanan sabuk akan muncul setelah mengikuti ujian.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function BeltTimelineSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardContent>
        <div className="flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 pb-8 last:pb-0">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <div className="flex flex-col gap-2 pt-0.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
