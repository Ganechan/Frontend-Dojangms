// hooks/useAuth.ts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginPayload, User } from "@/types/auth";
import { saveClientSession, clearClientSession } from "@/lib/auth";

interface UseAuthReturn {
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Redirect jika akun masih pending
        if (res.status === 403 && data.status === "pending") {
          router.push("/account-pending");
          return;
        }

        // Tampilkan pesan dari backend
        toast.error(data.message || "Login gagal.");
        return;
      }

      // Login berhasil
      const user: User = data.user;

      saveClientSession(user);

      toast.success(data.message || "Login berhasil.");

      redirectByRole(user.roles, router);
    } catch (error) {
      console.error(error);

      toast.error("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      toast.success("Berhasil keluar.");
    } catch {
      toast.error("Gagal logout.");
    } finally {
      clearClientSession();
      setIsLoading(false);
      router.push("/login");
    }
  };

  return {
    isLoading,
    login,
    logout,
  };
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
