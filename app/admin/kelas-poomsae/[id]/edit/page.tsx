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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Save } from "lucide-react";
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

interface PoomsaeClassData {
  id: number;
  gender: string | null;
  kategori_usia: {
    id: number;
    nama: string;
  };
  level_kelas: {
    id: number;
    nama: string;
  };
  jurus: {
    id: number;
    nama: string;
  };
  format: {
    id: number;
    nama: string;
  };
}

export default function EditPoomsaeClassPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<PoomsaeClassData | null>(null);

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

  // Flag untuk mengetahui apakah jurus disabled (otomatis)
  const [isJurusDisabled, setIsJurusDisabled] = useState(false);
  const [isGenderDisabled, setIsGenderDisabled] = useState(false);

  // Fetch semua master data
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
      } catch (err) {
        console.error("Error fetching master data:", err);
        toast.error("Gagal memuat data master");
      }
    };
    fetchMasterData();
  }, []);

  // Fetch detail data kelas poomsae
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/kelas-poomsae/${classId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data kelas");
        }

        const detail = result.data as PoomsaeClassData;
        setData(detail);
        setFormData({
          kategori_usia_id: detail.kategori_usia.id.toString(),
          level_kelas_id: detail.level_kelas.id.toString(),
          gender: detail.gender || "",
          jurus_id: detail.jurus.id.toString(),
          format_id: detail.format.id.toString(),
        });

        // Tentukan initial state untuk disable berdasarkan format yang ada
        const formatName = detail.format.nama;
        applyRules(formatName, detail.jurus.id.toString());
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat data");
        router.push("/admin/kelas-poomsae");
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchDetail();
  }, [classId, router]);

  // Fungsi untuk menerapkan aturan berdasarkan format yang dipilih
  const applyRules = (formatName: string, currentJurusId?: string) => {
    const format = formatOptions.find((f) => f.name === formatName);
    if (!format) return;

    // Reset dulu
    setIsJurusDisabled(false);
    setIsGenderDisabled(false);

    // Aturan gender
    if (formatName === "pasangan") {
      // gender = null (tidak perlu diisi)
      setFormData((prev) => ({ ...prev, gender: "" }));
      setIsGenderDisabled(true);
    } else if (formatName === "beregu putra") {
      setFormData((prev) => ({ ...prev, gender: "putra" }));
      setIsGenderDisabled(true);
    } else if (formatName === "beregu putri") {
      setFormData((prev) => ({ ...prev, gender: "putri" }));
      setIsGenderDisabled(true);
    } else {
      // format lain, gender bisa dipilih user, pastikan tidak disabled
      setIsGenderDisabled(false);
      // jangan reset gender, biarkan user pilih
    }

    // Aturan jurus: freestyle dan freestyle beregu -> jurus otomatis Freestyle (id 18)
    const freestyleJurus = jurusOptions.find(
      (j) => j.name.toLowerCase() === "freestyle",
    );
    if (
      (formatName === "freestyle" || formatName === "freestyle beregu") &&
      freestyleJurus
    ) {
      setFormData((prev) => ({
        ...prev,
        jurus_id: freestyleJurus.id.toString(),
      }));
      setIsJurusDisabled(true);
    } else {
      // Untuk format lain, jika tidak sedang loading dan tidak ada jurus yang dipilih, biarkan user pilih
      // Jika sebelumnya jurus di-set otomatis, kita harus set ke kosong agar user bisa pilih (tapi kita tidak override jika sudah ada)
      if (!currentJurusId || currentJurusId === "") {
        // Hanya jika belum ada jurus
      }
      setIsJurusDisabled(false);
    }
  };

  // Handler perubahan format
  const handleFormatChange = (formatId: string) => {
    const selectedFormat = formatOptions.find(
      (f) => f.id.toString() === formatId,
    );
    if (!selectedFormat) return;

    setFormData((prev) => ({ ...prev, format_id: formatId }));
    // Reset gender dan jurus sesuai aturan
    applyRules(selectedFormat.name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
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
    // Validasi jurus: jika tidak disabled dan kosong
    if (!isJurusDisabled && !formData.jurus_id) {
      toast.error("Pilih jurus");
      return false;
    }
    // Validasi gender: jika tidak disabled dan kosong
    if (!isGenderDisabled && !formData.gender) {
      toast.error("Pilih gender");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Untuk format pasangan, gender dikirim null
      const selectedFormat = formatOptions.find(
        (f) => f.id.toString() === formData.format_id,
      );
      let genderValue = formData.gender;
      if (selectedFormat?.name === "pasangan") {
        genderValue = "";
      }

      const payload = {
        kategori_usia_id: Number(formData.kategori_usia_id),
        level_kelas_id: Number(formData.level_kelas_id),
        gender: genderValue || null,
        jurus_id: Number(formData.jurus_id),
        format_id: Number(formData.format_id),
      };

      const response = await fetch(`/api/admin/kelas-poomsae/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal memperbarui");

      toast.success(result.message || "Kelas poomsae berhasil diperbarui");
      router.push("/admin/kelas-poomsae");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
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
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              <div className="max-w-2xl mx-auto w-full space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-9 w-28 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <Skeleton className="h-[480px] rounded-xl" />
              </div>
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
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              <div className="max-w-2xl mx-auto w-full space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="shadow-sm"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                  </Button>
                  <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Edit Kelas Poomsae
                    </h1>
                    <p className="text-muted-foreground mt-1.5">
                      Perbarui informasi kelas pertandingan Poomsae
                    </p>
                  </div>
                </div>

                {/* Form */}
                <Card>
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-base">
                      Form Edit Kelas Poomsae
                    </CardTitle>
                    <CardDescription>
                      Ubah detail kelas sesuai kebutuhan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Kategori Usia & Level Kelas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Kategori Usia{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Select
                            value={formData.kategori_usia_id}
                            onValueChange={(val) =>
                              handleSelectChange("kategori_usia_id", val)
                            }
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Pilih kategori usia" />
                            </SelectTrigger>
                            <SelectContent>
                              {kategoriOptions.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Level Kelas{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Select
                            value={formData.level_kelas_id}
                            onValueChange={(val) =>
                              handleSelectChange("level_kelas_id", val)
                            }
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Pilih level kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {levelOptions.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Format Poomsae & Jurus */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Format <span className="text-destructive">*</span>
                          </label>
                          <Select
                            value={formData.format_id}
                            onValueChange={handleFormatChange}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Pilih format" />
                            </SelectTrigger>
                            <SelectContent>
                              {formatOptions.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Jurus <span className="text-destructive">*</span>
                          </label>
                          <Select
                            value={formData.jurus_id}
                            onValueChange={(val) =>
                              handleSelectChange("jurus_id", val)
                            }
                            disabled={isJurusDisabled}
                          >
                            <SelectTrigger className="bg-background">
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
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isJurusDisabled && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Untuk format freestyle, jurus otomatis
                              &ldquo;Freestyle&rdquo;.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Gender {!isGenderDisabled && <span className="text-destructive">*</span>}
                        </label>
                        <Select
                          value={formData.gender}
                          onValueChange={(val) =>
                            handleSelectChange("gender", val)
                          }
                          disabled={isGenderDisabled}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              placeholder={
                                isGenderDisabled
                                  ? formData.gender
                                    ? formData.gender === "putra"
                                      ? "Putra"
                                      : "Putri"
                                    : "Otomatis"
                                  : "Pilih gender"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="putra">Putra</SelectItem>
                            <SelectItem value="putri">Putri</SelectItem>
                          </SelectContent>
                        </Select>
                        {isGenderDisabled && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Gender sudah ditentukan berdasarkan format yang
                            dipilih.
                          </p>
                        )}
                      </div>

                      <Separator />

                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.back()}
                          disabled={submitting}
                          className="shadow-sm"
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="shadow-sm"
                        >
                          {submitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Simpan Perubahan
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
