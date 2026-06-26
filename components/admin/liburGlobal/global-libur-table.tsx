// components\admin\liburGlobal\global-libur-table.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, SquarePenIcon } from "lucide-react";
import type { GlobalHoliday } from "@/types/admin/libur-global";
import { EditGlobalHolidayModal } from "./global-libur-edit-modal";

interface GlobalHolidayTableProps {
  data: GlobalHoliday[];
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatCreatedAt = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function GlobalHolidayTable({
  data,
  onDelete,
  isDeleting,
}: GlobalHolidayTableProps) {
  // State untuk mengontrol modal edit dan menyimpan data holiday yang dipilih
  const [selectedHoliday, setSelectedHoliday] = useState<GlobalHoliday | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);

  // Handler untuk tombol edit
  const handleEdit = (holiday: GlobalHoliday) => {
    setSelectedHoliday(holiday);
    setShowEditModal(true);
  };

  if (data.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Tidak ada data libur global
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((holiday) => (
            <TableRow key={holiday.id}>
              <TableCell>{formatDate(holiday.tanggal)}</TableCell>
              <TableCell>{holiday.keterangan}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatCreatedAt(holiday.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-200/55 border-emerald-200"
                    onClick={() => handleEdit(holiday)}
                  >
                    <SquarePenIcon className="h-4 w-4" />
                  </Button>

                  <Link href={`/admin/liburGlobal/${holiday.id}`}>
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
                    onClick={() => onDelete?.(holiday.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal edit dengan holiday yang dipilih */}
      <EditGlobalHolidayModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        holiday={selectedHoliday}
        onSuccess={() => {
          // Refresh data setelah update berhasil
          window.location.reload();
        }}
      />
    </div>
  );
}

