"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { HolidayDetailData } from "@/types/admin/libur";

interface EditHolidayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday: HolidayDetailData | null;
  onSuccess?: () => void;
}

export function EditHolidayModal({
  open,
  onOpenChange,
  holiday,
  onSuccess,
}: EditHolidayModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    tanggal: "",
    keterangan: "",
  });

  useEffect(() => {
    if (holiday) {
      setFormData({
        tanggal: holiday.tanggal,
        keterangan: holiday.keterangan,
      });
      setErrors({});
    }
  }, [holiday, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tanggal.trim()) {
      newErrors.tanggal = "Tanggal harus diisi";
    }

    if (!formData.keterangan.trim()) {
      newErrors.keterangan = "Keterangan harus diisi";
    } else if (formData.keterangan.trim().length < 3) {
      newErrors.keterangan = "Keterangan minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!holiday) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 🔥 Gunakan internal API
      const response = await fetch(
        `/api/admin/jadwal/edit/libur/${holiday.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tanggal: formData.tanggal,
            keterangan: formData.keterangan,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui libur jadwal");
      }

      toast.success(data.message || "Libur jadwal berhasil diperbarui");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui libur jadwal",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Libur Jadwal</DialogTitle>
          <DialogDescription>
            Perbarui informasi libur jadwal di bawah ini
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium mb-2">
              Tanggal
            </label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.tanggal && (
              <p className="mt-1 text-sm text-destructive">{errors.tanggal}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="keterangan"
              className="block text-sm font-medium mb-2"
            >
              Keterangan
            </label>
            <Textarea
              id="keterangan"
              name="keterangan"
              placeholder="Contoh: Hari libur nasional"
              value={formData.keterangan}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={3}
            />
            {errors.keterangan && (
              <p className="mt-1 text-sm text-destructive">
                {errors.keterangan}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
