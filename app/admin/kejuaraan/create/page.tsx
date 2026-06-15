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
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const CHAMPIONSHIP_LEVELS = [
  { value: "kota", label: "Tingkat Kota" },
  { value: "provinsi", label: "Tingkat Provinsi" },
  { value: "nasional", label: "Tingkat Nasional" },
  { value: "internasional", label: "Tingkat Internasional" },
];

interface KategoriUsia {
  id: number;
  name: string;
}

interface Rule {
  kategori_usia_id: number;
  tahun_lahir_min: string;
  tahun_lahir_max: string;
}

export default function CreateChampionshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState<KategoriUsia[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    level: "kota",
    location: "",
    start_date: "",
    end_date: "",
  });

  const [rules, setRules] = useState<Rule[]>([]);

  // Fetch kategori usia
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/kategori-usia");
        const data = await response.json();
        if (response.ok && data.success) {
          setCategories(data.data);
          // Inisialisasi rules berdasarkan kategori usia yang ada
          const initialRules = data.data.map((cat: KategoriUsia) => ({
            kategori_usia_id: cat.id,
            tahun_lahir_min: "",
            tahun_lahir_max: "",
          }));
          setRules(initialRules);
        } else {
          toast.error("Gagal memuat data kategori usia");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Gagal memuat data kategori usia");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (value: string) => {
    setFormData((prev) => ({ ...prev, level: value }));
  };

  const handleRuleChange = (
    kategoriId: number,
    field: "min" | "max",
    value: string,
  ) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.kategori_usia_id === kategoriId
          ? {
              ...rule,
              tahun_lahir_min: field === "min" ? value : rule.tahun_lahir_min,
              tahun_lahir_max: field === "max" ? value : rule.tahun_lahir_max,
            }
          : rule,
      ),
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Nama kejuaraan harus diisi");
      return false;
    }
    if (!formData.location.trim()) {
      toast.error("Lokasi harus diisi");
      return false;
    }
    if (!formData.start_date) {
      toast.error("Tanggal mulai harus diisi");
      return false;
    }
    if (!formData.end_date) {
      toast.error("Tanggal selesai harus diisi");
      return false;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error(
        "Tanggal selesai harus lebih besar atau sama dengan tanggal mulai",
      );
      return false;
    }

    // Validasi rules: untuk semua kategori, max harus diisi. Untuk selain Senior, min harus diisi.
    for (const rule of rules) {
      const kategori = categories.find((c) => c.id === rule.kategori_usia_id);
      if (!kategori) continue;
      const isSenior = kategori.name.toLowerCase() === "senior";

      if (!rule.tahun_lahir_max) {
        toast.error(`Tahun lahir maksimal untuk ${kategori.name} harus diisi`);
        return false;
      }
      if (!isSenior && !rule.tahun_lahir_min) {
        toast.error(`Tahun lahir minimal untuk ${kategori.name} harus diisi`);
        return false;
      }
      if (rule.tahun_lahir_min && rule.tahun_lahir_max) {
        const minYear = parseInt(rule.tahun_lahir_min);
        const maxYear = parseInt(rule.tahun_lahir_max);
        if (minYear > maxYear) {
          toast.error(
            `Tahun lahir minimal (${minYear}) tidak boleh lebih besar dari maksimal (${maxYear}) untuk ${kategori.name}`,
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Siapkan payload sesuai dengan format yang diinginkan backend
      const payload = {
        name: formData.name,
        level: formData.level,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        kategori_usia_rules: rules.map((rule) => ({
          kategori_usia_id: rule.kategori_usia_id,
          tahun_lahir_min: rule.tahun_lahir_min
            ? parseInt(rule.tahun_lahir_min)
            : null,
          tahun_lahir_max: rule.tahun_lahir_max
            ? parseInt(rule.tahun_lahir_max)
            : null,
        })),
      };

      const response = await fetch("/api/admin/kejuaraan/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Gagal membuat kejuaraan");

      toast.success(data.message || "Kejuaraan berhasil dibuat");
      router.push("/admin/kejuaraan");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat membuat kejuaraan");
      console.error("Error creating championship:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="min-h-screen bg-background p-6">
                <div className="max-w-3xl mx-auto">
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
                      Buat Kejuaraan Baru
                    </h1>
                    <p className="text-muted-foreground">
                      Tambahkan kejuaraan baru ke dalam sistem
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Kejuaraan</CardTitle>
                      <CardDescription>
                        Isi semua field yang diperlukan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama Kejuaraan */}
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Nama Kejuaraan{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Kejuaraan Kota 1"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        {/* Tingkat Kejuaraan */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Tingkat Kejuaraan{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Select
                            value={formData.level}
                            onValueChange={handleLevelChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CHAMPIONSHIP_LEVELS.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Lokasi */}
                        <div className="space-y-2">
                          <label
                            htmlFor="location"
                            className="text-sm font-medium"
                          >
                            Lokasi <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="location"
                            name="location"
                            placeholder="GOR Kota Salatiga"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        {/* Tanggal */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="start_date"
                              className="text-sm font-medium"
                            >
                              Tanggal Mulai{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <Input
                              id="start_date"
                              name="start_date"
                              type="date"
                              value={formData.start_date}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="end_date"
                              className="text-sm font-medium"
                            >
                              Tanggal Selesai{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <Input
                              id="end_date"
                              name="end_date"
                              type="date"
                              value={formData.end_date}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Kategori Usia Rules */}
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Aturan Kategori Usia
                          </h3>
                          <div className="space-y-4">
                            {categories.map((cat) => {
                              const rule = rules.find(
                                (r) => r.kategori_usia_id === cat.id,
                              );
                              const isSenior =
                                cat.name.toLowerCase() === "senior";
                              return (
                                <div
                                  key={cat.id}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-md"
                                >
                                  <div className="font-medium">{cat.name}</div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-xs text-muted-foreground">
                                        {isSenior
                                          ? "Tahun Lahir Min (opsional)"
                                          : "Tahun Lahir Min *"}
                                      </label>
                                      <Input
                                        type="number"
                                        placeholder="Minimal tahun"
                                        value={rule?.tahun_lahir_min || ""}
                                        onChange={(e) =>
                                          handleRuleChange(
                                            cat.id,
                                            "min",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">
                                        Tahun Lahir Max *
                                      </label>
                                      <Input
                                        type="number"
                                        placeholder="Maksimal tahun"
                                        value={rule?.tahun_lahir_max || ""}
                                        onChange={(e) =>
                                          handleRuleChange(
                                            cat.id,
                                            "max",
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            * Untuk Senior, tahun lahir minimal bersifat
                            opsional (boleh kosong).
                            <br />
                            ** Tahun lahir maksimal wajib diisi untuk semua
                            kategori.
                          </p>
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
                          <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                          >
                            {loading && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {loading ? "Membuat..." : "Buat Kejuaraan"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
