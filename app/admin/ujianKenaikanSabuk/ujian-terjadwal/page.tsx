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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  UserPlus,
  Loader2,
  Edit,
  CalendarCheck,
  MapPin,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface UjianTerjadwal {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  level_ujian: "kota" | "provinsi";
  lokasi: string;
  keterangan: string;
}

interface Summary {
  total: number;
  kota: number;
  provinsi: number;
}

export default function ScheduledExamsPage() {
  const [exams, setExams] = useState<UjianTerjadwal[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    kota: 0,
    provinsi: 0,
  });
  const [levelFilter, setLevelFilter] = useState<"all" | "kota" | "provinsi">(
    "all",
  );
  const [loading, setLoading] = useState(true);

  const fetchScheduledExams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/ujian-kenaikan-sabuk/terjadwal");

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = "Gagal memuat data";
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.message || errorMsg;
        } catch {
          if (errorText) errorMsg = errorText;
        }
        throw new Error(errorMsg);
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Respons kosong dari server");
      }

      const data = JSON.parse(responseText);
      setExams(data.data || []);
      setSummary(data.summary || { total: 0, kota: 0, provinsi: 0 });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memuat data ujian terjadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledExams();
  }, []);

  const filteredExams = exams.filter((ujian) => {
    return levelFilter === "all" || ujian.level_ujian === levelFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLevelBadgeVariant = (level: string) => {
    return level === "provinsi" ? "default" : "outline";
  };

  const levelFilterLabels: Record<string, string> = {
    all: "Semua Tingkat",
    kota: "Kota",
    provinsi: "Provinsi",
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
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Kelola Peserta
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Daftar Peserta ujian kenaikan sabuk aktif mendatang
                  </p>
                </div>
                <Link
                  href="/admin/ujianKenaikanSabuk/create"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Ujian
                  </Button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Terjadwal
                    </CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">{summary.total}</div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah ujian yang akan datang
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-sky-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">
                      Level Kota
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-sky-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                        {summary.kota}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Ujian tingkat kota
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-violet-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-violet-700 dark:text-violet-400">
                      Level Provinsi
                    </CardTitle>
                    <Award className="h-4 w-4 text-violet-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                        {summary.provinsi}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Ujian tingkat provinsi
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Toolbar Level Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Filter Tingkat / Level Ujian
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(["all", "kota", "provinsi"] as const).map((level) => {
                        const count =
                          level === "all" ? summary.total : summary[level];
                        return (
                          <Button
                            key={level}
                            variant={
                              levelFilter === level ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setLevelFilter(level)}
                            className="text-xs h-8"
                          >
                            {levelFilterLabels[level]}
                            <span className="ml-1.5 text-[10px] opacity-70">
                              ({count})
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[35%] font-semibold">
                          Keterangan
                        </TableHead>
                        <TableHead className="font-semibold">Lokasi</TableHead>
                        <TableHead className="font-semibold">
                          Tanggal Pelaksanaan
                        </TableHead>
                        <TableHead className="w-[120px] font-semibold">
                          Level
                        </TableHead>
                        <TableHead className="text-right w-[220px] font-semibold">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-5 w-44" />
                              <Skeleton className="h-3 w-20 mt-1.5" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-36" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Skeleton className="h-8 w-[120px] rounded-md" />
                                <Skeleton className="h-8 w-[130px] rounded-md" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredExams.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-16 text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <CalendarCheck className="h-10 w-10 text-muted-foreground/40" />
                              <p className="text-sm font-medium">
                                Tidak ada ujian terjadwal yang ditemukan
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                Coba ubah filter level atau buat ujian baru
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExams.map((ujian) => (
                          <TableRow
                            key={ujian.id}
                            className="group transition-colors"
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground leading-snug">
                                  {ujian.keterangan}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                  ID: {ujian.id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {ujian.lokasi}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="text-foreground">
                                <p className="whitespace-nowrap">
                                  {formatDate(ujian.tanggal_mulai)}
                                </p>
                                {ujian.tanggal_mulai !==
                                  ujian.tanggal_selesai && (
                                  <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                                    s/d {formatDate(ujian.tanggal_selesai)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getLevelBadgeVariant(
                                  ujian.level_ujian,
                                )}
                                className="capitalize"
                              >
                                {ujian.level_ujian}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <div className="flex gap-2 justify-end">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/admin/ujianKenaikanSabuk/${ujian.id}/peserta`}
                                        passHref
                                      >
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs font-medium shadow-sm"
                                        >
                                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                                          Kelola Peserta
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Kelola daftar peserta ujian
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/admin/ujianKenaikanSabuk/addPeserta?examId=${ujian.id}`}
                                        passHref
                                      >
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs font-medium shadow-sm"
                                        >
                                          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                                          Tambah Peserta
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Tambah peserta baru ke ujian
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
