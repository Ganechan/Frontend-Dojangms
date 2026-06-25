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
import { Trash2, Eye, Edit } from "lucide-react";
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((holiday) => (
            <TableRow key={holiday.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{holiday.id}</TableCell>
              <TableCell>{formatDate(holiday.tanggal)}</TableCell>
              <TableCell>{holiday.keterangan}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatCreatedAt(holiday.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/liburGlobal/${holiday.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(holiday)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
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
