"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  Plus,
  Loader2,
  Layers,
  ArrowLeft,
  Users,
  School,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Kelas {
  id: number;
  nama: string;
  deskripsi: string;
  status: "aktif" | "nonaktif";
}

interface PaginationInfo {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function TrainersPage() {
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "aktif" | "nonaktif">("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [summary, setSummary] = useState({
    total: 0,
    aktif: 0,
    nonaktif: 0,
  });

  // Debounce search term to avoid spamming the backend API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch classes data from internal API using search and status filters
  const fetchClasses = useCallback(async (p: number, search: string, status: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", p.toString());
      params.append("limit", "10");
      if (search.trim()) {
        params.append("search", search.trim());
      }
      if (status !== "all") {
        params.append("status", status);
      }

      const response = await fetch(
        `/api/admin/kelas/getallkelas?${params.toString()}`,
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengambil data kelas");
      }
      const data = await response.json();
      setClasses(data.data || []);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total_data: data.pagination.total_data,
        total_page: data.pagination.total_page,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });

      if (data.summary) {
        setSummary({
          total: Number(data.summary.total_kelas) || 0,
          aktif: Number(data.summary.total_kelas_aktif) || 0,
          nonaktif: Number(data.summary.total_kelas_nonaktif) || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengambil data kelas",
      );
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch classes whenever page, debouncedSearch or statusFilter changes
  useEffect(() => {
    fetchClasses(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, fetchClasses]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val: "all" | "aktif" | "nonaktif") => {
    setStatusFilter(val);
    setPage(1);
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
          <div className="@container/main mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">

            {/* Back to Classes Link */}
            <div className="flex items-center">
              <Link href="/admin/kelas">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group h-8 px-2 text-neutral-500 hover:text-neutral-900 transition-colors -ml-2 mb-1 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
                  Kembali ke Kelas
                </Button>
              </Link>
            </div>

            {/* Header Section */}
            <div className="flex flex-col gap-1 border-b pb-5">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                Alokasi Pelatih Kelas
              </h1>
              <p className="text-sm text-neutral-500">
                Tentukan pelatih penanggung jawab, kelola instruktur kelas, dan distribusikan alokasi pelatih baru.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-neutral-200/80">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-3 bg-neutral-100 rounded-xl">
                    <School className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Total Kelas
                    </p>
                    {loading && summary.total === 0 ? (
                      <Skeleton className="h-7 w-12 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-bold text-neutral-900 mt-0.5">
                        {summary.total}
                      </h3>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-neutral-200/80 border-l-4 border-l-emerald-500">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider">
                      Kelas Aktif
                    </p>
                    {loading && summary.aktif === 0 ? (
                      <Skeleton className="h-7 w-12 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-bold text-emerald-700 mt-0.5">
                        {summary.aktif}
                      </h3>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-neutral-200/80 border-l-4 border-l-rose-500">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <XCircle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-rose-600/80 uppercase tracking-wider">
                      Kelas Nonaktif
                    </p>
                    {loading && summary.nonaktif === 0 ? (
                      <Skeleton className="h-7 w-12 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-bold text-rose-700 mt-0.5">
                        {summary.nonaktif}
                      </h3>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Toolbar Filters Card */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-sm space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                <Input
                  type="text"
                  placeholder="Cari nama kelas atau deskripsi kurikulum..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-neutral-50/30 focus-visible:bg-white border-neutral-200"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-lg border border-neutral-200/50">
                  <button
                    onClick={() => handleStatusFilterChange("all")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-155 ${statusFilter === "all"
                        ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/40"
                        : "text-neutral-500 hover:text-neutral-800"
                      }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange("aktif")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-155 ${statusFilter === "aktif"
                        ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/40"
                        : "text-neutral-500 hover:text-neutral-800"
                      }`}
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange("nonaktif")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-155 ${statusFilter === "nonaktif"
                        ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/40"
                        : "text-neutral-500 hover:text-neutral-800"
                      }`}
                  >
                    Nonaktif
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200/60">
                  <Layers className="size-3.5 text-neutral-400" />
                  <span>
                    Total:{" "}
                    <strong className="text-neutral-900">
                      {pagination.total_data}
                    </strong>{" "}
                    Kelas
                  </span>
                </div>
              </div>
            </div>

            {/* Main Data Table View */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-50/70 border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[30%] font-semibold text-neutral-700 pl-6 py-3.5">
                      Nama Kelas
                    </TableHead>
                    <TableHead className="w-[40%] font-semibold text-neutral-700 py-3.5">
                      Deskripsi Kelas
                    </TableHead>
                    <TableHead className="w-[13%] font-semibold text-neutral-700 py-3.5">
                      Status
                    </TableHead>
                    <TableHead className="w-[17%] text-right font-semibold text-neutral-700 pr-6 py-3.5">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="py-4 pl-6">
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell className="py-4">
                          <Skeleton className="h-5 w-48" />
                        </TableCell>
                        <TableCell className="py-4">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell className="py-4 pr-6">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-24 rounded-md" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : classes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-48 text-center text-muted-foreground font-medium"
                      >
                        <div className="flex flex-col items-center justify-center gap-3 text-neutral-400">
                          <School className="size-10 stroke-[1.5] text-neutral-300 animate-pulse" />
                          <span className="text-sm font-medium text-neutral-500">
                            Tidak ada kelas yang terdeteksi dalam kriteria ini.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((kelas) => (
                      <TableRow
                        key={kelas.id}
                        className="hover:bg-neutral-50/50 transition-colors"
                      >
                        <TableCell className="font-semibold text-neutral-900 py-4 pl-6">
                          {kelas.nama}
                        </TableCell>
                        <TableCell className="text-neutral-500 text-sm max-w-xs truncate py-4">
                          {kelas.deskripsi || (
                            <span className="text-neutral-400 italic font-normal">
                              Tidak ada deskripsi
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {kelas.status === "aktif" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-none hover:bg-emerald-50 font-medium px-2.5 py-0.5 inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Aktif
                            </Badge>
                          ) : (
                            <Badge className="bg-neutral-100 text-neutral-600 border border-neutral-200 shadow-none hover:bg-neutral-100 font-medium px-2.5 py-0.5 inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                              Nonaktif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-4 pr-6">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Button Kelola Pelatih */}
                            {kelas.status === "aktif" ? (
                              <Link href={`/admin/kelas/addPelatih/${kelas.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 shadow-sm border-blue-200 text-blue-600 bg-blue-50/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-150 font-semibold"
                                >
                                  <Users className="size-3.5 mr-1.5 stroke-[2.5]" />
                                  Kelola Pelatih
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="h-8 shadow-none font-semibold opacity-40 cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
                              >
                                <Users className="size-3.5 mr-1.5 stroke-[2.5]" />
                                Kelola Pelatih
                              </Button>
                            )}
                            {/* Button Tambah Pelatih */}
                            {kelas.status === "aktif" ? (
                              <Link
                                href={`/admin/kelas/addPelatih/create?classId=${kelas.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 shadow-sm border-emerald-200 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-150 font-semibold"
                                >
                                  <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                                  Tambah Pelatih
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="h-8 shadow-none font-semibold opacity-40 cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
                              >
                                <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                                Tambah Pelatih
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {!loading && pagination.total_page > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <div className="text-sm text-neutral-500 font-medium">
                  Menampilkan Halaman{" "}
                  <span className="text-neutral-850 font-semibold">{pagination.page}</span>{" "}
                  dari{" "}
                  <span className="text-neutral-850 font-semibold">
                    {pagination.total_page}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(pagination.page - 1)}
                    disabled={!pagination.has_prev || loading}
                    className="shadow-sm border-neutral-200 hover:bg-neutral-50 font-medium h-8"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(pagination.page + 1)}
                    disabled={!pagination.has_next || loading}
                    className="shadow-sm border-neutral-200 hover:bg-neutral-50 font-medium h-8"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
