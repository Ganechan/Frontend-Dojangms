"use client";

import { Award, RotateCw, SearchX, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function UjianEmptyState() {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Award className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">Belum ada riwayat ujian</EmptyTitle>
        <EmptyDescription>
          Riwayat ujian sabuk akan muncul di sini.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function UjianSearchEmptyState() {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <SearchX className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">Tidak ditemukan hasil</EmptyTitle>
        <EmptyDescription>Coba ubah filter yang digunakan.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function UjianErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlert className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-base">
          Gagal memuat riwayat ujian
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
