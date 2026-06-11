"use server";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  CalendarDays,
  SquarePen,
  History,
  Layers,
  Info,
} from "lucide-react";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface JadwalDetail {
  id: number;

  informasi: {
    nama: string;
    tipe: string;
    status: string;
    keterangan: string | null;
  };

  jadwal: {
    hari: string | null;
    jam_mulai: string;
    jam_selesai: string;
  };

  periode: {
    effective_from: string | null;
    effective_until: string | null;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
  };

  lokasi: {
    nama: string;
  };

  relasi: {
    kelas: {
      id: number;
      nama: string;
    } | null;

    dibuat_oleh: {
      id: number;
      nama: string;
    };
  };

  metadata: {
    created_at: string;
    updated_at: string;
  };
}

async function getJadwalDetail(id: string): Promise<JadwalDetail | null> {
  try {
    const response = await fetch(
      `http://localhost:3001/api/admin/jadwal/${id}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Failed to fetch schedule detail:", error);
    return null;
  }
}

const SCHEDULE_TYPE_MAP: Record<
  string,
  { label: string; color: string; bar: string }
> = {
  latihan_wajib: {
    label: "Latihan Wajib",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
    bar: "bg-blue-500",
  },
  kelas: {
    label: "Kelas",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
    bar: "bg-emerald-500",
  },
  training_camp: {
    label: "Training Camp",
    color:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
    bar: "bg-purple-500",
  },
};

const STATUS_BADGE_MAP: Record<string, { label: string; color: string }> = {
  aktif: {
    label: "Aktif",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
  },
  nonaktif: {
    label: "Tidak Aktif",
    color:
      "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
  },
};

const DAYS_MAP: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

function formatTime(time: string): string {
  return time.substring(0, 5); // HH:MM format
}

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function JadwalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schedule = await getJadwalDetail(id);

  if (!schedule) {
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
            <div className="mx-auto w-full max-w-4xl px-4 py-8">
              <Link href="/admin/jadwal/jadwal">
                <Button variant="ghost" className="mb-6 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Jadwal
                </Button>
              </Link>
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
                <CardContent className="pt-6">
                  <p className="text-center text-red-700 dark:text-red-400 font-medium">
                    Jadwal tidak ditemukan atau terjadi kesalahan saat mengambil
                    data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const typeInfo = SCHEDULE_TYPE_MAP[schedule.informasi.tipe] || {
    label: schedule.informasi.tipe,
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    bar: "bg-gray-500",
  };

  const statusInfo = STATUS_BADGE_MAP[schedule.informasi.status] || {
    label: schedule.informasi.status,
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
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
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back navigation */}
            <div className="mb-6">
              <Link href="/admin/jadwal/jadwal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:foreground cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Daftar Jadwal
                </Button>
              </Link>
            </div>

            {/* Header Section */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {schedule.informasi.nama}
                  </h1>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`${typeInfo.color} font-medium border`}
                    >
                      {typeInfo.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${statusInfo.color} font-medium border`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Jadwal ID:{" "}
                  <span className="font-mono text-foreground font-semibold">
                    #{schedule.id}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <Link href={`/admin/jadwal/jadwal/${schedule.id}/edit`}>
                  <Button className="gap-2 cursor-pointer">
                    <SquarePen className="h-4 w-4" />
                    Edit Jadwal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Info Columns (2/3 width) */}
              <div className="space-y-6 lg:col-span-2">
                {/* Core Schedule Card */}
                <Card className="overflow-hidden border shadow-sm pt-0">
                  <div className={`h-1.5 w-full ${typeInfo.bar}`} />
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      Detail Pelaksanaan
                    </CardTitle>
                    <CardDescription>
                      Informasi utama terkait jadwal latihan ini.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Time / Jam */}
                      <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Clock className="h-4 w-4 text-indigo-500" />
                          Waktu / Jam
                        </div>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {formatTime(schedule.jadwal.jam_mulai)} -{" "}
                          {formatTime(schedule.jadwal.jam_selesai)} WIB
                        </p>
                      </div>

                      {/* Lokasi */}
                      <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <MapPin className="h-4 w-4 text-rose-500" />
                          Lokasi
                        </div>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {schedule.lokasi.nama}
                        </p>
                      </div>

                      {/* Conditional Hari (if exists) */}
                      {(schedule.informasi.tipe === "latihan_wajib" ||
                        schedule.informasi.tipe === "kelas") && (
                        <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            Hari
                          </div>
                          <p className="mt-2 text-lg font-semibold text-foreground capitalize">
                            {schedule.jadwal.hari
                              ? DAYS_MAP[schedule.jadwal.hari] ||
                                schedule.jadwal.hari
                              : "-"}
                          </p>
                        </div>
                      )}

                      {/* Conditional Kelas (for Tipe Kelas) */}
                      {schedule.informasi.tipe === "kelas" && (
                        <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Layers className="h-4 w-4 text-emerald-500" />
                            Kelas Terkait
                          </div>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            {schedule.relasi.kelas
                              ? schedule.relasi.kelas.nama
                              : "-"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Period / Dates details */}
                    <div className="rounded-lg border bg-neutral-50/50 p-4 dark:bg-neutral-900/50">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Periode Aktif Jadwal
                      </h4>

                      {schedule.informasi.tipe === "training_camp" ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Tanggal Mulai
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {schedule.periode.tanggal_mulai
                                ? formatDate(schedule.periode.tanggal_mulai)
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Tanggal Selesai
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {schedule.periode.tanggal_selesai
                                ? formatDate(schedule.periode.tanggal_selesai)
                                : "-"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Mulai Efektif
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {schedule.periode.effective_from
                                ? formatDate(schedule.periode.effective_from)
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Hingga Efektif
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {schedule.periode.effective_until
                                ? formatDate(schedule.periode.effective_until)
                                : "Selamanya (Rutin)"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Keterangan / Notes */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      Keterangan / Catatan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {schedule.informasi.keterangan ? (
                      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border">
                        {schedule.informasi.keterangan}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground bg-muted/10 p-4 rounded-lg border border-dashed">
                        Tidak ada keterangan tambahan untuk jadwal ini.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info Column (1/3 width) */}
              <div className="space-y-6">
                {/* Metadata / System Info Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5 text-muted-foreground" />
                      Informasi Sistem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Dibuat Oleh */}
                    <div className="flex items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Dibuat Oleh
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {schedule.relasi.dibuat_oleh.nama}
                        </p>
                      </div>
                    </div>

                    {/* Tanggal Dibuat */}
                    <div className="flex items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                      <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Waktu Pembuatan
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatDate(schedule.metadata.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Terakhir Diperbarui */}
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Terakhir Diperbarui
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatDate(schedule.metadata.updated_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="border shadow-sm bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-semibold">
                      Aksi Cepat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Button asChild className="w-full gap-2">
                      <Link href={`/admin/jadwal/jadwal/${schedule.id}/edit`}>
                        <SquarePen className="h-4 w-4" />
                        Edit Jadwal Ini
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full gap-2">
                      <Link href="/admin/jadwal/jadwal">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
