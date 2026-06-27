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
import {
  SearchIcon,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EditExamModal } from "@/components/admin/ujian/edit-ujian-modal";

interface Ujian {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  level_ujian: "kota" | "provinsi";
  lokasi: string;
  keterangan: string;
  status: "terjadwal" | "selesai" | "dibatalkan";
  created_at: string;
  deleted_at: string | null; // tambahan
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

interface Summary {
  total: number | string;
  terjadwal: number | string;
  selesai: number | string;
  dibatalkan: number | string;
  kota: number | string;
  provinsi: number | string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Ujian[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    terjadwal: 0,
    selesai: 0,
    dibatalkan: 0,
    kota: 0,
    provinsi: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "terjadwal" | "selesai" | "dibatalkan"
  >("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "kota" | "provinsi">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // State untuk konfirmasi hapus
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingExamId, setDeletingExamId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEditModal = (id: number) => {
    setSelectedExamId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedExamId(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingExamId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExamId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/${deletingExamId}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus ujian");
      }

      toast.success(data.message || "Ujian berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingExamId(null);
      // Refresh data (kembali ke halaman 1)
      fetchExams(1);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat menghapus ujian");
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch exams via internal route handler
  const fetchExams = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/all?page=${page}&limit=10`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memuat data");
      setExams(data.data || []);
      setPagination({
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_page: data.pagination.total_page,
        total_data: data.pagination.total_data,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });
      setSummary(
        data.summary || {
          total: 0,
          terjadwal: 0,
          selesai: 0,
          dibatalkan: 0,
          kota: 0,
          provinsi: 0,
        },
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memuat data ujian");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Filter exams based on search and filters
  const filteredExams = exams.filter((ujian) => {
    const matchesSearch =
      ujian.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ujian.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ujian.status === statusFilter;
    const matchesLevel =
      levelFilter === "all" || ujian.level_ujian === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

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
      case "terjadwal":
        return "default";
      case "selesai":
        return "secondary";
      case "dibatalkan":
        return "destructive";
      default:
        return "default";
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    return level === "provinsi" ? "default" : "outline";
  };

  // Helper untuk menentukan apakah tombol aksi di-disable
  const isActionDisabled = (ujian: Ujian) => {
    // Jika sudah dihapus (deleted_at tidak null) => semua tombol disable
    if (ujian.deleted_at !== null) return true;
    // Jika status "dibatalkan" => semua tombol disable
    if (ujian.status === "dibatalkan") return true;
    // Jika status "selesai" => edit dan delete disable, tapi detail tetap aktif
    // Di sini kita return false karena pengecekan dilakukan per tombol
    return false;
  };

  const isEditDeleteDisabled = (ujian: Ujian) => {
    // Selesai: edit & delete disabled
    if (ujian.status === "selesai") return true;
    // Dibatalkan atau sudah dihapus (sudah ditangani isActionDisabled)
    if (ujian.status === "dibatalkan" || ujian.deleted_at !== null) return true;
    return false;
  };

  const statusFilterLabels: Record<string, string> = {
    all: "Semua",
    terjadwal: "Terjadwal",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
  };

  const levelFilterLabels: Record<string, string> = {
    all: "Semua",
    kota: "Kota",
    provinsi: "Provinsi",
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
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Ujian Kenaikan Sabuk
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Kelola ujian kenaikan sabuk dan peserta
                  </p>
                </div>
                <Link
                  href="/admin/ujianKenaikanSabuk/create"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Ujian
                  </Button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Ujian
                    </CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">{summary.total}</div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah seluruh ujian
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-sky-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">
                      Terjadwal
                    </CardTitle>
                    <Clock className="h-4 w-4 text-sky-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                        {summary.terjadwal}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Ujian yang akan datang
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
                      Ujian yang telah selesai
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-rose-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400">
                      Dibatalkan
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-rose-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                        {summary.dibatalkan}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Ujian yang dibatalkan
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Cari ujian atau lokasi..."
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
                        {(
                          ["all", "terjadwal", "selesai", "dibatalkan"] as const
                        ).map((status) => {
                          const count =
                            status === "all" ? summary.total : summary[status];
                          return (
                            <Button
                              key={status}
                              variant={
                                statusFilter === status ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setStatusFilter(status)}
                              className="text-xs h-8"
                            >
                              {statusFilterLabels[status]}
                              <span className="ml-1.5 text-[10px] opacity-70">
                                ({count})
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Level Ujian
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(["all", "kota", "provinsi"] as const).map((level) => {
                          const count =
                            level === "all" ? summary.total : summary[level];
                          return (
                            <Button
                              key={level}
                              variant={
                                levelFilter === level ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setLevelFilter(level)}
                              className="text-xs h-8"
                            >
                              {levelFilterLabels[level]}
                              <span className="ml-1.5 text-[10px] opacity-70">
                                ({count})
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[30%] font-semibold">
                          Keterangan
                        </TableHead>
                        <TableHead className="font-semibold">Lokasi</TableHead>
                        <TableHead className="font-semibold">
                          Tanggal
                        </TableHead>
                        <TableHead className="font-semibold">Level</TableHead>
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
                              <Skeleton className="h-3 w-16 mt-1.5" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1.5 justify-end">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredExams.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-16 text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <CalendarCheck className="h-10 w-10 text-muted-foreground/40" />
                              <p className="text-sm font-medium">
                                Tidak ada ujian yang ditemukan
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                Coba ubah filter atau kata kunci pencarian
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExams.map((ujian) => {
                          const disabledAll = isActionDisabled(ujian);
                          const disabledEditDelete =
                            isEditDeleteDisabled(ujian);

                          return (
                            <TableRow
                              key={ujian.id}
                              className="group transition-colors"
                            >
                              <TableCell>
                                <div>
                                  <p className="font-medium text-foreground leading-snug">
                                    {ujian.keterangan}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                    ID: {ujian.id}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {ujian.lokasi}
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="text-foreground">
                                  <p className="whitespace-nowrap">
                                    {formatDate(ujian.tanggal_mulai)}
                                  </p>
                                  {ujian.tanggal_mulai !==
                                    ujian.tanggal_selesai && (
                                    <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                                      s/d {formatDate(ujian.tanggal_selesai)}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getLevelBadgeVariant(
                                    ujian.level_ujian,
                                  )}
                                  className="capitalize"
                                >
                                  {ujian.level_ujian}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadgeVariant(ujian.status)}
                                  className="capitalize"
                                >
                                  {ujian.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <TooltipProvider>
                                  <div className="flex gap-1 justify-end">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span>
                                          <Link
                                            href={`/admin/ujianKenaikanSabuk/${ujian.id}`}
                                            className={
                                              disabledAll
                                                ? "pointer-events-none"
                                                : ""
                                            }
                                          >
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                              disabled={disabledAll}
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </Link>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>Detail</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-sky-600"
                                            onClick={() =>
                                              handleOpenEditModal(ujian.id)
                                            }
                                            disabled={disabledEditDelete}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>Ubah</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() =>
                                              handleDeleteClick(ujian.id)
                                            }
                                            disabled={disabledEditDelete}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>Hapus</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TooltipProvider>
                              </TableCell>
                            </TableRow>
                          );
                        })
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
                      onClick={() => fetchExams(pagination.current_page - 1)}
                      disabled={!pagination.has_prev}
                      className="shadow-sm"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchExams(pagination.current_page + 1)}
                      disabled={!pagination.has_next}
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

        {/* Modal Edit */}
        <EditExamModal
          examId={selectedExamId}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={() => fetchExams(pagination.current_page)}
        />

        {/* AlertDialog Konfirmasi Hapus */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Ujian</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus ujian ini? Tindakan ini akan
                menghapus data ujian secara permanen dan tidak dapat dibatalkan.
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
