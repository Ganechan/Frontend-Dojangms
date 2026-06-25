"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  RotateCcw,
  Clock,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface AnnouncementDetail {
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
  data: AnnouncementDetail;
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarking, setIsMarking] = useState(false);

  const fetchAnnouncementDetail = async () => {
    if (!id) {
      setError("ID pengumuman tidak ditemukan");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/public/pengumuman/${id}`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat detail pengumuman");
      }

      const data: ApiResponse = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Gagal memuat detail pengumuman");
      }

      setAnnouncement(data.data);

      // Jika belum dibaca, tandai otomatis
      if (data.data.sudah_dibaca === 0) {
        handleAutoMarkAsRead(data.data.id);
      }
    } catch (err: any) {
      setError(
        err.message || "Pengumuman tidak ditemukan atau server bermasalah.",
      );
      toast.error(err.message || "Gagal memuat detail pengumuman");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoMarkAsRead = async (announcementId: number) => {
    try {
      setIsMarking(true);
      const res = await fetch(
        `/api/public/pengumuman/${announcementId}/tandai-dibaca`,
        {
          method: "POST",
        },
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn("Gagal menandai otomatis:", errData.message);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAnnouncement((prev) => (prev ? { ...prev, sudah_dibaca: 1 } : null));
      }
    } catch (error) {
      console.error("Gagal memperbarui status baca otomatis:", error);
    } finally {
      setIsMarking(false);
    }
  };

  useEffect(() => {
    fetchAnnouncementDetail();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(
      dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T"),
    );
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
            <hr className="border-muted" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !announcement) {
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
                <div className="min-h-screen bg-background p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Terjadi Kesalahan</AlertTitle>
                    <AlertDescription>
                      {error || "Data gagal ditemukan."}
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/pelatih/pengumuman")}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
                    </Button>
                    <Button onClick={fetchAnnouncementDetail} className="gap-2">
                      <RotateCcw className="h-4 w-4" /> Coba Lagi
                    </Button>
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
              <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/pelatih/pengumuman")}
                      className="gap-2 text-muted-foreground hover:text-foreground self-start sm:self-center"
                    >
                      <ArrowLeft className="h-4 w-4" /> Kembali
                    </Button>
                  </div>

                  <Card className="shadow-sm">
                    <CardHeader className="p-6 pb-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                            {announcement.judul}
                          </h1>
                        </div>

                        <div className="shrink-0">
                          {announcement.sudah_dibaca === 1 ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-800 border-green-200 gap-1.5 py-1 px-2.5"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                              Sudah Dibaca
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 hover:bg-orange-100 gap-1.5 py-1 px-2.5 animate-pulse"
                            >
                              <Eye className="h-3.5 w-3.5 text-orange-600" />
                              Baru / Belum Dibaca
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm text-muted-foreground pt-1 border-b border-muted pb-4">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-muted-foreground/70" />
                          <span>
                            Oleh:{" "}
                            <strong className="text-foreground/90 font-medium">
                              {announcement.pembuat_nama}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground/70" />
                          <span>
                            Diterbitkan:{" "}
                            {formatDate(announcement.tanggal_publish)}
                          </span>
                        </div>
                        {announcement.created_at && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground/70" />
                            <span>
                              Dibuat: {formatDate(announcement.created_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-2">
                      <div className="prose prose-sm md:prose-base max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                        {announcement.isi}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
