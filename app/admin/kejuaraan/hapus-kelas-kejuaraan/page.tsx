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
import { Plus, Loader2, Trash } from "lucide-react";
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
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      const allData = data.data || [];
      const scheduled = allData.filter(
        (champ: Championship) =>
          champ.status === "akan_datang" || champ.status === "berlangsung",
      );

      setChampionships(scheduled);

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

        <div className="p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Hapus Kelas Kejuaraan
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Menghapus kelas kejuaraan yang tidak dipertandingkan
              </p>
            </div>
            <Link href="/admin/kejuaraan/create" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Buat Kejuaraan
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Total Terjadwal
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {summary.total}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Tingkat Kota
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {summary.kota}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Tingkat Provinsi
              </p>
              <p className="text-xl md:text-2xl font-bold text-indigo-600">
                {summary.provinsi}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Tingkat Nasional
              </p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">
                {summary.nasional}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Tingkat Internasional
              </p>
              <p className="text-xl md:text-2xl font-bold text-rose-600">
                {summary.internasional}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="space-y-1.5">
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
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-transparent">
                    <TableHead className="w-[30%]">Nama Kejuaraan</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tingkat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[180px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredChampionships.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Tidak ada kejuaraan terjadwal yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredChampionships.map((champ) => (
                      <TableRow key={champ.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-foreground">
                              {champ.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ID: {champ.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {champ.location}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="text-foreground font-medium">
                            <p>{formatDate(champ.start_date)}</p>
                            {champ.start_date !== champ.end_date && (
                              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                                s/d {formatDate(champ.end_date)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getLevelBadgeVariant(champ.level)}
                            className="capitalize font-medium"
                          >
                            {champ.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(champ.status)}>
                            {getStatusLabel(champ.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/admin/kejuaraan/${champ.id}/kelas/hapus/kyorugi`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="shadow-xs"
                              >
                                <Trash className="w-4 h-4 mr-1.5" />
                                Hapus Kyorugi
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/kejuaraan/${champ.id}/kelas/hapus/poomsae`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="shadow-xs text-blue-600"
                              >
                                <Trash className="w-4 h-4 mr-1.5" />
                                Hapus Poomsae
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
