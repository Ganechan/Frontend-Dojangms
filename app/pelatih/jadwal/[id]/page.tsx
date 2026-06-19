"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  BookOpen,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// ============ INTERFACES ============
interface Periode {
  effective_from: string | null;
  effective_until: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
}

interface Kelas {
  id: number;
  nama: string;
  deskripsi: string;
  status: string;
  created_at: string;
  jumlah_murid_aktif: number;
}

interface JadwalDetail {
  id: number;
  nama: string;
  tipe: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  keterangan: string | null;
  status: string;
  periode: Periode;
  kelas: Kelas;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: JadwalDetail;
}

export default function DetailJadwalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<JadwalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/pelatih/jadwal/${id}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat data");
      }
      const result: ApiResponse = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Gagal memuat data");
      }
      setData(result.data);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat detail jadwal";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    fetchData();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const hariMap: Record<string, string> = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jumat",
    sabtu: "Sabtu",
    minggu: "Minggu",
  };

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Gagal Memuat Data Jadwal</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Coba Lagi
          </Button>
        </Alert>
      </div>
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
              <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white">
                  <div className="flex flex-col gap-4 p-4 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                      >
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                      </Button>
                    </div>

                    {loading ? (
                      <>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </>
                    ) : data ? (
                      <>
                        <div>
                          <Breadcrumb>
                            <BreadcrumbList>
                              <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">
                                  Dashboard
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                <BreadcrumbLink href="/pelatih/kelasJadwal">
                                  Kelas Saya
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                <BreadcrumbLink
                                  href={`/pelatih/kelas/${data.kelas.id}`}
                                >
                                  {data.kelas.nama}
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                <BreadcrumbPage>Detail Jadwal</BreadcrumbPage>
                              </BreadcrumbItem>
                            </BreadcrumbList>
                          </Breadcrumb>
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold tracking-tight">
                            {data.nama}
                          </h1>
                          <p className="mt-2 text-muted-foreground">
                            Detail jadwal latihan dan informasi terkait.
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="p-4 md:p-8">
                  {/* Summary Cards */}
                  {loading ? (
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                      ))}
                    </div>
                  ) : data ? (
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Nama Jadwal
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{data.nama}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge
                            variant={
                              data.status === "aktif" ? "default" : "secondary"
                            }
                            className={
                              data.status === "aktif" ? "bg-green-600" : ""
                            }
                          >
                            {capitalize(data.status)}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tipe
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline">
                            {capitalize(data.tipe)}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Kelas Terkait
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data.kelas.nama}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {data.kelas.jumlah_murid_aktif} murid aktif
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}

                  {/* Main Content */}
                  <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
                    <div className="md:col-span-2 lg:col-span-3">
                      {loading ? (
                        <Card>
                          <CardHeader>
                            <Skeleton className="h-8 w-1/3" />
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                              <Skeleton key={i} className="h-10" />
                            ))}
                          </CardContent>
                        </Card>
                      ) : data ? (
                        <Card>
                          <CardHeader>
                            <CardTitle>Informasi Jadwal</CardTitle>
                            <CardDescription>
                              Detail lengkap jadwal latihan
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Nama Jadwal
                                </label>
                                <p className="mt-2 text-lg font-semibold">
                                  {data.nama}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Tipe
                                </label>
                                <p className="mt-2 text-lg font-semibold">
                                  {capitalize(data.tipe)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Hari
                                </label>
                                <p className="mt-2 text-lg font-semibold">
                                  {hariMap[data.hari] || capitalize(data.hari)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Waktu
                                </label>
                                <p className="mt-2 text-lg font-semibold">
                                  {data.jam_mulai} - {data.jam_selesai}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Lokasi
                                </label>
                                <p className="mt-2 text-lg font-semibold">
                                  {data.lokasi}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Status
                                </label>
                                <div className="mt-2">
                                  <Badge
                                    variant={
                                      data.status === "aktif"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={
                                      data.status === "aktif"
                                        ? "bg-green-600"
                                        : ""
                                    }
                                  >
                                    {capitalize(data.status)}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Keterangan */}
                            {data.keterangan && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Keterangan
                                </label>
                                <p className="mt-2 text-base">
                                  {data.keterangan}
                                </p>
                              </div>
                            )}

                            {/* Periode */}
                            <div className="border-t pt-4">
                              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                Periode Berlakunya
                              </h3>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Mulai Efektif
                                  </p>
                                  <p className="font-semibold">
                                    {formatDate(data.periode.effective_from)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Sampai Efektif
                                  </p>
                                  <p className="font-semibold">
                                    {formatDate(data.periode.effective_until) ||
                                      "Tidak terbatas"}
                                  </p>
                                </div>
                                {data.periode.tanggal_mulai && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Tanggal Mulai
                                    </p>
                                    <p className="font-semibold">
                                      {formatDate(data.periode.tanggal_mulai)}
                                    </p>
                                  </div>
                                )}
                                {data.periode.tanggal_selesai && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Tanggal Selesai
                                    </p>
                                    <p className="font-semibold">
                                      {formatDate(data.periode.tanggal_selesai)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Kelas Terkait */}
                            <div className="border-t pt-4">
                              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                Kelas Terkait
                              </h3>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Nama Kelas
                                  </p>
                                  <p className="font-semibold">
                                    {data.kelas.nama}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Status Kelas
                                  </p>
                                  <Badge
                                    variant={
                                      data.kelas.status === "aktif"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={
                                      data.kelas.status === "aktif"
                                        ? "bg-green-600"
                                        : ""
                                    }
                                  >
                                    {capitalize(data.kelas.status)}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Murid Aktif
                                  </p>
                                  <p className="font-semibold">
                                    {data.kelas.jumlah_murid_aktif} murid
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Dibuat
                                  </p>
                                  <p className="font-semibold">
                                    {formatDate(data.kelas.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  Deskripsi Kelas
                                </p>
                                <p className="text-base">
                                  {data.kelas.deskripsi || "-"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : null}
                    </div>

                    {/* Right Sidebar */}
                    {loading ? (
                      <Skeleton className="h-64" />
                    ) : data ? (
                      <Card className="md:sticky md:top-4 md:h-fit">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Ringkasan Jadwal
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Nama Jadwal
                            </p>
                            <p className="font-semibold">{data.nama}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Hari & Waktu
                            </p>
                            <p className="font-semibold">
                              {hariMap[data.hari] || capitalize(data.hari)},{" "}
                              {data.jam_mulai} - {data.jam_selesai}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Lokasi
                            </p>
                            <p className="font-semibold">{data.lokasi}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Status
                            </p>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  data.status === "aktif"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  data.status === "aktif" ? "bg-green-600" : ""
                                }
                              >
                                {capitalize(data.status)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Kelas
                            </p>
                            <p className="font-semibold">{data.kelas.nama}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
