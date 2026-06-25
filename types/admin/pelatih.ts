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
    sertifikasi: SertifikasiItem[];
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

export interface CoachSummary {
  total_pelatih: number;
  total_pelatih_active: string;
  total_pelatih_inactive: string;
  total_per_belt: Record<string, number>;
}

export interface CoachApiResponse {
  message: string;
  summary: CoachSummary;
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

export interface UpdatePelatihPayload {
  name?: string;
  email?: string;
  phone?: string;
  tanggal_lahir?: string;
  status?: CoachStatus;
  belt_id?: number;
  belt_achieved_at?: string;
  spesialisasi?: string;
  sertifikasi?: { id: number; nama: string }[];
}

export interface UpdatePelatihResponse {
  message: string;
  data: {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    tanggal_lahir: string;
    tahun_lahir: number;
    status: CoachStatus;
    sabuk_saat_ini?: { id: number; name: string };
    pelatih?: {
      spesialisasi: string | null;
      bio: string | null;
      sertifikasi: SertifikasiItem[];
    };
  };
}

export interface SertifikasiItem {
  id: number;
  nama: string;
}

export interface AddSertifikasiPayload {
  nama_sertifikasi: string;
}

export interface AddSertifikasiResponse {
  message: string;
  data: {
    id: number;
    pelatih_id: number;
    nama_sertifikasi: string;
  };
}

export interface EditSertifikasiPayload {
  sertifikasi: { id: number; nama: string }[];
}
