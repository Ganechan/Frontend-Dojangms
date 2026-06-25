"use client";

import { AlertTriangle, RotateCw, SearchX, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function PrestasiEmptyState() {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Trophy className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">
          Belum ada riwayat kejuaraan
        </EmptyTitle>
        <EmptyDescription>
          Riwayat kejuaraan yang pernah diikuti akan muncul di sini.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function PrestasiSearchEmptyState() {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <SearchX className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">Tidak ditemukan hasil</EmptyTitle>
        <EmptyDescription>
          Coba ubah pencarian atau filter yang digunakan.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function PrestasiErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">
          Gagal memuat data prestasi
        </EmptyTitle>
        <EmptyDescription>
          Silakan coba kembali beberapa saat lagi.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onRetry}>
          <RotateCw data-icon="inline-start" />
          Coba Lagi
        </Button>
      </EmptyContent>
    </Empty>
  );
}
