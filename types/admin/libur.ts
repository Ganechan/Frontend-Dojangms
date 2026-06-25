export interface HolidaySchedule {
  id: number;
  jadwal_id: number;
  tanggal: string;
  keterangan: string;
  created_at: string;
  jadwal_nama: string;
  jadwal_tipe: 'latihan_wajib' | 'kelas' | 'training_camp';
}

export interface HolidayPaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface HolidayApiResponse {
  message: string;
  pagination: HolidayPaginationMeta;
  data: HolidaySchedule[];
}

export const LIMIT_OPTIONS = [10, 25, 50, 75, 100, 200];

export const SCHEDULE_TYPE_LABELS: Record<string, string> = {
  latihan_wajib: 'Latihan Wajib',
  kelas: 'Kelas',
  training_camp: 'Training Camp',
};

export interface HolidayDetailData {
  id: number;
  jadwal_id: number;
  tanggal: string;
  keterangan: string;
  created_at: string;
  jadwal_nama: string;
  jadwal_tipe: 'latihan_wajib' | 'kelas' | 'training_camp';
}

export interface HolidayDetailResponse {
  message: string;
  data: HolidayDetailData;
}
