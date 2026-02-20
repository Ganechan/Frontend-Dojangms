import { z } from "zod";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  tanggal_lahir: z.string(),
  status: z.enum(["active", "inactive"]),
  created_at: z.string(),
  roles: z.array(z.string()),
  current_belt: z.string(),
  belt_achieved_at: z.string(),
});

export type User = z.infer<typeof schema>;

export interface ApiResponse {
  message: string;
  meta: {
    page: number;
    limit: number;
    total_data: number;
    total_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
  total: number;
  totalMurid: number;
  totalAdmin: number; // ✅ TAMBAHKAN
  totalPelatih: number; // ✅ TAMBAHKAN
  data: User[];
}

// ✅ NEW: Type untuk role counts
export interface RoleCounts {
  semua: number;
  admin: number;
  pelatih: number;
  murid: number;
}
