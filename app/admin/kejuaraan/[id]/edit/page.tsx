"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface ChampionshipData {
  id: number;
  name: string;
  level: string;
  location: string;
  year: number;
  start_date: string;
  end_date: string;
}

export default function EditChampionshipPage() {
  const params = useParams();
  const router = useRouter();
  const championshipId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [championship, setChampionship] = useState<ChampionshipData | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    location: "",
    start_date: "",
    end_date: "",
  });

  // Fetch championship data via internal API
  useEffect(() => {
    const fetchChampionship = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/kejuaraan/${championshipId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data kejuaraan");
        }

        const champData = data.data;
        setChampionship(champData);
        setFormData({
          name: champData.name,
          level: champData.level,
          location: champData.location,
          start_date: champData.start_date,
          end_date: champData.end_date,
        });
      } catch (err: any) {
        console.error("Error fetching championship:", err);
        toast.error(err.message || "Gagal memuat data kejuaraan");
      } finally {
        setLoading(false);
      }
    };

    if (championshipId) {
      fetchChampionship();
    }
  }, [championshipId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLevelChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      level: value,
    }));
  };

  const validateForm = (): boolean => {
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        level: formData.level,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      const response = await fetch(
        `/api/admin/kejuaraan/update/${championshipId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui kejuaraan");
      }

      toast.success(data.message || "Kejuaraan berhasil diperbarui");
      router.push(`/admin/kejuaraan/${championshipId}`);
    } catch (err: any) {
      toast.error(
        err.message || "Terjadi kesalahan saat memperbarui kejuaraan",
      );
      console.error("Error updating championship:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Memuat data kejuaraan...</p>
            </div>
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
                <div className="max-w-2xl mx-auto">
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
                      Edit Kejuaraan
                    </h1>
                    <p className="text-muted-foreground">
                      Perbarui informasi kejuaraan
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Kejuaraan</CardTitle>
                      <CardDescription>
                        Ubah detail kejuaraan sesuai kebutuhan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
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
                              <SelectItem value="kota">Tingkat Kota</SelectItem>
                              <SelectItem value="provinsi">
                                Tingkat Provinsi
                              </SelectItem>
                              <SelectItem value="nasional">
                                Tingkat Nasional
                              </SelectItem>
                              <SelectItem value="internasional">
                                Tingkat Internasional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

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

                        <div className="flex gap-4 pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={submitting}
                          >
                            Batal
                          </Button>
                          <Button
                            type="submit"
                            disabled={submitting}
                            className="flex-1"
                          >
                            {submitting && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
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
