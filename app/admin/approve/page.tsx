"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserRoundPlus,
  List,
  Search,
  Eye,
  UserCheck,
  UserX,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// ─── WhatsApp Status Types ────────────────────────────────────────────────────

interface WhatsAppStatusData {
  connected: boolean;
  qrCode: string | null;
  message: string;
}

interface WhatsAppStatusResponse {
  enabled: boolean;
  ready: boolean;
  status: string; // misal "qr", "connected", "disconnected", dll.
  qr: string | null; // base64 data URI jika status "qr", null jika tidak
  message?: string | null; // optional human-readable message from the API
}
// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  created_at: string;
}

interface Pagination {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
  has_prev: boolean;
  has_next: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: PendingUser[];
  pagination: Pagination;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()} ${hh}:${mm}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const PAGE_SIZE_OPTIONS = ["10", "25", "50", "100", "200"];
const API_BASE = "/api/auth/user-pending";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCards({
  totalData,
  displayed,
  loading,
}: {
  totalData: number;
  displayed: number;
  loading: boolean;
}) {
  const cards = [
    {
      title: "Total Pending",
      icon: UserRoundPlus,
      value: totalData,
      color: "text-amber-600 dark:text-amber-450",
      bg: "bg-amber-50 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30",
    },
    {
      title: "Ditampilkan",
      icon: List,
      value: displayed,
      color: "text-blue-600 dark:text-blue-450",
      bg: "bg-blue-50 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="transition-all duration-300 hover:shadow-xs border border-border bg-card rounded-xl p-4 sm:p-5 flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {card.value.toLocaleString("id-ID")}
                </p>
              )}
            </div>
            <div className={`rounded-xl p-2.5 ${card.bg} shrink-0`}>
              <Icon className={`size-5 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UserAvatar({ user }: { user: PendingUser }) {
  const initials = getInitials(user.name);
  const colorClass = getAvatarColor(user.id);
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase border border-foreground/5 shadow-xs ${colorClass}`}
    >
      {initials}
    </span>
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant,
  onConfirm,
  loading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: "default" | "destructive";
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
            className={
              confirmVariant === "default" && confirmLabel === "Setujui"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800"
                : ""
            }
          >
            {loading ? (
              <RefreshCw className="size-4 animate-spin mr-2" />
            ) : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function MobileCardSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ApprovalUserPage() {
  const router = useRouter();

  const [users, setUsers] = useState<PendingUser[]>([]);

  // WhatsApp connection state
  const [waStatus, setWaStatus] = useState<WhatsAppStatusResponse | null>(null);
  const [isLoadingWA, setIsLoadingWA] = useState(false);
  const [waDialogOpen, setWaDialogOpen] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── WhatsApp status polling ────────────────────────────────────────────────

  const fetchWAStatus = useCallback(async () => {
    setIsLoadingWA(true);
    try {
      const res = await fetch("/api/admin/whatsapp/status");
      if (!res.ok) throw new Error("Gagal mengambil status WA");
      const json: WhatsAppStatusResponse = await res.json();
      setWaStatus(json);
      // Anggap connected jika ready === true atau status === "connected"
      return json.ready === true || json.status === "connected";
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
        const connected = await fetchWAStatus();
        // Slow down polling once connected
        if (connected === true && intervalMs < 30_000) {
          startPolling(30_000);
        }
        // Speed up if disconnected so we catch QR quickly
        if (connected === false && intervalMs > 3_000) {
          startPolling(3_000);
        }
      }, intervalMs);
    },
    [fetchWAStatus],
  );

  useEffect(() => {
    // Initial fetch
    fetchWAStatus().then((connected) => {
      // Start fast polling if not connected, slow polling if already connected
      startPolling(connected ? 30_000 : 3_000);
    });

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchWAStatus, startPolling]);
  const [pagination, setPagination] = useState<Pagination>({
    total_data: 0,
    total_page: 1,
    current_page: 1,
    per_page: 10,
    has_prev: false,
    has_next: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Confirmation dialogs
  const [approveDialog, setApproveDialog] = useState<PendingUser | null>(null);
  const [rejectDialog, setRejectDialog] = useState<PendingUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
      });
      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }

      // 🔥 Gunakan internal API
      const res = await fetch(`${API_BASE}?${params}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memuat data");
      }
      const data: ApiResponse = await res.json();
      setUsers(data.data ?? []);
      setPagination(
        data.pagination ?? {
          total_data: 0,
          total_page: 1,
          current_page: 1,
          per_page: Number(pageSize),
          has_prev: false,
          has_next: false,
        },
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handlePageSizeChange(value: string) {
    setPageSize(value);
    setCurrentPage(1);
  }

  async function handleApprove() {
    if (!approveDialog) return;
    setActionLoading(true);
    try {
      // 🔥 Gunakan internal API
      const res = await fetch(`${API_BASE}/${approveDialog.id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyetujui");
      toast.success(data.message || "Akun berhasil disetujui");
      setApproveDialog(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectDialog) return;
    setActionLoading(true);
    try {
      // 🔥 Gunakan internal API
      const res = await fetch(`${API_BASE}/${rejectDialog.id}/reject`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menolak");
      toast.success(data.message || "Akun berhasil ditolak");
      setRejectDialog(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  }

  const startEntry =
    pagination.total_data === 0
      ? 0
      : (pagination.current_page - 1) * pagination.per_page + 1;
  const endEntry = Math.min(
    pagination.current_page * pagination.per_page,
    pagination.total_data,
  );

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
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0 w-full p-4 sm:p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full min-w-0 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Persetujuan Akun
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kelola akun pengguna yang menunggu persetujuan administrator.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* WhatsApp Status Pill Badge */}
                <div
                  onClick={() => setWaDialogOpen(true)}
                  className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-border px-4 py-2.5 rounded-full text-sm shadow-xs font-medium cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {waStatus?.ready || waStatus?.status === "connected" ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        WA Connected
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
                      </span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        WA Disconnected
                      </span>
                    </>
                  )}
                  <div className="w-px h-4 bg-border mx-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchWAStatus();
                    }}
                    disabled={isLoadingWA}
                    className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
                    title="Perbarui Status"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isLoadingWA ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* WhatsApp Warning Banner */}
            {waStatus && !waStatus.ready && waStatus.status !== "connected" && (
              <Alert className="border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10 text-amber-800 dark:text-amber-300">
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-900 dark:text-amber-400 font-semibold">
                  WhatsApp Terputus
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
                  <span>
                    WhatsApp tidak terhubung. Pengguna tidak akan menerima
                    notifikasi pesan saat akun mereka disetujui atau ditolak.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWaDialogOpen(true)}
                    className="shrink-0 border-amber-300 dark:border-amber-800/60 text-amber-800 dark:text-amber-400 hover:bg-amber-100/80 dark:hover:bg-amber-950/40"
                  >
                    Hubungkan Sekarang
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Summary Cards */}
            <SummaryCards
              totalData={pagination.total_data}
              displayed={users.length}
              loading={loading}
            />

            {/* ── Content gated on WA connection ── */}
            {waStatus && !waStatus.ready && waStatus.status !== 'connected' ?  (
              // ── Disconnected placeholder ──
              <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
                  <div className="h-16 w-16 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-lg font-semibold text-foreground">
                      WhatsApp Belum Terhubung
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hubungkan WhatsApp terlebih dahulu agar sistem dapat
                      mengirim notifikasi saat akun pengguna disetujui atau
                      ditolak.
                    </p>
                  </div>
                  <Button
                    onClick={() => setWaDialogOpen(true)}
                    className="bg-[#D90429] text-white hover:bg-[#b30322] font-semibold rounded-lg h-10 px-6 mt-2"
                  >
                    Hubungkan WhatsApp
                  </Button>
                </div>
              </div>

              
            ) : (
              <>
                {/* ── Connected: show action bar, table, pagination ── */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs w-full max-w-full">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9 bg-background/50 focus-visible:ring-primary/20 w-full"
                        placeholder="Cari nama, email, atau nomor HP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          Tampilkan
                        </span>
                        <Select
                          value={pageSize}
                          onValueChange={handlePageSizeChange}
                        >
                          <SelectTrigger className="w-20 bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          data
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchUsers}
                        disabled={loading}
                        className="size-9 bg-background/50 hover:bg-muted shrink-0"
                        title="Segarkan Data"
                      >
                        <RefreshCw
                          className={`size-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && !loading && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Gagal Memuat Data</AlertTitle>
                    <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        Terjadi kesalahan saat mengambil daftar akun yang
                        menunggu persetujuan.
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchUsers}
                        className="shrink-0 border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <RefreshCw className="size-4 mr-2" />
                        Coba Lagi
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* ── Desktop / Tablet Table ── */}
                <div className="hidden md:block rounded-xl border border-border bg-card shadow-xs overflow-hidden w-full max-w-full">
                  <div className="overflow-x-auto w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 border-b border-border hover:bg-muted/40">
                          <TableHead className="w-12 text-center font-semibold text-foreground/80">
                            No
                          </TableHead>
                          <TableHead className="min-w-[200px] font-semibold text-foreground/80">
                            Nama
                          </TableHead>
                          <TableHead className="min-w-[200px] font-semibold text-foreground/80">
                            Email
                          </TableHead>
                          <TableHead className="min-w-[140px] font-semibold text-foreground/80">
                            Nomor HP
                          </TableHead>
                          <TableHead className="min-w-[150px] font-semibold text-foreground/80">
                            Tanggal Lahir
                          </TableHead>
                          <TableHead className="min-w-[180px] font-semibold text-foreground/80">
                            Tanggal Registrasi
                          </TableHead>
                          <TableHead className="min-w-[240px] font-semibold text-foreground/80">
                            Aksi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableSkeleton
                            rows={Number(pageSize) > 10 ? 10 : Number(pageSize)}
                          />
                        ) : users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                <div className="rounded-full bg-muted p-4">
                                  <Users className="size-8 text-muted-foreground" />
                                </div>
                                <p className="text-base font-semibold text-foreground">
                                  Tidak Ada Akun Menunggu Persetujuan
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Semua akun telah diproses.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user, idx) => (
                            <TableRow
                              key={user.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="text-center text-sm text-muted-foreground">
                                {startEntry + idx}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <UserAvatar user={user} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-foreground leading-tight truncate">
                                      {user.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                      ID: {user.id}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <a
                                  href={`mailto:${user.email}`}
                                  className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors hover:underline"
                                >
                                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                                  <span className="truncate max-w-[180px]">
                                    {user.email}
                                  </span>
                                </a>
                              </TableCell>
                              <TableCell>
                                <a
                                  href={`tel:${user.phone}`}
                                  className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors hover:underline"
                                >
                                  <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                                  <span>{user.phone}</span>
                                </a>
                              </TableCell>
                              <TableCell className="text-sm text-foreground/90">
                                {formatDate(user.birth_date)}
                              </TableCell>
                              <TableCell className="text-sm text-foreground/90">
                                {formatDateTime(user.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5"
                                    onClick={() =>
                                      router.push(`/admin/approve/${user.id}`)
                                    }
                                  >
                                    <Eye className="size-3.5 mr-1" />
                                    Detail
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5 border-emerald-250 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-800 dark:hover:text-emerald-300"
                                    onClick={() => setApproveDialog(user)}
                                  >
                                    <UserCheck className="size-3.5 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5 border-red-250 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300"
                                    onClick={() => setRejectDialog(user)}
                                  >
                                    <UserX className="size-3.5 mr-1" />
                                    Tolak
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* ── Mobile Cards ── */}
                <div className="md:hidden w-full max-w-full">
                  {loading ? (
                    <MobileCardSkeleton rows={5} />
                  ) : users.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <div className="rounded-full bg-muted p-4">
                          <Users className="size-8 text-muted-foreground" />
                        </div>
                        <p className="text-base font-semibold text-foreground">
                          Tidak Ada Akun Menunggu Persetujuan
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Semua akun telah diproses.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 w-full">
                      {users.map((user, idx) => (
                        <div
                          key={user.id}
                          className="rounded-xl border border-border bg-card p-4 hover:shadow-xs transition-all duration-300 w-full max-w-full"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <UserAvatar user={user} />
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground leading-none truncate">
                                  {user.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground mt-1 truncate">
                                  ID: {user.id}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px] px-2 py-0.5"
                            >
                              #{startEntry + idx}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                Email
                              </span>
                              <a
                                href={`mailto:${user.email}`}
                                className="truncate hover:underline text-foreground/90 font-medium"
                              >
                                {user.email}
                              </a>
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                Nomor HP
                              </span>
                              <a
                                href={`tel:${user.phone}`}
                                className="truncate hover:underline text-foreground/90 font-medium"
                              >
                                {user.phone}
                              </a>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                Tanggal Lahir
                              </span>
                              <span className="text-foreground/90 font-medium">
                                {formatDate(user.birth_date)}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                Registrasi
                              </span>
                              <span className="text-foreground/90 font-medium">
                                {formatDateTime(user.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-3 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs h-8 px-2"
                              onClick={() =>
                                router.push(`/admin/approval-user/${user.id}`)
                              }
                            >
                              <Eye className="size-3.5 mr-1 shrink-0" />
                              Detail
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs h-8 px-2 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                              onClick={() => setApproveDialog(user)}
                            >
                              <UserCheck className="size-3.5 mr-1 shrink-0" />
                              Setujui
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs h-8 px-2 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => setRejectDialog(user)}
                            >
                              <UserX className="size-3.5 mr-1 shrink-0" />
                              Tolak
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {!loading && !error && users.length > 0 && (
                  <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Menampilkan {startEntry} – {endEntry} dari{" "}
                      {pagination.total_data.toLocaleString("id-ID")} data
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.has_prev}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className="w-full sm:w-auto"
                      >
                        Sebelumnya
                      </Button>
                      <span className="text-sm text-muted-foreground min-w-[60px] text-center whitespace-nowrap">
                        {pagination.current_page} / {pagination.total_page || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.has_next}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="w-full sm:w-auto"
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Approve Confirmation */}
      <ConfirmDialog
        open={!!approveDialog}
        onOpenChange={(v) => {
          if (!v) setApproveDialog(null);
        }}
        title="Setujui Akun?"
        description={`Apakah Anda yakin ingin menyetujui akun ini?`}
        confirmLabel="Setujui"
        confirmVariant="default"
        onConfirm={handleApprove}
        loading={actionLoading}
      />

      {/* Reject Confirmation */}
      <ConfirmDialog
        open={!!rejectDialog}
        onOpenChange={(v) => {
          if (!v) setRejectDialog(null);
        }}
        title="Tolak Akun?"
        description={`Apakah Anda yakin ingin menolak akun ini?`}
        confirmLabel="Tolak"
        confirmVariant="destructive"
        onConfirm={handleReject}
        loading={actionLoading}
      />

      {/* WhatsApp Status Dialog */}
      <Dialog open={waDialogOpen} onOpenChange={setWaDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Status Koneksi WhatsApp</DialogTitle>
            <DialogDescription>
              WhatsApp digunakan untuk mengirim notifikasi persetujuan akun
              kepada pengguna.
            </DialogDescription>
          </DialogHeader>

          {waStatus?.ready || waStatus?.status === "connected" ? (
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg text-foreground">
                  Terhubung
                </h3>
                <p className="text-sm text-muted-foreground">
                  {waStatus?.message || "Sistem WhatsApp siap mengirimkan notifikasi."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Menunggu Scan QR
                </div>

                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Hubungkan WhatsApp
                </h3>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  Buka WhatsApp di HP Anda, masuk ke Perangkat Tertaut, lalu
                  tautkan perangkat baru dengan memindai kode QR.
                </p>

                <div className="space-y-2 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-muted w-5 h-5 font-bold text-[10px]">
                      1
                    </span>
                    <span>Buka WhatsApp di ponsel Anda</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-muted w-5 h-5 font-bold text-[10px]">
                      2
                    </span>
                    <span>Pilih Perangkat Tertaut</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-muted w-5 h-5 font-bold text-[10px]">
                      3
                    </span>
                    <span>Pindai QR Code di samping</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col items-center justify-center space-y-2">
                <div className="w-full max-w-[180px] aspect-square rounded-xl border border-border bg-white p-3 flex items-center justify-center shadow-xs">
                  {waStatus?.qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={waStatus.qr}
                      alt="WhatsApp QR Code"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-[10px] font-medium">
                        Memuat QR Code...
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  QR Code diperbarui secara berkala
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setWaDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
