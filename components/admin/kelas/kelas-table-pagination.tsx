"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIMIT_OPTIONS } from "@/types/admin/kelas";
import type { Kelas, PaginationMeta } from "@/types/admin/kelas";

interface KelasTablePaginationProps {
  table?: Table<Kelas>;
  meta?: PaginationMeta;
  onPageSizeChange?: (size: number) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export function KelasTablePagination({
  table,
  meta,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
}: KelasTablePaginationProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {meta ? (
          <>
            Halaman{" "}
            <span className="font-medium text-foreground">{meta.page}</span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">
              {meta.total_page}
            </span>{" "}
            &bull; Total{" "}
            <span className="font-medium text-foreground">
              {meta.total_data}
            </span>{" "}
            data
          </>
        ) : (
          " "
        )}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tampilkan</span>
        <Select
          value={String(meta?.limit || 10)}
          onValueChange={(v) => onPageSizeChange?.(Number(v))}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onPrevPage) {
              onPrevPage();
            } else {
              table?.previousPage();
            }
          }}
          disabled={meta ? !meta.has_prev : false}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onNextPage) {
              onNextPage();
            } else {
              table?.nextPage();
            }
          }}
          disabled={meta ? !meta.has_next : false}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
}

