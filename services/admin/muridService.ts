// services\admin\muridService.ts
import { apiFetch } from "@/lib/apiClient";
import type {
  FetchMuridParams,
  LimitOption,
  MuridApiResponse,
  MuridDetailApiResponse,
  UpdateMuridPayload,
  UpdateMuridResponse,
  BeltListApiResponse,
} from "@/types/admin/murid";

export async function fetchMurid({
  page,
  limit,
  search,
  status,
}: FetchMuridParams): Promise<MuridApiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);

  // panggil Next.js Route Handler, bukan langsung ke backend
  return apiFetch<MuridApiResponse>(`/api/admin/murid?${params.toString()}`, {
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

export async function fetchMuridById(
  id: number,
): Promise<MuridDetailApiResponse> {
  return apiFetch<MuridDetailApiResponse>(`/api/admin/murid/${id}`, {
    cache: "no-store",
  });
}

export async function fetchBelts(): Promise<BeltListApiResponse> {
  return apiFetch<BeltListApiResponse>(`/api/public/belt`, {
    cache: "no-store",
  });
}

export async function updateMurid(
  id: number,
  payload: UpdateMuridPayload,
): Promise<UpdateMuridResponse> {
  return apiFetch<UpdateMuridResponse>(`/api/admin/murid/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
