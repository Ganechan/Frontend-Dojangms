export interface GlobalHoliday {
  id: number;
  tanggal: string;
  keterangan: string;
  created_at: string;
}

export interface GlobalHolidayPaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GlobalHolidayListResponse {
  message: string;
  pagination: GlobalHolidayPaginationMeta;
  data: GlobalHoliday[];
}

export const LIMIT_OPTIONS = [10, 25, 50, 75, 100, 200];

export interface ImpactedSchedule {
  jadwal_id: number;
  jadwal_nama: string;
  tipe: "latihan_wajib" | "kelas" | "training_camp";
  hari: string | null;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  kelas: { id: number; nama: string } | null;
  effective_from: string | null;
  effective_until: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
}

export interface GlobalHolidayDetailData {
  id: number;
  tanggal: string;
  keterangan: string;
  created_at: string;
  daftar_jadwal_terdampak: ImpactedSchedule[];
  total_terdampak: number;
}

export interface GlobalHolidayDetailResponse {
  message: string;
  data: GlobalHolidayDetailData;
}
