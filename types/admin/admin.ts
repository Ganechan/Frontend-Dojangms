// types/admin/admin.ts

export type AdminStatus = "active" | "inactive";
export type ActiveStatusTab = "total" | AdminStatus;
export type LimitOption = 10 | 25 | 50 | 75 | 100 | 200;

export const LIMIT_OPTIONS: LimitOption[] = [10, 25, 50, 75, 100, 200];

export interface AdminData {
  id: number;
  name: string;
  email: string;
  phone: string;
  foto: string | null;
  jenis_kelamin: string | null;
  alamat: string | null;
  tanggal_lahir: string;
  status: AdminStatus;
  tanggal_bergabung: string;
  updated_at: string;
}

export interface AdminSummary {
  total_admin: number;
  total_admin_active: string;
  total_admin_inactive: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface AdminApiResponse {
  message: string;
  summary: AdminSummary;
  pagination: PaginationMeta;
  data: AdminData[];
}

export interface AdminStatusCounts {
  total: number;
  active: number;
  inactive: number;
}

export interface FetchAdminParams {
  page: number;
  limit: LimitOption;
  search?: string;
  status?: AdminStatus;
}

// ── Detail admin ──────────────────────────────────────────────────────────────

export interface AdminDetail extends AdminData {
  roles: string[];
}

export interface AdminDetailApiResponse {
  message: string;
  data: AdminDetail;
}
