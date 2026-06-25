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
import { Plus, UserPlus, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Ujian Terjadwal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Daftar pelaksanaan ujian kenaikan sabuk aktif mendatang
              </p>
            </div>
            <Link
              href="/admin/ujianKenaikanSabuk/create"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Buat Ujian
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Level Kota
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {summary.kota}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Level Provinsi
              </p>
              <p className="text-xl md:text-2xl font-bold text-indigo-600">
                {summary.provinsi}
              </p>
            </div>
          </div>

          {/* Toolbar Level Filter */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="space-y-1.5">
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

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-transparent">
                    <TableHead className="w-[35%]">Keterangan</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal Pelaksanaan</TableHead>
                    <TableHead className="w-[120px]">Level</TableHead>
                    <TableHead className="text-right w-[180px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Tidak ada ujian terjadwal yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.map((ujian) => (
                      <TableRow key={ujian.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-foreground">
                              {ujian.keterangan}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ID Ujian: {ujian.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {ujian.lokasi}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="text-foreground font-medium">
                            <p>{formatDate(ujian.tanggal_mulai)}</p>
                            {ujian.tanggal_mulai !== ujian.tanggal_selesai && (
                              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                                s/d {formatDate(ujian.tanggal_selesai)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getLevelBadgeVariant(ujian.level_ujian)}
                            className="capitalize font-medium"
                          >
                            {ujian.level_ujian}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/admin/ujianKenaikanSabuk/${ujian.id}/peserta`}
                            passHref
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="shadow-xs border-border text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
                              Kelola Peserta
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/ujianKenaikanSabuk/addPeserta?examId=${ujian.id}`}
                            passHref
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="shadow-xs border-border text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <UserPlus className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
                              Tambah Peserta
                            </Button>
                          </Link>
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
