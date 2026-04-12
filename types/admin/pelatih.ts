// types\admin\pelatih.ts
export type CoachStatus = "active" | "inactive";
export type ActiveStatusTab = "total" | CoachStatus;
export type LimitOption = 10 | 25 | 50 | 75 | 100 | 200;

export const LIMIT_OPTIONS: LimitOption[] = [10, 25, 50, 75, 100, 200];

export interface CoachData {
  id: number;
  name: string;
  email: string;
  phone: string;
  foto: string | null;
  jenis_kelamin: "laki-laki" | "perempuan";
  alamat: string | null;
  tanggal_lahir: string;
  tanggal_bergabung: string;
  status: CoachStatus;
  pelatih: {
    spesialisasi: string | null;
    sertifikasi: string | null;
  };
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
  kelas_diampu: KelasItem[];
  total_murid: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CoachApiResponse {
  message: string;
  pagination: PaginationMeta;
  data: CoachData[];
}

export interface CoachStatusCounts {
  total: number;
  active: number;
  inactive: number;
}

export interface FetchCoachesParams {
  page: number;
  limit: LimitOption;
  search?: string;
  status?: CoachStatus | "total";
}

export interface KelasItem {
  id: number;
  nama: string;
  status: string;
  jumlah_murid: number;
  jadwal: JadwalItem[];
}

export interface JadwalItem {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string | null;
}

export interface CoachDetail extends CoachData {
  // CoachDetail sama dengan CoachData
  // tambahkan field ekstra dari endpoint detail jika ada
}

export interface CoachDetailApiResponse {
  message: string;
  data: CoachDetail;
}
