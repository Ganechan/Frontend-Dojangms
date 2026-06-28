// lib\profile\profile-edit-schema.ts
import { z } from "zod";

// Only digits allowed (optionally a leading +) for phone numbers.
const phoneRegex = /^\+?\d+$/;

export const profileEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama minimal 3 karakter"),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  phone: z
    .string()
    .trim()
    .min(1, "Nomor HP wajib diisi")
    .regex(phoneRegex, "Nomor HP hanya boleh berisi angka"),
  alamat: z.string().trim().optional(),
  jenis_kelamin: z.string().optional(),
  nama_wali: z.string().trim().optional(),
  no_wali: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Nomor HP wali hanya boleh berisi angka",
    }),
});

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
