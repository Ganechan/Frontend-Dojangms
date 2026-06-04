// components/admin/admin/admin-delete-dialog.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { softDeleteAdmin } from "@/services/admin/adminService";
import { ApiError } from "@/lib/apiClient";

interface AdminDeleteDialogProps {
  adminId: number;
  adminName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminDeleteDialog({
  adminId,
  adminName,
  open,
  onOpenChange,
  onSuccess,
}: AdminDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await softDeleteAdmin(adminId);
      toast.success(res.message ?? "Admin berhasil dinonaktifkan");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            toast.error(err.message);
            onOpenChange(false);
            break;
          case 401:
            toast.error("Sesi habis, silakan login kembali");
            break;
          case 403:
            toast.error("Anda tidak memiliki akses");
            break;
          case 404:
            toast.error("Admin tidak ditemukan");
            onOpenChange(false);
            break;
          default:
            toast.error("Terjadi kesalahan server");
        }
      } else {
        toast.error("Gagal terhubung ke server");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nonaktifkan Admin</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menonaktifkan{" "}
            <span className="font-semibold text-foreground">{adminName}</span>?
            <br />
            Admin akan dinonaktifkan dan tidak dapat mengakses sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isDeleting ? "Memproses..." : "Ya, Nonaktifkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
