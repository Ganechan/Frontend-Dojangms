// hooks\Useauth.ts
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
      // Panggil API Route Next.js (bukan backend langsung)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
      }

      // Simpan hanya data user (non-sensitif) di client
      const user: User = data.user;
      saveClientSession(user);

      // Redirect berdasarkan role
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

function redirectByRole(
  roles: string[],
  router: ReturnType<typeof useRouter>,
): void {
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
