// services/admin/adminService.ts
import { apiFetch } from "@/lib/apiClient";
import type {
  AdminApiResponse,
  AdminDetailApiResponse,
  UpdateAdminPayload,
  UpdateAdminResponse,
  FetchAdminParams,
  LimitOption,
} from "@/types/admin/admin";

export async function fetchAdmin({
  page,
  limit,
  search,
  status,
}: FetchAdminParams): Promise<AdminApiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);

  return apiFetch<AdminApiResponse>(`/api/admin/admin?${params.toString()}`, {
    cache: "no-store",
  });
}

export async function fetchAdminById(
  id: number,
): Promise<AdminDetailApiResponse> {
  return apiFetch<AdminDetailApiResponse>(`/api/admin/admin/${id}`, {
    cache: "no-store",
  });
}

export async function softDeleteAdmin(
  id: number,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/admin/admin/${id}`, {
    method: "DELETE",
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

// ── Update admin ──────────────────────────────────────────────────────────────
export async function updateAdmin(
  id: number,
  payload: UpdateAdminPayload,
): Promise<UpdateAdminResponse> {
  return apiFetch<UpdateAdminResponse>(`/api/admin/admin/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}