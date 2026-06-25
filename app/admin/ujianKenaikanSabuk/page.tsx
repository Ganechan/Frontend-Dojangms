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
import { SearchIcon, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
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

        <div className="p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header dan tombol create - tetap sama */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Ujian Kenaikan Sabuk
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Kelola ujian kenaikan sabuk dan peserta
              </p>
            </div>
            <Link
              href="/admin/ujianKenaikanSabuk/create"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Buat Ujian
              </Button>
            </Link>
          </div>

          {/* Summary Cards - sama seperti sebelumnya */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Total Ujian
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {summary.total}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Terjadwal
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {summary.terjadwal}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Selesai
              </p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {summary.selesai}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Dibatalkan
              </p>
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {summary.dibatalkan}
              </p>
            </div>
          </div>

          {/* Filters - sama */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder="Cari ujian atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/50">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "terjadwal", "selesai", "dibatalkan"] as const).map(
                    (status) => {
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
                          className="capitalize text-xs h-8"
                        >
                          {status === "all" ? "Semua" : status}
                          <span className="ml-1 text-[10px] opacity-75">
                            ({count})
                          </span>
                        </Button>
                      );
                    },
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
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
                        variant={levelFilter === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLevelFilter(level)}
                        className="capitalize text-xs h-8"
                      >
                        {level === "all" ? "Semua" : level}
                        <span className="ml-1 text-[10px] opacity-75">
                          ({count})
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Keterangan</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Tidak ada ujian yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.map((ujian) => {
                      const disabledAll = isActionDisabled(ujian);
                      const disabledEditDelete = isEditDeleteDisabled(ujian);

                      return (
                        <TableRow key={ujian.id}>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-foreground">
                                {ujian.keterangan}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ID: {ujian.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {ujian.lokasi}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="text-foreground">
                              <p>{formatDate(ujian.tanggal_mulai)}</p>
                              {ujian.tanggal_mulai !==
                                ujian.tanggal_selesai && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  s/d {formatDate(ujian.tanggal_selesai)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getLevelBadgeVariant(ujian.level_ujian)}
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
                            <div className="flex gap-1.5 justify-end">
                              <Link
                                href={`/admin/ujianKenaikanSabuk/${ujian.id}`}
                              >
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  title="Detail"
                                  disabled={disabledAll}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700"
                                title="Ubah"
                                onClick={() => handleOpenEditModal(ujian.id)}
                                disabled={disabledEditDelete}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                title="Hapus"
                                onClick={() => handleDeleteClick(ujian.id)}
                                disabled={disabledEditDelete}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination - sama */}
          {pagination.total_page > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Halaman {pagination.current_page} dari {pagination.total_page}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchExams(pagination.current_page - 1)}
                  disabled={!pagination.has_prev}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchExams(pagination.current_page + 1)}
                  disabled={!pagination.has_next}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
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
