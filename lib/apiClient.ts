const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { timeout = 10_000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
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
