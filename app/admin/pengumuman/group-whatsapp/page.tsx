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
import { Eye, Plus, Edit, Trash2, Search, Loader2, Wifi, WifiOff, QrCode, RefreshCw, Inbox } from "lucide-react";
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

// ─── WhatsApp Group Types ─────────────────────────────────────────────────────

interface WhatsAppGroup {
  id: number;
  nama_grup: string;
  group_jid: string;
  kelas_id: number | null;
  kelas_nama: string | null;
  status: string;
  created_at: string;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

interface GroupResponse {
  success: boolean;
  message: string;
  data: WhatsAppGroup[];
  meta: {
    pagination: PaginationInfo;
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WhatsAppGroupsPage() {
  // WhatsApp connection state
  const [waStatus, setWaStatus] = useState<WhatsAppStatusResponse | null>(null);
  const [isLoadingWA, setIsLoadingWA] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Groups state
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
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
        // Slow down polling once connected
        if (status === "ready" && intervalMs < 30_000) {
          startPolling(30_000);
        }
        // Speed up if disconnected/auth_failure so we catch QR quickly
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
    // Initial fetch
    fetchWAStatus().then((status) => {
      // Start fast polling if not ready, slow polling if already ready
      startPolling(status === "ready" ? 30_000 : 3_000);
    });

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchWAStatus, startPolling]);

  // ── Groups fetch ──────────────────────────────────────────────────────────

  const fetchGroups = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("per_page", "10");
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(
        `/api/admin/whatsapp-groups/terdaftar?${params.toString()}`,
      );
      const data: GroupResponse = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal memuat data");

      if (data.success) {
        setGroups(data.data || []);
        setPagination(data.meta.pagination);
      } else {
        throw new Error(data.message || "Gagal memuat data");
      }
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      toast.error(error.message || "Gagal memuat data grup WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredGroups = groups.filter(
    (item) =>
      item.nama_grup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.group_jid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Delete handler ────────────────────────────────────────────────────────

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/whatsapp-groups/${deletingId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menghapus");
      toast.success(data.message || "Grup berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchGroups(1);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

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
                  Grup WhatsApp
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Kelola grup WhatsApp yang terdaftar di sistem
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

                {/* Add Group Button */}
                {isWAReady ? (
                  <Link href="/admin/pengumuman/group-whatsapp/tambah">
                    <Button className="bg-[#D90429] text-white hover:bg-[#b30322] font-semibold rounded-lg h-10 px-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Grup
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="bg-[#E4E4E7] dark:bg-[#27272A] text-[#A1A1AA] dark:text-[#71717A] border border-border font-semibold rounded-lg h-10 px-4 cursor-not-allowed">
                    <Plus className="w-4 h-4 mr-2 text-[#A1A1AA] dark:text-[#71717A]" />
                    Tambah Grup
                  </Button>
                )}
              </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 bg-card">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4">
                  Total Grup
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  {pagination.total_data}
                </div>
              </Card>
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 bg-card">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4">
                  Aktif
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#10B981] tracking-tight">
                  {groups.filter((g) => g.status === "aktif").length}
                </div>
              </Card>
              <Card className="border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 bg-card">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4">
                  Terhubung dengan Kelas
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B82F6] tracking-tight">
                  {groups.filter((g) => g.kelas_id !== null).length}
                </div>
              </Card>
            </div>

            {/* ── Main Content Area ── */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden p-4 sm:p-6">
              {isWAReady ? (
                // ── Connected State (Table) ──
                <div className="space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                      type="text"
                      placeholder="Cari nama grup atau JID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchGroups(1);
                      }}
                      className="pl-11 bg-[#FAFAFA] dark:bg-zinc-900 border-border rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/40">
                          <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">NAMA GRUP</TableHead>
                          <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">JID</TableHead>
                          <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">KELAS</TableHead>
                          <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">STATUS</TableHead>
                          <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4">TANGGAL DIBUAT</TableHead>
                          <TableHead className="text-xs font-bold tracking-wider text-muted-foreground uppercase py-4 text-right">AKSI</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-20">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        ) : filteredGroups.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-24">
                              <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-muted/60 rounded-full text-muted-foreground">
                                  <Inbox className="w-8 h-8 stroke-[1.5]" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-base font-semibold text-foreground">Belum ada grup yang terdaftar</h3>
                                  <p className="text-sm text-muted-foreground">Klik tombol &quot;Tambah Grup&quot; untuk memulai</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredGroups.map((group) => (
                            <TableRow key={group.id} className="border-b border-border/40 last:border-0 hover:bg-muted/5">
                              <TableCell className="font-semibold text-foreground py-4">
                                {group.nama_grup}
                              </TableCell>
                              <TableCell className="text-sm font-mono text-muted-foreground py-4">
                                {group.group_jid}
                              </TableCell>
                              <TableCell className="text-sm py-4">
                                {group.kelas_nama ? (
                                  <Badge variant="outline" className="rounded-full bg-muted/30">{group.kelas_nama}</Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant={group.status === "aktif" ? "default" : "secondary"}
                                  className={`rounded-full ${
                                    group.status === "aktif"
                                      ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100"
                                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100"
                                  }`}
                                >
                                  {group.status === "aktif" ? "Aktif" : "Nonaktif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground py-4">
                                {formatDate(group.created_at)}
                              </TableCell>
                              <TableCell className="text-right py-4">
                                <div className="flex gap-1 justify-end">
                                  <Link href={`/admin/pengumuman/group-whatsapp/${group.id}`}>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                      <Eye className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                  </Link>
                                  <Link href={`/admin/pengumuman/group-whatsapp/${group.id}/edit`}>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                      <Edit className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteClick(group.id)}
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
                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <div className="text-sm text-muted-foreground">
                        Halaman {pagination.current_page} dari {pagination.total_page}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchGroups(pagination.current_page - 1)}
                          disabled={!pagination.has_prev || loading}
                          className="rounded-lg"
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchGroups(pagination.current_page + 1)}
                          disabled={!pagination.has_next || loading}
                          className="rounded-lg"
                        >
                          Selanjutnya
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // ── Disconnected State (QR Code Scan) ──
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-2 sm:p-4 lg:p-8">
                  {/* Left Column: Instructions */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2 text-[#D97706] font-semibold text-xs sm:text-sm">
                      <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                      Menunggu Scan QR
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                      Hubungkan WhatsApp
                    </h2>
                    
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
                      Scan QR Code di samping untuk menghubungkan WhatsApp Anda dengan sistem manajemen grup.
                    </p>

                    <div className="space-y-4 pt-2">
                      {[
                        {
                          num: 1,
                          text: (
                            <>
                              Buka <strong>WhatsApp</strong> di ponsel Anda
                            </>
                          ),
                        },
                        {
                          num: 2,
                          text: (
                            <>
                              Ketuk <strong>Menu</strong> atau <strong>Setelan</strong> dan pilih <strong>Perangkat Tertaut</strong>
                            </>
                          ),
                        },
                        {
                          num: 3,
                          text: (
                            <>
                              Ketuk <strong>Tautkan Perangkat</strong>
                            </>
                          ),
                        },
                      ].map((step) => (
                        <div key={step.num} className="flex items-start gap-3 sm:gap-4">
                          <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#F4F4F5] dark:bg-zinc-800 text-foreground w-8 h-8 font-bold text-sm mt-0.5">
                            {step.num}
                          </span>
                          <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: QR Code Display */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                    <div className="w-full max-w-[280px] aspect-square rounded-2xl border border-border/80 bg-white p-4 flex items-center justify-center shadow-sm">
                      {waStatus?.status === "initializing" && !waStatus.qr ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          <span className="text-xs font-medium">Menghubungkan...</span>
                        </div>
                      ) : waStatus?.qr ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={waStatus.qr}
                          alt="WhatsApp QR Code"
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          <span className="text-xs font-medium">Membuat QR Code...</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      QR Code diperbarui setiap 60 detik
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Grup WhatsApp</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus grup ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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