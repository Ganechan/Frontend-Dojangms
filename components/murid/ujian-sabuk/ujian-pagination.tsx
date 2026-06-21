"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UjianPaginationProps {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
  itemCount: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, last: number): number[] {
  const delta = 1;
  const range: number[] = [];
  const start = Math.max(1, current - delta);
  const end = Math.min(last, current + delta);
  for (let i = start; i <= end; i++) range.push(i);
  if (!range.includes(1)) range.unshift(1);
  if (!range.includes(last) && last > 1) range.push(last);
  return Array.from(new Set(range)).sort((a, b) => a - b);
}

export function UjianPagination({
  page,
  lastPage,
  total,
  perPage,
  itemCount,
  onPageChange,
}: UjianPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = total === 0 ? 0 : from + itemCount - 1;
  const isFirst = page <= 1;
  const isLast = page >= lastPage;
  const pages = getPageNumbers(page, lastPage);

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {from.toLocaleString("id-ID")}
        </span>{" "}
        -{" "}
        <span className="font-medium text-foreground">
          {to.toLocaleString("id-ID")}
        </span>{" "}
        dari{" "}
        <span className="font-medium text-foreground">
          {total.toLocaleString("id-ID")}
        </span>{" "}
        riwayat ujian
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={isFirst}
          aria-label="Halaman pertama"
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft />
        </Button>

        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showGap = prev !== undefined && p - prev > 1;
          return (
            <div key={p} className="flex items-center gap-1">
              {showGap && (
                <span
                  className="px-1 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  …
                </span>
              )}
              <Button
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(p)}
                aria-label={`Halaman ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn("tabular-nums")}
              >
                {p}
              </Button>
            </div>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(lastPage)}
          disabled={isLast}
          aria-label="Halaman terakhir"
        >
          <ChevronsRight />
        </Button>
      </div>
    </nav>
  );
}
