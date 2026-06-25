"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// ============ INTERFACES ============
interface Sabuk {
  id: number;
  nama: string;
}

interface Murid {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_bergabung: string;
  sabuk: Sabuk;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

interface MuridData {
  total: number;
  data: Murid[];
  pagination: Pagination;
}

interface Jadwal {
  id: number;
  nama: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  status: string;
}

interface KelasDetail {
  id: number;
  nama: string;
  deskripsi: string;
  status: string;
  created_at: string;
  jadwal: Jadwal[];
  murid: MuridData;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: KelasDetail;
}

const SABUK_COLORS: Record<string, string> = {
  Putih: "bg-gray-100 text-gray-800",
  Kuning: "bg-yellow-100 text-yellow-800",
  Biru: "bg-blue-100 text-blue-800",
  Merah: "bg-red-100 text-red-800",
  Hitam: "bg-gray-900 text-white",
};

export default function DetailKelasPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<KelasDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muridPage, setMuridPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const url = `/api/pelatih/kelas/${id}?murid_page=${page}&murid_limit=10`;
        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Gagal memuat data");
        }
        const result: ApiResponse = await res.json();
        if (!result.success) {
          throw new Error(result.message || "Gagal memuat data");
        }
        setData(result.data);
        setMuridPage(page);
      } catch (err: any) {
        const msg = err.message || "Gagal memuat detail kelas";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    fetchData(muridPage);
  };

  const handlePageChange = (newPage: number) => {
    fetchData(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const filteredMurid =
    data?.murid.data.filter((murid) =>
      murid.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Gagal Memuat Data Kelas</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Coba Lagi
          </Button>
        </Alert>
      </div>
    );
  }

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
              <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white">
                  <div className="flex flex-col gap-4 p-4 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                      >
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                      </Button>
                    </div>

                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-1/3" />
                      </>
                    ) : data ? (
                      <>
                        <div>
                          <h1 className="text-3xl font-bold tracking-tight">
                            {data.nama}
                          </h1>
                          <p className="mt-2 text-muted-foreground">
                            Informasi lengkap kelas, jadwal latihan, dan daftar
                            murid.
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="p-4 md:p-8">
                  {/* Summary Cards */}
                  {loading ? (
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                      ))}
                    </div>
                  ) : data ? (
                    <div className="mb-8 grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Nama Kelas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{data.nama}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge
                            variant={
                              data.status === "aktif" ? "default" : "secondary"
                            }
                            className={
                              data.status === "aktif" ? "bg-green-600" : ""
                            }
                          >
                            {capitalize(data.status)}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Jumlah Murid
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data.murid.total} Murid
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Jumlah Jadwal
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data.jadwal.length} Jadwal
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}

                  {/* Main Content with Sidebar */}
                  <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
                    <div className="md:col-span-2 lg:col-span-3">
                      {loading ? (
                        <Card>
                          <CardHeader>
                            <Skeleton className="h-8 w-1/3" />
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-10" />
                            ))}
                          </CardContent>
                        </Card>
                      ) : data ? (
                        <Tabs defaultValue="informasi" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="informasi">
                              Informasi Kelas
                            </TabsTrigger>
                            <TabsTrigger value="jadwal">
                              Jadwal Latihan
                            </TabsTrigger>
                            <TabsTrigger value="murid">
                              Daftar Murid
                            </TabsTrigger>
                          </TabsList>

                          {/* Tab 1: Informasi Kelas */}
                          <TabsContent value="informasi" className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>Informasi Kelas</CardTitle>
                                <CardDescription>
                                  Detail lengkap tentang kelas Anda
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Nama Kelas
                                  </label>
                                  <p className="mt-2 text-lg font-semibold">
                                    {data.nama}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Deskripsi
                                  </label>
                                  <p className="mt-2 text-base">
                                    {data.deskripsi}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Status
                                  </label>
                                  <div className="mt-2">
                                    <Badge
                                      variant={
                                        data.status === "aktif"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        data.status === "aktif"
                                          ? "bg-green-600"
                                          : ""
                                      }
                                    >
                                      {capitalize(data.status)}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Tanggal Dibuat
                                  </label>
                                  <p className="mt-2 text-base">
                                    {formatDate(data.created_at)}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Tab 2: Jadwal Latihan */}
                          <TabsContent value="jadwal" className="space-y-4">
                            {data.jadwal.length === 0 ? (
                              <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                  <div className="text-center">
                                    <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                      Belum Ada Jadwal
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="grid gap-4 md:grid-cols-2">
                                {data.jadwal.map((jadwal) => (
                                  <Card
                                    key={jadwal.id}
                                    className="overflow-hidden"
                                  >
                                    <CardHeader className="pb-3">
                                      <div className="flex items-start justify-between">
                                        <CardTitle className="text-base">
                                          {jadwal.nama}
                                        </CardTitle>
                                        <Badge
                                          variant={
                                            jadwal.status === "aktif"
                                              ? "default"
                                              : "secondary"
                                          }
                                          className={
                                            jadwal.status === "aktif"
                                              ? "bg-green-600"
                                              : ""
                                          }
                                        >
                                          {capitalize(jadwal.status)}
                                        </Badge>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="size-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          Hari:
                                        </span>
                                        <span>{capitalize(jadwal.hari)}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm">
                                        <Clock className="size-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          Waktu:
                                        </span>
                                        <span>
                                          {jadwal.jam_mulai} -{" "}
                                          {jadwal.jam_selesai}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="size-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          Lokasi:
                                        </span>
                                        <span>{jadwal.lokasi}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          {/* Tab 3: Daftar Murid */}
                          <TabsContent value="murid" className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>Daftar Murid</CardTitle>
                                <CardDescription>
                                  Total {data.murid.total} murid terdaftar
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Search */}
                                <div className="relative">
                                  <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Cari nama murid..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                      setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                  />
                                </div>

                                {filteredMurid.length === 0 ? (
                                  <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                      <p className="text-muted-foreground">
                                        Tidak ada murid ditemukan.
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {/* Desktop Table */}
                                    <div className="hidden overflow-x-auto md:block">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b">
                                            <th className="px-4 py-3 text-left font-medium">
                                              Nama
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                              Email
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                              Nomor HP
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                              Sabuk
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                              Tanggal Bergabung
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {filteredMurid.map((murid) => (
                                            <tr
                                              key={murid.id}
                                              className="border-b hover:bg-gray-50"
                                            >
                                              <td className="px-4 py-3">
                                                {murid.name}
                                              </td>
                                              <td className="px-4 py-3 text-muted-foreground">
                                                {murid.email}
                                              </td>
                                              <td className="px-4 py-3">
                                                {murid.phone}
                                              </td>
                                              <td className="px-4 py-3">
                                                <Badge
                                                  className={
                                                    SABUK_COLORS[
                                                      murid.sabuk.nama
                                                    ] || "bg-gray-100"
                                                  }
                                                >
                                                  {murid.sabuk.nama}
                                                </Badge>
                                              </td>
                                              <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(
                                                  murid.tanggal_bergabung,
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="space-y-3 md:hidden">
                                      {filteredMurid.map((murid) => (
                                        <Card key={murid.id}>
                                          <CardContent className="space-y-3 pt-6">
                                            <div>
                                              <p className="text-sm font-medium text-muted-foreground">
                                                Nama
                                              </p>
                                              <p className="font-semibold">
                                                {murid.name}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium text-muted-foreground">
                                                Email
                                              </p>
                                              <p className="text-sm">
                                                {murid.email}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium text-muted-foreground">
                                                Nomor HP
                                              </p>
                                              <p className="text-sm">
                                                {murid.phone}
                                              </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                  Sabuk
                                                </p>
                                                <Badge
                                                  className={
                                                    SABUK_COLORS[
                                                      murid.sabuk.nama
                                                    ] || "bg-gray-100"
                                                  }
                                                >
                                                  {murid.sabuk.nama}
                                                </Badge>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                  Bergabung
                                                </p>
                                                <p className="text-xs">
                                                  {formatDate(
                                                    murid.tanggal_bergabung,
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </>
                                )}

                                {/* Pagination */}
                                {data.murid.pagination && (
                                  <div className="flex items-center justify-between border-t pt-4">
                                    <div className="text-sm text-muted-foreground">
                                      Halaman{" "}
                                      {data.murid.pagination.current_page} dari{" "}
                                      {data.murid.pagination.total_page}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                          !data.murid.pagination.has_prev
                                        }
                                        onClick={() =>
                                          handlePageChange(
                                            data.murid.pagination.current_page -
                                              1,
                                          )
                                        }
                                      >
                                        Sebelumnya
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                          !data.murid.pagination.has_next
                                        }
                                        onClick={() =>
                                          handlePageChange(
                                            data.murid.pagination.current_page +
                                              1,
                                          )
                                        }
                                      >
                                        Selanjutnya
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      ) : null}
                    </div>

                    {/* Right Sidebar */}
                    {loading ? (
                      <Skeleton className="h-64" />
                    ) : data ? (
                      <Card className="md:sticky md:top-4 md:h-fit">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Ringkasan Kelas
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Nama Kelas
                            </p>
                            <p className="font-semibold">{data.nama}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Status
                            </p>
                            <div className="mt-2">
                              <Badge
                                variant={
                                  data.status === "aktif"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  data.status === "aktif" ? "bg-green-600" : ""
                                }
                              >
                                {capitalize(data.status)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Total Murid
                            </p>
                            <p className="mt-1 font-semibold">
                              {data.murid.total}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Total Jadwal
                            </p>
                            <p className="mt-1 font-semibold">
                              {data.jadwal.length}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}
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
