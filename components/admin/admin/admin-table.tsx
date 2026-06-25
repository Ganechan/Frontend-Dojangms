// components/admin/admin/admin-table.tsx
"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, SquarePenIcon, Trash2 } from "lucide-react";
import Link from "next/link";

import type {
  ActiveStatusTab,
  AdminData,
  AdminStatusCounts,
  PaginationMeta,
} from "@/types/admin/admin";
import { AdminTableToolbar } from "./admin-table-toolbar";
import { AdminTablePagination } from "./admin-table-pagination";
import { AdminDeleteDialog } from "../admin/admin-delete-dialog";

// ─── helpers ────────────────────────────────────────────────────────────────

function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Aktif";
    case "inactive":
      return "Tidak Aktif";
    default:
      return status || "-";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "active":
      return "border-transparent bg-emerald-100 text-emerald-800";
    case "inactive":
      return "border-transparent bg-slate-100 text-slate-800";
    default:
      return "border-transparent bg-blue-100 text-blue-800";
  }
}

// ─── columns ────────────────────────────────────────────────────────────────

function getAdminColumns(
  onDelete: (id: number, name: string) => void,
): ColumnDef<AdminData>[] {
  return [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name || "-"}</span>
          <span className="text-xs text-muted-foreground md:hidden">
            {row.original.email || "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email || "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusClass(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Link href={`/admin/anggota/admin/${row.original.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-200/55 border-emerald-200"
            >
              <SquarePenIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
              <span className="sr-only">Edit admin</span>
            </Button>
          </Link>
          <Link href={`/admin/anggota/admin/${row.original.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-blue-600 hover:text-blue-600 hover:bg-blue-200/55 border-blue-200"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Detail</span>
              <span className="sr-only">Lihat detail admin</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            onClick={() => onDelete(row.original.id, row.original.name)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Hapus</span>
            <span className="sr-only">Hapus admin</span>
          </Button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];
}

// ─── props ───────────────────────────────────────────────────────────────────

interface AdminDataTableProps {
  data: AdminData[];
  pagination?: PaginationMeta;
  statusCounts?: AdminStatusCounts;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (q: string) => void;
  onStatusChange?: (status: ActiveStatusTab) => void;
  onRefresh?: () => void;
  initialSearch?: string;
  initialStatus?: ActiveStatusTab;
}

// ─── component ───────────────────────────────────────────────────────────────

export function AdminDataTable({
  data,
  pagination,
  statusCounts,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onStatusChange,
  onRefresh,
  initialSearch,
  initialStatus,
}: AdminDataTableProps) {
  const [activeStatus, setActiveStatus] = React.useState<ActiveStatusTab>(
    initialStatus ?? "total",
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [tablePagination, setTablePagination] = React.useState<PaginationState>(
    {
      pageIndex: pagination ? pagination.page - 1 : 0,
      pageSize: pagination?.limit ?? 10,
    },
  );

  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: number;
    name: string;
  } | null>(null);

  React.useEffect(() => {
    setActiveStatus(initialStatus ?? "total");
  }, [initialStatus]);

  React.useEffect(() => {
    if (pagination) {
      setTablePagination({
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      });
    }
  }, [pagination]);

  const columns = React.useMemo(
    () => getAdminColumns((id, name) => setDeleteTarget({ id, name })),
    [],
  );

  const handlePaginationChange = React.useCallback(
    (updater: React.SetStateAction<PaginationState>) => {
      const next =
        typeof updater === "function" ? updater(tablePagination) : updater;
      if (next.pageIndex !== tablePagination.pageIndex)
        onPageChange?.(next.pageIndex + 1);
      if (next.pageSize !== tablePagination.pageSize)
        onPageSizeChange?.(next.pageSize);
      setTablePagination(next);
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

  return (
    <>
      <Tabs
        value={activeStatus}
        onValueChange={(v) => {
          const s = v as ActiveStatusTab;
          setActiveStatus(s);
          onStatusChange?.(s);
        }}
        className="w-full flex-col justify-start gap-6"
      >
        <AdminTableToolbar
          table={table}
          statusCounts={statusCounts}
          onSearchChange={onSearchChange}
          onStatusChange={(s) => {
            setActiveStatus(s);
            onStatusChange?.(s);
          }}
          initialSearch={initialSearch}
          initialStatus={activeStatus}
        />

        <TabsContent
          value={activeStatus}
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-lg border">
            <Table className="[&_th]:text-center">
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

          <AdminTablePagination table={table} meta={pagination} />
        </TabsContent>
      </Tabs>

      {deleteTarget && (
        <AdminDeleteDialog
          adminId={deleteTarget.id}
          adminName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          onSuccess={() => {
            setDeleteTarget(null);
            onRefresh?.();
          }}
        />
      )}
    </>
  );
}
