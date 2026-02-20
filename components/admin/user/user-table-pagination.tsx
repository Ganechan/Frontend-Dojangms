"use client";

import { Table } from "@tanstack/react-table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ApiResponse } from "./hooks/types";
import { PAGE_SIZE_OPTIONS } from "./hooks/constants";

interface UserTablePaginationProps {
  table: Table<User>;
  meta?: ApiResponse["meta"]; // ✅ NEW: Meta dari backend
}

export function UserTablePagination({ table, meta }: UserTablePaginationProps) {
  return (
    <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Baris per halaman</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {PAGE_SIZE_OPTIONS.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ✅ NEW: Info dari backend */}
      {meta && (
        <div className="text-sm text-muted-foreground">
          Menampilkan {(meta.page - 1) * meta.limit + 1} -{" "}
          {Math.min(meta.page * meta.limit, meta.total_data)} dari{" "}
          {meta.total_data} data
        </div>
      )}

      {/* Page Info & Navigation */}
      <div className="flex items-center gap-8">
        <div className="flex items-center justify-end text-sm font-medium">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || (meta && !meta.has_prev)}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || (meta && !meta.has_prev)}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || (meta && !meta.has_next)}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || (meta && !meta.has_next)}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
