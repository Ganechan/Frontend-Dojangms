//components\admin\jadwal\edit-jadwal-form.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  ScheduleDetailData,
  ScheduleFormType,
  Kelas,
} from "@/types/admin/jadwal";
import {
  detectScheduleFormType,
  mapScheduleDataToFormValues,
  getScheduleFormTypeLabel,
} from "@/lib/jadwal-helper";
import {
  latihanWajibSchema,
  trainingCampSchema,
  kelasRegulerSchema,
  kelasPenggantiSchema,
  type EditScheduleFormInput,
} from "@/lib/jadwal-edit";

interface EditScheduleFormProps {
  scheduleData: ScheduleDetailData;
  kelasList: Kelas[];
  scheduleId: number;
}

const DAYS = [
  { value: "senin", label: "Senin" },
  { value: "selasa", label: "Selasa" },
  { value: "rabu", label: "Rabu" },
  { value: "kamis", label: "Kamis" },
  { value: "jumat", label: "Jumat" },
  { value: "sabtu", label: "Sabtu" },
  { value: "minggu", label: "Minggu" },
];

const STATUS_OPTIONS = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Tidak Aktif" },
];

export function EditScheduleForm({
  scheduleData,
  kelasList,
  scheduleId,
}: EditScheduleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formType = detectScheduleFormType(scheduleData);
  const initialValues = mapScheduleDataToFormValues(scheduleData);

  // Select schema based on form type
  const getSchema = () => {
    switch (formType) {
      case "latihan_wajib":
        return latihanWajibSchema;
      case "training_camp":
        return trainingCampSchema;
      case "kelas_reguler":
        return kelasRegulerSchema;
      case "kelas_pengganti":
        return kelasPenggantiSchema;
      default:
        return latihanWajibSchema;
    }
  };

  const form = useForm<EditScheduleFormInput>({
    resolver: zodResolver(getSchema()),
    defaultValues: initialValues as EditScheduleFormInput,
  });

  const onSubmit = async (values: EditScheduleFormInput) => {
    setIsSubmitting(true);
    try {
      // Prepare payload based on form type
      let payload: any = {
        nama: values.nama,
        lokasi: values.lokasi,
        jam_mulai: values.jam_mulai,
        jam_selesai: values.jam_selesai,
        status: values.status,
      };

      if (formType === "latihan_wajib") {
        payload.hari = (values as any).hari;
      } else if (formType === "training_camp") {
        payload.tanggal_mulai = (values as any).tanggal_mulai;
        payload.tanggal_selesai = (values as any).tanggal_selesai;
      } else if (formType === "kelas_reguler") {
        payload.hari = (values as any).hari;
        payload.effective_from = (values as any).effective_from;
        payload.kelas_id = (values as any).kelas_id;
      } else if (formType === "kelas_pengganti") {
        payload.tanggal = (values as any).tanggal;
        payload.kelas_id = (values as any).kelas_id;
      }

      const response = await fetch(`/api/admin/jadwal/${scheduleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Gagal memperbarui jadwal");
        return;
      }

      toast.success(data.message || "Jadwal berhasil diperbarui");
      router.push(`/admin/jadwal/jadwal/${scheduleId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Terjadi kesalahan saat memperbarui jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Jadwal</CardTitle>
        <CardDescription>
          {getScheduleFormTypeLabel(formType)} - {scheduleData.informasi.nama}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nama Field */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium mb-2">
              Nama Jadwal
            </label>
            <Input
              id="nama"
              placeholder="Contoh: Latihan Wajib - Senin"
              {...form.register("nama")}
            />
            {form.formState.errors.nama && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.nama.message}
              </p>
            )}
          </div>

          {/* Latihan Wajib: Hari */}
          {formType === "latihan_wajib" && (
            <div>
              <label htmlFor="hari" className="block text-sm font-medium mb-2">
                Hari
              </label>
              <Select
                value={form.watch("hari" as any)}
                onValueChange={(value) => form.setValue("hari" as any, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(form.formState.errors as any).hari && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).hari.message}
                </p>
              )}
            </div>
          )}

          {/* Training Camp: Tanggal Mulai */}
          {formType === "training_camp" && (
            <div>
              <label
                htmlFor="tanggal_mulai"
                className="block text-sm font-medium mb-2"
              >
                Tanggal Mulai
              </label>
              <Input
                id="tanggal_mulai"
                type="date"
                {...form.register("tanggal_mulai" as any)}
              />
              {(form.formState.errors as any).tanggal_mulai && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).tanggal_mulai.message}
                </p>
              )}
            </div>
          )}

          {/* Training Camp: Tanggal Selesai */}
          {formType === "training_camp" && (
            <div>
              <label
                htmlFor="tanggal_selesai"
                className="block text-sm font-medium mb-2"
              >
                Tanggal Selesai
              </label>
              <Input
                id="tanggal_selesai"
                type="date"
                {...form.register("tanggal_selesai" as any)}
              />
              {(form.formState.errors as any).tanggal_selesai && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).tanggal_selesai.message}
                </p>
              )}
            </div>
          )}

          {/* Kelas Reguler: Hari */}
          {formType === "kelas_reguler" && (
            <div>
              <label htmlFor="hari" className="block text-sm font-medium mb-2">
                Hari
              </label>
              <Select
                value={form.watch("hari" as any)}
                onValueChange={(value) => form.setValue("hari" as any, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(form.formState.errors as any).hari && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).hari.message}
                </p>
              )}
            </div>
          )}

          {/* Kelas Reguler: Effective From */}
          {formType === "kelas_reguler" && (
            <div>
              <label
                htmlFor="effective_from"
                className="block text-sm font-medium mb-2"
              >
                Tanggal Efektif
              </label>
              <Input
                id="effective_from"
                type="date"
                {...form.register("effective_from" as any)}
              />
              {(form.formState.errors as any).effective_from && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).effective_from.message}
                </p>
              )}
            </div>
          )}

          {/* Kelas Pengganti: Tanggal */}
          {formType === "kelas_pengganti" && (
            <div>
              <label
                htmlFor="tanggal"
                className="block text-sm font-medium mb-2"
              >
                Tanggal
              </label>
              <Input
                id="tanggal"
                type="date"
                {...form.register("tanggal" as any)}
              />
              {(form.formState.errors as any).tanggal && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).tanggal.message}
                </p>
              )}
            </div>
          )}

          {/* Kelas Selection (for both Kelas Reguler and Kelas Pengganti) */}
          {(formType === "kelas_reguler" || formType === "kelas_pengganti") && (
            <div>
              <label
                htmlFor="kelas_id"
                className="block text-sm font-medium mb-2"
              >
                Kelas
              </label>
              <Select
                value={String(form.watch("kelas_id" as any) || "")}
                onValueChange={(value) =>
                  form.setValue("kelas_id" as any, Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={String(kelas.id)}>
                      {kelas.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(form.formState.errors as any).kelas_id && (
                <p className="mt-1 text-sm text-destructive">
                  {(form.formState.errors as any).kelas_id.message}
                </p>
              )}
            </div>
          )}

          {/* Time Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="jam_mulai"
                className="block text-sm font-medium mb-2"
              >
                Jam Mulai
              </label>
              <Input
                id="jam_mulai"
                type="time"
                {...form.register("jam_mulai")}
              />
              {form.formState.errors.jam_mulai && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.jam_mulai.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="jam_selesai"
                className="block text-sm font-medium mb-2"
              >
                Jam Selesai
              </label>
              <Input
                id="jam_selesai"
                type="time"
                {...form.register("jam_selesai")}
              />
              {form.formState.errors.jam_selesai && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.jam_selesai.message}
                </p>
              )}
            </div>
          </div>

          {/* Lokasi Field */}
          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium mb-2">
              Lokasi
            </label>
            <Input
              id="lokasi"
              placeholder="Contoh: Dojang Utama"
              {...form.register("lokasi")}
            />
            {form.formState.errors.lokasi && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.lokasi.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) =>
                form.setValue("status", value as "aktif" | "nonaktif")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
