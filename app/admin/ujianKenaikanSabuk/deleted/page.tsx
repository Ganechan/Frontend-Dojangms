"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, SearchIcon, RotateCcw, Loader2 } from "lucide-react";
import RestoreExamDialog from "@/components/admin/ujian/restore-ujian-dialog";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DeletedExam {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  level_ujian: "kota" | "provinsi";
  lokasi: string;
  keterangan: string;
  status: string;
  created_at: string;
  deleted_at: string;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function DeletedExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<DeletedExam[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "kota" | "provinsi">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const fetchDeletedExams = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/deleted?page=${page}&limit=10`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data ujian yang dihapus",
        );
      }

      setExams(data.data || []);
      setPagination({
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_page: data.pagination.total_page,
        total_data: data.pagination.total_data,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });
    } catch (error: any) {
      console.error("Error fetching deleted exams:", error);
      toast.error(error.message || "Gagal memuat data ujian yang dihapus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedExams();
  }, []);

  // Filter exams based on search and level
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === "all" || exam.level_ujian === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleRestore = (examId: number) => {
    setSelectedExamId(examId);
    setRestoreDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedExamId) return;

    setRestoring(true);
    try {
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/${selectedExamId}/restore`,
        {
          method: "PATCH", // <-- Ubah method ke PATCH
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengembalikan ujian");
      }

      toast.success(data.message || "Ujian berhasil dipulihkan");
      // Refresh the list
      fetchDeletedExams(pagination.current_page);
      setRestoreDialogOpen(false);
      setSelectedExamId(null);
    } catch (error: any) {
      console.error("Error restoring exam:", error);
      toast.error(
        error.message || "Terjadi kesalahan saat mengembalikan ujian",
      );
    } finally {
      setRestoring(false);
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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto">
                  {/* Header */}
                  <div className="mb-8">
                    <Link href="/exams">
                      <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                      </Button>
                    </Link>

                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Ujian yang Dihapus
                    </h1>
                    <p className="text-muted-foreground">
                      Kelola dan kembalikan ujian yang telah dihapus
                    </p>
                  </div>

                  {/* Toolbar & Filters */}
                  <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <div className="space-y-4">
                      {/* Search */}
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                          type="text"
                          placeholder="Cari ujian atau lokasi..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {/* Filter & Stats */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-2">
                          <Button
                            variant={
                              levelFilter === "all" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setLevelFilter("all")}
                          >
                            Semua
                          </Button>
                          <Button
                            variant={
                              levelFilter === "kota" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setLevelFilter("kota")}
                          >
                            Kota
                          </Button>
                          <Button
                            variant={
                              levelFilter === "provinsi" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setLevelFilter("provinsi")}
                          >
                            Provinsi
                          </Button>
                        </div>
                        <div className="flex-1" />
                        <div className="text-sm text-muted-foreground">
                          Total: {pagination.total_data} ujian dihapus
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Keterangan</TableHead>
                          <TableHead>Lokasi</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Dihapus Pada</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Memuat data...
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredExams.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Tidak ada ujian yang dihapus
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredExams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium max-w-xs truncate">
                                {exam.keterangan}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {exam.lokasi}
                              </TableCell>
                              <TableCell className="text-sm">
                                {exam.level_ujian === "kota"
                                  ? formatDate(exam.tanggal_mulai)
                                  : `${formatDate(exam.tanggal_mulai)} - ${formatDate(exam.tanggal_selesai)}`}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    exam.level_ujian === "provinsi"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {exam.level_ujian === "kota"
                                    ? "Kota"
                                    : "Provinsi"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDateTime(exam.deleted_at)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRestore(exam.id)}
                                  disabled={restoring}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Kembalikan
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {pagination.total_page > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Halaman {pagination.current_page} dari{" "}
                        {pagination.total_page}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchDeletedExams(pagination.current_page - 1)
                          }
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchDeletedExams(pagination.current_page + 1)
                          }
                          disabled={!pagination.has_next || loading}
                        >
                          Selanjutnya
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Restore Dialog */}
                <RestoreExamDialog
                  open={restoreDialogOpen}
                  onOpenChange={setRestoreDialogOpen}
                  onConfirm={handleRestoreConfirm}
                  loading={restoring}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
