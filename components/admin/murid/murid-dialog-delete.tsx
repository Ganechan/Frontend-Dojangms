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
import { softDeleteMurid } from "@/services/admin/muridService";
import { ApiError } from "@/lib/apiClient";

// ── props ─────────────────────────────────────────────────────────────────────

interface MuridDeleteDialogProps {
  muridId: number;
  muridName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ── component ─────────────────────────────────────────────────────────────────

export function MuridDeleteDialog({
  muridId,
  muridName,
  open,
  onOpenChange,
  onSuccess,
}: MuridDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await softDeleteMurid(muridId);
      toast.success(res.message ?? "Murid berhasil dinonaktifkan");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            toast.error(err.message); // "User sudah dalam status inactive"
            onOpenChange(false);
            break;
          case 401:
            toast.error("Sesi habis, silakan login kembali");
            break;
          case 403:
            toast.error("Anda tidak memiliki akses");
            break;
          case 404:
            toast.error("Murid tidak ditemukan");
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
          <AlertDialogTitle>Nonaktifkan Murid</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menonaktifkan{" "}
            <span className="font-semibold text-foreground">{muridName}</span>?
            <br />
            Murid akan dinonaktifkan dan tidak dapat mengakses sistem.
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