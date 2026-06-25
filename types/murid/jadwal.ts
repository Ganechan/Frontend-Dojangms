import { KelasStatus } from "./kelas";

export type JadwalProgress = "berlangsung" | "akan_datang" | "selesai";

export const HARI_OPTIONS = [
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
  "minggu",
] as const;

export type Hari = (typeof HARI_OPTIONS)[number];
export type HariFilter = "all" | Hari;

export interface Jadwal {
  id: number | string;
  nama: string; // jadwal_nama
  kelasNama: string; // kelas_nama
  status: KelasStatus; // status (kelas_status)
  progress: JadwalProgress; // status_jadwal
  hari: string; // hari
  jamMulai: string; // jam_mulai
  jamSelesai: string; // jam_selesai
  lokasi: string; // lokasi
  berlakuMulai: string; // effective_from
  berlakuSampai?: string | null; // effective_until
  tipeJadwal?: string; // tipe
  // tambahan lain jika diperlukan
}

export interface JadwalMeta {
  total: number;
  totalAktif: number;
  totalHariIni: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JadwalResponse {
  data: Jadwal[];
  meta: JadwalMeta;
}
