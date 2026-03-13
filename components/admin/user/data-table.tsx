"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import type {
  ApiResponse,
  RoleCounts,
  User,
} from "@/components/admin/user/hooks/types";
import { schema } from "@/components/admin/user/hooks/types";
import { getColumns } from "@/components/admin/user/columns";
import {
  defaultHiddenColumns,
  DEFAULT_PAGE_SIZE,
} from "@/components/admin/user/hooks/constants";
import { UserTableToolbar } from "@/components/admin/user/user-table-toolbar";
import { UserTablePagination } from "@/components/admin/user/user-table-pagination";

export type { User };
export { schema };

interface DataTableProps {
  data: User[];
  pagination?: ApiResponse["pagination"]; // ✅ updated
  roleCounts?: RoleCounts;
  activeRole?: string;
  onRoleChange?: (role: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSoftDeleteSuccess?: () => void;
}

export function DataTable({
  data: initialData,
  pagination,
  roleCounts,
  activeRole = "semua",
  onRoleChange,
  onPageChange,
  onPageSizeChange,
  onSoftDeleteSuccess,
}: DataTableProps) {
  const data = React.useMemo(
    () => (initialData ?? []).filter((u) => u.status === "active"),
    [initialData],
  );

  const columns = React.useMemo(
    () => getColumns({ onSoftDeleteSuccess }),
    [onSoftDeleteSuccess],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultHiddenColumns);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [tablePagination, setTablePagination] = React.useState<PaginationState>(
    {
      pageIndex: pagination ? pagination.page - 1 : 0,
      pageSize: pagination?.limit || DEFAULT_PAGE_SIZE,
    },
  );

  // Sync dari server pagination → table state
  React.useEffect(() => {
    if (pagination) {
      setTablePagination({
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      });
    }
  }, [pagination]);

  const handlePaginationChange = React.useCallback(
    (updater: any) => {
      const newPagination =
        typeof updater === "function" ? updater(tablePagination) : updater;

      if (newPagination.pageIndex !== tablePagination.pageIndex) {
        onPageChange?.(newPagination.pageIndex + 1);
      }

      if (newPagination.pageSize !== tablePagination.pageSize) {
        onPageSizeChange?.(newPagination.pageSize);
      }

      setTablePagination(newPagination);
    },
    [tablePagination, onPageChange, onPageSizeChange],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: pagination?.total_page ?? -1,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: tablePagination,
    },
    manualPagination: true,
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  /**
   * Compat layer:
   * Kalau UserTablePagination masih expect prop bernama `meta`,
   * kita map `pagination` → `metaCompat`.
   */
  const metaCompat = React.useMemo(() => {
    if (!pagination) return undefined;
    return {
      page: pagination.page,
      limit: pagination.limit,
      total_data: pagination.total_data,
      total_page: pagination.total_page,
      has_next: pagination.has_next,
      has_prev: pagination.has_prev,
    };
  }, [pagination]);

  return (
    <Tabs
      value={activeRole}
      onValueChange={onRoleChange}
      className="w-full flex-col justify-start gap-6"
    >
      <UserTableToolbar table={table} roleCounts={roleCounts} />

      <TabsContent
        value={activeRole}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ✅ sementara pakai compat supaya tidak perlu ubah komponen pagination dulu */}
        <UserTablePagination table={table} meta={metaCompat} />
      </TabsContent>
    </Tabs>
  );
}
