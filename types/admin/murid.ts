// types\admin\murid.ts
export type MuridStatus = "active" | "inactive";
export type ActiveStatusTab = "total" | MuridStatus;
export type LimitOption = 10 | 25 | 50 | 75 | 100 | 200;

export const LIMIT_OPTIONS: LimitOption[] = [10, 25, 50, 75, 100, 200];

export interface MuridData {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status: MuridStatus;
  created_at: string;
  current_belt: string;
  belt_achieved_at: string;
}

export interface MuridSummary {
  total_murid: number;
  total_murid_active: string;
  total_murid_inactive: string;
  total_per_belt: Record<string, number>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface MuridApiResponse {
  message: string;
  summary: MuridSummary;
  pagination: PaginationMeta;
  data: MuridData[];
}

export interface MuridStatusCounts {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

export interface FetchMuridParams {
  page: number;
  limit: LimitOption;
  search?: string;
  status?: MuridStatus;
}

// ── Tipe khusus untuk detail murid ───────────────────────────────────────────

export interface BeltEntry {
  name: string;
  dan_level: number | null;
  achieved_at: string;
}

export interface BeltHistoryEntry extends BeltEntry {
  is_current: number;
}

export interface MuridDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: MuridStatus;
  tanggal_lahir: string;
  created_at: string;
  roles: string[];
  current_belt: BeltEntry | null;
  belt_history: BeltHistoryEntry[];
}

export interface MuridDetailApiResponse {
  message: string;
  data: MuridDetail;
}

export interface BeltOption {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

export interface BeltListApiResponse {
  message: string;
  data: BeltOption[];
}

// Update Murid
export interface UpdateMuridPayload {
  name?: string;
  email?: string;
  phone?: string;
  tanggal_lahir?: string;
  status?: MuridStatus;
  belt_id?: number;
  belt_achieved_at?: string;
}

export interface UpdateMuridResponse {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    tanggal_lahir: string;
    tahun_lahir: number;
    status: MuridStatus;
    sabuk_saat_ini?: {
      id: number;
      name: string;
    };
  };
}
