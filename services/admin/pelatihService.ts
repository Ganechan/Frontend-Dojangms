// services\admin\pelatihService.ts
import { apiFetch } from "@/lib/apiClient";
import type {
  CoachApiResponse,
  CoachDetailApiResponse,
  FetchCoachesParams,
  LimitOption,
  UpdatePelatihPayload,
  UpdatePelatihResponse,
  AddSertifikasiPayload,
  AddSertifikasiResponse,
} from "@/types/admin/pelatih";

export async function fetchPelatihById(
  id: number,
): Promise<CoachDetailApiResponse> {
  return apiFetch<CoachDetailApiResponse>(`/api/admin/pelatih/${id}`, {
    cache: "no-store",
  });
}

export async function fetchPelatih({
  page,
  limit,
  search,
  status,
}: FetchCoachesParams): Promise<CoachApiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) params.set("search", search.trim());
  if (status && status !== "total") params.set("status", status);

  // panggil Next.js Route Handler, bukan langsung ke backend
  // browser hanya tahu /api/pelatih, tidak tahu URL backend
  return apiFetch<CoachApiResponse>(`/api/admin/pelatih?${params.toString()}`, {
    cache: "no-store",
  });
}

export function sanitizeLimit(raw: string | null): LimitOption {
  const valid: LimitOption[] = [10, 25, 50, 75, 100, 200];
  const n = raw ? parseInt(raw, 10) : NaN;
  return valid.includes(n as LimitOption) ? (n as LimitOption) : 10;
}

export function sanitizePage(raw: string | null): number {
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export async function updatePelatih(
  id: number,
  payload: UpdatePelatihPayload,
): Promise<UpdatePelatihResponse> {
  return apiFetch<UpdatePelatihResponse>(`/api/admin/pelatih/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ── Tambah sertifikasi baru ───────────────────────────────────────────────────
export async function addSertifikasiPelatih(
  pelatihId: number,
  payload: AddSertifikasiPayload,
): Promise<AddSertifikasiResponse> {
  return apiFetch<AddSertifikasiResponse>(
    `/api/admin/pelatih/${pelatihId}/sertifikasi`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

// ── Hapus sertifikasi ─────────────────────────────────────────────────────────
export async function deleteSertifikasiPelatih(
  pelatihId: number,
  sertifikasiId: number,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    `/api/admin/pelatih/${pelatihId}/sertifikasi/${sertifikasiId}`,
    { method: "DELETE" },
  );
}

// ── Soft delete pelatih ───────────────────────────────────────────────────────
export async function softDeletePelatih(
  id: number,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/admin/pelatih/${id}`, {
    method: "DELETE",
  });
}
