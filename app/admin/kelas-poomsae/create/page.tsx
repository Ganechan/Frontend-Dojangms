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

interface Jurus {
  id: number;
  name: string;
}

interface Format {
  id: number;
  name: string;
}

export default function CreatePoomsaeClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMaster, setLoadingMaster] = useState(true);

  // Master data
  const [kategoriOptions, setKategoriOptions] = useState<KategoriUsia[]>([]);
  const [levelOptions, setLevelOptions] = useState<LevelKelas[]>([]);
  const [jurusOptions, setJurusOptions] = useState<Jurus[]>([]);
  const [formatOptions, setFormatOptions] = useState<Format[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    kategori_usia_id: "",
    level_kelas_id: "",
    gender: "",
    jurus_id: "",
    format_id: "",
  });

  // Untuk mengontrol apakah dropdown jurus disabled
  const [isJurusDisabled, setIsJurusDisabled] = useState(false);

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [kategoriRes, levelRes, jurusRes, formatRes] = await Promise.all([
          fetch("/api/admin/kategori-usia"),
          fetch("/api/admin/level-kelas"),
          fetch("/api/admin/poomsae-jurus"),
          fetch("/api/admin/poomsae-format"),
        ]);

        const kategoriData = await kategoriRes.json();
        const levelData = await levelRes.json();
        const jurusData = await jurusRes.json();
        const formatData = await formatRes.json();

        if (kategoriRes.ok && kategoriData.success)
          setKategoriOptions(kategoriData.data);
        if (levelRes.ok && levelData.success) setLevelOptions(levelData.data);
        if (jurusRes.ok && jurusData.success) setJurusOptions(jurusData.data);
        if (formatRes.ok && formatData.success)
          setFormatOptions(formatData.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("Gagal memuat data master");
      } finally {
        setLoadingMaster(false);
      }
    };
    fetchMasterData();
  }, []);

  // Handle perubahan format untuk menentukan logika gender dan jurus
  const handleFormatChange = (formatId: string) => {
    const selectedFormat = formatOptions.find(
      (f) => f.id.toString() === formatId,
    );
    setFormData((prev) => ({ ...prev, format_id: formatId, gender: "" }));

    if (selectedFormat) {
      const formatName = selectedFormat.name;

      // Logika gender
      if (formatName === "pasangan" || formatName === "freestyle beregu") {
        setFormData((prev) => ({ ...prev, gender: "" }));
      } else if (formatName === "beregu putri") {
        setFormData((prev) => ({ ...prev, gender: "putri" }));
      } else if (formatName === "beregu putra") {
        setFormData((prev) => ({ ...prev, gender: "putra" }));
      }

      // Logika jurus untuk freestyle
      if (formatName === "freestyle" || formatName === "freestyle beregu") {
        // Cari id jurus "Freestyle"
        const freestyleJurus = jurusOptions.find(
          (j) => j.name.toLowerCase() === "freestyle",
        );
        if (freestyleJurus) {
          setFormData((prev) => ({
            ...prev,
            jurus_id: freestyleJurus.id.toString(),
          }));
          setIsJurusDisabled(true);
        } else {
          // Jika tidak ditemukan, reset dan tetap enable (sebagai fallback)
          setFormData((prev) => ({ ...prev, jurus_id: "" }));
          setIsJurusDisabled(false);
        }
      } else {
        setFormData((prev) => ({ ...prev, jurus_id: "" }));
        setIsJurusDisabled(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, jurus_id: "" }));
      setIsJurusDisabled(false);
    }
  };

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
    if (!formData.format_id) {
      toast.error("Pilih format");
      return false;
    }

    const selectedFormat = formatOptions.find(
      (f) => f.id.toString() === formData.format_id,
    );
    const needGender =
      selectedFormat &&
      !["pasangan", "freestyle beregu"].includes(selectedFormat.name);
    if (needGender && !formData.gender) {
      toast.error("Pilih gender");
      return false;
    }

    // Validasi jurus: jika format bukan freestyle/freestyle beregu, jurus wajib diisi
    if (
      selectedFormat &&
      selectedFormat.name !== "freestyle" &&
      selectedFormat.name !== "freestyle beregu" &&
      !formData.jurus_id
    ) {
      toast.error("Pilih jurus");
      return false;
    }

    // Jika format freestyle/freestyle beregu, pastikan jurus_id sudah terisi (otomatis)
    if (
      (selectedFormat?.name === "freestyle" ||
        selectedFormat?.name === "freestyle beregu") &&
      !formData.jurus_id
    ) {
      toast.error("Jurus tidak ditemukan untuk format freestyle");
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
        gender: formData.gender || null,
        jurus_id: Number(formData.jurus_id),
        format_id: Number(formData.format_id),
      };

      const response = await fetch("/api/admin/kelas-poomsae", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal membuat kelas");

      toast.success(data.message || "Kelas poomsae berhasil dibuat");
      router.push("/admin/kelas-poomsae");
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

  const selectedFormat = formatOptions.find(
    (f) => f.id.toString() === formData.format_id,
  );
  const needGender =
    selectedFormat &&
    !["pasangan", "freestyle beregu"].includes(selectedFormat.name);
  const isGenderDisabled =
    !needGender ||
    (selectedFormat &&
      (selectedFormat.name === "beregu putri" ||
        selectedFormat.name === "beregu putra"));

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
                Buat Kelas Poomsae
              </h1>
              <p className="text-muted-foreground">
                Tambahkan kelas poomsae baru ke dalam sistem
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Kelas Poomsae</CardTitle>
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

                  {/* Format Poomsae */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Format Poomsae *
                    </label>
                    <Select
                      value={formData.format_id}
                      onValueChange={handleFormatChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih format" />
                      </SelectTrigger>
                      <SelectContent>
                        {formatOptions.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jurus */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jurus *</label>
                    <Select
                      value={formData.jurus_id}
                      onValueChange={(val) =>
                        handleInputChange("jurus_id", val)
                      }
                      disabled={isJurusDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isJurusDisabled
                              ? "Otomatis (Freestyle)"
                              : "Pilih jurus"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {jurusOptions.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isJurusDisabled && (
                      <p className="text-xs text-muted-foreground">
                        Untuk format freestyle, jurus otomatis "Freestyle".
                      </p>
                    )}
                  </div>

                  {/* Gender (hanya jika diperlukan) */}
                  {needGender && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Gender {!isGenderDisabled && "*"}
                      </label>
                      <Select
                        value={formData.gender}
                        onValueChange={(val) =>
                          handleInputChange("gender", val)
                        }
                        disabled={isGenderDisabled}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isGenderDisabled ? "Otomatis" : "Pilih gender"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="putra">Putra</SelectItem>
                          <SelectItem value="putri">Putri</SelectItem>
                        </SelectContent>
                      </Select>
                      {isGenderDisabled && (
                        <p className="text-xs text-muted-foreground">
                          Gender sudah ditentukan berdasarkan format yang
                          dipilih.
                        </p>
                      )}
                    </div>
                  )}

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
