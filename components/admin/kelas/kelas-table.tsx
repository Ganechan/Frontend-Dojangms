"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { SquarePenIcon, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Kelas } from "@/types/admin/kelas";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface KelasTableProps {
  data: Kelas[];
  pageCount: number;
  pageSize: number;
  isLoading?: boolean;
  onDeleteSuccess?: () => void;
}

export function KelasTable({
  data,
  pageCount,
  pageSize,
  isLoading = false,
  onDeleteSuccess,
}: KelasTableProps) {
  const [selectedKelas, setSelectedKelas] = React.useState<Kelas | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleSoftDelete = async () => {
    if (!selectedKelas) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `http://localhost:3001/api/admin/kelas/softdeletekelas/${selectedKelas.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menonaktifkan kelas");
      }

      toast.success(result.message || "Kelas berhasil dinonaktifkan");
      setSelectedKelas(null);
      onDeleteSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Kelas>[] = [
    {
      accessorKey: "nama",
      header: "Nama Kelas",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <p className="font-medium">{row.getValue("nama")}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.deskripsi}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "aktif" ? "default" : "secondary"}>
            {status === "aktif" ? "Aktif" : "Tidak Aktif"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Link href={`/admin/kelas/${row.original.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-200/55 border-emerald-200"
            >
              <SquarePenIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
              <span className="sr-only">Edit jadwal</span>
            </Button>
          </Link>
          <Link href={`/admin/kelas/${row.original.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-blue-600 hover:text-blue-600 hover:bg-blue-200/55 border-blue-200"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Detail</span>
              <span className="sr-only">Lihat detail jadwal</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            disabled={row.original.status === "nonaktif"}
            onClick={() => setSelectedKelas(row.original)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Hapus</span>
            <span className="sr-only">Hapus jadwal</span>
          </Button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {isLoading ? (
              [...Array(pageSize || 5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-12 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-48 rounded" />
                      <Skeleton className="h-3 w-32 rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  Tidak ada data kelas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!selectedKelas}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setSelectedKelas(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan Kelas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menonaktifkan kelas{" "}
              <span className="font-semibold text-foreground">
                {selectedKelas?.nama}
              </span>
              ? Kelas ini tidak akan dihapus permanen, namun statusnya akan
              berubah menjadi tidak aktif.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSoftDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Nonaktifkan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}