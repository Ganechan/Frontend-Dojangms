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

import {
  User,
  schema,
  ApiResponse,
  RoleCounts,
} from "@/components/admin/user/hooks/types";
import { columns } from "@/components/admin/user/columns";
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
  meta?: ApiResponse["meta"];
  roleCounts?: RoleCounts;
  activeRole?: string; // ✅ NEW
  onRoleChange?: (role: string) => void; // ✅ NEW
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable({
  data: initialData,
  meta,
  roleCounts,
  activeRole = "semua", // ✅ NEW
  onRoleChange, // ✅ NEW
  onPageChange,
  onPageSizeChange,
}: DataTableProps) {
  const [data] = React.useState(() => initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultHiddenColumns);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: meta ? meta.page - 1 : 0,
    pageSize: meta?.limit || DEFAULT_PAGE_SIZE,
  });

  React.useEffect(() => {
    if (meta) {
      setPagination({
        pageIndex: meta.page - 1,
        pageSize: meta.limit,
      });
    }
  }, [meta]);

  // ✅ REMOVED: filterUsersByRole - sekarang backend yang filter

  const handlePaginationChange = React.useCallback(
    (updater: any) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;

      if (newPagination.pageIndex !== pagination.pageIndex) {
        onPageChange?.(newPagination.pageIndex + 1);
      }

      if (newPagination.pageSize !== pagination.pageSize) {
        onPageSizeChange?.(newPagination.pageSize);
      }

      setPagination(newPagination);
    },
    [pagination, onPageChange, onPageSizeChange],
  );

  const table = useReactTable({
    data, // ✅ CHANGED: Langsung pakai data tanpa filter
    columns,
    pageCount: meta?.total_page ?? -1,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
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

  return (
    <Tabs
      value={activeRole}
      onValueChange={onRoleChange} // ✅ CHANGED: Trigger parent handler
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

        <UserTablePagination table={table} meta={meta} />
      </TabsContent>
    </Tabs>
  );
}
