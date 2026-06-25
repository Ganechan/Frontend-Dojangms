"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentCount: number;
  isBulk: boolean;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteStudentDialog({
  open,
  onOpenChange,
  studentCount,
  isBulk,
  onConfirm,
}: DeleteStudentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Murid</AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk
              ? `Apakah Anda yakin ingin menghapus ${studentCount} murid? Data akan dihapus secara permanen dan tidak dapat dikembalikan.`
              : "Apakah Anda yakin ingin menghapus murid ini? Data akan dihapus secara permanen dan tidak dapat dikembalikan."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
