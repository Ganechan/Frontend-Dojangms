import { apiFetch } from "@/lib/apiClient";
import type {
  BeltApiResponse,
  CreateMuridApiResponse,
  CreateMuridPayload,
} from "@/types/admin/pendaftaran";

export async function fetchBelts(): Promise<BeltApiResponse> {
  return apiFetch<BeltApiResponse>("/api/public/belt", {
    cache: "no-store",
  });
}

export async function createMurid(
  payload: CreateMuridPayload,
): Promise<CreateMuridApiResponse> {
  return apiFetch<CreateMuridApiResponse>("/api/admin/anggota/pendaftaran", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
