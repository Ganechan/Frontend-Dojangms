// types/murid/ujian-sabuk.ts

export interface UjianStatistik {
  total_ujian: number;
  lulus: number;
  tidak_lulus: number;
  terdaftar: number;
  sabuk_saat_ini: {
    id: number;
    nama: string;
    achieved_at: string;
  };
}

export interface UjianData {
  id: number;
  level: string;
  lokasi: string;
  keterangan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

export interface RiwayatUjianItem {
  peserta_ujian_id: number;
  ujian: UjianData;
  status: string;
  tanggal_lulus: string | null;
  tanggal_edit: string | null;
  belt_asal: { id: number; nama: string };
  belt_tujuan: { id: number; nama: string };
}

export interface AlurSabuk {
  id: number;
  belt_id: number;
  nama: string;
  achieved_at: string;
  is_current: boolean;
}

export interface UjianResponse {
  success: boolean;
  message: string;
  data: {
    summary: UjianStatistik;
    riwayat_ujian: RiwayatUjianItem[];
    alur_sabuk: AlurSabuk[];
  };
  pagination: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface Ujian {
  id: number;
  deskripsi: string;
  level: string;
  lokasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  sabukAwal: string;
  sabukTujuan: string;
  tanggalLulus: string | null;
}

export interface UjianPage {
  data: Ujian[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface UjianFilters {
  status: string;
  perPage: number;
  page: number;
}

export interface SabukProgress {
  id: number;
  namaSabuk: string;
  tanggal: string;
  isCurrent: boolean;
}

export interface CurrentBelt {
  namaSabuk: string;
  tanggal: string;
}

export interface BeltTimelineResult {
  current: CurrentBelt | null;
  timeline: SabukProgress[];
}

export const STATUS_OPTIONS = ["Lulus", "Tidak Lulus"] as const;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200] as const;

// ==================== UTILITY FUNCTIONS ====================

export function formatTanggal(value: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function normalizeStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === "lulus" || s === "pass" || s === "passed" || s === "lolos") {
    return "Lulus";
  }
  if (
    s === "tidak_lulus" ||
    s === "fail" ||
    s === "failed" ||
    s.includes("tidak")
  ) {
    return "Tidak Lulus";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function isLulus(status: string): boolean {
  return normalizeStatus(status) === "Lulus";
}

// ==================== BELT COLOR ====================

interface BeltSwatch {
  color: string;
  bordered: boolean;
}

const BELT_COLORS: { test: RegExp; color: string; bordered?: boolean }[] = [
  { test: /putih|white/i, color: "oklch(0.98 0 0)", bordered: true },
  { test: /kuning|yellow/i, color: "oklch(0.86 0.16 95)" },
  { test: /hijau|green/i, color: "oklch(0.7 0.16 150)" },
  { test: /biru|blue/i, color: "oklch(0.62 0.16 250)" },
  { test: /merah|red/i, color: "oklch(0.6 0.2 25)" },
  { test: /coklat|cokelat|brown/i, color: "oklch(0.5 0.09 55)" },
  { test: /hitam|black|dan|poom/i, color: "oklch(0.28 0.01 270)" },
];

export function beltSwatch(namaSabuk: string): BeltSwatch {
  for (const entry of BELT_COLORS) {
    if (entry.test.test(namaSabuk)) {
      return { color: entry.color, bordered: Boolean(entry.bordered) };
    }
  }
  return { color: "oklch(0.7 0.03 260)", bordered: false };
}

// ==================== FETCHERS ====================

export async function fetchStatistik(
  signal?: AbortSignal,
): Promise<UjianStatistik> {
  const res = await fetch("/api/murid/riwayat-ujian?limit=1", { signal });
  if (!res.ok) throw new Error(`Gagal memuat statistik (${res.status})`);
  const json = (await res.json()) as UjianResponse;
  return json.data.summary;
}

export async function fetchUjian(
  filters: UjianFilters,
  signal?: AbortSignal,
): Promise<UjianPage> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.perPage));
  if (filters.status !== "all") params.set("status", filters.status);

  const res = await fetch(`/api/murid/riwayat-ujian?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Gagal memuat riwayat ujian (${res.status})`);
  const json = (await res.json()) as UjianResponse;

  const data = json.data.riwayat_ujian.map((item) => ({
    id: item.peserta_ujian_id,
    deskripsi: item.ujian.keterangan,
    level: item.ujian.level,
    lokasi: item.ujian.lokasi,
    tanggalMulai: item.ujian.tanggal_mulai,
    tanggalSelesai: item.ujian.tanggal_selesai,
    status: normalizeStatus(item.status),
    sabukAwal: item.belt_asal.nama,
    sabukTujuan: item.belt_tujuan.nama,
    tanggalLulus: item.tanggal_lulus,
  }));

  return {
    data,
    total: json.pagination.total_data,
    page: json.pagination.current_page,
    perPage: json.pagination.per_page,
    lastPage: json.pagination.total_page,
  };
}

export async function fetchSabukTimeline(
  signal?: AbortSignal,
): Promise<BeltTimelineResult> {
  const res = await fetch("/api/murid/riwayat-ujian?limit=1", { signal });
  if (!res.ok) throw new Error(`Gagal memuat linimasa sabuk (${res.status})`);
  const json = (await res.json()) as UjianResponse;

  const timeline = json.data.alur_sabuk.map((item) => ({
    id: item.id,
    namaSabuk: item.nama,
    tanggal: item.achieved_at,
    isCurrent: item.is_current,
  }));

  const currentItem =
    timeline.find((item) => item.isCurrent) ?? timeline[timeline.length - 1];
  const current = currentItem
    ? { namaSabuk: currentItem.namaSabuk, tanggal: currentItem.tanggal }
    : null;

  return { current, timeline };
}
