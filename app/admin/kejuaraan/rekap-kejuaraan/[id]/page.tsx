"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Users,
  Eye,
  Loader2,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Kejuaraan {
  id: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
}

interface TotalMedali {
  emas: number;
  perak: number;
  perunggu: number;
  harapan: number;
  total_peserta: number;
}

interface PeraihMedali {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  hasil: string;
  belt: {
    id: number;
    nama: string;
  };
  kelas: {
    tipe: string;
    nama: string;
  };
}

interface SemuaPeserta {
  user_id: number;
  name: string;
  hasil: string;
  kelas: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    kejuaraan: Kejuaraan;
    total_medali: TotalMedali;
    peraih_medali: PeraihMedali[];
    semua_peserta: SemuaPeserta[];
  };
}

const hasilLabel: Record<string, string> = {
  juara1: "🏆 Juara 1",
  juara2: "🥈 Juara 2",
  juara3: "🥉 Juara 3",
  harapan: "🏅 Harapan",
  peserta: "Peserta",
};

const hasilBadgeVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  juara1: "default",
  juara2: "secondary",
  juara3: "outline",
  harapan: "default",
  peserta: "secondary",
};

export default function HasilKejuaraanPage() {
  const params = useParams();
  const router = useRouter();
  const kejuaraanId = params.id as string;
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/kejuaraan/${kejuaraanId}/hasil`,
        );
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Gagal memuat data");
        }
        const result: ApiResponse = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Gagal memuat data");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data");
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kejuaraanId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMedaliIcon = (hasil: string) => {
    switch (hasil) {
      case "juara1":
        return <Medal className="h-4 w-4 text-yellow-500" />;
      case "juara2":
        return <Medal className="h-4 w-4 text-gray-400" />;
      case "juara3":
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  if (loading) {
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
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !data) {
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
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="text-center">
              <p className="text-lg text-destructive">
                {error || "Data tidak ditemukan"}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.back()}
              >
                Kembali
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const { kejuaraan, total_medali, peraih_medali, semua_peserta } = data;

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
        <div className="flex flex-1 flex-col p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {kejuaraan.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {kejuaraan.location} • {formatDate(kejuaraan.start_date)} -{" "}
                    {formatDate(kejuaraan.end_date)}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {kejuaraan.level.charAt(0).toUpperCase() +
                      kejuaraan.level.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Total Medali Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Peserta
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {total_medali.total_peserta}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">
                    Emas
                  </CardTitle>
                  <Medal className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-700">
                    {total_medali.emas}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Perak
                  </CardTitle>
                  <Medal className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-700">
                    {total_medali.perak}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700">
                    Perunggu
                  </CardTitle>
                  <Medal className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700">
                    {total_medali.perunggu}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">
                    Harapan
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">
                    {total_medali.harapan}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Peraih Medali */}
            <Card>
              <CardHeader>
                <CardTitle>🏅 Peraih Medali</CardTitle>
                <CardDescription>
                  Daftar peserta yang berhasil meraih medali
                </CardDescription>
              </CardHeader>
              <CardContent>
                {peraih_medali.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada peraih medali
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Sabuk</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Hasil</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {peraih_medali.map((peserta) => (
                        <TableRow key={peserta.user_id}>
                          <TableCell className="font-medium">
                            {peserta.name}
                          </TableCell>
                          <TableCell>{peserta.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{peserta.belt.nama}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                {peserta.kelas.tipe === "kyorugi"
                                  ? "Kyorugi"
                                  : "Poomsae"}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {peserta.kelas.nama}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getMedaliIcon(peserta.hasil)}
                              <Badge
                                variant={
                                  hasilBadgeVariant[peserta.hasil] ||
                                  "secondary"
                                }
                              >
                                {hasilLabel[peserta.hasil] || peserta.hasil}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Semua Peserta */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Semua Peserta</CardTitle>
                <CardDescription>
                  Daftar lengkap semua peserta kejuaraan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {semua_peserta.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada peserta
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Hasil</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semua_peserta.map((peserta) => (
                        <TableRow key={peserta.user_id}>
                          <TableCell className="font-medium">
                            {peserta.name}
                          </TableCell>
                          <TableCell>{peserta.kelas}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                hasilBadgeVariant[peserta.hasil] || "secondary"
                              }
                            >
                              {hasilLabel[peserta.hasil] || peserta.hasil}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
