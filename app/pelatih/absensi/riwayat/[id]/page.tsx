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
  Search,
  Eye,
  ClipboardX,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
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

interface MuridRekap {
  user_id: number;
  name: string;
  total_sesi: number;
  hadir: string;
  izin: string;
  sakit: string;
  alpha: string;
  persentase_hadir: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    kelas_id: number;
    filter: {
      start_date: string | null;
      end_date: string | null;
    };
    murid: MuridRekap[];
  };
}

interface JadwalResponse {
  success: boolean;
  data?: { id: number }[];
}

export default function RekapAbsensiKelasPage() {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.id as string;

  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jadwalId, setJadwalId] = useState<number | null>(null);
  const [loadingJadwal, setLoadingJadwal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/pelatih/riwayat-absensi/kelas/${kelasId}`;
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
      const msg =
        err.message || "Gagal memuat rekap absensi. Pastikan server berjalan.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [kelasId]);

  // Fetch jadwalId dari kelas
  const fetchJadwalId = useCallback(async () => {
    if (!data) return;
    setLoadingJadwal(true);
    try {
      const res = await fetch(
        `/api/pelatih/jadwal?kelas_id=${kelasId}&limit=1`,
      );
      if (!res.ok) {
        throw new Error("Gagal mengambil data jadwal");
      }
      const result: JadwalResponse = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        setJadwalId(result.data[0].id);
      } else {
        // Fallback: jika tidak ada jadwal, set ke null
        setJadwalId(null);
        console.warn("Tidak ada jadwal untuk kelas ini");
      }
    } catch (err) {
      console.error("Error fetching jadwal:", err);
      setJadwalId(null);
    } finally {
      setLoadingJadwal(false);
    }
  }, [data, kelasId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      fetchJadwalId();
    }
  }, [data, fetchJadwalId]);

  const formatPersentase = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const filteredMurid =
    data?.murid?.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const totalMurid = data?.murid?.length || 0;
  const totalSesi = data?.murid?.[0]?.total_sesi || 0;
  const rataKehadiran =
    totalMurid > 0
      ? Math.round(
          data!.murid.reduce((sum, m) => sum + m.persentase_hadir, 0) /
            totalMurid,
        )
      : 0;

  const handleRefresh = () => {
    fetchData();
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
                      <BreadcrumbItem>Rekap Kelas</BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      Rekap Absensi Kelas
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Rekap absensi per murid untuk kelas ini.
                    </p>
                  </div>

                  {/* Error State */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal Memuat Rekap</AlertTitle>
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
                  )}

                  {/* Summary Cards */}
                  {!error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {loading ? (
                        <>
                          {[1, 2, 3].map((i) => (
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
                      ) : (
                        <>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Total Murid
                              </CardTitle>
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {totalMurid}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Total Sesi
                              </CardTitle>
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {totalSesi}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Rata-rata Kehadiran
                              </CardTitle>
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {rataKehadiran}%
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>
                  )}

                  {/* Search Section */}
                  {!error && data && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          Cari Murid
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Cari berdasarkan nama murid..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Table/Cards */}
                  {!error && (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block rounded-lg border">
                        {loading ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nama Murid</TableHead>
                                <TableHead>Total Sesi</TableHead>
                                <TableHead>Hadir</TableHead>
                                <TableHead>Izin</TableHead>
                                <TableHead>Sakit</TableHead>
                                <TableHead>Alpha</TableHead>
                                <TableHead>Persentase Kehadiran</TableHead>
                                <TableHead>Aksi</TableHead>
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
                        ) : filteredMurid.length === 0 ? (
                          <div className="p-8 text-center">
                            <ClipboardX className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Belum Ada Data Murid
                            </h3>
                            <p className="text-muted-foreground">
                              Tidak ada murid yang terdaftar di kelas ini atau
                              belum ada data absensi.
                            </p>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nama Murid</TableHead>
                                <TableHead>Total Sesi</TableHead>
                                <TableHead>Hadir</TableHead>
                                <TableHead>Izin</TableHead>
                                <TableHead>Sakit</TableHead>
                                <TableHead>Alpha</TableHead>
                                <TableHead>Persentase Kehadiran</TableHead>
                                <TableHead className="text-center">
                                  Aksi
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredMurid.map((murid) => (
                                <TableRow key={murid.user_id}>
                                  <TableCell className="font-medium">
                                    {murid.name}
                                  </TableCell>
                                  <TableCell>{murid.total_sesi}</TableCell>
                                  <TableCell>
                                    <Badge className="bg-green-600 text-white">
                                      {murid.hadir}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-yellow-500 text-white">
                                      {murid.izin}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-blue-600 text-white">
                                      {murid.sakit}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-red-600 text-white">
                                      {murid.alpha}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">
                                        {formatPersentase(
                                          murid.persentase_hadir,
                                        )}
                                      </div>
                                      <Progress
                                        value={murid.persentase_hadir}
                                        className="w-24"
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {jadwalId ? (
                                      <Link
                                        href={`/pelatih/absensi/riwayat/murid/${murid.user_id}?jadwalId=${jadwalId}`}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          title="Lihat detail rekap murid ini"
                                        >
                                          <Eye className="h-4 w-4" />
                                          Detail
                                        </Button>
                                      </Link>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        title="Jadwal tidak ditemukan"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-4">
                        {loading ? (
                          <>
                            {[1, 2, 3].map((i) => (
                              <Card key={i}>
                                <CardContent className="pt-6 space-y-3">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-4 w-20" />
                                </CardContent>
                              </Card>
                            ))}
                          </>
                        ) : filteredMurid.length === 0 ? (
                          <div className="p-8 text-center">
                            <ClipboardX className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Belum Ada Data Murid
                            </h3>
                            <p className="text-muted-foreground">
                              Tidak ada murid yang terdaftar di kelas ini atau
                              belum ada data absensi.
                            </p>
                          </div>
                        ) : (
                          filteredMurid.map((murid) => (
                            <Card key={murid.user_id}>
                              <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">
                                    Nama Murid
                                  </p>
                                  <p className="font-semibold">{murid.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                      Total Sesi
                                    </p>
                                    <Badge variant="secondary">
                                      {murid.total_sesi}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                      Hadir
                                    </p>
                                    <Badge className="bg-green-600 text-white">
                                      {murid.hadir}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Izin
                                    </p>
                                    <Badge className="bg-yellow-500 text-white">
                                      {murid.izin}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Sakit
                                    </p>
                                    <Badge className="bg-blue-600 text-white">
                                      {murid.sakit}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Alpha
                                    </p>
                                    <Badge className="bg-red-600 text-white">
                                      {murid.alpha}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <p className="text-sm text-muted-foreground">
                                      Persentase Kehadiran
                                    </p>
                                    <p className="font-semibold">
                                      {formatPersentase(murid.persentase_hadir)}
                                    </p>
                                  </div>
                                  <Progress value={murid.persentase_hadir} />
                                </div>
                                {jadwalId ? (
                                  <Link
                                    href={`/pelatih/absensi/riwayat/murid/${murid.user_id}`}
                                  >
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Detail
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    disabled
                                  >
                                    Detail (Tidak Tersedia)
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </>
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
