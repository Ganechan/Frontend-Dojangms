// app\admin\kelas-poomsae\[id]\edit\page.tsx
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
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Kelas Poomsae</h1>
                <p className="text-sm text-muted-foreground">
                  Perbarui informasi kelas pertandingan
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Form Edit Kelas Poomsae</CardTitle>
                <CardDescription>
                  Ubah detail kelas sesuai kebutuhan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Kategori Usia */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Kategori Usia *
                    </label>
                    <Select
                      value={formData.kategori_usia_id}
                      onValueChange={(val) =>
                        handleSelectChange("kategori_usia_id", val)
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
                        handleSelectChange("level_kelas_id", val)
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
                    <label className="text-sm font-medium">Format *</label>
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
                        handleSelectChange("jurus_id", val)
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

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Gender {!isGenderDisabled && "*"}
                    </label>
                    <Select
                      value={formData.gender}
                      onValueChange={(val) => handleSelectChange("gender", val)}
                      disabled={isGenderDisabled}
                    >
                      <SelectTrigger>
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
                      <p className="text-xs text-muted-foreground">
                        Gender sudah ditentukan berdasarkan format yang dipilih.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={submitting}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Simpan Perubahan
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
