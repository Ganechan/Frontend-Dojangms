import { z } from "zod";

// ✅ pertahankan nama schema agar file lain tidak perlu banyak berubah
export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  tanggal_lahir: z.string(),
  status: z.enum(["active", "inactive"]),
  created_at: z.string(),
  roles: z.array(z.string()),
  current_belt: z.string().nullable().optional(),
  belt_achieved_at: z.string().nullable().optional(),
});

export type User = z.infer<typeof schema>;

// pagination (sesuai JSON baru)
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total_data: z.number(),
  total_page: z.number(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
});

const numberFromString = z.union([z.number(), z.string()]).transform((v) => {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
});

export const summarySchema = z.object({
  total: z.number(),
  total_murid: numberFromString,
  total_admin: numberFromString,
  total_pelatih: numberFromString,
});

export interface ApiResponse {
  message: string;
  summary: {
    total: number;
    total_murid: number; // sudah jadi number karena transform di atas (kalau dipakai via zod parse)
    total_admin: number;
    total_pelatih: number;
  };
  pagination: {
    page: number;
    limit: number;
    total_data: number;
    total_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
  data: User[];
}

export interface RoleCounts {
  semua: number;
  admin: number;
  pelatih: number;
  murid: number;
}
