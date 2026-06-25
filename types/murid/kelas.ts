//types\murid\kelas.ts
export type KelasStatus = "aktif" | "nonaktif";

export interface Kelas {
  id: string | number;
  nama: string;
  deskripsi: string;
  status: KelasStatus;
  tanggalBergabung: string;
  jumlahJadwalAktif: number;
  jumlahPelatih: number;
}

export interface KelasMeta {
  total: number;
  totalAktif: number;
  totalNonaktif: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface KelasResponse {
  data: Kelas[];
  meta: KelasMeta;
}

export type StatusFilter = "all" | KelasStatus;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

/* ---------- Detail Kelas ---------- */

export type AbsensiStatus = "hadir" | "izin" | "sakit" | "alpha";

export interface JadwalLatihan {
  id: string | number;
  jadwal_nama: string; // nama
  hari: string;
  jam_mulai: string; // jamMulai
  jam_selesai: string; // jamSelesai
  lokasi: string;
  effective_from?: string;
  effective_until?: string | null;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
}

export interface StatistikKehadiran {
  total_pertemuan: number; // totalPertemuan
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  persentase_kehadiran: number; // persentaseKehadiran
}

export interface KelasStatistik {
  muridAktif: number;
  pelatihAktif: number;
  totalJadwal: number;
  persentaseKehadiran: number;
}

export interface RiwayatAbsensi {
  absensi_id: number; // tambahan dari response
  tanggal: string;
  jadwal_id: number; // tambahan
  jadwal_nama: string; // bukan jadwalNama
  hari: string;
  jam_mulai: string; // jamMulai
  jam_selesai: string; // jamSelesai
  status: AbsensiStatus;
  catatan?: string;
  waktu_absen: string; // waktu absen
}

export interface KelasDetail {
  id: string | number;
  nama: string;
  deskripsi: string;
  status: KelasStatus;
  tanggal_bergabung: string; // tanggalBergabung
  jumlah_murid_aktif: number; // muridAktif
  jumlah_pelatih_aktif: number; // pelatihAktif
  jadwal: JadwalLatihan[];
  absensi: {
    riwayat: RiwayatAbsensi[];
    statistik: StatistikKehadiran;
  };
}

export type AbsensiStatusFilter = "all" | AbsensiStatus;
