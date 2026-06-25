"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Hash,
  Clock,
  Layers,
  SquarePen,
} from "lucide-react";
import { toast } from "sonner";
import type { HolidayDetailResponse } from "@/types/admin/libur";
import { SCHEDULE_TYPE_LABELS } from "@/types/admin/libur";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// 1. IMPORT MODAL POP-UP ANDA DISINI (Sesuaikan path foldernya jika berbeda)
import { EditHolidayModal } from "@/components/admin/libur/edit-modal-popup";

export default function HolidayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [holiday, setHoliday] = useState<HolidayDetailResponse["data"] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // 2. STATE UNTUK KONTROL MODAL POP-UP
  const [showEditModal, setShowEditModal] = useState(false);

  // Fungsi fetch data dipisah agar bisa dipanggil ulang setelah sukses edit data
  const fetchHoliday = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/admin/jadwal/libur-jadwal/${id}`,
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data libur jadwal");
      }

      const data: HolidayDetailResponse = await response.json();
      setHoliday(data.data);
    } catch (error) {
      console.error("Error fetching holiday:", error);
      toast.error(
        "Libur jadwal tidak ditemukan atau terjadi kesalahan saat mengambil data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHoliday();
  }, [fetchHoliday]);

  const getScheduleTypeBadgeColor = (
    type: "latihan_wajib" | "kelas" | "training_camp",
  ) => {
    switch (type) {
      case "latihan_wajib":
        return "default";
      case "kelas":
        return "secondary";
      case "training_camp":
        return "outline";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
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
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mx-auto max-w-4xl w-full space-y-6">
            {/* Header Navigasi Atas */}
            <div className="flex items-center justify-between border-b pb-4">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 h-8 text-muted-foreground hover:foreground transition-colors"
                onClick={() => router.push("/admin/libur")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <Card className="flex h-64 items-center justify-center border-dashed shadow-none">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Memuat rincian data...
                  </p>
                </div>
              </Card>
            ) : !holiday ? (
              /* Error / Not Found State */
              <Card className="border-destructive/30 bg-destructive/5 shadow-none">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-destructive">
                      Data Tidak Ditemukan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Libur jadwal tidak ditemukan atau telah dihapus dari
                      sistem.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => router.push("/admin/libur")}>
                    Kembali ke Jadwal Libur
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Main Content View */
              <>
                {/* Header Konten Utama & Button Edit Sejajar */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 w-full">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      {holiday.keterangan}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded">
                        <Hash className="h-3 w-3" />{" "}
                        <span>ID: {holiday.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Dibuat pada {formatDateTime(holiday.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. PERUBAHAN BUTTON: Menggunakan onClick untuk memicu modal pop-up */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-2 px-4 font-medium text-emerald-600 border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-sm shrink-0 self-start sm:self-auto"
                    onClick={() => setShowEditModal(true)}
                  >
                    <SquarePen className="h-4 w-4 shrink-0" />
                    <span>Edit Data</span>
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Informasi Libur */}
                  <Card className="shadow-sm border-muted-foreground/10 p-0">
                    <CardHeader className="p-4 bg-muted/30">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/90 uppercase tracking-wider">
                        <Calendar className="h-4 w-4 text-primary" />
                        Informasi Libur
                      </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Tanggal Libur
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(holiday.tanggal)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Keterangan / Alasan
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {holiday.keterangan}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informasi Jadwal Terkait */}
                  <Card className="shadow-sm border-muted-foreground/10 p-0">
                    <CardHeader className="p-4 bg-muted/30">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/90 uppercase tracking-wider">
                        <Layers className="h-4 w-4 text-primary" />
                        Informasi Jadwal Terdampak
                      </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Nama Jadwal
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {holiday.jadwal_nama}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Tipe Acara
                        </p>
                        <div className="pt-0.5">
                          <Badge
                            variant={getScheduleTypeBadgeColor(
                              holiday.jadwal_tipe,
                            )}
                            className="rounded-md px-2 py-0.5 text-xs font-medium"
                          >
                            {SCHEDULE_TYPE_LABELS[holiday.jadwal_tipe]}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          ID Jadwal Referensi
                        </p>
                        <p className="text-xs font-mono bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded w-fit border border-dashed">
                          #{holiday.jadwal_id}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* 4. TEMPATKAN KOMPONEN MODAL DI BAWAH SINI */}
      <EditHolidayModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        holiday={holiday}
        onSuccess={fetchHoliday} // Otomatis refresh data di halaman detail setelah sukses simpan
      />
    </SidebarProvider>
  );
}
