"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  AlertCircle,
  Calendar,
  UserCheck,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Interface terperinci menyesuaikan response API data-lengkap
interface Sabuk {
  id: number;
  nama: string;
}

interface Jadwal {
  id: number;
  nama: string;
  hari: string | null;
  effective_from: string | null;
  effective_until: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  keterangan: string | null;
  status: string;
}

interface Pelatih {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  foto: string | null;
  tanggal_lahir: string;
  spesialisasi: string;
  tanggal_bergabung: string;
  sabuk_saat_ini: Sabuk;
}

interface Murid {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  foto: string | null;
  tanggal_lahir: string;
  tanggal_bergabung: string;
  sabuk_saat_ini: Sabuk;
}

interface KelasLengkap {
  id: number;
  nama: string;
  deskripsi: string;
  status: "aktif" | "nonaktif";
  created_at: string;
  jadwal: Jadwal[];
  pelatih: Pelatih[];
  murid: Murid[];
}

export default function KelasDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [kelas, setKelas] = useState<KelasLengkap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKelasDetailCompleto = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Mengarah ke endpoint data-lengkap yang baru
        const response = await fetch(
          `http://localhost:3001/api/admin/kelas/${id}/data-lengkap`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil detail lengkap data kelas");
        }

        const result = await response.json();
        setKelas(result.data);
      } catch (err) {
        console.error("Error fetching kelas detail:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Kelas tidak ditemukan atau terjadi kesalahan saat mengambil data",
        );
        toast.error("Gagal memuat informasi lengkap kelas.");
      } finally {
        setLoading(false);
      }
    };

    fetchKelasDetailCompleto();
  }, [id]);

  const getStatusBadgeVariant = (status: string) => {
    return status === "aktif" ? "default" : "secondary";
  };

  const getStatusLabel = (status: string) => {
    return status === "aktif" ? "Aktif" : "Tidak Aktif";
  };

  // Format Jam (hh:mm:ss -> hh:mm)
  const formatJam = (timeString: string) => {
    return timeString.substring(0, 5);
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
          <div className="flex flex-1 flex-col bg-neutral-50/50">
            <div className="mx-auto w-full max-w-4xl px-4 py-12 space-y-6">
              <div className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900"></div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Mengompilasi data lengkap kelas...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !kelas) {
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
          <div className="flex flex-1 flex-col bg-neutral-50/50">
            <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-4">
              <Link href="/admin/kelas" className="inline-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Manajemen Kelas
                </Button>
              </Link>

              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="flex items-center gap-4 pt-6">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      Terjadi Kesalahan
                    </p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </CardContent>
              </Card>
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
        <div className="flex flex-1 flex-col bg-neutral-50/50">
          <div className="@container/main mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-8 space-y-6">
            {/* Back Action & Header */}
            <div className="space-y-4">
              <Link href="/admin/kelas" className="inline-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 -ml-2 text-muted-foreground hover:text-neutral-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Manajemen Kelas
                </Button>
              </Link>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                    {kelas.nama}
                  </h1>
                  <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-2">
                    <span>ID Kelas:</span>
                    <code className="bg-neutral-100 border text-neutral-800 px-1.5 py-0.5 rounded font-mono text-[11px]">
                      {kelas.id}
                    </code>
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" asChild className="shadow-sm">
                    <Link href={`/admin/kelas/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4 text-neutral-500" />
                      Edit Kelas
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Info Card */}
            <Card className="shadow-sm overflow-hidden border-neutral-200">
              <CardHeader className="bg-neutral-50/60 border-b py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-neutral-800">
                      Detail Informasi Kelas
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Spesifikasi utama program kelas
                    </p>
                  </div>
                  <Badge
                    variant={getStatusBadgeVariant(kelas.status)}
                    className="px-3 py-0.5 shadow-none font-medium"
                  >
                    {getStatusLabel(kelas.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-neutral-100 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 pt-0">
                  <span className="text-sm font-medium text-neutral-500">
                    Deskripsi
                  </span>
                  <p className="text-sm text-neutral-800 md:col-span-2 leading-relaxed whitespace-pre-line">
                    {kelas.deskripsi || "Tidak ada deskripsi untuk kelas ini."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 pt-4">
                  <span className="text-sm font-medium text-neutral-500">
                    Status Akses
                  </span>
                  <p className="text-sm text-neutral-600 md:col-span-2">
                    {kelas.status === "aktif"
                      ? "Kelas aktif dan siap menerima distribusi alokasi murid baru."
                      : "Kelas nonaktif. Tombol tambah murid dimatikan secara sistem."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section: Jadwal & Pelatih (2 Columns Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Jadwal */}
              <Card className="shadow-sm border-neutral-200">
                <CardHeader className="border-b py-4 bg-neutral-50/30">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-800">
                    <Calendar className="size-4 text-neutral-500" />
                    Jadwal Sesi Kelas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {kelas.jadwal.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic p-2 text-center">
                      Belum ada jadwal yang dikonfigurasi.
                    </p>
                  ) : (
                    kelas.jadwal.map((j) => (
                      <div
                        key={j.id}
                        className="p-3 border rounded-lg bg-white shadow-xs space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-neutral-900">
                            {j.nama}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-semibold px-2 py-0"
                          >
                            {j.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3 text-neutral-400" />
                            <span>{j.hari || j.tanggal_mulai}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-neutral-100 text-neutral-700 font-mono px-1 py-0.5 rounded text-[10px]">
                              {formatJam(j.jam_mulai)} -{" "}
                              {formatJam(j.jam_selesai)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 pt-1 border-t border-dashed">
                          <MapPin className="size-3 text-neutral-400" />
                          <span className="truncate">{j.lokasi}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Card Pelatih */}
              <Card className="shadow-sm border-neutral-200">
                <CardHeader className="border-b py-4 bg-neutral-50/30">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-800">
                    <UserCheck className="size-4 text-neutral-500" />
                    Pelatih Utama
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {kelas.pelatih.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic p-2 text-center">
                      Belum ada pelatih yang ditugaskan.
                    </p>
                  ) : (
                    kelas.pelatih.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 border rounded-lg bg-white shadow-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-neutral-900">
                            {p.nama}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {p.email} • {p.telepon}
                          </p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            Spesialisasi:{" "}
                            <strong className="text-neutral-700">
                              {p.spesialisasi}
                            </strong>
                          </p>
                        </div>
                        <Badge className="bg-neutral-900 text-white font-medium text-[10px] px-2 py-0.5 rounded shadow-none">
                          Dan/Sabuk {p.sabuk_saat_ini.nama}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Section: Daftar Murid Terdaftar (Full Width Card) */}
            <Card className="shadow-sm border-neutral-200">
              <CardHeader className="border-b py-4 bg-neutral-50/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-800">
                  <img src={undefined} alt="" /> {/* Spacer layout */}
                  <Users className="size-4 text-neutral-500" />
                  Daftar Murid Terdaftar ({kelas.murid.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {kelas.murid.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-6 text-center">
                    Belum ada murid yang dimasukkan ke dalam kelas ini.
                  </p>
                ) : (
                  <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                    {kelas.murid.map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-4 flex items-center justify-between hover:bg-neutral-50/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-400 w-4 text-right">
                            {idx + 1}.
                          </span>
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-neutral-900">
                              {m.nama}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {m.email} • {m.telepon}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-neutral-300 text-neutral-700 font-medium text-[10px] px-2 py-0.5 shadow-xs bg-neutral-50"
                        >
                          {m.sabuk_saat_ini.nama}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
