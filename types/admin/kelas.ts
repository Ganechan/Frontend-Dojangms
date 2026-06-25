export type KelasStatus = "aktif" | "nonaktif";
export type ActiveKelasTab = "total" | "aktif" | "nonaktif";

export interface Kelas {
  id: number;
  nama: string;
  deskripsi: string;
  status: KelasStatus;
}

export interface KelasStatusCounts {
  total: number;
  aktif: number;
  nonaktif: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface KelasListResponse {
  message: string;
  summary: {
    total_kelas: number;
    total_kelas_aktif: string | number;
    total_kelas_nonaktif: string | number;
  };
  pagination: PaginationMeta;
  data: Kelas[];
}

export const LIMIT_OPTIONS = [10, 25, 50, 75, 100, 200];
