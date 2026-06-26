import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterPayload, BeltOption } from "@/types/auth";

interface UseRegisterReturn {
  isLoading: boolean;
  error: string | null;
  belts: BeltOption[];
  isBeltsLoading: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  fetchBelts: () => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [belts, setBelts] = useState<BeltOption[]>([]);
  const [isBeltsLoading, setIsBeltsLoading] = useState(false);
  const router = useRouter();

  const fetchBelts = async () => {
    // Jangan fetch ulang kalau sudah ada datanya
    if (belts.length > 0) return;

    setIsBeltsLoading(true);
    try {
      // Panggil API Route Next.js — bukan backend langsung
      const res = await fetch("/api/public/belt");
      const data = await res.json();

      if (!res.ok) {
        console.error("Gagal mengambil data sabuk:", data.message);
        return;
      }

      setBelts(data.data);
    } catch {
      console.error("Gagal mengambil data sabuk");
    } finally {
      setIsBeltsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Pendaftaran gagal");
        return;
      }

      // Redirect ke login setelah berhasil daftar
      router.push("/login?registered=true");
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, belts, isBeltsLoading, register, fetchBelts };
}
