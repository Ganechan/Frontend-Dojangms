"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  MailCheck,
  Search,
  CheckCheck,
  Eye,
  Check,
  BellOff,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AppSidebar } from "@/components/murid/app-sidebar";
import { SiteHeader } from "@/components/murid/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Announcement {
  id: number;
  judul: string;
  isi: string;
  target_type: "global" | "role" | "kelas" | "individu";
  target_role: string | null;
  kelas_id: number | null;
  status: string;
  tanggal_publish: string;
  created_at: string;
  scheduled_at: string | null;
  pembuat_nama: string;
  sudah_dibaca: number; // 0=belum, 1=sudah
  notifikasi_id: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  pagination: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export default function AnnouncementListPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const fetchAnnouncements = async (
    page: number = 1,
    limit: number = pageSize,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `/api/public/pengumuman?page=${page}&limit=${limit}`,
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat data");
      }
      const data: ApiResponse = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Gagal memuat data");
      }
      setAnnouncements(data.data);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      setError(
        err.message || "Gagal memuat pengumuman. Pastikan server berjalan.",
      );
      setAnnouncements([]);
      toast.error(err.message || "Gagal memuat pengumuman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(1, pageSize);
  }, []);

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    setPageSize(size);
    fetchAnnouncements(1, size);
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllRead(true);
    try {
      const res = await fetch("/api/public/pengumuman/baca-semua", {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menandai semua");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Gagal menandai semua");
      }
      toast.success("Semua pengumuman ditandai sebagai sudah dibaca");
      fetchAnnouncements(currentPage, pageSize);
    } catch (err: any) {
      toast.error(err.message || "Gagal menandai semua");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.isi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.pembuat_nama.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "unread")
      return matchesSearch && ann.sudah_dibaca === 0;
    if (filterStatus === "read") return matchesSearch && ann.sudah_dibaca === 1;
    return matchesSearch;
  });

  const totalUnread = announcements.filter(
    (ann) => ann.sudah_dibaca === 0,
  ).length;
  const totalRead = announcements.filter(
    (ann) => ann.sudah_dibaca === 1,
  ).length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, pagination.total_data);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (error) {
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
                <div className="space-y-6">
                  <div className="min-h-screen bg-background p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-6">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">
                          Pengumuman
                        </h1>
                        <p className="text-muted-foreground mt-1">
                          Lihat seluruh pengumuman yang dikirim kepada Anda.
                        </p>
                      </div>

                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Gagal Memuat Pengumuman</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>

                      <Button
                        onClick={() =>
                          fetchAnnouncements(currentPage, pageSize)
                        }
                        className="gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Coba Lagi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
              <div className="space-y-6">
                <div className="min-h-screen bg-background p-4 md:p-8">
                  <div className="max-w-6xl mx-auto space-y-6">
                    <div className="min-h-screen bg-background p-4 md:p-8">
                      <div className="max-w-6xl mx-auto space-y-6">
                        {/* Header */}
                        <div>
                          <h1 className="text-3xl font-bold text-foreground">
                            Pengumuman
                          </h1>
                          <p className="text-muted-foreground mt-1">
                            Lihat seluruh pengumuman yang dikirim kepada Anda.
                          </p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-6 flex flex-row items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Total Pengumuman
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                  {pagination.total_data}
                                </p>
                              </div>
                              <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-6 flex flex-row items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Belum Dibaca
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                  {totalUnread}
                                </p>
                              </div>
                              <Mail className="h-8 w-8 text-orange-500" />
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-6 flex flex-row items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Sudah Dibaca
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                  {totalRead}
                                </p>
                              </div>
                              <MailCheck className="h-8 w-8 text-green-500" />
                            </CardContent>
                          </Card>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                          <div className="w-full lg:flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Cari judul atau isi pengumuman..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 w-full"
                            />
                          </div>

                          <Select
                            value={filterStatus}
                            onValueChange={setFilterStatus}
                          >
                            <SelectTrigger className="w-full lg:w-48">
                              <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua</SelectItem>
                              <SelectItem value="unread">
                                Belum Dibaca
                              </SelectItem>
                              <SelectItem value="read">Sudah Dibaca</SelectItem>
                            </SelectContent>
                          </Select>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="gap-2 w-full lg:w-auto">
                                <CheckCheck className="h-4 w-4" />
                                Tandai Semua Dibaca
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tandai Semua Pengumuman Sebagai Dibaca?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Semua pengumuman akan ditandai sebagai sudah
                                  dibaca. Aksi ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex gap-3 justify-end">
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleMarkAllAsRead}
                                  disabled={isMarkingAllRead}
                                >
                                  {isMarkingAllRead
                                    ? "Menyimpan..."
                                    : "Ya, Tandai Semua"}
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Tampilkan
                          </span>
                          <Select
                            value={pageSize.toString()}
                            onValueChange={handlePageSizeChange}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                              <SelectItem value="200">200</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Loading State */}
                        {loading && !announcements.length && (
                          <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                              <Card key={i}>
                                <CardContent className="p-4 space-y-2">
                                  <Skeleton className="h-5 w-1/2" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-24" />
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Announcement Cards */}
                        {!loading && filteredAnnouncements.length > 0 && (
                          <div className="space-y-3">
                            {filteredAnnouncements.map((ann) => {
                              const isUnread = ann.sudah_dibaca === 0;

                              return (
                                <Card
                                  key={ann.id}
                                  className={`transition-all ${
                                    isUnread
                                      ? "bg-orange-50/50 border-l-4 border-l-orange-500"
                                      : ""
                                  }`}
                                >
                                  <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Info Side */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-sm md:text-base text-foreground truncate max-w-xl">
                                          {ann.judul}
                                        </h3>
                                        {isUnread ? (
                                          <Badge
                                            variant="secondary"
                                            className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-[10px] px-1.5 py-0"
                                          >
                                            Belum Dibaca
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-800 border-green-200 text-[10px] px-1.5 py-0"
                                          >
                                            Sudah Dibaca
                                          </Badge>
                                        )}
                                      </div>

                                      {/* Content Preview */}
                                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                                        {ann.isi}
                                      </p>

                                      {/* Date Meta */}
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                          {formatDate(ann.tanggal_publish)}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action Side */}
                                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                      <Link
                                        href={`/murid/pengumuman/${ann.id}`}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-1.5 text-xs h-8"
                                        >
                                          <Eye className="h-3.5 w-3.5" />
                                          Lihat
                                        </Button>
                                      </Link>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredAnnouncements.length === 0 && (
                          <div className="text-center py-12">
                            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Belum Ada Pengumuman
                            </h3>
                            <p className="text-muted-foreground">
                              Tidak ada pengumuman yang tersedia saat ini.
                            </p>
                          </div>
                        )}

                        {/* Pagination */}
                        {!loading && announcements.length > 0 && (
                          <div className="flex flex-col gap-4">
                            <div className="text-sm text-muted-foreground">
                              Menampilkan {startItem} - {endItem} dari{" "}
                              {pagination.total_data} pengumuman
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                disabled={!pagination.has_prev}
                                onClick={() =>
                                  fetchAnnouncements(currentPage - 1, pageSize)
                                }
                                className="gap-2"
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Sebelumnya
                              </Button>
                              <Button
                                variant="outline"
                                disabled={!pagination.has_next}
                                onClick={() =>
                                  fetchAnnouncements(currentPage + 1, pageSize)
                                }
                                className="gap-2"
                              >
                                Selanjutnya
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
