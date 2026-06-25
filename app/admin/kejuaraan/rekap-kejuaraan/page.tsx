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
import { Plus, Loader2, Eye } from "lucide-react";
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
  total_championship: number;
  akan_datang: string;
  berlangsung: string;
  selesai: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Championship[];
  meta: {
    pagination: Pagination;
    summary: Summary;
  };
}

export default function CompletedChampionshipsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [summary, setSummary] = useState<Summary>({
    total_championship: 0,
    akan_datang: "0",
    berlangsung: "0",
    selesai: "0",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCompletedChampionships = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kejuaraan/getall?page=${page}&per_page=10&status=selesai`,
      );
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      setChampionships(data.data || []);
      setPagination(data.meta.pagination);
      setSummary(data.meta.summary);
      setCurrentPage(page);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memuat data kejuaraan selesai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedChampionships();
  }, []);

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

  const getLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
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
                Kejuaraan Selesai
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Daftar kejuaraan yang telah selesai
              </p>
            </div>
            <Link href="/admin/kejuaraan/create" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Buat Kejuaraan
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Total
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {summary.total_championship}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Akan Datang
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {summary.akan_datang}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Berlangsung
              </p>
              <p className="text-xl md:text-2xl font-bold text-amber-600">
                {summary.berlangsung}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                Selesai
              </p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {summary.selesai}
              </p>
            </div>
          </div>

          {/* Table */}
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
                  ) : championships.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Tidak ada kejuaraan selesai yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    championships.map((champ) => (
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
                            {getLevelLabel(champ.level)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Selesai</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/admin/kejuaraan/rekap-kejuaraan/${champ.id}`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="shadow-xs"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              Detail
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

          {/* Pagination */}
          {pagination.total_page > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Halaman{" "}
                <span className="font-medium text-foreground">
                  {pagination.current_page}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">
                  {pagination.total_page}
                </span>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    fetchCompletedChampionships(pagination.current_page - 1)
                  }
                  disabled={!pagination.has_prev || loading}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    fetchCompletedChampionships(pagination.current_page + 1)
                  }
                  disabled={!pagination.has_next || loading}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
