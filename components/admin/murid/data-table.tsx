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
  StatusCounts,
  User,
} from "@/components/admin/murid/hooks/types";
import { schema } from "@/components/admin/murid/hooks/types";
import { getColumns } from "@/components/admin/murid/columns";
import {
  defaultHiddenColumns,
  DEFAULT_PAGE_SIZE,
} from "@/components/admin/murid/hooks/constants";
import { UserTableToolbar } from "@/components/admin/murid/user-table-toolbar";
import { UserTablePagination } from "@/components/admin/murid/user-table-pagination";

export type { User };
export { schema };

type ActiveStatus = "total" | "active" | "inactive";

interface DataTableProps {
  data: User[];
  pagination?: ApiResponse["pagination"];
  statusCounts?: StatusCounts;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSoftDeleteSuccess?: () => void;
}

export function DataTable({
  data: initialData,
  pagination,
  statusCounts,
  onPageChange,
  onPageSizeChange,
  onSoftDeleteSuccess,
}: DataTableProps) {
  // ✅ state lokal (tidak dari URL lagi)
  const [activeStatus, setActiveStatus] = React.useState<ActiveStatus>("total");

  const data = React.useMemo(() => {
    const list = initialData ?? [];
    if (activeStatus === "total") return list;
    return list.filter((u) => u.status === activeStatus);
  }, [initialData, activeStatus]);

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
      value={activeStatus}
      onValueChange={(v) => setActiveStatus(v as ActiveStatus)}
      className="w-full flex-col justify-start gap-6"
    >
      <UserTableToolbar table={table} statusCounts={statusCounts} />

      <TabsContent
        value={activeStatus}
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

        <UserTablePagination table={table} meta={metaCompat} />
      </TabsContent>
    </Tabs>
  );
}
