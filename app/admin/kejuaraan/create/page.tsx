"use client";

import { useState } from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
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

export default function CreateChampionshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: "kota",
    location: "",
    start_date: "",
    end_date: "",
  });

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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/kejuaraan/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          level: formData.level,
          location: formData.location,
          start_date: formData.start_date,
          end_date: formData.end_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat kejuaraan");
      }

      toast.success(data.message || "Kejuaraan berhasil dibuat");
      router.push("/admin/kejuaraan");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat kejuaraan";
      toast.error(message);
      console.error("Error creating championship:", err);
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
                        Isi semua field yang diperlukan untuk membuat kejuaraan
                        baru
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
