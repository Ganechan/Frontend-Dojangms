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
  Eye,
  Edit,
  Trash2,
  Search,
  Loader2,
  Plus,
  ArrowLeft,
  Send,
  ChevronDown,
  CalendarClock,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

interface Announcement {
  id: number;
  judul: string;
  isi: string;
  status: string;
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
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

interface DraftResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  meta: {
    pagination: PaginationInfo;
  };
}

export default function DraftAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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

  const [sendingId, setSendingId] = useState<number | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );
  const [scheduledAt, setScheduledAt] = useState("");

  const fetchDrafts = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(
        `/api/admin/pengumuman/draft?${params.toString()}`,
      );
      const data: DraftResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      if (data.success) {
        setAnnouncements(data.data || []);
        setPagination(data.meta.pagination);
      } else {
        throw new Error(data.message || "Gagal memuat data");
      }
    } catch (error: any) {
      console.error("Error fetching drafts:", error);
      toast.error(error.message || "Gagal memuat data draft");
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const formatDateTimeForApi = (value: string) => {
    if (!value) return "";
    return value.replace("T", " ").length === 16
      ? `${value.replace("T", " ")}:00`
      : value.replace("T", " ");
  };

  const handleSendNow = async (id: number) => {
    setSendingId(id);

    try {
      const response = await fetch(`/api/admin/pengumuman/${id}/kirim`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sekarang",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim pengumuman");
      }

      toast.success(data.message || "Pengumuman berhasil dikirim");
      fetchDrafts(1);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSendingId(null);
    }
  };

  const handleOpenScheduleDialog = (id: number) => {
    setSelectedScheduleId(id);
    setScheduledAt("");
    setScheduleDialogOpen(true);
  };

  const handleScheduleDialogChange = (open: boolean) => {
    setScheduleDialogOpen(open);

    if (!open) {
      setSelectedScheduleId(null);
      setScheduledAt("");
    }
  };

  const handleSendScheduled = async () => {
    if (!selectedScheduleId) return;

    if (!scheduledAt) {
      toast.error("Tanggal dan waktu pengiriman wajib diisi");
      return;
    }

    setSendingId(selectedScheduleId);

    try {
      const response = await fetch(
        `/api/admin/pengumuman/${selectedScheduleId}/kirim`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "terjadwal",
            scheduled_at: formatDateTimeForApi(scheduledAt),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menjadwalkan pengumuman");
      }

      toast.success(data.message || "Pengumuman berhasil dijadwalkan");
      setScheduleDialogOpen(false);
      setSelectedScheduleId(null);
      setScheduledAt("");
      fetchDrafts(1);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSendingId(null);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

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
      toast.success(data.message || "Draft berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchDrafts(1);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
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
        <div className="flex flex-1 flex-col p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Draft Pengumuman
                </h1>
                <p className="text-sm text-muted-foreground">
                  Daftar pengumuman yang masih dalam status draft
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/pengumuman">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Semua Pengumuman
                  </Button>
                </Link>
                <Link href="/admin/pengumuman/tambah">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Pengumuman
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder="Cari judul atau isi draft..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchDrafts(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Table */}
            {/* Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Judul</TableHead>
                    <TableHead>Dibuat Oleh</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-center">Kirim</TableHead>{" "}
                    {/* Kolom baru */}
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : announcements.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Tidak ada draft pengumuman
                      </TableCell>
                    </TableRow>
                  ) : (
                    announcements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="font-semibold text-foreground">
                            {item.judul}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {item.isi}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.dibuat_oleh?.nama || "-"}
                        </TableCell>
                        <TableCell>
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
                        <TableCell>
                          <Badge
                            variant={
                              item.kirim_whatsapp ? "default" : "secondary"
                            }
                          >
                            {item.kirim_whatsapp ? "Ya" : "Tidak"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(item.created_at)}
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                disabled={sendingId === item.id}
                              >
                                {sendingId === item.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="mr-2 h-4 w-4" />
                                )}
                                Kirim
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="center"
                              className="w-48"
                            >
                              <DropdownMenuItem
                                onClick={() => handleSendNow(item.id)}
                                disabled={sendingId === item.id}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Kirim sekarang
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenScheduleDialog(item.id)
                                }
                                disabled={sendingId === item.id}
                              >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                Jadwalkan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/pengumuman/${item.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/pengumuman/${item.id}/edit`}>
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
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  Halaman {pagination.current_page} dari {pagination.total_page}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDrafts(pagination.current_page - 1)}
                    disabled={!pagination.has_prev || loading}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDrafts(pagination.current_page + 1)}
                    disabled={!pagination.has_next || loading}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Schedule Send Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onOpenChange={handleScheduleDialogChange}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Jadwalkan Pengiriman</DialogTitle>
            <DialogDescription>
              Pilih tanggal dan waktu untuk mengirim pengumuman secara
              terjadwal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="scheduled-at">Tanggal dan Waktu</Label>
            <Input
              id="scheduled-at"
              type="datetime-local"
              value={scheduledAt}
              min={getMinDateTimeLocal()}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleScheduleDialogChange(false)}
              disabled={sendingId === selectedScheduleId}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSendScheduled}
              disabled={!scheduledAt || sendingId === selectedScheduleId}
            >
              {sendingId === selectedScheduleId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menjadwalkan...
                </>
              ) : (
                "Jadwalkan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus draft ini? Tindakan ini tidak
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
