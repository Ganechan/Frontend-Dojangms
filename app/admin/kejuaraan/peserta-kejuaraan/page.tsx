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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Eye,
  Loader2,
  Edit,
  Trophy,
  MapPin,
  Clock,
  Compass,
  Globe,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Championship {
  id: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Summary {
  total: number;
  kota: number;
  provinsi: number;
  nasional: number;
  internasional: number;
}

export default function ScheduledChampionshipsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    kota: 0,
    provinsi: 0,
    nasional: 0,
    internasional: 0,
  });
  const [levelFilter, setLevelFilter] = useState<
    "all" | "kota" | "provinsi" | "nasional" | "internasional"
  >("all");
  const [loading, setLoading] = useState(true);

  const fetchScheduledChampionships = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/admin/kejuaraan/getall?page=1&per_page=100",
      ); // ambil semua, filter status di client
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      // Filter hanya yang belum selesai (akan_datang atau berlangsung)
      const allData = data.data || [];
      const scheduled = allData.filter(
        (champ: Championship) =>
          champ.status === "akan_datang" || champ.status === "berlangsung",
      );

      setChampionships(scheduled);

      // Hitung summary berdasarkan data terjadwal
      const summaryData = {
        total: scheduled.length,
        kota: scheduled.filter((c: Championship) => c.level === "kota").length,
        provinsi: scheduled.filter((c: Championship) => c.level === "provinsi")
          .length,
        nasional: scheduled.filter((c: Championship) => c.level === "nasional")
          .length,
        internasional: scheduled.filter(
          (c: Championship) => c.level === "internasional",
        ).length,
      };
      setSummary(summaryData);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memuat data kejuaraan terjadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledChampionships();
  }, []);

  const filteredChampionships = championships.filter((champ) => {
    return levelFilter === "all" || champ.level === levelFilter;
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
    switch (level) {
      case "kota":
        return "outline";
      case "provinsi":
        return "secondary";
      case "nasional":
        return "default";
      case "internasional":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "akan_datang" ? "default" : "secondary";
  };

  const getStatusLabel = (status: string) => {
    return status === "akan_datang" ? "Akan Datang" : "Berlangsung";
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
                    Kelola Peserta Kejuaraan
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Daftar Peserta Kejuaraan yang akan datang & sedang berlangsung
                  </p>
                </div>
                <Link href="/admin/kejuaraan/create">
                  <Button className="w-full sm:w-auto shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Kejuaraan
                  </Button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md col-span-2 md:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Terjadwal
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">{summary.total}</div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kejuaraan terjadwal
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-sky-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">
                      Tingkat Kota
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
                      Skala regional kota
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-indigo-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                      Tingkat Provinsi
                    </CardTitle>
                    <Compass className="h-4 w-4 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {summary.provinsi}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Skala regional provinsi
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                      Tingkat Nasional
                    </CardTitle>
                    <Award className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {summary.nasional}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Skala nasional
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-rose-500 col-span-2 md:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400">
                      Tingkat Internasional
                    </CardTitle>
                    <Globe className="h-4 w-4 text-rose-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                        {summary.internasional}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Skala global
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Toolbar Level Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Filter Tingkat Kejuaraan
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          "all",
                          "kota",
                          "provinsi",
                          "nasional",
                          "internasional",
                        ] as const
                      ).map((level) => {
                        const count =
                          level === "all" ? summary.total : summary[level];
                        return (
                          <Button
                            key={level}
                            variant={levelFilter === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLevelFilter(level)}
                            className="capitalize text-xs h-8 shadow-xs"
                          >
                            {level === "all" ? "Semua Tingkat" : level}
                            <span className="ml-1.5 text-[10px] opacity-75 font-normal">
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
                        <TableHead className="font-semibold w-[30%]">
                          Nama Kejuaraan
                        </TableHead>
                        <TableHead className="font-semibold">Lokasi</TableHead>
                        <TableHead className="font-semibold">Tanggal</TableHead>
                        <TableHead className="font-semibold">Tingkat</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold w-[220px]">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-5 w-48" />
                              <Skeleton className="h-3 w-16 mt-1" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Skeleton className="h-8 w-24 rounded-md" />
                                <Skeleton className="h-8 w-28 rounded-md" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredChampionships.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-16 text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Trophy className="h-10 w-10 text-muted-foreground/40" />
                              <p className="text-sm font-medium">
                                Tidak ada kejuaraan terjadwal yang ditemukan
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                Coba ubah filter tingkat kejuaraan
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredChampionships.map((champ) => (
                          <TableRow
                            key={champ.id}
                            className="group transition-colors"
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground leading-snug">
                                  {champ.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                  ID: {champ.id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {champ.location}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="text-foreground">
                                <p className="whitespace-nowrap">
                                  {formatDate(champ.start_date)}
                                </p>
                                {champ.start_date !== champ.end_date && (
                                  <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                                    s/d {formatDate(champ.end_date)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getLevelBadgeVariant(champ.level)}
                                className="capitalize"
                              >
                                {champ.level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(champ.status)}
                              >
                                {getStatusLabel(champ.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Link
                                  href={`/admin/kejuaraan/${champ.id}/kelas/edit`}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="shadow-sm h-8"
                                  >
                                    <Edit className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                    Edit Peserta
                                  </Button>
                                </Link>
                                <Link
                                  href={`/admin/kejuaraan/${champ.id}/kelas`}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="shadow-sm h-8 border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/5"
                                  >
                                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                                    Tambah Peserta
                                  </Button>
                                </Link>
                              </div>
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
