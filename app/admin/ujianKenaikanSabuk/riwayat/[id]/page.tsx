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
  ChevronLeft,
  ChevronRight,
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
import { Separator } from "@/components/ui/separator";
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
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      case "tidak_lulus":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400";
      case "terdaftar":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
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
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-36 rounded-xl" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-96 rounded-xl" />
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
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Link href="/admin/ujianKenaikanSabuk/riwayat">
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="shadow-sm"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                <div className="border-b pb-4">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Detail Hasil Ujian
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
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
                <Card className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-base">
                      Informasi Ujian
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Level Ujian
                        </p>
                        <p className="text-sm font-semibold capitalize">
                          {data.ujian.level_ujian}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Lokasi
                        </p>
                        <p className="text-sm font-semibold">
                          {data.ujian.lokasi}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Keterangan
                        </p>
                        <p className="text-sm font-semibold">
                          {data.ujian.keterangan}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Status
                        </p>
                        <Badge variant="default" className="capitalize">
                          {data.ujian.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Tanggal Mulai
                        </p>
                        <p className="text-sm font-semibold">
                          {formatDate(data.ujian.tanggal_mulai)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Tanggal Selesai
                        </p>
                        <p className="text-sm font-semibold">
                          {formatDate(data.ujian.tanggal_selesai)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Summary Cards */}
              {data && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium">
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

                  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Lulus
                      </CardTitle>
                      <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {data.summary.lulus}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-rose-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium text-rose-700 dark:text-rose-400">
                        Tidak Lulus
                      </CardTitle>
                      <CircleX className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {data.summary.tidak_lulus}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-sky-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium text-sky-700 dark:text-sky-400">
                        Sudah Diedit
                      </CardTitle>
                      <FilePenLine className="h-4 w-4 text-sky-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                        {data.summary.sudah_diedit}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-emerald-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        % Lulus
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {data.summary.persentase_lulus}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-rose-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium text-rose-700 dark:text-rose-400">
                        % Tidak Lulus
                      </CardTitle>
                      <TrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {data.summary.persentase_tidak_lulus}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Search Section */}
              {data && data.peserta.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama, email, atau nomor telepon peserta..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Table - Desktop View */}
              {data && filteredPeserta.length > 0 && (
                <div className="hidden md:block">
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-semibold">
                              Peserta
                            </TableHead>
                            <TableHead className="font-semibold">
                              Sabuk Asal
                            </TableHead>
                            <TableHead className="font-semibold">
                              Sabuk Tujuan
                            </TableHead>
                            <TableHead className="font-semibold">
                              Status Kelulusan
                            </TableHead>
                            <TableHead className="font-semibold">
                              Tanggal Lulus
                            </TableHead>
                            <TableHead className="font-semibold">
                              Tanggal Edit
                            </TableHead>
                            <TableHead className="font-semibold">
                              Status Edit
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPeserta.map((peserta) => (
                            <TableRow
                              key={peserta.peserta_id}
                              className="group transition-colors"
                            >
                              <TableCell>
                                <div>
                                  <p className="font-medium text-foreground leading-snug">
                                    {peserta.user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {peserta.user.email}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono">
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
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatDateTime(peserta.tanggal_lulus)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatDateTime(peserta.tanggal_edit)}
                              </TableCell>
                              <TableCell>
                                {peserta.tanggal_edit ? (
                                  <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
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
                    </div>
                  </Card>
                </div>
              )}

              {/* Card View - Mobile */}
              {data && filteredPeserta.length > 0 && (
                <div className="md:hidden space-y-3">
                  {filteredPeserta.map((peserta) => (
                    <Card key={peserta.peserta_id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {peserta.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {peserta.user.email}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {peserta.user.phone}
                            </p>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Sabuk Asal
                              </p>
                              <Badge
                                variant="outline"
                                className="capitalize"
                              >
                                {peserta.belt_asal.name}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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

                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Status Kelulusan
                            </p>
                            <Badge
                              className={getStatusColor(peserta.status)}
                            >
                              {getStatusLabel(peserta.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Tanggal Lulus
                              </p>
                              <p className="text-sm">
                                {formatDateTime(peserta.tanggal_lulus)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Tanggal Edit
                              </p>
                              <p className="text-sm">
                                {formatDateTime(peserta.tanggal_edit)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Status Edit
                            </p>
                            {peserta.tanggal_edit ? (
                              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
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
                  <Card>
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm font-medium">
                          Belum Ada Peserta
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          Belum ada peserta yang terdaftar pada ujian ini.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* No Search Results */}
              {data &&
                filteredPeserta.length === 0 &&
                searchQuery !== "" && (
                  <Card>
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Search className="h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm font-medium">
                          Tidak Ada Hasil
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          Tidak ada peserta yang sesuai dengan pencarian
                          &ldquo;{searchQuery}&rdquo;.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Pagination */}
              {pagination && pagination.total_data > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Menampilkan{" "}
                    <span className="font-medium text-foreground">
                      {(pagination.current_page - 1) * pagination.per_page + 1}
                    </span>
                    {" - "}
                    <span className="font-medium text-foreground">
                      {Math.min(
                        pagination.current_page * pagination.per_page,
                        pagination.total_data,
                      )}
                    </span>
                    {" dari "}
                    <span className="font-medium text-foreground">
                      {pagination.total_data}
                    </span>{" "}
                    peserta
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchData(pagination.current_page - 1)}
                      disabled={!pagination.has_prev || loading}
                      className="shadow-sm"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchData(pagination.current_page + 1)}
                      disabled={!pagination.has_next || loading}
                      className="shadow-sm"
                    >
                      Selanjutnya
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
