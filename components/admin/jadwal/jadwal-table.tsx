// components\admin\jadwal\jadwal-table.tsx
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, SquarePenIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import type {
    ActiveScheduleTab,
    ScheduleData,
    ScheduleStatusCounts,
    PaginationMeta,
    ScheduleType,
    Kelas,
} from "@/types/admin/jadwal";
import { ScheduleTableToolbar } from "./jadwal-toolbar-table";
import { ScheduleTablePagination } from "./jadwal-table-pagination";

// ─── helpers ────────────────────────────────────────────────────────────────

function getScheduleTypeLabel(type: string) {
    switch (type) {
        case "latihan_wajib":
            return "Latihan Wajib";
        case "kelas":
            return "Kelas";
        case "training_camp":
            return "Training Camp";
        default:
            return type || "-";
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case "aktif":
            return "Aktif";
        case "nonaktif":
            return "Tidak Aktif";
        default:
            return status || "-";
    }
}

function getStatusClass(status: string) {
    switch (status) {
        case "aktif":
            return "border-transparent bg-emerald-100 text-emerald-800";
        case "nonaktif":
            return "border-transparent bg-slate-100 text-slate-800";
        default:
            return "border-transparent bg-blue-100 text-blue-800";
    }
}

function formatTime(time: string) {
    return time.slice(0, 5);
}

// ─── columns ────────────────────────────────────────────────────────────────

function getScheduleColumns(
    onDelete: (id: number, name: string) => void,
): ColumnDef<ScheduleData>[] {
    return [
        {
            accessorKey: "nama",
            header: "Nama Jadwal",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.nama || "-"}</span>
                    <span className="text-xs text-muted-foreground">
                        {getScheduleTypeLabel(row.original.tipe)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "hari",
            header: "Hari",
            cell: ({ row }) => (
                <span className="text-sm capitalize">
                    {row.original.hari
                        ? row.original.hari.charAt(0).toUpperCase() +
                        row.original.hari.slice(1)
                        : "-"}
                </span>
            ),
        },
        {
            accessorKey: "jam_mulai",
            header: "Waktu",
            cell: ({ row }) => (
                <span className="text-sm">
                    {formatTime(row.original.jam_mulai)} -{" "}
                    {formatTime(row.original.jam_selesai)}
                </span>
            ),
        },
        {
            accessorKey: "lokasi",
            header: "Lokasi",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.lokasi || "-"}
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
                    <Link href={`/admin/jadwal/jadwal/${row.original.id}/edit`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-200/55 border-emerald-200"
                        >
                            <SquarePenIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/jadwal/jadwal/${row.original.id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-blue-600 hover:text-blue-600 hover:bg-blue-200/55 border-blue-200"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => onDelete(row.original.id, row.original.nama)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
    ];
}

// ─── props ───────────────────────────────────────────────────────────────────

interface ScheduleDataTableProps {
    data: ScheduleData[];
    pagination?: PaginationMeta;
    statusCounts?: ScheduleStatusCounts;
    kelasList?: Kelas[];
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSearchChange?: (q: string) => void;
    onStatusChange?: (status: ActiveScheduleTab) => void;
    onTypeChange?: (type: ScheduleType | "all") => void;
    onKelasChange?: (kelasId: number | null) => void;
    onRefresh?: () => void;
    initialSearch?: string;
    initialStatus?: ActiveScheduleTab;
    initialType?: ScheduleType | "all";
    initialKelasId?: number | null;
    isLoading?: boolean;
}

// ─── component ───────────────────────────────────────────────────────────────

export function ScheduleDataTable({
    data,
    pagination,
    statusCounts,
    kelasList = [],
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onStatusChange,
    onTypeChange,
    onKelasChange,
    onRefresh,
    initialSearch,
    initialStatus,
    initialType = "all",
    initialKelasId,
    isLoading = false,
}: ScheduleDataTableProps) {
    const [activeStatus, setActiveStatus] = React.useState<ActiveScheduleTab>(
        initialStatus ?? "total",
    );
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [tablePagination, setTablePagination] = React.useState<PaginationState>({
        pageIndex: pagination ? pagination.page - 1 : 0,
        pageSize: pagination?.limit ?? 10,
    });

    // ─── delete state ──────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = React.useState<{
        id: number;
        name: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDeleteClick = React.useCallback((id: number, name: string) => {
        setDeleteTarget({ id, name });
    }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const response = await fetch(
                `/api/admin/jadwal/${deleteTarget.id}`,
                { method: "DELETE" }
            );
            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Gagal menghapus jadwal");
                return;
            }

            toast.success(result.message || "Jadwal berhasil dihapus");
            setDeleteTarget(null);
            onRefresh?.();
        } catch {
            toast.error("Terjadi kesalahan saat menghapus jadwal");
        } finally {
            setIsDeleting(false);
        }
    };

    // ──────────────────────────────────────────────────────────────────────

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
        () => getScheduleColumns(handleDeleteClick),
        [handleDeleteClick],
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
            {/* ─── Delete Confirmation Dialog ─────────────────────────────── */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus jadwal{" "}
                            <span className="font-semibold text-foreground">
                                {deleteTarget?.name}
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ─── Table ──────────────────────────────────────────────────── */}
            <Tabs
                value={activeStatus}
                onValueChange={(v) => {
                    const s = v as ActiveScheduleTab;
                    setActiveStatus(s);
                    onStatusChange?.(s);
                }}
                className="w-full flex-col justify-start gap-6"
            >
                <ScheduleTableToolbar
                    table={table}
                    statusCounts={statusCounts}
                    onSearchChange={onSearchChange}
                    onStatusChange={(s) => {
                        setActiveStatus(s);
                        onStatusChange?.(s);
                    }}
                    onTypeChange={onTypeChange}
                    onKelasChange={onKelasChange}
                    initialSearch={initialSearch}
                    initialStatus={activeStatus}
                    initialType={initialType}
                    initialKelasId={initialKelasId}
                    kelasList={kelasList}
                    isLoading={isLoading}
                />

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
                                            {isLoading ? "Memuat..." : "Tidak ada data."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <ScheduleTablePagination table={table} meta={pagination} />
                </TabsContent>
            </Tabs>
        </>
    );
}