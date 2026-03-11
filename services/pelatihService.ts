import { apiFetch } from "@/lib/apiClient";
import type {
  CoachApiResponse,
  FetchCoachesParams,
  LimitOption,
} from "@/types/pelatih";

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

  return apiFetch<CoachApiResponse>(
    `/api/admin/get/user/pelatih?${params.toString()}`,
    { cache: "no-store" },
  );
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
