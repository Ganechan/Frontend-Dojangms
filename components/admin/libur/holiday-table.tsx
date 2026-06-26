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
import type { HolidaySchedule } from "@/types/admin/libur";
import { SCHEDULE_TYPE_LABELS } from "@/types/admin/libur";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { EditHolidayModal } from "./edit-modal-popup";

interface HolidayTableProps {
  data: HolidaySchedule[];
  pageCount: number;
  pageSize: number;
  isLoading?: boolean;
  onDeleteSuccess?: () => void;
  onEditSuccess?: () => void;
}

export function HolidayTable({
  data,
  pageCount,
  pageSize,
  isLoading = false,
  onDeleteSuccess,
  onEditSuccess,
}: HolidayTableProps) {
  const [selectedHoliday, setSelectedHoliday] =
    React.useState<HolidaySchedule | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [holidayToEdit, setHolidayToEdit] =
    React.useState<HolidaySchedule | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getScheduleTypeBadgeColor = (
    type: "latihan_wajib" | "kelas" | "training_camp",
  ) => {
    switch (type) {
      case "latihan_wajib":
        return "default";
      case "kelas":
        return "secondary";
      case "training_camp":
        return "outline";
      default:
        return "default";
    }
  };

  // FUNGSI HAPUS MENGGUNAKAN INTERNAL API
  const handleDelete = async () => {
    if (!selectedHoliday) return;

    try {
      setIsDeleting(true);

      // Menggunakan endpoint internal Next.js (bukan langsung ke backend)
      const response = await fetch(
        `/api/admin/libur-jadwal/delete/${selectedHoliday.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus jadwal libur");
      }

      toast.success(result.message || "Jadwal libur berhasil dihapus");
      setSelectedHoliday(null);
      onDeleteSuccess?.(); // Memicu refresh data setelah berhasil menghapus
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<HolidaySchedule>[] = [
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.getValue("tanggal")),
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }) => row.getValue("keterangan"),
    },
    {
      accessorKey: "jadwal_nama",
      header: "Jadwal",
      cell: ({ row }) => row.getValue("jadwal_nama"),
    },
    {
      accessorKey: "jadwal_tipe",
      header: "Tipe",
      cell: ({ row }) => {
        const tipe = row.getValue("jadwal_tipe") as
          | "latihan_wajib"
          | "kelas"
          | "training_camp";
        return (
          <Badge variant={getScheduleTypeBadgeColor(tipe)}>
            {SCHEDULE_TYPE_LABELS[tipe]}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-200/55 border-emerald-200"
            onClick={() => setHolidayToEdit(row.original)}
          >
            <SquarePenIcon className="h-4 w-4" />
          </Button>

          <Link href={`/admin/libur/${row.original.id}`}>
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
            onClick={() => setSelectedHoliday(row.original)}
          >
            <Trash2 className="h-4 w-4" />
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
    manualPagination: true, // Agar pagination dikontrol oleh parent
    pageCount,
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
                    <Skeleton className="h-4 w-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-44 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
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
                  Tidak ada data libur jadwal
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog
        open={!!selectedHoliday}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setSelectedHoliday(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal Libur</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jadwal libur pada{" "}
              <span className="font-semibold text-foreground">
                {selectedHoliday ? formatDate(selectedHoliday.tanggal) : ""}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
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
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Edit Pop-up */}
      <EditHolidayModal
        open={!!holidayToEdit}
        onOpenChange={(open) => {
          if (!open) setHolidayToEdit(null);
        }}
        holiday={holidayToEdit}
        onSuccess={() => {
          setHolidayToEdit(null);
          onEditSuccess?.();
        }}
      />
    </div>
  );
}