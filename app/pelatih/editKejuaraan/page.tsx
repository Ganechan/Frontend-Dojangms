"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  CalendarClock,
  Users,
  ClipboardPen,
  RefreshCw,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Championship {
  id: number;
  name: string;
  level: "kota" | "provinsi" | "nasional" | "internasional";
  location: string;
  year: number;
  start_date: string;
  end_date: string;
  total_peserta: number;
  peserta_belum_diedit: string; // dari response, bisa string atau number
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Championship[];
}

export default function KejuaraanPage() {
  const router = useRouter();
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [filteredChampionships, setFilteredChampionships] = useState<
    Championship[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchChampionships = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await fetch("/api/pelatih/kejuaraan/editable");
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat data");
      }
      const data: ApiResponse = await response.json();
      if (data.success) {
        setChampionships(data.data);
        setFilteredChampionships(data.data);
      } else {
        setError(data.message || "Gagal memuat data kejuaraan");
      }
    } catch (err: any) {
      const msg =
        err.message || "Terjadi kesalahan saat mengambil daftar kejuaraan.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChampionships();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = championships.filter((champ) => {
      const lowerQuery = query.toLowerCase();
      return (
        champ.name.toLowerCase().includes(lowerQuery) ||
        champ.location.toLowerCase().includes(lowerQuery) ||
        champ.year.toString().includes(lowerQuery)
      );
    });
    setFilteredChampionships(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "kota":
        return "bg-blue-100 text-blue-800";
      case "provinsi":
        return "bg-green-100 text-green-800";
      case "nasional":
        return "bg-purple-100 text-purple-800";
      case "internasional":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalKejuaraan = championships.length;
  const totalPeserta = championships.reduce(
    (sum, c) => sum + c.total_peserta,
    0,
  );
  const totalBelumDiedit = championships.reduce(
    (sum, c) => sum + Number(c.peserta_belum_diedit),
    0,
  );

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
              <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      Edit Hasil Kejuaraan
                    </h1>
                    <p className="text-muted-foreground">
                      Edit hasil peserta kejuaraan yang menjadi tanggung jawab
                      Anda.
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Kejuaraan
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <>
                            <div className="text-2xl font-bold">
                              {totalKejuaraan}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              kejuaraan tersedia
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Peserta
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <>
                            <div className="text-2xl font-bold">
                              {totalPeserta}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              peserta terdaftar
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Belum Diedit
                        </CardTitle>
                        <ClipboardPen className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <>
                            <div className="text-2xl font-bold text-yellow-600">
                              {totalBelumDiedit}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              peserta belum diedit
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Siap Diedit
                        </CardTitle>
                        <ClipboardPen className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <>
                            <div className="text-2xl font-bold text-blue-600">
                              {totalKejuaraan}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              kejuaraan dapat diedit
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Error State */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal Memuat Data Kejuaraan</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchChampionships}
                        disabled={refreshing}
                        className="mt-2"
                      >
                        {refreshing ? "Memuat..." : "Coba Lagi"}
                      </Button>
                    </Alert>
                  )}

                  {/* Search and Actions */}
                  {!error && (
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Cari nama kejuaraan..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={fetchChampionships}
                          disabled={refreshing || loading}
                          title="Refresh data"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                          />
                        </Button>
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden md:block rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Nama Kejuaraan</TableHead>
                              <TableHead>Level</TableHead>
                              <TableHead>Lokasi</TableHead>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Total Peserta</TableHead>
                              <TableHead>Belum Diedit</TableHead>
                              <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              [...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    <Skeleton className="h-4 w-48" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-4 w-16" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-4 w-12" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-4 w-12" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-8 w-20" />
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : filteredChampionships.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={7}
                                  className="text-center py-8"
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <Trophy className="h-12 w-12 text-muted-foreground opacity-50" />
                                    <div>
                                      <h3 className="font-semibold text-foreground">
                                        Belum Ada Kejuaraan
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        Tidak ada kejuaraan yang dapat diedit
                                        saat ini.
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredChampionships.map((championship) => (
                                <TableRow
                                  key={championship.id}
                                  className="hover:bg-muted/50"
                                >
                                  <TableCell className="font-semibold">
                                    {championship.name}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={getLevelColor(
                                        championship.level,
                                      )}
                                    >
                                      {championship.level
                                        .charAt(0)
                                        .toUpperCase() +
                                        championship.level.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="text-sm">
                                        {championship.location}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="text-sm">
                                        {formatDate(championship.start_date)} -{" "}
                                        {formatDate(championship.end_date)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {championship.total_peserta} Peserta
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="secondary"
                                      className="bg-yellow-100 text-yellow-800"
                                    >
                                      {championship.peserta_belum_diedit}{" "}
                                      Peserta
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Link
                                      href={`/pelatih/editKejuaraan/${championship.id}`}
                                    >
                                      <Button
                                        size="sm"
                                        title="Edit hasil peserta kejuaraan"
                                      >
                                        <ClipboardPen className="h-4 w-4 mr-1" />
                                        Edit Hasil
                                      </Button>
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-4">
                        {loading ? (
                          [...Array(3)].map((_, i) => (
                            <Card key={i}>
                              <CardContent className="pt-6 space-y-3">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-40" />
                              </CardContent>
                            </Card>
                          ))
                        ) : filteredChampionships.length === 0 ? (
                          <div className="text-center py-12">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="font-semibold text-foreground mb-1">
                              Belum Ada Kejuaraan
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Tidak ada kejuaraan yang dapat diedit saat ini.
                            </p>
                          </div>
                        ) : (
                          filteredChampionships.map((championship) => (
                            <Card
                              key={championship.id}
                              className="overflow-hidden"
                            >
                              <CardContent className="pt-6 space-y-4">
                                <div>
                                  <h3 className="font-semibold text-foreground mb-2">
                                    {championship.name}
                                  </h3>
                                  <Badge
                                    className={getLevelColor(
                                      championship.level,
                                    )}
                                  >
                                    {championship.level
                                      .charAt(0)
                                      .toUpperCase() +
                                      championship.level.slice(1)}
                                  </Badge>
                                </div>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                      {championship.location}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                      {formatDate(championship.start_date)} -{" "}
                                      {formatDate(championship.end_date)}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2">
                                  <Badge variant="outline">
                                    {championship.total_peserta} Peserta
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-800"
                                  >
                                    {championship.peserta_belum_diedit} Belum
                                    Diedit
                                  </Badge>
                                </div>

                                <Link
                                  href={`/pelatih/editKejuaraan/${championship.id}`}
                                  className="block"
                                >
                                  <Button className="w-full">
                                    <ClipboardPen className="h-4 w-4 mr-2" />
                                    Edit Hasil
                                  </Button>
                                </Link>
                              </CardContent>
                            </Card>
                          ))
                        )}
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
