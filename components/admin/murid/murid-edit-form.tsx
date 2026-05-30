// components/admin/murid/murid-edit-form.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { updateMurid, fetchBelts } from "@/services/admin/muridService";
import { ApiError } from "@/lib/apiClient";
import type {
  BeltOption,
  MuridDetail,
  UpdateMuridPayload,
} from "@/types/admin/murid";

// ── helpers ───────────────────────────────────────────────────────────────────

function toDateInputValue(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const match = dateString.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ── props ─────────────────────────────────────────────────────────────────────

interface MuridEditFormProps {
  murid: MuridDetail;
}

// ── component ─────────────────────────────────────────────────────────────────

export function MuridEditForm({ murid }: MuridEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // belt list
  const [belts, setBelts] = React.useState<BeltOption[]>([]);
  const [beltsLoading, setBeltsLoading] = React.useState(true);

  // form state — profil
  const [name, setName] = React.useState(murid.name ?? "");
  const [email, setEmail] = React.useState(murid.email ?? "");
  const [phone, setPhone] = React.useState(murid.phone ?? "");
  const [tanggalLahir, setTanggalLahir] = React.useState(
    toDateInputValue(murid.tanggal_lahir),
  );
  const [status, setStatus] = React.useState<"active" | "inactive">(
    murid.status ?? "active",
  );

  // form state — sabuk
  const [beltId, setBeltId] = React.useState<string>(
    murid.current_belt
      ? String(
          // cari id belt yang cocok dengan nama current belt (akan di-resolve setelah belts load)
          "",
        )
      : "",
  );
  const [beltAchievedAt, setBeltAchievedAt] = React.useState(
    toDateInputValue(murid.current_belt?.achieved_at) || todayISO(),
  );

  const [originalBeltId, setOriginalBeltId] = React.useState<string>(beltId);

  // validation errors
  const [errors, setErrors] = React.useState<
    Partial<
      Record<
        "name" | "email" | "phone" | "tanggal_lahir" | "belt_achieved_at",
        string
      >
    >
  >({});

  // ── load belts ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    async function loadBelts() {
      setBeltsLoading(true);
      try {
        const res = await fetchBelts();
        setBelts(res.data);

        // set default belt_id dari current_belt murid
        if (murid.current_belt) {
          const matched = res.data.find(
            (b) => b.name === murid.current_belt?.name,
          );
          if (matched) {
            setBeltId(String(matched.id));
            setOriginalBeltId(String(matched.id));
          }
        }
      } catch {
        toast.error("Gagal memuat data sabuk");
      } finally {
        setBeltsLoading(false);
      }
    }
    loadBelts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── validasi ────────────────────────────────────────────────────────────────
  function validate(): boolean {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Nama wajib diisi";
    if (!email.trim()) {
      next.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Format email tidak valid";
    }
    if (!phone.trim()) {
      next.phone = "No. HP wajib diisi";
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
      next.phone = "Format nomor HP tidak valid";
    }
    if (!tanggalLahir) next.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (beltId && beltId !== originalBeltId && !beltAchievedAt)
      next.belt_achieved_at = "Tanggal pencapaian sabuk wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: UpdateMuridPayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tanggal_lahir: tanggalLahir,
        status,
        ...(beltId &&
          beltId !== originalBeltId && {
            belt_id: Number(beltId),
            belt_achieved_at: beltAchievedAt,
          }),
      };

      await updateMurid(murid.id, payload);
      toast.success("Data murid berhasil diperbarui");
      router.push(`/admin/anggota/murid/${murid.id}`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            toast.error(err.message || "Data yang dikirim tidak valid");
            break;
          case 401:
            toast.error("Sesi habis, silakan login kembali");
            router.push("/login");
            break;
          case 403:
            toast.error("Anda tidak memiliki akses");
            break;
          case 404:
            toast.error("Murid tidak ditemukan");
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
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        {/* ── Informasi Pribadi ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Pribadi</CardTitle>
            <CardDescription>Perbarui data dasar murid</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {/* Nama */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="Nama lengkap"
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="contoh@email.com"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* No. HP */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">
                No. HP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone)
                    setErrors((p) => ({ ...p, phone: undefined }));
                }}
                placeholder="08xxxxxxxxxx"
                disabled={isSubmitting}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Tanggal Lahir */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tanggal_lahir">
                Tanggal Lahir <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tanggal_lahir"
                type="date"
                value={tanggalLahir}
                max={todayISO()}
                onChange={(e) => {
                  setTanggalLahir(e.target.value);
                  if (errors.tanggal_lahir)
                    setErrors((p) => ({ ...p, tanggal_lahir: undefined }));
                }}
                disabled={isSubmitting}
                aria-invalid={!!errors.tanggal_lahir}
              />
              {errors.tanggal_lahir && (
                <p className="text-xs text-destructive">
                  {errors.tanggal_lahir}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Status ───────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Keanggotaan</CardTitle>
            <CardDescription>Atur status keaktifan murid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5 max-w-xs">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as "active" | "inactive")}
                disabled={isSubmitting}
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
          </CardContent>
        </Card>

        {/* ── Sabuk ────────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sabuk</CardTitle>
            <CardDescription>
              Perbarui sabuk murid. Biarkan kosong jika tidak ingin mengubah
              sabuk.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {/* Pilih Sabuk */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="belt_id">Sabuk</Label>
              <Select
                value={beltId}
                onValueChange={(v) => {
                  setBeltId(v);
                  if (!v) setBeltAchievedAt("");
                  else setBeltAchievedAt(todayISO()); // ← reset ke hari ini saat ganti sabuk
                }}
                disabled={isSubmitting || beltsLoading}
              >
                <SelectTrigger id="belt_id">
                  <SelectValue
                    placeholder={
                      beltsLoading ? "Memuat sabuk..." : "Pilih sabuk"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {belts.map((belt) => (
                    <SelectItem key={belt.id} value={String(belt.id)}>
                      {belt.name}
                      {belt.dan_level !== null && (
                        <span className="text-muted-foreground ml-1">
                          (DAN {belt.dan_level})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {murid.current_belt && (
                <p className="text-xs text-muted-foreground">
                  Sabuk saat ini:{" "}
                  <span className="font-medium">{murid.current_belt.name}</span>
                </p>
              )}
            </div>

            {/* Tanggal Pencapaian Sabuk — hanya tampil jika sabuk berubah */}
            {beltId && beltId !== originalBeltId && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="belt_achieved_at">
                  Tanggal Pencapaian <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="belt_achieved_at"
                  type="date"
                  value={beltAchievedAt}
                  max={todayISO()}
                  onChange={(e) => {
                    setBeltAchievedAt(e.target.value);
                    if (errors.belt_achieved_at)
                      setErrors((p) => ({ ...p, belt_achieved_at: undefined }));
                  }}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.belt_achieved_at}
                />
                {errors.belt_achieved_at && (
                  <p className="text-xs text-destructive">
                    {errors.belt_achieved_at}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* ── Tombol aksi ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/anggota/murid`}>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </form>
  );
}
