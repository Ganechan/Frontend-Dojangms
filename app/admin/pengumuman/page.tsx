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

// Interface untuk data pengumuman
interface Announcement {
  id: number;
  judul: string;
  isi: string;
  status: string; // "draft", "terjadwal", "terkirim"
  tanggal_publish: string | null;
  scheduled_at: string | null;
  kirim_whatsapp: boolean;
  created_at: string;
  dibuat_oleh: { nama: string };
  target: {
    target_type: string;
    target_role: string | null;
    kelas_id: string | null;
    target_user_ids: string | null;
  };
  whatsapp: {
    dikirim: boolean;
    statistik: {
      total_grup: number;
      terkirim: string;
      gagal: string;
      pending: string;
    };
  };
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
  total: number;
  draft: string;
  terjadwal: string;
  terkirim: string;
}

interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  summary: Summary;
  meta: {
    pagination: PaginationInfo;
  };
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
    draft: "0",
    terjadwal: "0",
    terkirim: "0",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "terjadwal" | "terkirim"
  >("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnnouncements = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("per_page", "10");
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(
        `/api/admin/pengumuman?${params.toString()}`,
      );
      const data: AnnouncementResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      if (data.success) {
        setAnnouncements(data.data || []);
        setPagination(data.meta.pagination);
        setSummary(data.summary);
        setCurrentPage(page);
      } else {
        throw new Error(data.message || "Gagal memuat data");
      }
    } catch (error: any) {
      console.error("Error fetching announcements:", error);
      toast.error(error.message || "Gagal memuat data pengumuman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [statusFilter]);

  // Filter client-side tambahan (search sudah dihandle di server, tapi kita tetap filter untuk keamanan)
  const filteredAnnouncements = announcements.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // Delete handler
  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/pengumuman/${deletingId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menghapus");
      toast.success(data.message || "Pengumuman berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchAnnouncements(1);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "terjadwal":
        return "default";
      case "terkirim":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "terjadwal":
        return "Terjadwal";
      case "terkirim":
        return "Terkirim";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
                <div className="max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="mb-8 flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        Pengumuman
                      </h1>
                      <p className="text-muted-foreground">
                        Kelola pengumuman untuk murid, pelatih, dan admin
                      </p>
                    </div>
                    <Link href="/admin/pengumuman/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Pengumuman
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
                        <p className="text-2xl font-bold">{summary.total}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Draft
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-amber-600">
                          {summary.draft}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Terjadwal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">
                          {summary.terjadwal}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Terkirim
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-green-600">
                          {summary.terkirim}
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
                        placeholder="Cari judul atau isi pengumuman..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          // auto search after typing (debounce bisa ditambahkan)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") fetchAnnouncements(1);
                        }}
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
                            statusFilter === "draft" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("draft")}
                        >
                          Draft
                        </Button>
                        <Button
                          variant={
                            statusFilter === "terjadwal" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("terjadwal")}
                        >
                          Terjadwal
                        </Button>
                        <Button
                          variant={
                            statusFilter === "terkirim" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter("terkirim")}
                        >
                          Terkirim
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Menampilkan {filteredAnnouncements.length} dari{" "}
                      {pagination.total_data} pengumuman
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[30%]">Judul</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tanggal Publish</TableHead>
                          <TableHead>Dibuat Oleh</TableHead>
                          <TableHead>Target</TableHead>
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
                        ) : filteredAnnouncements.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Tidak ada pengumuman yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAnnouncements.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {item.judul}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                                    {item.isi}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadgeVariant(item.status)}
                                >
                                  {getStatusLabel(item.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(item.tanggal_publish)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {item.dibuat_oleh?.nama || "-"}
                              </TableCell>
                              <TableCell className="text-sm">
                                <Badge variant="outline">
                                  {item.target.target_type === "global"
                                    ? "Semua"
                                    : item.target.target_type === "role"
                                      ? item.target.target_role
                                      : item.target.target_type === "kelas"
                                        ? `Kelas ${item.target.kelas_id}`
                                        : "Spesifik User"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Link href={`/admin/pengumuman/${item.id}`}>
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Link
                                    href={`/admin/pengumuman/${item.id}/edit`}
                                  >
                                    <Button size="sm" variant="ghost">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteClick(item.id)}
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
                            fetchAnnouncements(pagination.current_page - 1)
                          }
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchAnnouncements(pagination.current_page + 1)
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
            <AlertDialogTitle>Hapus Pengumuman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini
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
