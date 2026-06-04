"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ApiError } from "@/lib/apiClient";
import { createMurid, fetchBelts } from "@/services/admin/pendaftaranService";
import type { Belt, AddMuridFormState } from "@/types/admin/pendaftaran";
import { INITIAL_ADD_MURID_FORM } from "@/types/admin/pendaftaran";

export function AddUserForm() {
  const router = useRouter();

  const [belts, setBelts] = useState<Belt[]>([]);
  const [loadingBelts, setLoadingBelts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddMuridFormState>(
    INITIAL_ADD_MURID_FORM,
  );

  // ── Fetch daftar sabuk ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadBelts() {
      try {
        const res = await fetchBelts();
        if (!cancelled) setBelts(res.data);
      } catch {
        if (!cancelled) toast.error("Gagal memuat data sabuk");
      } finally {
        if (!cancelled) setLoadingBelts(false);
      }
    }

    loadBelts();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Handler ───────────────────────────────────────────────────────────────
  const handleChange = (field: keyof AddMuridFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createMurid({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        tanggal_lahir: formData.tanggal_lahir,
        roles: ["murid"],
        status: formData.status,
        belt_id: Number(formData.belt_id),
      });

      toast.success("Akun murid berhasil dibuat");
      router.push("/admin/anggota/pendaftaran");
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 401:
            toast.error("Sesi habis, silakan login kembali");
            router.push("/login");
            break;
          case 403:
            toast.error("Anda tidak memiliki akses ke halaman ini");
            router.push("/admin");
            break;
          case 422:
            toast.error("Data tidak valid, periksa kembali isian form");
            break;
          default:
            toast.error("Terjadi kesalahan server");
        }
      } else {
        toast.error("Gagal terhubung ke server");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          placeholder="Budi Santoso"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="budi@gmail.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimal 8 karakter"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">No. HP</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="081234567890"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
        <Input
          id="tanggal_lahir"
          type="date"
          value={formData.tanggal_lahir}
          onChange={(e) => handleChange("tanggal_lahir", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="belt">Sabuk</Label>
        <Select
          value={formData.belt_id}
          onValueChange={(val) => handleChange("belt_id", val)}
          disabled={loadingBelts}
        >
          <SelectTrigger id="belt">
            <SelectValue
              placeholder={loadingBelts ? "Memuat sabuk..." : "Pilih sabuk"}
            />
          </SelectTrigger>
          <SelectContent>
            {belts.map((belt) => (
              <SelectItem key={belt.id} value={String(belt.id)}>
                {belt.name}
                {belt.dan_level ? ` (DAN ${belt.dan_level})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(val) => handleChange("status", val)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Menyimpan..." : "Simpan Akun Murid"}
      </Button>
    </form>
  );
}
