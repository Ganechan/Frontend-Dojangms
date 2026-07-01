// components/admin/liburGlobal/add-modal-popup.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddHolidayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddHolidayModal({
  open,
  onOpenChange,
  onSuccess,
}: AddHolidayModalProps) {
  const [tanggal, setTanggal] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [keterangan, setKeterangan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTanggal(undefined);
      setKeterangan("");
      setIsCalendarOpen(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tanggal) {
      toast.error("Pilih tanggal libur terlebih dahulu");
      return;
    }

    if (!keterangan.trim()) {
      toast.error("Keterangan wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        tanggal: format(tanggal, "yyyy-MM-dd"),
        keterangan: keterangan.trim(),
      };

      const res = await fetch("/api/admin/jadwal/libur-global", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message ?? "Gagal menyimpan libur global");
      }

      toast.success(data?.message ?? "Libur global berhasil ditambahkan");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Tambah Libur Global
          </DialogTitle>
          <DialogDescription>
            Tentukan tanggal libur global beserta keterangannya.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-2">
            <Label htmlFor="tanggal-trigger">
              Tanggal Libur <span className="text-destructive">*</span>
            </Label>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="tanggal-trigger"
                  variant="outline"
                  className={cn(
                    "w-full justify-start font-normal",
                    !tanggal && "text-muted-foreground",
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggal
                    ? format(tanggal, "EEEE, dd MMMM yyyy", {
                        locale: localeId,
                      })
                    : "Pilih tanggal…"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={(date) => {
                    setTanggal(date);
                    setIsCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">
              Keterangan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="keterangan"
              placeholder="Contoh: Libur Global Senin Satu"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Menyimpan…" : "Simpan Libur Global"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
