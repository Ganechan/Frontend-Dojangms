"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { Eye, Plus, Edit, Trash2, Search, Loader2, RefreshCw, Inbox } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// ─── WhatsApp Status Types ────────────────────────────────────────────────────

type WAStatus =
  | "initializing"
  | "qr"
  | "authenticated"
  | "ready"
  | "disconnected"
  | "auth_failure";

interface WhatsAppStatusResponse {
  ready: boolean;
  status: WAStatus;
  qr: string | null;
}

// ─── Interface untuk data pengumuman ──────────────────────────────────────────

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
  // Announcements & general state
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

  // WhatsApp status state
  const [waStatus, setWaStatus] = useState<WhatsAppStatusResponse | null>(null);
  const [isLoadingWA, setIsLoadingWA] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── WhatsApp status polling ────────────────────────────────────────────────

  const fetchWAStatus = useCallback(async () => {
    setIsLoadingWA(true);
    try {
      const res = await fetch("/api/admin/whatsapp/status");
      const data: WhatsAppStatusResponse = await res.json();
      setWaStatus(data);
      return data.status;
    } catch (err) {
      console.error("Error fetching WA status:", err);
      return null;
    } finally {
      setIsLoadingWA(false);
    }
  }, []);

  const startPolling = useCallback(
    (intervalMs: number) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        const status = await fetchWAStatus();
        if (status === "ready" && intervalMs < 30_000) {
          startPolling(30_000);
        }
        if (
          (status === "qr" || status === "disconnected" || status === "auth_failure") &&
          intervalMs > 3_000
        ) {
          startPolling(3_000);
        }
      }, intervalMs);
    },
    [fetchWAStatus],
  );

  useEffect(() => {
    fetchWAStatus().then((status) => {
      startPolling(status === "ready" ? 30_000 : 3_000);
    });

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchWAStatus, startPolling]);

  // ── Fetch Announcements ────────────────────────────────────────────────────

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // ── Delete Handler ─────────────────────────────────────────────────────────

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

  const isWAReady = waStatus?.status === "ready";

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
        <div className="flex flex-1 flex-col p-4 sm:p-6 bg-[#FAFAFA] dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  Pengumuman
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Kelola pengumuman untuk murid, pelatih, dan admin
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Status Pill Badge */}
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-border px-4 py-2 rounded-full text-sm shadow-sm font-medium">
                  {isWAReady ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">Connected</span>
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
                      </span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Disconnected</span>
                    </>
                  )}
                  <div className="w-px h-4 bg-border mx-1" />
                  <button
                    onClick={() => fetchWAStatus()}
                    disabled={isLoadingWA}
                    className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
                    title="Perbarui Status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWA ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Create Button */}
                <Link href="/admin/pengumuman/tambah">
                  <Button className="bg-[#D90429] text-white hover:bg-[#b30322] font-semibold rounded-lg h-10 px-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Pengumuman
                  </Button>
                </Link>
              </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl bg-card">
                <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{summary.total}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl bg-card">
                <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Draft
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600">{summary.draft}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl bg-card">
                <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Terjadwal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{summary.terjadwal}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl bg-card">
                <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Terkirim
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{summary.terkirim}</p>
                </CardContent>
              </Card>
            </div>

            {/* ── Toolbar & Filters ── */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-4 sm:p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  type="text"
                  placeholder="Cari judul atau isi pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchAnnouncements(1);
                  }}
                  className="pl-11 bg-[#FAFAFA] dark:bg-zinc-900 border-border rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "Semua" },
                    { key: "draft", label: "Draft" },
                    { key: "terjadwal", label: "Terjadwal" },
                    { key: "terkirim", label: "Terkirim" },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={statusFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(filter.key as any)}
                      className="rounded-lg font-medium"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground pt-1 border-t border-border/40">
                Menampilkan {filteredAnnouncements.length} dari {pagination.total_data} pengumuman
              </div>
            </div>

            {/* ── Table Container ── */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/40">
                      <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4 pl-6 w-[35%]">Judul</TableHead>
                      <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">Status</TableHead>
                      <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">Tanggal Publish</TableHead>
                      <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">Dibuat Oleh</TableHead>
                      <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">Target</TableHead>
                      <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4 text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : filteredAnnouncements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-24">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-muted/60 rounded-full text-muted-foreground">
                              <Inbox className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-semibold text-foreground">Tidak ada pengumuman</h3>
                              <p className="text-sm text-muted-foreground">Silakan buat pengumuman baru untuk memulai</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAnnouncements.map((item) => (
                        <TableRow key={item.id} className="border-b border-border/40 last:border-0 hover:bg-muted/5">
                          <TableCell className="font-semibold text-foreground py-4 pl-6">
                            <div>
                              <p className="font-semibold text-foreground">
                                {item.judul}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-sm font-normal">
                                {item.isi}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant={getStatusBadgeVariant(item.status)}
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                item.status === "draft"
                                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100"
                                  : item.status === "terjadwal"
                                    ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100"
                                    : "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100"
                              }`}
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm py-4 text-muted-foreground">
                            {formatDate(item.tanggal_publish)}
                          </TableCell>
                          <TableCell className="text-sm py-4 text-muted-foreground">
                            {item.dibuat_oleh?.nama || "-"}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="rounded-full bg-muted/30">
                              {item.target.target_type === "global"
                                ? "Semua"
                                : item.target.target_type === "role"
                                  ? item.target.target_role
                                  : item.target.target_type === "kelas"
                                    ? `Kelas ${item.target.kelas_id}`
                                    : "Spesifik User"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-4 pr-6">
                            <div className="flex gap-1 justify-end">
                              <Link href={`/admin/pengumuman/${item.id}`}>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </Link>
                              <Link href={`/admin/pengumuman/${item.id}/edit`}>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                  <Edit className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-border/40">
                  <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Halaman {pagination.current_page} dari {pagination.total_page}
                  </div>
                  <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAnnouncements(pagination.current_page - 1)}
                      disabled={!pagination.has_prev || loading}
                      className="rounded-lg flex-1 sm:flex-none"
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAnnouncements(pagination.current_page + 1)}
                      disabled={!pagination.has_next || loading}
                      className="rounded-lg flex-1 sm:flex-none"
                    >
                      Selanjutnya
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
