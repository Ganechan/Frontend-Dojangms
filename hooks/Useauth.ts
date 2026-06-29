// hooks/useAuth.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPayload, User } from "@/types/auth";
import { saveClientSession, clearClientSession } from "@/lib/auth";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika status 403 dan kita punya field status
        if (res.status === 403) {
          if (data.status === "pending") {
            router.push("/account-pending");
            return;
          }
          if (data.status === "rejected" || data.status === "inactive") {
            setError("Akun Anda tidak aktif atau ditolak. Silakan hubungi admin.");
            return;
          }
          // Fallback jika status tidak ada (misal backend lama)
          // Kita coba deteksi dari pesan? Atau anggap pending?
          // Lebih aman: tetap tampilkan error
          setError(data.message || "Akun tidak aktif");
          return;
        }
        // Error lainnya (401, 500)
        setError(data.message || "Login gagal");
        return;
      }

      // Login sukses
      const user: User = data.user;
      saveClientSession(user);
      redirectByRole(user.roles, router);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      clearClientSession();
      setIsLoading(false);
      router.push("/login");
    }
  };

  return { isLoading, error, login, logout };
}

function redirectByRole(roles: string[], router: ReturnType<typeof useRouter>): void {
  if (roles.includes("admin")) {
    router.push("/admin");
  } else if (roles.includes("pelatih")) {
    router.push("/pelatih");
  } else if (roles.includes("murid")) {
    router.push("/murid");
  } else {
    router.push("/dashboard");
  }
}