"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
  Search,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Kelas {
  id: number;
  nama: string;
  deskripsi: string;
  status: "aktif" | "nonaktif";
  created_at: string;
  jumlah_murid: number;
  jumlah_jadwal: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Kelas[];
  meta: {
    pagination: {
      current_page: number;
      per_page: number;
      total_page: number;
      total_data: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

const fetchClasses = async (
  page: number,
  limit: number,
  search: string,
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`/api/pelatih/kelas?${params}`);
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Gagal memuat data" }));
    throw new Error(errorData.message || "Gagal memuat data");
  }
  return await response.json();
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return dateString;
  }
};

export default function ClassesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const limit = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchClasses(page, limit, debouncedSearch);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal memuat data"));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pagination = data?.meta?.pagination;
  const classes = data?.data || [];

  // Summary stats
  const totalClasses = pagination?.total_data || 0;
  const activeClasses = classes.filter((k) => k.status === "aktif").length;
  const totalStudents = classes.reduce((sum, k) => sum + k.jumlah_murid, 0);
  const totalSchedules = classes.reduce((sum, k) => sum + k.jumlah_jadwal, 0);

  const isEmpty = !loading && classes.length === 0 && !error;
  const hasError = error !== null;

  const handleRefresh = () => {
    loadData();
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
              <div className="space-y-6">
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                  {/* Main Content */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-700">
                            Total Kelas
                          </CardTitle>
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {totalClasses}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Semua kelas yang diampu
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-700">
                            Kelas Aktif
                          </CardTitle>
                          <GraduationCap className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {activeClasses}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Kelas dengan status aktif
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-700">
                            Total Murid
                          </CardTitle>
                          <Users className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {totalStudents}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Semua siswa di kelas
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-700">
                            Total Jadwal
                          </CardTitle>
                          <Calendar className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {totalSchedules}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Jadwal latihan
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 min-w-0">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cari Kelas
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                              placeholder="Cari nama kelas..."
                              className="pl-10"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRefresh}
                          disabled={loading}
                          title="Refresh data"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Error State */}
                    {hasError && (
                      <Alert variant="destructive" className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Gagal Memuat Data</AlertTitle>
                        <AlertDescription>
                          {error?.message ||
                            "Terjadi kesalahan saat mengambil data kelas."}
                        </AlertDescription>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          className="mt-4"
                        >
                          Coba Lagi
                        </Button>
                      </Alert>
                    )}

                    {/* Loading State */}
                    {loading && (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse"
                          >
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty State */}
                    {isEmpty && (
                      <Card className="border-slate-200 text-center py-12">
                        <CardContent className="flex flex-col items-center gap-4">
                          <div className="rounded-full bg-slate-100 p-4">
                            <BookOpen className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              Belum Ada Kelas
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                              Anda belum ditugaskan pada kelas mana pun.
                            </p>
                          </div>
                          <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="mt-4"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Desktop Table View */}
                    {!loading && !isEmpty && !hasError && (
                      <>
                        <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Nama Kelas
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Deskripsi
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Murid
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Jadwal
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Status
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Dibuat
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Aksi
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {classes.map((kelas) => (
                                  <tr
                                    key={kelas.id}
                                    className="hover:bg-slate-50 transition-colors"
                                  >
                                    <td className="px-6 py-4">
                                      <span className="font-semibold text-slate-900">
                                        {kelas.nama}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                                      <div className="line-clamp-2">
                                        {kelas.deskripsi}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <Badge
                                        variant="secondary"
                                        className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                                      >
                                        👥 {kelas.jumlah_murid} Murid
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                      <Badge
                                        variant="secondary"
                                        className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                                      >
                                        📅 {kelas.jumlah_jadwal} Jadwal
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                      <Badge
                                        variant={
                                          kelas.status === "aktif"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className={
                                          kelas.status === "aktif"
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                                        }
                                      >
                                        {kelas.status === "aktif"
                                          ? "✓ Aktif"
                                          : "Nonaktif"}
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                      {formatDate(kelas.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                      <Link
                                        href={`/pelatih/absensi/riwayat/${kelas.id}`}
                                      >
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-blue-600 hover:text-blue-700"
                                        >
                                          <Eye className="h-4 w-4 mr-1" />
                                          Detail
                                        </Button>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                          {classes.map((kelas) => (
                            <Card
                              key={kelas.id}
                              className="border-slate-200 hover:shadow-lg transition-shadow"
                            >
                              <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="font-semibold text-slate-900">
                                      {kelas.nama}
                                    </h3>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                      {kelas.deskripsi}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      kelas.status === "aktif"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={
                                      kelas.status === "aktif"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-slate-100 text-slate-800"
                                    }
                                  >
                                    {kelas.status === "aktif"
                                      ? "✓ Aktif"
                                      : "Nonaktif"}
                                  </Badge>
                                </div>

                                <div className="flex gap-3 mb-4">
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-800"
                                  >
                                    👥 {kelas.jumlah_murid}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="bg-orange-100 text-orange-800"
                                  >
                                    📅 {kelas.jumlah_jadwal}
                                  </Badge>
                                </div>

                                <div className="text-xs text-slate-500 mb-4">
                                  Dibuat: {formatDate(kelas.created_at)}
                                </div>

                                <Link
                                  href={`/pelatih/absensi/riwayat/${kelas.id}`}
                                >
                                  <Button variant="outline" className="w-full">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detail
                                  </Button>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Pagination */}
                        {pagination && (
                          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-600">
                              Menampilkan {(page - 1) * limit + 1} -{" "}
                              {Math.min(page * limit, pagination.total_data)}{" "}
                              dari {pagination.total_data} kelas
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                disabled={!pagination.has_prev || loading}
                                onClick={() =>
                                  setPage((p) => Math.max(p - 1, 1))
                                }
                              >
                                Sebelumnya
                              </Button>
                              <Button
                                variant="outline"
                                disabled={!pagination.has_next || loading}
                                onClick={() => setPage((p) => p + 1)}
                              >
                                Selanjutnya
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
