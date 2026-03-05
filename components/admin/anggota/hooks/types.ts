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
  // ❌ roles dihapus karena tidak ada di response baru
  current_belt: z.string().nullable().optional(),
  belt_achieved_at: z.string().nullable().optional(),
});

export type User = z.infer<typeof schema>;

// pagination (sesuai JSON)
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

// ✅ summary baru dari endpoint /murid
export const summarySchema = z.object({
  total_murid: numberFromString,
  total_murid_active: numberFromString,
  total_murid_inactive: numberFromString,
  total_per_belt: z.record(z.string(), numberFromString).optional(),
});

export interface ApiResponse {
  message: string;
  summary: {
    total_murid: number;
    total_murid_active: number;
    total_murid_inactive: number;
    total_per_belt?: Record<string, number>;
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

// ✅ counts untuk toolbar baru (Total | Active | Inactive)
export interface StatusCounts {
  total: number;
  active: number;
  inactive: number;
}
