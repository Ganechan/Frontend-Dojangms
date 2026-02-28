// components/admin/kejuaraan/championship-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Championship {
  id?: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
  status: "akan datang" | "berlangsung" | "selesai";
}

interface ChampionshipFormProps {
  initialData?: Championship;
  isEditMode?: boolean;
  onSubmit?: (data: Championship) => Promise<void>;
}

const LEVEL_OPTIONS = ["kota", "provinsi", "nasional", "internasional"];

const STATUS_BADGE: Record<
  Championship["status"],
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  "akan datang": {
    label: "Akan Datang",
    variant: "outline",
    className: "border-blue-500 text-blue-600 bg-blue-50",
  },
  berlangsung: {
    label: "Berlangsung",
    variant: "outline",
    className: "border-green-500 text-green-600 bg-green-50",
  },
  selesai: {
    label: "Selesai",
    variant: "outline",
    className: "border-gray-400 text-gray-600 bg-gray-50",
  },
};

export function ChampionshipForm({
  initialData,
  isEditMode = false,
  onSubmit,
}: ChampionshipFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Championship>(
    initialData || {
      name: "",
      level: "",
      location: "",
      start_date: "",
      end_date: "",
      status: "akan datang",
    },
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nama kejuaraan wajib diisi";
    if (!formData.level) newErrors.level = "Tingkat kejuaraan wajib dipilih";
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi";
    if (!formData.start_date)
      newErrors.start_date = "Tanggal mulai wajib diisi";
    if (!formData.end_date) newErrors.end_date = "Tanggal berakhir wajib diisi";

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date =
          "Tanggal berakhir harus lebih besar dari tanggal mulai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon periksa kembali form anda");
      return;
    }

    try {
      setLoading(true);

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const endpoint = isEditMode
          ? `http://localhost:3001/api/admin/update/championship/${formData.id}`
          : `http://localhost:3001/api/admin/create/championship`;

        // Exclude status from payload saat edit (ditentukan backend)
        const { status, ...payloadWithoutStatus } = formData;
        const payload = isEditMode ? payloadWithoutStatus : formData;

        const response = await fetch(endpoint, {
          method: isEditMode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Gagal menyimpan data");
        }

        toast.success(
          isEditMode
            ? "Kejuaraan berhasil diperbarui"
            : "Kejuaraan berhasil ditambahkan",
        );

        router.push("/admin/kejuaraan");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const statusBadge = STATUS_BADGE[formData.status];

  return (
    <div className="px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/kejuaraan"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit Kejuaraan" : "Tambah Kejuaraan Baru"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditMode
            ? "Perbarui informasi kejuaraan taekwondo"
            : "Buat kejuaraan taekwondo baru"}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama Kejuaraan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Contoh: Open Tournament 2024"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Level and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="level"
                className="text-sm font-medium text-gray-700"
              >
                Tingkat <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
              >
                <SelectTrigger className={errors.level ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-500">{errors.level}</p>
              )}
            </div>

            {/* Status sebagai Badge (hanya tampil saat edit) */}
            {isEditMode && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <div className="flex items-center h-9 mt-1">
                  <Badge
                    variant={statusBadge.variant}
                    className={statusBadge.className}
                  >
                    {statusBadge.label}
                  </Badge>
                  <span className="ml-2 text-xs text-gray-400">
                    Ditentukan otomatis
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Location Field */}
          <div>
            <Label
              htmlFor="location"
              className="text-sm font-medium text-gray-700"
            >
              Lokasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="Contoh: Jakarta Convention Center"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="start_date"
                className="text-sm font-medium text-gray-700"
              >
                Tanggal Mulai <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="end_date"
                className="text-sm font-medium text-gray-700"
              >
                Tanggal Berakhir <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={loading}
              onClick={() => router.push("/admin/kejuaraan")}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
