// lib\jadwal-edit.ts
import { z } from "zod";

const statusField = z.enum(["aktif", "nonaktif"], {
  required_error: "Status wajib dipilih",
});

// Base schema with common fields
const baseSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama jadwal harus diisi")
    .min(3, "Nama minimal 3 karakter"),
  lokasi: z
    .string()
    .min(1, "Lokasi harus diisi")
    .min(3, "Lokasi minimal 3 karakter"),
  jam_mulai: z.string().regex(/^\d{2}:\d{2}$/, "Format jam harus HH:MM"),
  jam_selesai: z.string().regex(/^\d{2}:\d{2}$/, "Format jam harus HH:MM"),
  status: statusField,
});

/**
 * Latihan Wajib schema
 */
export const latihanWajibSchema = baseSchema.extend({
  hari: z.string().min(1, "Hari harus dipilih"),
});

export type LatihanWajibFormInput = z.infer<typeof latihanWajibSchema>;

/**
 * Training Camp schema
 */
export const trainingCampSchema = baseSchema.extend({
  tanggal_mulai: z.string().min(1, "Tanggal mulai harus diisi"),
  tanggal_selesai: z.string().min(1, "Tanggal selesai harus diisi"),
});

export type TrainingCampFormInput = z.infer<typeof trainingCampSchema>;

/**
 * Kelas Reguler schema
 */
export const kelasRegulerSchema = baseSchema.extend({
  hari: z.string().min(1, "Hari harus dipilih"),
  effective_from: z.string().min(1, "Tanggal efektif harus diisi"),
  kelas_id: z.number().int().positive("Kelas harus dipilih"),
});

export type KelasRegulerFormInput = z.infer<typeof kelasRegulerSchema>;

/**
 * Kelas Pengganti schema
 */
export const kelasPenggantiSchema = baseSchema.extend({
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  kelas_id: z.number().int().positive("Kelas harus dipilih"),
});

export type KelasPenggantiFormInput = z.infer<typeof kelasPenggantiSchema>;

/**
 * Discriminated union type for all schedule forms
 */
export type EditScheduleFormInput =
  | LatihanWajibFormInput
  | TrainingCampFormInput
  | KelasRegulerFormInput
  | KelasPenggantiFormInput;
