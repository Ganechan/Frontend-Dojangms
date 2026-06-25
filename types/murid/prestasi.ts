// types/murid/prestasi.ts

export interface PrestasiStatistik {
  total_kejuaraan: number;
  juara1: number;
  juara2: number;
  juara3: number;
  harapan1?: number;
  harapan2?: number;
  peserta?: number;
}

export interface Prestasi {
  kejuaraan_id: number;
  kejuaraan_nama: string;
  level: string;
  location: string;
  year: number;
  start_date: string;
  end_date: string;
  cabang: string;
  hasil: string;
  belt_saat_itu: string;
  kategori_usia: string;
  level_kompetisi: string;
  gender: string;
  label_berat?: string;
  batas_bawah?: number;
  batas_atas?: number;
  jurus?: string | null;
  format_poomsae?: string | null;
  kelas_kejuaraan_detail?: string;
  catatan?: string | null;
  is_edited?: number;
}

export interface PrestasiPage {
  data: Prestasi[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface PrestasiFilters {
  search: string;
  tahun: string;
  level: string;
  hasil: string;
  perPage: number;
  page: number;
}

export const LEVEL_OPTIONS = [
  "Kota",
  "Provinsi",
  "Nasional",
  "Internasional",
] as const;
export const HASIL_OPTIONS = ["Juara 1", "Juara 2", "Juara 3"] as const;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200] as const;

// ---- Fetchers ----------------------------------------------------------

/**
 * Ambil statistik prestasi dari endpoint /api/murid/prestasi/statistik
 */
export async function fetchStatistik(
  signal?: AbortSignal,
): Promise<PrestasiStatistik> {
  const res = await fetch("/api/murid/prestasi/statistik", {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Gagal memuat statistik (${res.status})`);
  }
  const json = await res.json();
  // Response: { success: true, data: { total_kejuaraan, juara1, juara2, juara3, ... } }
  return json.data as PrestasiStatistik;
}

/**
 * Ambil daftar prestasi dengan filter dan pagination.
 * Endpoint: /api/murid/prestasi?page=1&limit=10&search=...&tahun=...&level=...&hasil=...
 */
export async function fetchPrestasi(
  filters: PrestasiFilters,
  signal?: AbortSignal,
): Promise<PrestasiPage> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.perPage));
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.tahun !== "all") params.set("tahun", filters.tahun);
  if (filters.level !== "all") params.set("level", filters.level);
  if (filters.hasil !== "all") params.set("hasil", filters.hasil);

  const res = await fetch(`/api/murid/prestasi?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Gagal memuat riwayat (${res.status})`);
  }
  const json = await res.json();
  // Response: { success: true, data: [...], pagination: { current_page, per_page, total_page, total_data, ... } }
  const data = json.data || [];
  const pagination = json.pagination || {};
  return {
    data,
    total: pagination.total_data || 0,
    page: pagination.current_page || 1,
    perPage: pagination.per_page || 10,
    lastPage: pagination.total_page || 1,
  };
}

// ---- Formatting helpers ------------------------------------------------

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatTanggal(value: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

export function buildYearOptions(): string[] {
  const current = new Date().getFullYear();
  const years: string[] = [];
  for (let year = current; year >= 2010; year--) {
    years.push(String(year));
  }
  return years;
}
