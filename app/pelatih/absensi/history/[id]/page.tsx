// app\pelatih\absensi\history\[id]\page.tsx
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
  Filter,
  Search,
  Pencil,
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

interface AttendanceRecord {
  tanggal: string;
  total_murid: number;
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
    jadwal_id: number;
    jadwal_nama: string;
    filter_editable: boolean;
    history: AttendanceRecord[];
  };
  meta: {
    pagination: {
      current_page: number;
      per_page: number;
      total_page: number;
      total_data: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export default function HistoryAbsensiPage() {
  const params = useParams();
  const router = useRouter();
  const jadwalId = params.id as string;

  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [pagination, setPagination] = useState<
    ApiResponse["meta"]["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const url = `/api/pelatih/absensi/${jadwalId}/history?filter=editable&page=${page}&limit=10`;
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
        setPagination(result.meta.pagination);
        setCurrentPage(page);
      } catch (err: any) {
        const msg =
          err.message ||
          "Gagal memuat history absensi. Pastikan server berjalan.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [jadwalId],
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredRecords =
    data?.history?.filter((record) =>
      record.tanggal.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const averageAttendance =
    data?.history && data.history.length > 0
      ? Math.round(
          data.history.reduce((sum, r) => sum + r.persentase_hadir, 0) /
            data.history.length,
        )
      : 0;

  const latestTotalMurid = data?.history?.[0]?.total_murid || 0;

  const handleRefresh = () => {
    fetchData(currentPage);
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

                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      History Absensi
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Daftar absensi yang masih dapat diperbarui oleh pelatih
                      (usia &lt; 7 hari).
                    </p>
                    {data && (
                      <p className="text-sm text-foreground mt-3 font-medium">
                        {data.jadwal_nama}
                      </p>
                    )}
                  </div>

                  {/* Error State */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal Memuat History Absensi</AlertTitle>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {loading ? (
                        <>
                          {[1, 2, 3, 4].map((i) => (
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
                                Total History
                              </CardTitle>
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {pagination?.total_data || 0}
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
                                {averageAttendance}%
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Total Murid
                              </CardTitle>
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {latestTotalMurid}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Filter
                              </CardTitle>
                              <Filter className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <Badge className="bg-green-600 text-white">
                                Editable
                              </Badge>
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
                          Cari
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Cari berdasarkan tanggal... (contoh: 2026-06-18)"
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
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Total Murid</TableHead>
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
                        ) : filteredRecords.length === 0 && !searchQuery ? (
                          <div className="p-8 text-center">
                            <ClipboardX className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Belum Ada History Absensi
                            </h3>
                            <p className="text-muted-foreground">
                              Belum ada data absensi yang dapat diedit (usia
                              &lt; 7 hari).
                            </p>
                          </div>
                        ) : filteredRecords.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                              Tidak ada hasil yang sesuai dengan pencarian Anda.
                            </p>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Total Murid</TableHead>
                                <TableHead>Hadir</TableHead>
                                <TableHead>Izin</TableHead>
                                <TableHead>Sakit</TableHead>
                                <TableHead>Alpha</TableHead>
                                <TableHead>Persentase Kehadiran</TableHead>
                                <TableHead>Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredRecords.map((record) => (
                                <TableRow key={record.tanggal}>
                                  <TableCell className="font-medium">
                                    {formatDate(record.tanggal)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {record.total_murid} Murid
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-green-600 text-white">
                                      {record.hadir}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-yellow-500 text-white">
                                      {record.izin}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-blue-600 text-white">
                                      {record.sakit}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-red-600 text-white">
                                      {record.alpha}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">
                                        {record.persentase_hadir}%
                                      </div>
                                      <Progress
                                        value={record.persentase_hadir}
                                        className="w-24"
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        router.push(
                                          `/pelatih/absensi/edit/${jadwalId}?tanggal=${record.tanggal}&mode=edit`,
                                        )
                                      }
                                      title="Edit absensi pada tanggal ini"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
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
                        ) : filteredRecords.length === 0 && !searchQuery ? (
                          <div className="p-8 text-center">
                            <ClipboardX className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Belum Ada History Absensi
                            </h3>
                            <p className="text-muted-foreground">
                              Belum ada data absensi yang dapat diedit (usia
                              &lt; 7 hari).
                            </p>
                          </div>
                        ) : filteredRecords.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                              Tidak ada hasil yang sesuai dengan pencarian Anda.
                            </p>
                          </div>
                        ) : (
                          filteredRecords.map((record) => (
                            <Card key={record.tanggal}>
                              <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">
                                    Tanggal
                                  </p>
                                  <p className="font-semibold">
                                    {formatDate(record.tanggal)}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                      Total Murid
                                    </p>
                                    <Badge variant="secondary">
                                      {record.total_murid} Murid
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                      Hadir
                                    </p>
                                    <Badge className="bg-green-600 text-white">
                                      {record.hadir}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Izin
                                    </p>
                                    <Badge className="bg-yellow-500 text-white">
                                      {record.izin}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Sakit
                                    </p>
                                    <Badge className="bg-blue-600 text-white">
                                      {record.sakit}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Alpha
                                    </p>
                                    <Badge className="bg-red-600 text-white">
                                      {record.alpha}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <p className="text-sm text-muted-foreground">
                                      Persentase Kehadiran
                                    </p>
                                    <p className="font-semibold">
                                      {record.persentase_hadir}%
                                    </p>
                                  </div>
                                  <Progress value={record.persentase_hadir} />
                                </div>
                                <Button
                                  onClick={() =>
                                    router.push(
                                      `/pelatih/absensi/${jadwalId}?tanggal=${record.tanggal}&mode=edit`,
                                    )
                                  }
                                  className="w-full"
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Absensi
                                </Button>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </>
                  )}

                  {/* Pagination */}
                  {!error && pagination && filteredRecords.length > 0 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Menampilkan{" "}
                        {(pagination.current_page - 1) * pagination.per_page +
                          1}{" "}
                        -{" "}
                        {Math.min(
                          pagination.current_page * pagination.per_page,
                          pagination.total_data,
                        )}{" "}
                        dari {pagination.total_data} data
                      </p>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchData(pagination.current_page - 1)}
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchData(pagination.current_page + 1)}
                          disabled={!pagination.has_next || loading}
                        >
                          Selanjutnya
                        </Button>
                      </div>
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
