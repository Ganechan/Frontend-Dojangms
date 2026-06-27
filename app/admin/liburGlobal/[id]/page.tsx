"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";
import type {
  GlobalHolidayDetailData,
  GlobalHolidayDetailResponse,
} from "@/types/admin/libur-global";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EditGlobalHolidayModal } from "@/components/admin/liburGlobal/global-libur-edit-modal";

const SCHEDULE_TYPE_LABELS: Record<string, string> = {
  latihan_wajib: "Latihan Wajib",
  kelas: "Kelas",
  training_camp: "Training Camp",
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatTime = (timeString: string): string => {
  if (!timeString) return "-";
  return timeString.substring(0, 5);
};

const getScheduleTypeBadgeColor = (
  type: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case "latihan_wajib":
      return "default";
    case "kelas":
      return "secondary";
    case "training_camp":
      return "destructive";
    default:
      return "outline";
  }
};

export default function GlobalHolidayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const [holiday, setHoliday] = useState<GlobalHolidayDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchHoliday = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/jadwal/libur-global/get/${id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Gagal mengambil data libur global",
        );
      }

      const data: GlobalHolidayDetailResponse = await response.json();
      setHoliday(data.data);
    } catch (error) {
      console.error("Error fetching holiday:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Libur global tidak ditemukan atau terjadi kesalahan saat mengambil data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHoliday();
  }, [fetchHoliday]);

  const handleEditSuccess = () => {
    fetchHoliday(); // Refresh data tanpa reload halaman
    setShowEditModal(false);
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
        <div className="flex flex-1 flex-col bg-neutral-50/50">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="mx-auto max-w-5xl w-full px-4 py-6 md:px-6 md:py-8 space-y-6">
              {/* Back Navigation */}
              <div className="flex items-center">
                <Link href="/admin/liburGlobal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground pl-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Libur Global
                  </Button>
                </Link>
              </div>

              {/* LOADING STATE */}
              {isLoading && (
                <div className="rounded-xl border bg-card p-16 flex flex-col items-center justify-center space-y-3 shadow-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/70" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Memuat rincian data libur...
                  </p>
                </div>
              )}

              {/* ERROR / NOT FOUND STATE */}
              {!isLoading && !holiday && (
                <Card className="border-destructive/30 bg-destructive/[0.02] shadow-sm">
                  <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="font-semibold text-destructive text-base">
                          Data Tidak Ditemukan
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Libur global tidak ditemukan atau terjadi kesalahan
                          eksternal saat mengambil rincian data.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/admin/liburGlobal"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Cek Daftar Libur
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* MAIN CONTENT */}
              {!isLoading && holiday && (
                <>
                  {/* Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {holiday.keterangan}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span>
                          ID:{" "}
                          <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono">
                            {holiday.id}
                          </code>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          Dibuat pada {formatDateTime(holiday.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                      <Button
                        onClick={() => setShowEditModal(true)}
                        className="w-full sm:w-auto shadow-sm"
                      >
                        Edit Detail
                      </Button>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="shadow-sm">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Tanggal Libur Nasional
                          </p>
                          <p className="text-lg font-bold text-neutral-800">
                            {formatDate(holiday.tanggal)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Keterangan Acara / Agenda
                          </p>
                          <p className="text-lg font-bold text-neutral-800">
                            {holiday.keterangan}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Impacted Schedules Table */}
                  <Card className="shadow-sm overflow-hidden rounded-xl border">
                    <CardHeader className="border-b bg-neutral-50/50 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-lg font-semibold">
                          Jadwal Terdampak
                        </CardTitle>
                      </div>
                      <CardDescription className="text-neutral-500 mt-1">
                        Terdapat{" "}
                        <span className="font-semibold text-foreground">
                          {holiday.total_terdampak} jadwal
                        </span>{" "}
                        yang otomatis dinonaktifkan sementara oleh sistem pada
                        hari libur ini.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {holiday.daftar_jadwal_terdampak.length === 0 ? (
                        <div className="py-12 text-center">
                          <p className="text-sm text-muted-foreground font-medium">
                            Aman. Tidak ada jadwal operasional yang bentrok
                            dengan tanggal ini.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-neutral-50/70">
                              <TableRow>
                                <TableHead className="w-[30%] py-3">
                                  Nama Jadwal
                                </TableHead>
                                <TableHead className="w-[15%]">Tipe</TableHead>
                                <TableHead className="w-[20%]">
                                  Lokasi
                                </TableHead>
                                <TableHead className="w-[15%]">
                                  Waktu Kegiatan
                                </TableHead>
                                <TableHead className="w-[20%] text-right pr-6">
                                  Hari / Rentang Tanggal
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {holiday.daftar_jadwal_terdampak.map(
                                (schedule) => (
                                  <TableRow
                                    key={schedule.jadwal_id}
                                    className="hover:bg-neutral-50/50"
                                  >
                                    <TableCell className="py-3.5 font-medium">
                                      <div>
                                        <p className="font-semibold text-neutral-900">
                                          {schedule.jadwal_nama}
                                        </p>
                                        {schedule.kelas && (
                                          <p className="text-xs text-muted-foreground mt-0.5">
                                            Kelas: {schedule.kelas.nama}
                                          </p>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={getScheduleTypeBadgeColor(
                                          schedule.tipe,
                                        )}
                                        className="shadow-none"
                                      >
                                        {SCHEDULE_TYPE_LABELS[schedule.tipe] ||
                                          schedule.tipe}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-600">
                                      {schedule.lokasi}
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-600 font-mono">
                                      {formatTime(schedule.jam_mulai)} -{" "}
                                      {formatTime(schedule.jam_selesai)}
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-600 text-right pr-6">
                                      {schedule.tipe === "training_camp" ? (
                                        <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                                          {formatDate(
                                            schedule.tanggal_mulai || "",
                                          )}{" "}
                                          s/d{" "}
                                          {formatDate(
                                            schedule.tanggal_selesai || "",
                                          )}
                                        </span>
                                      ) : (
                                        <span className="capitalize font-medium text-neutral-800">
                                          {schedule.hari}
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Edit Modal */}
              <EditGlobalHolidayModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                holiday={holiday}
                onSuccess={handleEditSuccess}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
