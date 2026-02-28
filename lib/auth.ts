import { AuthSession, User } from "@/types/auth";

const SESSION_KEY = "auth_session";

/**
 * Simpan session ke sessionStorage (hanya data non-sensitif).
 * Token TIDAK disimpan di sini — token hanya ada di httpOnly cookie
 * yang di-set oleh API Route server-side.
 */
export function saveClientSession(user: User): void {
  if (typeof window === "undefined") return;
  // Hanya simpan data user (bukan token) di client storage
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getClientSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearClientSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Cek apakah user punya role tertentu
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Cek apakah user punya salah satu dari beberapa role
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}
