// components/admin/pelatih/pelatih-edit-form.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, X, Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";

import {
  updatePelatih,
  addSertifikasiPelatih,
  deleteSertifikasiPelatih,
} from "@/services/admin/pelatihService";
import { fetchBelts } from "@/services/admin/muridService";
import { ApiError } from "@/lib/apiClient";
import type { BeltOption } from "@/types/admin/murid";
import type {
  CoachDetail,
  SertifikasiItem,
  UpdatePelatihPayload,
} from "@/types/admin/pelatih";

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

// ── konstanta ─────────────────────────────────────────────────────────────────

const SPESIALISASI_OPTIONS = [
  { label: "Kyorugi", value: "kyorugi" },
  { label: "Poomsae", value: "poomsae" },
  { label: "Kyorugi dan Poomsae", value: "kyorugi dan poomsae" },
];

// ── props ─────────────────────────────────────────────────────────────────────

interface PelatihEditFormProps {
  pelatih: CoachDetail;
}

// ── component ─────────────────────────────────────────────────────────────────

export function PelatihEditForm({ pelatih }: PelatihEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // belt list
  const [belts, setBelts] = React.useState<BeltOption[]>([]);
  const [beltsLoading, setBeltsLoading] = React.useState(true);

  // form state — profil
  const [name, setName] = React.useState(pelatih.name ?? "");
  const [email, setEmail] = React.useState(pelatih.email ?? "");
  const [phone, setPhone] = React.useState(pelatih.phone ?? "");
  const [tanggalLahir, setTanggalLahir] = React.useState(
    toDateInputValue(pelatih.tanggal_lahir),
  );
  const [status, setStatus] = React.useState<"active" | "inactive">(
    pelatih.status ?? "active",
  );

  // form state — sabuk
  const [beltId, setBeltId] = React.useState<string>("");
  const [originalBeltId, setOriginalBeltId] = React.useState<string>("");
  const [beltAchievedAt, setBeltAchievedAt] = React.useState(
    toDateInputValue(
      pelatih.belt_history?.find((b) => b.is_current === 1)?.achieved_at,
    ) || todayISO(),
  );

  // form state — spesialisasi
  const [spesialisasi, setSpesialisasi] = React.useState(
    pelatih.pelatih?.spesialisasi?.toLowerCase() ?? "",
  );

  // form state — sertifikasi (local copy untuk optimistic UI)
  const [sertifikasiList, setSertifikasiList] = React.useState<
    SertifikasiItem[]
  >(() => {
    const raw = pelatih.pelatih?.sertifikasi;
    if (!raw || !Array.isArray(raw)) return [];
    return raw as SertifikasiItem[];
  });

  // sertifikasi edit state
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingText, setEditingText] = React.useState<string>("");

  // sertifikasi tambah state
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newSertifikasi, setNewSertifikasi] = React.useState("");
  const [isAddingCert, setIsAddingCert] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

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
        if (pelatih.sabuk_saat_ini) {
          const matched = res.data.find(
            (b) => b.name === pelatih.sabuk_saat_ini?.name,
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

  // ── validasi profil ─────────────────────────────────────────────────────────
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

  // ── submit profil + spesialisasi + sabuk ────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: UpdatePelatihPayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tanggal_lahir: tanggalLahir,
        status,
        spesialisasi: spesialisasi || undefined,
        ...(beltId &&
          beltId !== originalBeltId && {
            belt_id: Number(beltId),
            belt_achieved_at: beltAchievedAt,
          }),
      };

      await updatePelatih(pelatih.id, payload);
      toast.success("Data pelatih berhasil diperbarui");
      router.push(`/admin/anggota/pelatih/${pelatih.id}`);
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
            toast.error("Pelatih tidak ditemukan");
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

  // ── tambah sertifikasi ──────────────────────────────────────────────────────
  async function handleAddSertifikasi() {
    if (!newSertifikasi.trim()) return;
    setIsAddingCert(true);
    try {
      const res = await addSertifikasiPelatih(pelatih.id, {
        nama_sertifikasi: newSertifikasi.trim(),
      });
      setSertifikasiList((prev) => [
        ...prev,
        { id: res.data.id, nama: res.data.nama_sertifikasi },
      ]);
      setNewSertifikasi("");
      setShowAddForm(false);
      toast.success("Sertifikasi berhasil ditambahkan");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Gagal menambah sertifikasi");
      } else {
        toast.error("Gagal terhubung ke server");
      }
    } finally {
      setIsAddingCert(false);
    }
  }

  // ── edit sertifikasi ────────────────────────────────────────────────────────
  async function handleEditSertifikasi(item: SertifikasiItem) {
    if (!editingText.trim() || editingText.trim() === item.nama) {
      setEditingId(null);
      return;
    }
    setIsSubmitting(true);
    try {
      await updatePelatih(pelatih.id, {
        sertifikasi: [{ id: item.id, nama: editingText.trim() }],
      });
      setSertifikasiList((prev) =>
        prev.map((s) =>
          s.id === item.id ? { ...s, nama: editingText.trim() } : s,
        ),
      );
      setEditingId(null);
      toast.success("Sertifikasi berhasil diperbarui");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Gagal memperbarui sertifikasi");
      } else {
        toast.error("Gagal terhubung ke server");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── hapus sertifikasi ───────────────────────────────────────────────────────
  async function handleDeleteSertifikasi(id: number) {
    setDeletingId(id);
    try {
      await deleteSertifikasiPelatih(pelatih.id, id);
      setSertifikasiList((prev) => prev.filter((s) => s.id !== id));
      toast.success("Sertifikasi berhasil dihapus");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Gagal menghapus sertifikasi");
      } else {
        toast.error("Gagal terhubung ke server");
      }
    } finally {
      setDeletingId(null);
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
            <CardDescription>Perbarui data dasar pelatih</CardDescription>
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
            <CardDescription>Atur status keaktifan pelatih</CardDescription>
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
              Perbarui sabuk pelatih. Tanggal pencapaian wajib diisi jika sabuk
              berbeda dengan sabuk saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="belt_id">Sabuk</Label>
              <Select
                value={beltId}
                onValueChange={(v) => {
                  setBeltId(v);
                  if (v && v !== originalBeltId) setBeltAchievedAt(todayISO());
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
              {pelatih.sabuk_saat_ini && (
                <p className="text-xs text-muted-foreground">
                  Sabuk saat ini:{" "}
                  <span className="font-medium">
                    {pelatih.sabuk_saat_ini.name}
                  </span>
                </p>
              )}
            </div>

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

        {/* ── Informasi Pelatih ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Pelatih</CardTitle>
            <CardDescription>Spesialisasi pelatih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5 max-w-xs">
              <Label htmlFor="spesialisasi">Spesialisasi</Label>
              <Select
                value={spesialisasi}
                onValueChange={setSpesialisasi}
                disabled={isSubmitting}
              >
                <SelectTrigger id="spesialisasi">
                  <SelectValue placeholder="Pilih spesialisasi" />
                </SelectTrigger>
                <SelectContent>
                  {SPESIALISASI_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pelatih.pelatih?.spesialisasi && (
                <p className="text-xs text-muted-foreground">
                  Saat ini:{" "}
                  <span className="font-medium">
                    {pelatih.pelatih.spesialisasi}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Sertifikasi ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Sertifikasi</CardTitle>
              <CardDescription>Kelola sertifikasi pelatih</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setShowAddForm((v) => !v);
                setNewSertifikasi("");
              }}
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Form tambah sertifikasi */}
            {showAddForm && (
              <div className="flex flex-col gap-2 rounded-lg border p-4 bg-muted/30">
                <Label htmlFor="new_sertifikasi">Nama Sertifikasi Baru</Label>
                <div className="flex gap-2">
                  <Input
                    id="new_sertifikasi"
                    value={newSertifikasi}
                    onChange={(e) => setNewSertifikasi(e.target.value)}
                    placeholder="Contoh: Kukkiwon DAN IV"
                    disabled={isAddingCert}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSertifikasi();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSertifikasi}
                    disabled={isAddingCert || !newSertifikasi.trim()}
                    className="gap-2 shrink-0"
                  >
                    {isAddingCert ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Simpan
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    disabled={isAddingCert}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {/* List sertifikasi */}
            {sertifikasiList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Pelatih belum mempunyai sertifikasi
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {sertifikasiList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-lg border px-4 py-3"
                  >
                    {editingId === item.id ? (
                      // Mode edit inline
                      <div className="flex flex-1 items-center gap-2">
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={1}
                          className="flex-1 min-h-0 resize-none"
                          disabled={isSubmitting}
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleEditSertifikasi(item)}
                          disabled={isSubmitting}
                          className="gap-1 shrink-0"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3" />
                          )}
                          Simpan
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          disabled={isSubmitting}
                        >
                          Batal
                        </Button>
                      </div>
                    ) : (
                      // Mode tampil
                      <>
                        <span className="flex-1 text-sm">{item.nama}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingText(item.nama);
                            }}
                            disabled={isSubmitting || deletingId === item.id}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteSertifikasi(item.id)}
                            disabled={isSubmitting || deletingId === item.id}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* ── Tombol aksi ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/anggota/pelatih`}>
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
