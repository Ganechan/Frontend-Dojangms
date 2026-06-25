"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface KategoriUsia {
  id: number;
  name: string;
}

interface LevelKelas {
  id: number;
  name: string;
}

export default function CreateKyorugiClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMaster, setLoadingMaster] = useState(true);

  // Master data
  const [kategoriOptions, setKategoriOptions] = useState<KategoriUsia[]>([]);
  const [levelOptions, setLevelOptions] = useState<LevelKelas[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    kategori_usia_id: "",
    level_kelas_id: "",
    gender: "",
    label: "",
    batas_bawah: "",
    batas_atas: "",
  });

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [kategoriRes, levelRes] = await Promise.all([
          fetch("/api/admin/kategori-usia"),
          fetch("/api/admin/level-kelas"),
        ]);

        const kategoriData = await kategoriRes.json();
        const levelData = await levelRes.json();

        if (kategoriRes.ok && kategoriData.success)
          setKategoriOptions(kategoriData.data);
        if (levelRes.ok && levelData.success) setLevelOptions(levelData.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("Gagal memuat data master");
      } finally {
        setLoadingMaster(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.kategori_usia_id) {
      toast.error("Pilih kategori usia");
      return false;
    }
    if (!formData.level_kelas_id) {
      toast.error("Pilih level kelas");
      return false;
    }
    if (!formData.gender) {
      toast.error("Pilih gender");
      return false;
    }
    if (!formData.label.trim()) {
      toast.error("Label kelas harus diisi");
      return false;
    }
    const batasBawah = Number(formData.batas_bawah);
    const batasAtas = Number(formData.batas_atas);
    if (isNaN(batasBawah) || batasBawah < 0) {
      toast.error("Batas bawah harus berupa angka positif");
      return false;
    }
    if (isNaN(batasAtas) || batasAtas <= batasBawah) {
      toast.error("Batas atas harus lebih besar dari batas bawah");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        kategori_usia_id: Number(formData.kategori_usia_id),
        level_kelas_id: Number(formData.level_kelas_id),
        gender: formData.gender,
        label: formData.label,
        batas_bawah: Number(formData.batas_bawah),
        batas_atas: Number(formData.batas_atas),
      };

      const response = await fetch("/api/admin/kelas-kyorugi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal membuat kelas");

      toast.success(data.message || "Kelas kyorugi berhasil dibuat");
      router.push("/admin/kelas-kyorugi");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (loadingMaster) {
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
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <div className="flex flex-1 flex-col p-6 bg-background">
          <div className="max-w-2xl mx-auto w-full space-y-6">
            <div className="mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Buat Kelas Kyorugi
              </h1>
              <p className="text-muted-foreground">
                Tambahkan kelas kyorugi baru ke dalam sistem
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Kelas Kyorugi</CardTitle>
                <CardDescription>
                  Isi semua field yang diperlukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Kategori Usia */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Kategori Usia *
                    </label>
                    <Select
                      value={formData.kategori_usia_id}
                      onValueChange={(val) =>
                        handleInputChange("kategori_usia_id", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori usia" />
                      </SelectTrigger>
                      <SelectContent>
                        {kategoriOptions.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Level Kelas */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Level Kelas *</label>
                    <Select
                      value={formData.level_kelas_id}
                      onValueChange={(val) =>
                        handleInputChange("level_kelas_id", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih level kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {levelOptions.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender *</label>
                    <Select
                      value={formData.gender}
                      onValueChange={(val) => handleInputChange("gender", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="putra">Putra</SelectItem>
                        <SelectItem value="putri">Putri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Label */}
                  <div className="space-y-2">
                    <label htmlFor="label" className="text-sm font-medium">
                      Label Kelas *
                    </label>
                    <Input
                      id="label"
                      name="label"
                      placeholder="Contoh: under-42"
                      value={formData.label}
                      onChange={(e) =>
                        handleInputChange("label", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Batas Bawah dan Atas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="batas_bawah"
                        className="text-sm font-medium"
                      >
                        Batas Bawah (kg) *
                      </label>
                      <Input
                        id="batas_bawah"
                        name="batas_bawah"
                        type="number"
                        placeholder="35"
                        value={formData.batas_bawah}
                        onChange={(e) =>
                          handleInputChange("batas_bawah", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="batas_atas"
                        className="text-sm font-medium"
                      >
                        Batas Atas (kg) *
                      </label>
                      <Input
                        id="batas_atas"
                        name="batas_atas"
                        type="number"
                        placeholder="42"
                        value={formData.batas_atas}
                        onChange={(e) =>
                          handleInputChange("batas_atas", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {loading ? "Menyimpan..." : "Buat Kelas"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
