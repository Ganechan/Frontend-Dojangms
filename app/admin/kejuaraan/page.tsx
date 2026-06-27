"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  Trophy,
  Clock,
  Zap,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Championship {
  id: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

interface SummaryData {
  total_championship: number;
  akan_datang: string;
  berlangsung: string;
  selesai: string;
}

interface ChampionshipResponse {
  success: boolean;
  message: string;
  data: Championship[];
  meta: {
    pagination: PaginationInfo;
    summary: SummaryData;
  };
}

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [summary, setSummary] = useState<SummaryData>({
    total_championship: 0,
    akan_datang: "0",
    berlangsung: "0",
    selesai: "0",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "akan_datang" | "berlangsung" | "selesai"
  >("all");
  const [levelFilter, setLevelFilter] = useState<
    "all" | "kota" | "provinsi" | "nasional" | "internasional"
  >("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // State untuk delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchChampionships = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kejuaraan/getall?page=${page}&per_page=10`,
      );
      const data: ChampionshipResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      if (data.success) {
        setChampionships(data.data || []);
        setPagination(data.meta.pagination);
        setSummary(data.meta.summary);
        setCurrentPage(page);
      } else {
        throw new Error(data.message || "Gagal memuat data");
      }
    } catch (error: any) {
      console.error("Error fetching championships:", error);
      toast.error(error.message || "Gagal memuat data kejuaraan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampionships();
  }, []);

  const filteredChampionships = championships.filter((championship) => {
    const matchesSearch =
      championship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || championship.status === statusFilter;
    const matchesLevel =
      levelFilter === "all" || championship.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Fungsi untuk menghapus kejuaraan
  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/kejuaraan/${deletingId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus kejuaraan");
      }

      toast.success(data.message || "Kejuaraan berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      // Refresh data ke halaman 1
      fetchChampionships(1);
    } catch (error: any) {
      console.error("Error deleting championship:", error);
      toast.error(
        error.message || "Terjadi kesalahan saat menghapus kejuaraan",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "akan_datang":
        return "default";
      case "berlangsung":
        return "secondary";
      case "selesai":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "akan_datang":
        return "Akan Datang";
      case "berlangsung":
        return "Berlangsung";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  const getLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const statusFilterOptions = [
    { value: "all", label: "Semua" },
    { value: "akan_datang", label: "Akan Datang" },
    { value: "berlangsung", label: "Berlangsung" },
    { value: "selesai", label: "Selesai" },
  ] as const;

  const levelFilterOptions = [
    { value: "all", label: "Semua" },
    { value: "kota", label: "Kota" },
    { value: "provinsi", label: "Provinsi" },
    { value: "nasional", label: "Nasional" },
    { value: "internasional", label: "Internasional" },
  ] as const;

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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Kejuaraan
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Kelola kejuaraan dan peserta
                  </p>
                </div>
                <Link href="/admin/kejuaraan/create">
                  <Button className="w-full sm:w-auto shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Kejuaraan
                  </Button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Kejuaraan
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">
                        {summary.total_championship}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah seluruh kejuaraan
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-sky-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">
                      Akan Datang
                    </CardTitle>
                    <Clock className="h-4 w-4 text-sky-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                        {summary.akan_datang}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kejuaraan yang akan datang
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-amber-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Berlangsung
                    </CardTitle>
                    <Zap className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {summary.berlangsung}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Sedang berlangsung
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-emerald-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Selesai
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {summary.selesai}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kejuaraan yang telah selesai
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Toolbar & Filters */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Cari kejuaraan atau lokasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background"
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {statusFilterOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            variant={
                              statusFilter === opt.value ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setStatusFilter(
                                opt.value as typeof statusFilter,
                              )
                            }
                            className="text-xs h-8"
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tingkat
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {levelFilterOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            variant={
                              levelFilter === opt.value ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setLevelFilter(opt.value as typeof levelFilter)
                            }
                            className="text-xs h-8"
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-1">
                    Menampilkan{" "}
                    <span className="font-medium text-foreground">
                      {filteredChampionships.length}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium text-foreground">
                      {pagination.total_data}
                    </span>{" "}
                    kejuaraan
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">Nama</TableHead>
                        <TableHead className="font-semibold">Lokasi</TableHead>
                        <TableHead className="font-semibold">
                          Tanggal
                        </TableHead>
                        <TableHead className="font-semibold">
                          Tingkat
                        </TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-5 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-48" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredChampionships.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-16 text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Trophy className="h-10 w-10 text-muted-foreground/40" />
                              <p className="text-sm font-medium">
                                Tidak ada kejuaraan yang ditemukan
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                Coba ubah filter atau kata kunci pencarian
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredChampionships.map((championship) => (
                          <TableRow
                            key={championship.id}
                            className="group transition-colors"
                          >
                            <TableCell>
                              <p className="font-medium text-foreground leading-snug">
                                {championship.name}
                              </p>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {championship.location}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="text-foreground">
                                <p className="whitespace-nowrap">
                                  {formatDate(championship.start_date)}
                                </p>
                                {championship.start_date !==
                                  championship.end_date && (
                                  <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                                    s/d {formatDate(championship.end_date)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {getLevelLabel(championship.level)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(
                                  championship.status,
                                )}
                              >
                                {getStatusLabel(championship.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <div className="flex gap-1 justify-end">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/admin/kejuaraan/${championship.id}`}
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>Detail</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/admin/kejuaraan/${championship.id}/edit`}
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-muted-foreground hover:text-sky-600"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>Ubah</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                          handleDeleteClick(championship.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Hapus</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Pagination */}
              {pagination.total_page > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Halaman{" "}
                    <span className="font-medium text-foreground">
                      {pagination.current_page}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium text-foreground">
                      {pagination.total_page}
                    </span>
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchChampionships(pagination.current_page - 1)
                      }
                      disabled={!pagination.has_prev || loading}
                      className="shadow-sm"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchChampionships(pagination.current_page + 1)
                      }
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kejuaraan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kejuaraan ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
