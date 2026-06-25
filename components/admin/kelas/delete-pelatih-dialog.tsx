"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainerIds: number[];
  onConfirm: (trainerIds: number[]) => Promise<void>;
  isMultiple?: boolean;
}

export default function DeleteTrainerDialog({
  open,
  onOpenChange,
  trainerIds,
  onConfirm,
  isMultiple = false,
}: DeleteTrainerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(trainerIds);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pelatih</AlertDialogTitle>
          <AlertDialogDescription>
            {isMultiple
              ? `Anda akan menghapus ${trainerIds.length} pelatih. Tindakan ini tidak dapat dibatalkan.`
              : "Anda akan menghapus pelatih ini. Tindakan ini tidak dapat dibatalkan."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
