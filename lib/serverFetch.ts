// lib\serverFetch.ts
import { cookies } from "next/headers";
import { ApiError } from "./apiClient";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

interface ServerFetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Dipakai HANYA di server (Route Handler / Server Component).
 * Otomatis membaca auth_token dari cookie httpOnly dan meneruskannya ke backend.
 */
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const { timeout = 10_000, ...fetchOptions } = options;

  // baca auth_token — nama cookie sesuai middleware.ts
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
    });

    if (!res.ok) {
      throw new ApiError(res.status, `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
