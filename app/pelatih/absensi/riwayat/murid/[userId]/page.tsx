// app/pelatih/riwayat-absensi/murid/[userId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  CalendarDays,
  TrendingUp,
  Users,
  ClipboardX,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Statistik {
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  total_sesi: number;
}

interface RiwayatItem {
  id: number;
  tanggal: string;
  status: string;
  catatan: string | null;
  created_at: string;
  nama_murid: string;
  jadwal_id: number;
  jadwal_nama: string;
  hari_latihan: string;
  jam_mulai: string;
  jam_selesai: string;
  kelas_id: number;
  kelas_nama: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    nama: string;
    statistik: Statistik;
    riwayat: RiwayatItem[];
  };
  meta: {
    limit: number;
  };
}

const statusLabel: Record<string, string> = {
  hadir: "Hadir",
  izin: "Izin",
  sakit: "Sakit",
  alpha: "Alpha",
};

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  hadir: "default",
  izin: "secondary",
  sakit: "outline",
  alpha: "destructive",
};

export default function RiwayatAbsensiMuridPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const limit = 20; // Fixed limit, bisa juga dari query params jika perlu

  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Tidak pakai jadwalId, sesuai permintaan (opsional di backend)
      const url = `/api/pelatih/riwayat-absensi/murid/${userId}?limit=${limit}`;
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
      const msg = err.message || "Gagal memuat riwayat absensi murid.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatTanggal = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatWaktu = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const formatTanggalWaktu = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHariLabel = (hari: string) => {
    const map: Record<string, string> = {
      senin: "Senin",
      selasa: "Selasa",
      rabu: "Rabu",
      kamis: "Kamis",
      jumat: "Jumat",
      sabtu: "Sabtu",
      minggu: "Minggu",
    };
    return map[hari] || hari;
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (error) {
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
          <div className="flex flex-1 flex-col p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gagal Memuat Data</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-4"
              >
                Coba Lagi
              </Button>
            </Alert>
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
              <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.back()}
                      className="mb-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>

                  {/* Breadcrumb */}
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">
                          Dashboard
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/pelatih/absensi">
                          Absensi
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/pelatih/absensi/edit">
                          Edit Absensi
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/pelatih/absensi/rekap">
                          Rekap Kelas
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>Riwayat Murid</BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  {/* Title */}
                  {loading ? (
                    <Skeleton className="h-8 w-64" />
                  ) : data ? (
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">
                        Riwayat Absensi: {data.nama}
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Detail riwayat absensi murid ini.
                      </p>
                    </div>
                  ) : null}

                  {/* Summary Cards */}
                  {!error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {loading ? (
                        <>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Card key={i}>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-4" />
                              </CardHeader>
                              <CardContent>
                                <Skeleton className="h-8 w-12" />
                              </CardContent>
                            </Card>
                          ))}
                        </>
                      ) : data ? (
                        <>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Total Sesi
                              </CardTitle>
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {data.statistik.total_sesi}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Hadir
                              </CardTitle>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-green-600">
                                {data.statistik.total_hadir}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Izin
                              </CardTitle>
                              <Users className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-yellow-600">
                                {data.statistik.total_izin}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Sakit
                              </CardTitle>
                              <Users className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-blue-600">
                                {data.statistik.total_sakit}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Alpha
                              </CardTitle>
                              <Users className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-red-600">
                                {data.statistik.total_alpha}
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : null}
                    </div>
                  )}

                  {/* Riwayat Table */}
                  {!error && (
                    <div className="rounded-lg border">
                      {loading ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Jadwal</TableHead>
                              <TableHead>Hari</TableHead>
                              <TableHead>Jam</TableHead>
                              <TableHead>Kelas</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Catatan</TableHead>
                              <TableHead>Dibuat</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[1, 2, 3].map((i) => (
                              <TableRow key={i}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                                  <TableCell key={j}>
                                    <Skeleton className="h-4 w-16" />
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : data?.riwayat.length === 0 ? (
                        <div className="p-8 text-center">
                          <ClipboardX className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Belum Ada Riwayat Absensi
                          </h3>
                          <p className="text-muted-foreground">
                            Murid ini belum memiliki data absensi.
                          </p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Jadwal</TableHead>
                              <TableHead>Hari</TableHead>
                              <TableHead>Jam</TableHead>
                              <TableHead>Kelas</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Catatan</TableHead>
                              <TableHead>Dibuat</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data?.riwayat.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {formatTanggal(item.tanggal)}
                                </TableCell>
                                <TableCell>{item.jadwal_nama}</TableCell>
                                <TableCell>
                                  {getHariLabel(item.hari_latihan)}
                                </TableCell>
                                <TableCell>
                                  {formatWaktu(item.jam_mulai)} -{" "}
                                  {formatWaktu(item.jam_selesai)}
                                </TableCell>
                                <TableCell>{item.kelas_nama}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      statusBadgeVariant[item.status] ||
                                      "secondary"
                                    }
                                  >
                                    {statusLabel[item.status] || item.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{item.catatan || "-"}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatTanggalWaktu(item.created_at)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
