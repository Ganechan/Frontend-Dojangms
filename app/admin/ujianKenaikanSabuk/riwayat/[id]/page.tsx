"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  BadgeCheck,
  CircleX,
  FilePenLine,
  TrendingUp,
  TrendingDown,
  Search,
  ClipboardList,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
}

interface Belt {
  id: number;
  name: string;
}

interface Peserta {
  peserta_id: number;
  user: User;
  belt_asal: Belt;
  belt_tujuan: Belt;
  status: "lulus" | "tidak_lulus" | "terdaftar";
  tanggal_lulus: string | null;
  tanggal_edit: string | null;
}

interface Ujian {
  id: number;
  level_ujian: string;
  lokasi: string;
  keterangan: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

interface Summary {
  total_peserta: number;
  terdaftar: string;
  lulus: string;
  tidak_lulus: string;
  sudah_diedit: string;
  persentase_lulus: number;
  persentase_tidak_lulus: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    ujian: Ujian;
    summary: Summary;
    peserta: Peserta[];
  };
  pagination: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export default function DetailHasilUjianPage() {
  const params = useParams();
  const ujianId = params.id as string;

  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/admin/ujian/${ujianId}/hasil-peserta?page=${page}&limit=10`;
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
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      const msg =
        err.message || "Terjadi kesalahan saat mengambil data hasil ujian.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [ujianId]);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMMM yyyy HH:mm", {
      locale: idLocale,
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString + "T00:00:00"), "d MMMM yyyy", {
      locale: idLocale,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lulus":
        return "bg-green-100 text-green-800";
      case "tidak_lulus":
        return "bg-red-100 text-red-800";
      case "terdaftar":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "lulus":
        return "Lulus";
      case "tidak_lulus":
        return "Tidak Lulus";
      case "terdaftar":
        return "Terdaftar";
      default:
        return status;
    }
  };

  const filteredPeserta =
    data?.peserta?.filter(
      (p) =>
        p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.phone.includes(searchQuery),
    ) || [];

  const handleRefresh = () => {
    fetchData(currentPage);
  };

  if (loading && !data) {
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
            <div className="max-w-7xl mx-auto w-full space-y-8">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <Skeleton className="h-96" />
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
              <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Link href="/admin/ujianKenaikanSabuk/riwayat">
                        <Button variant="outline" size="icon">
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={loading}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>

                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Detail Hasil Ujian
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Lihat hasil kelulusan peserta ujian kenaikan sabuk.
                      </p>
                    </div>
                  </div>

                  {/* Error State */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal Memuat Hasil Ujian</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchData(currentPage)}
                        className="mt-4"
                      >
                        Coba Lagi
                      </Button>
                    </Alert>
                  )}

                  {/* Ujian Information Card */}
                  {data && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Informasi Ujian
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Level Ujian
                            </p>
                            <p className="text-base font-semibold capitalize">
                              {data.ujian.level_ujian}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Lokasi
                            </p>
                            <p className="text-base font-semibold">
                              {data.ujian.lokasi}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Keterangan
                            </p>
                            <p className="text-base font-semibold">
                              {data.ujian.keterangan}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Status
                            </p>
                            <Badge variant="default" className="capitalize">
                              {data.ujian.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Tanggal Mulai
                            </p>
                            <p className="text-base font-semibold">
                              {formatDate(data.ujian.tanggal_mulai)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Tanggal Selesai
                            </p>
                            <p className="text-base font-semibold">
                              {formatDate(data.ujian.tanggal_selesai)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Summary Cards */}
                  {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Peserta
                          </CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data.summary.total_peserta}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Lulus
                          </CardTitle>
                          <BadgeCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {data.summary.lulus}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Tidak Lulus
                          </CardTitle>
                          <CircleX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {data.summary.tidak_lulus}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Sudah Diedit
                          </CardTitle>
                          <FilePenLine className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {data.summary.sudah_diedit}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Persentase Lulus
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {data.summary.persentase_lulus}%
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Persentase Tidak Lulus
                          </CardTitle>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {data.summary.persentase_tidak_lulus}%
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Search Section */}
                  {data && data.peserta.length > 0 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama peserta..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}

                  {/* Table - Desktop View */}
                  {data && filteredPeserta.length > 0 && (
                    <div className="hidden md:block">
                      <Card>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Peserta</TableHead>
                                <TableHead>Sabuk Asal</TableHead>
                                <TableHead>Sabuk Tujuan</TableHead>
                                <TableHead>Status Kelulusan</TableHead>
                                <TableHead>Tanggal Lulus</TableHead>
                                <TableHead>Tanggal Edit</TableHead>
                                <TableHead>Status Edit</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredPeserta.map((peserta) => (
                                <TableRow key={peserta.peserta_id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-semibold">
                                        {peserta.user.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {peserta.user.email}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {peserta.user.phone}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="capitalize"
                                    >
                                      {peserta.belt_asal.name}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="capitalize"
                                    >
                                      {peserta.belt_tujuan.name}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={getStatusColor(peserta.status)}
                                    >
                                      {getStatusLabel(peserta.status)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {formatDateTime(peserta.tanggal_lulus)}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {formatDateTime(peserta.tanggal_edit)}
                                  </TableCell>
                                  <TableCell>
                                    {peserta.tanggal_edit ? (
                                      <Badge
                                        variant="default"
                                        className="bg-blue-600"
                                      >
                                        Sudah Diedit
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">
                                        Belum Diedit
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Card View - Mobile */}
                  {data && filteredPeserta.length > 0 && (
                    <div className="md:hidden space-y-4">
                      {filteredPeserta.map((peserta) => (
                        <Card key={peserta.peserta_id}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <p className="font-semibold text-base">
                                  {peserta.user.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {peserta.user.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {peserta.user.phone}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Sabuk Asal
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {peserta.belt_asal.name}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Sabuk Tujuan
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {peserta.belt_tujuan.name}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Status Kelulusan
                                </p>
                                <Badge
                                  className={getStatusColor(peserta.status)}
                                >
                                  {getStatusLabel(peserta.status)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Tanggal Lulus
                                  </p>
                                  <p>{formatDateTime(peserta.tanggal_lulus)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Tanggal Edit
                                  </p>
                                  <p>{formatDateTime(peserta.tanggal_edit)}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Status Edit
                                </p>
                                {peserta.tanggal_edit ? (
                                  <Badge
                                    variant="default"
                                    className="bg-blue-600"
                                  >
                                    Sudah Diedit
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Belum Diedit</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {data &&
                    filteredPeserta.length === 0 &&
                    searchQuery === "" && (
                      <div className="text-center py-12">
                        <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Belum Ada Peserta
                        </h3>
                        <p className="text-muted-foreground">
                          Belum ada peserta yang terdaftar pada ujian ini.
                        </p>
                      </div>
                    )}

                  {/* No Search Results */}
                  {data &&
                    filteredPeserta.length === 0 &&
                    searchQuery !== "" && (
                      <div className="text-center py-12">
                        <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Tidak Ada Hasil
                        </h3>
                        <p className="text-muted-foreground">
                          Tidak ada peserta yang sesuai dengan pencarian Anda.
                        </p>
                      </div>
                    )}

                  {/* Pagination */}
                  {pagination && pagination.total_data > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        Menampilkan{" "}
                        {(pagination.current_page - 1) * pagination.per_page +
                          1}{" "}
                        -{" "}
                        {Math.min(
                          pagination.current_page * pagination.per_page,
                          pagination.total_data,
                        )}{" "}
                        dari {pagination.total_data} peserta
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => fetchData(pagination.current_page - 1)}
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
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
