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
import { Eye, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
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
                <div className="max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="mb-8 flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        Kejuaraan
                      </h1>
                      <p className="text-muted-foreground">
                        Kelola kejuaraan dan peserta
                      </p>
                    </div>
                    <Link href="/admin/kejuaraan/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Kejuaraan
                      </Button>
                    </Link>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {summary.total_championship}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Akan Datang
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">
                          {summary.akan_datang}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Berlangsung
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-amber-600">
                          {summary.berlangsung}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Selesai
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-green-600">
                          {summary.selesai}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Toolbar & Filters */}
                  <div className="bg-card rounded-lg border border-border p-4 mb-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        type="text"
                        placeholder="Cari kejuaraan atau lokasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={
                            statusFilter === "all" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("all")}
                        >
                          Semua
                        </Button>
                        <Button
                          variant={
                            statusFilter === "akan_datang"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("akan_datang")}
                        >
                          Akan Datang
                        </Button>
                        <Button
                          variant={
                            statusFilter === "berlangsung"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("berlangsung")}
                        >
                          Berlangsung
                        </Button>
                        <Button
                          variant={
                            statusFilter === "selesai" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("selesai")}
                        >
                          Selesai
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Tingkat
                      </p>
                      <div className="flex flex-wrap gap-2">
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
                        <Button
                          variant={
                            levelFilter === "nasional" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setLevelFilter("nasional")}
                        >
                          Nasional
                        </Button>
                        <Button
                          variant={
                            levelFilter === "internasional"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setLevelFilter("internasional")}
                        >
                          Internasional
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Menampilkan {filteredChampionships.length} dari{" "}
                      {pagination.total_data} kejuaraan
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Nama</TableHead>
                          <TableHead>Lokasi</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Tingkat</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredChampionships.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Tidak ada kejuaraan yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredChampionships.map((championship) => (
                            <TableRow key={championship.id}>
                              <TableCell className="font-medium">
                                {championship.name}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {championship.location}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(championship.start_date)} -{" "}
                                {formatDate(championship.end_date)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
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
                                <div className="flex gap-2 justify-end">
                                  <Link
                                    href={`/admin/kejuaraan/${championship.id}`}
                                  >
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Link
                                    href={`/admin/kejuaraan/${championship.id}/edit`}
                                  >
                                    <Button size="sm" variant="ghost">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                      handleDeleteClick(championship.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
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
                            fetchChampionships(pagination.current_page - 1)
                          }
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchChampionships(pagination.current_page + 1)
                          }
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
