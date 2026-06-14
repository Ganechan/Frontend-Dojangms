"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { ArrowLeft, Edit, Trash2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface KelasPertandingan {
  id: number;
  name: string;
  category: string;
  age_group: string;
}

interface ChampionshipData {
  id: number;
  name: string;
  level: string;
  location: string;
  year: number;
  start_date: string;
  end_date: string;
  kelas_pertandingan: KelasPertandingan[];
}

export default function ChampionshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const championshipId = params.id;
  const [championship, setChampionship] = useState<ChampionshipData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChampionshipDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/admin/kejuaraan/${championshipId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data kejuaraan");
        }

        setChampionship(data.data);
      } catch (err: any) {
        const message = err.message || "Terjadi kesalahan saat memuat data";
        setError(message);
        toast.error(message);
        console.error("Error fetching championship detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (championshipId) {
      fetchChampionshipDetail();
    }
  }, [championshipId]);

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
    switch (level) {
      case "kota":
        return "Tingkat Kota";
      case "provinsi":
        return "Tingkat Provinsi";
      case "nasional":
        return "Tingkat Nasional";
      case "internasional":
        return "Tingkat Internasional";
      default:
        return level.charAt(0).toUpperCase() + level.slice(1);
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
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Memuat data kejuaraan...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !championship) {
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
          <div className="min-h-[calc(100vh-4rem)] p-6 flex items-center justify-center">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/kejuaraan")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
                {error || "Data kejuaraan tidak ditemukan"}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
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
              <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.back()}
                      className="mb-4"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>

                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          {championship.name}
                        </h1>
                        <p className="text-muted-foreground">
                          Lihat detail kejuaraan dan kelola kelas pertandingan
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/championships/${championship.id}/edit`}>
                          <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Nama Kejuaraan
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {championship.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Tingkat Kejuaraan
                        </p>
                        <Badge
                          variant={getLevelBadgeVariant(championship.level)}
                          className="text-base py-1 px-3"
                        >
                          {getLevelLabel(championship.level)}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Lokasi
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {championship.location}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Tahun
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {championship.year}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Tanggal Mulai
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDate(championship.start_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Tanggal Selesai
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDate(championship.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-foreground">
                            Kelas Pertandingan
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Total:{" "}
                            {championship.kelas_pertandingan?.length || 0} kelas
                          </p>
                        </div>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Kelas
                        </Button>
                      </div>

                      {championship.kelas_pertandingan &&
                      championship.kelas_pertandingan.length > 0 ? (
                        <div className="rounded-lg border border-border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead>Nama Kelas</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Kelompok Usia</TableHead>
                                <TableHead className="text-right">
                                  Aksi
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {championship.kelas_pertandingan.map((kelas) => (
                                <TableRow key={kelas.id}>
                                  <TableCell className="font-medium">
                                    {kelas.name}
                                  </TableCell>
                                  <TableCell className="text-sm capitalize">
                                    {kelas.category}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {kelas.age_group}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                      <Button size="sm" variant="outline">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-destructive text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                          Tidak ada kelas pertandingan yang terdaftar
                        </div>
                      )}
                    </div>
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
