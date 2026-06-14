"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, Eye, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Ujian {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  level_ujian: "kota" | "provinsi";
  lokasi: string;
  keterangan: string;
  status: string;
  created_at: string;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function ExamHistoryPage() {
  const [exams, setExams] = useState<Ujian[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "kota" | "provinsi">(
    "all",
  );
  const [loading, setLoading] = useState(true);

  const fetchExams = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/selesai?page=${page}&limit=10`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memuat data");
      setExams(data.data || []);
      setPagination({
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_page: data.pagination.total_page,
        total_data: data.pagination.total_data,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });
    } catch (error: any) {
      console.error("Error fetching exams:", error);
      toast.error(error.message || "Gagal memuat data ujian selesai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === "all" || exam.level_ujian === levelFilter;
    return matchesSearch && matchesLevel;
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8">
                    <Link href="/exams">
                      <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                      </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Riwayat Ujian
                    </h1>
                    <p className="text-muted-foreground">
                      Lihat daftar ujian yang telah selesai
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="text-sm text-muted-foreground">
                        Total Ujian Selesai: {pagination.total_data}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                          type="text"
                          placeholder="Cari ujian atau lokasi..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex gap-2">
                        {(["all", "kota", "provinsi"] as const).map((level) => (
                          <Button
                            key={level}
                            variant={
                              levelFilter === level ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setLevelFilter(level)}
                          >
                            {level === "all" ? "Semua" : level}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Keterangan</TableHead>
                          <TableHead>Lokasi</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredExams.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Tidak ada ujian yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredExams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium max-w-xs truncate">
                                {exam.keterangan}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {exam.lokasi}
                              </TableCell>
                              <TableCell className="text-sm">
                                {exam.tanggal_mulai === exam.tanggal_selesai
                                  ? formatDate(exam.tanggal_mulai)
                                  : `${formatDate(exam.tanggal_mulai)} - ${formatDate(exam.tanggal_selesai)}`}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getLevelBadgeVariant(
                                    exam.level_ujian,
                                  )}
                                >
                                  {exam.level_ujian === "provinsi"
                                    ? "Provinsi"
                                    : "Kota"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">Selesai</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={`/admin/ujianKenaikanSabuk/${exam.id}`}
                                >
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
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

                  {pagination.total_page > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Halaman {pagination.current_page} dari{" "}
                        {pagination.total_page}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchExams(pagination.current_page - 1)
                          }
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchExams(pagination.current_page + 1)
                          }
                          disabled={!pagination.has_next || loading}
                        >
                          Selanjutnya
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
