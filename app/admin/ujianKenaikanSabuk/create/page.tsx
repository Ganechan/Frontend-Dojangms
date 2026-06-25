"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner"; // Import Sonner Toast

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [levelUjian, setLevelUjian] = useState("kota");

  const [formData, setFormData] = useState({
    level_ujian: "kota",
    tanggal: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    lokasi: "",
    keterangan: "",
  });

  const handleLevelChange = (value: string) => {
    setLevelUjian(value);
    setFormData((prev) => ({
      ...prev,
      level_ujian: value,
    }));
    setError("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.keterangan.trim()) {
      const msg = "Keterangan ujian harus diisi";
      setError(msg);
      toast.error(msg);
      return false;
    }

    if (!formData.lokasi.trim()) {
      const msg = "Lokasi harus diisi";
      setError(msg);
      toast.error(msg);
      return false;
    }

    if (levelUjian === "kota") {
      if (!formData.tanggal) {
        const msg = "Tanggal ujian harus diisi";
        setError(msg);
        toast.error(msg);
        return false;
      }
    } else {
      if (!formData.tanggal_mulai) {
        const msg = "Tanggal mulai harus diisi";
        setError(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.tanggal_selesai) {
        const msg = "Tanggal selesai harus diisi";
        setError(msg);
        toast.error(msg);
        return false;
      }
      if (
        new Date(formData.tanggal_mulai) > new Date(formData.tanggal_selesai)
      ) {
        const msg =
          "Tanggal selesai harus lebih besar atau sama dengan tanggal mulai";
        setError(msg);
        toast.error(msg);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload =
        levelUjian === "kota"
          ? {
              level_ujian: "kota",
              tanggal: formData.tanggal,
              lokasi: formData.lokasi,
              keterangan: formData.keterangan,
            }
          : {
              level_ujian: "provinsi",
              tanggal_mulai: formData.tanggal_mulai,
              tanggal_selesai: formData.tanggal_selesai,
              lokasi: formData.lokasi,
              keterangan: formData.keterangan,
            };

      const response = await fetch("/api/admin/ujian-kenaikan-sabuk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat ujian");
      }

      // Pemicu toast sukses saat berhasil menyimpan data
      toast.success("Ujian kenaikan sabuk baru berhasil dibuat!");
      router.push("/admin/ujianKenaikanSabuk");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat ujian";
      setError(message);

      // Pemicu toast error jika request ke API gagal
      toast.error(message);
      console.error("Error creating exam:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="p-4 md:p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Header & Back Button */}
          <div className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              disabled={loading}
              className="h-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Buat Ujian Baru
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Tambahkan jadwal ujian kenaikan sabuk baru ke dalam sistem
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Ujian</CardTitle>
              <CardDescription>
                Isi semua detail yang diperlukan di bawah ini untuk membuat
                entri ujian baru.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inline Error Alert (Tetap dipertahankan sebagai cadangan konteks form) */}
                {error && (
                  <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>{error}</div>
                  </div>
                )}

                {/* Grid Wrapper untuk Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Tingkat Ujian */}
                  <div className="space-y-2">
                    <Label htmlFor="level_ujian">Tingkat Ujian</Label>
                    <Select
                      value={levelUjian}
                      onValueChange={handleLevelChange}
                      disabled={loading}
                    >
                      <SelectTrigger id="level_ujian" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kota">Tingkat Kota</SelectItem>
                        <SelectItem value="provinsi">
                          Tingkat Provinsi
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tanggal Ujian Dinamis */}
                  {levelUjian === "kota" ? (
                    <div className="space-y-2">
                      <Label htmlFor="tanggal">
                        Tanggal Ujian{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="tanggal"
                        name="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        className="bg-background"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tanggal_mulai">
                          Tanggal Mulai{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="tanggal_mulai"
                          name="tanggal_mulai"
                          type="date"
                          value={formData.tanggal_mulai}
                          onChange={handleInputChange}
                          disabled={loading}
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tanggal_selesai">
                          Tanggal Selesai{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="tanggal_selesai"
                          name="tanggal_selesai"
                          type="date"
                          value={formData.tanggal_selesai}
                          onChange={handleInputChange}
                          disabled={loading}
                          required
                          className="bg-background"
                        />
                      </div>
                    </div>
                  )}

                  {/* Lokasi */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="lokasi">
                      Lokasi <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lokasi"
                      name="lokasi"
                      placeholder="Contoh: GOR Kota Salatiga"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      className="bg-background"
                    />
                  </div>

                  {/* Keterangan */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="keterangan">
                      Keterangan / Deskripsi{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="keterangan"
                      name="keterangan"
                      placeholder="Contoh: Ujian kenaikan sabuk putih ke kuning"
                      value={formData.keterangan}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      className="min-h-[120px] bg-background resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="w-full sm:w-28"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Membuat...
                      </>
                    ) : (
                      "Buat Ujian"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
