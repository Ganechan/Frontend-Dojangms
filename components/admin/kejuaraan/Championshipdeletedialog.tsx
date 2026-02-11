"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Championship } from "./hooks/useChampionship";

interface ChampionshipDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChampionship: Championship | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ChampionshipDeleteDialog({
  open,
  onOpenChange,
  selectedChampionship,
  onConfirm,
  isSubmitting,
}: ChampionshipDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Hapus Kejuaraan</AlertDialogTitle>
        <AlertDialogDescription>
          Apakah Anda yakin ingin menghapus kejuaraan "
          {selectedChampionship?.name}"? Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
