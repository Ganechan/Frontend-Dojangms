"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateKelasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: any) => void;
}

export function CreateKelasModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateKelasModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    status: "aktif",
  });

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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
    if (errors.status) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.status;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama kelas harus diisi";
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = "Nama kelas minimal 3 karakter";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi harus diisi";
    } else if (formData.deskripsi.trim().length < 10) {
      newErrors.deskripsi = "Deskripsi minimal 10 karakter";
    }

    if (!formData.status) {
      newErrors.status = "Status harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/kelas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          deskripsi: formData.deskripsi,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Gagal menambahkan kelas");
        return;
      }

      toast.success(data.message || "Kelas berhasil ditambahkan");

      // Reset Form State
      setFormData({
        nama: "",
        deskripsi: "",
        status: "aktif",
      });
      setErrors({});

      // Jalankan fungsi success callback dan tutup modal
      if (onSuccess) {
        onSuccess(data.data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating kelas:", error);
      toast.error("Terjadi kesalahan saat menambahkan kelas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Tambah Kelas
          </DialogTitle>
          <DialogDescription>
            Masukkan informasi detail untuk membuat program kelas pelatihan
            baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Nama Kelas */}
          <div className="space-y-2">
            <label
              htmlFor="nama"
              className="text-sm font-medium text-neutral-800"
            >
              Nama Kelas
            </label>
            <Input
              id="nama"
              name="nama"
              placeholder="Contoh: Kelas Taekwondo Pemula"
              value={formData.nama}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={
                errors.nama
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.nama && (
              <p className="text-xs font-medium text-destructive">
                {errors.nama}
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label
              htmlFor="deskripsi"
              className="text-sm font-medium text-neutral-800"
            >
              Deskripsi
            </label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Contoh: Kelas khusus pemula usia 7-12 tahun dengan fokus materi dasar..."
              value={formData.deskripsi}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={4}
              className={
                errors.deskripsi
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.deskripsi && (
              <p className="text-xs font-medium text-destructive">
                {errors.deskripsi}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-neutral-800"
            >
              Status Kelas
            </label>
            <Select
              value={formData.status}
              onValueChange={handleSelectChange}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={
                  errors.status
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs font-medium text-destructive">
                {errors.status}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-sm">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Tambah Kelas"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
