"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  Users,
  Send,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Interface untuk detail pengumuman
interface AnnouncementDetail {
  id: number;
  judul: string;
  isi: string;
  status: string;
  tanggal_publish: string | null;
  scheduled_at: string | null;
  kirim_whatsapp: boolean;
  created_at: string;
  dibuat_oleh: { nama: string };
  target: {
    target_type: string;
    target_role: string | null;
    kelas_id: string | null;
    target_user_ids: string | null;
  };
  whatsapp: {
    dikirim: boolean;
    statistik: {
      total_grup: number;
      terkirim: string;
      gagal: string;
      pending: string;
    };
    daftar_grup?: {
      id: number;
      nama_grup: string;
      group_jid: string;
      status: string;
      sent_at: string | null;
      error_message: string | null;
    }[];
  };
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const announcementId = params.id;
  const [data, setData] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/admin/pengumuman/${announcementId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data pengumuman");
        }

        setData(result.data);
      } catch (err: any) {
        const message = err.message || "Terjadi kesalahan saat memuat data";
        setError(message);
        toast.error(message);
        console.error("Error fetching announcement detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (announcementId) {
      fetchDetail();
    }
  }, [announcementId]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "terjadwal":
        return "default";
      case "terkirim":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "terjadwal":
        return "Terjadwal";
      case "terkirim":
        return "Terkirim";
      default:
        return status;
    }
  };

  const getTargetLabel = (target: AnnouncementDetail["target"]) => {
    switch (target.target_type) {
      case "global":
        return "Semua Pengguna";
      case "role":
        return `Role: ${target.target_role}`;
      case "kelas":
        return `Kelas ID: ${target.kelas_id}`;
      case "user_ids":
        return `Spesifik User (${target.target_user_ids})`;
      default:
        return "Tidak diketahui";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWhatsAppStatusBadge = (status: string) => {
    switch (status) {
      case "terkirim":
        return <Badge className="bg-green-100 text-green-800">Terkirim</Badge>;
      case "gagal":
        return <Badge className="bg-red-100 text-red-800">Gagal</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Tidak diketahui</Badge>;
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
              <p className="text-muted-foreground">
                Memuat detail pengumuman...
              </p>
            </div>
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
          <div className="min-h-[calc(100vh-4rem)] p-6 flex items-center justify-center">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/pengumuman")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
                {error || "Data pengumuman tidak ditemukan"}
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
          <div className="p-6 bg-background">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-6">
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
                      {data.judul}
                    </h1>
                    <p className="text-muted-foreground">Detail pengumuman</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/pengumuman/${data.id}/edit`}>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        toast.info("Fitur hapus akan segera tersedia");
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>

              {/* Detail Content */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Status
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(data.status)}
                      className="text-base py-1 px-3"
                    >
                      {getStatusLabel(data.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Dibuat Oleh
                    </p>
                    <p className="text-lg font-semibold">
                      {data.dibuat_oleh.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Tanggal Dibuat
                    </p>
                    <p className="text-lg font-semibold">
                      {formatDateTime(data.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Tanggal Publish
                    </p>
                    <p className="text-lg font-semibold">
                      {formatDate(data.tanggal_publish)}
                    </p>
                  </div>
                  {data.scheduled_at && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Dijadwalkan Pada
                      </p>
                      <p className="text-lg font-semibold">
                        {formatDateTime(data.scheduled_at)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Kirim WhatsApp
                    </p>
                    <Badge
                      variant={data.kirim_whatsapp ? "default" : "secondary"}
                    >
                      {data.kirim_whatsapp ? "Ya" : "Tidak"}
                    </Badge>
                  </div>
                </div>

                {/* Target */}
                <div className="border-t pt-4">
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Target Penerima
                  </h2>
                  <p className="text-base">{getTargetLabel(data.target)}</p>
                </div>

                {/* Isi Pengumuman */}
                <div className="border-t pt-4">
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Isi Pengumuman
                  </h2>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <p className="whitespace-pre-wrap text-sm">{data.isi}</p>
                  </div>
                </div>

                {/* WhatsApp Statistics */}
                {data.kirim_whatsapp && data.whatsapp && (
                  <div className="border-t pt-4">
                    <h2 className="text-sm font-medium text-muted-foreground mb-3">
                      Statistik WhatsApp
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <Card className="bg-muted/20">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">
                            Total Grup
                          </p>
                          <p className="text-xl font-bold">
                            {data.whatsapp.statistik.total_grup}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">
                            Terkirim
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            {data.whatsapp.statistik.terkirim}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">Gagal</p>
                          <p className="text-xl font-bold text-red-600">
                            {data.whatsapp.statistik.gagal}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-yellow-50">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">
                            Pending
                          </p>
                          <p className="text-xl font-bold text-yellow-600">
                            {data.whatsapp.statistik.pending}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Daftar Grup */}
                    {data.whatsapp.daftar_grup &&
                      data.whatsapp.daftar_grup.length > 0 && (
                        <div className="border-t pt-4">
                          <h3 className="text-sm font-medium text-muted-foreground mb-3">
                            Daftar Grup WhatsApp
                          </h3>
                          <div className="rounded-lg border border-border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nama Grup</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Waktu Kirim</TableHead>
                                  <TableHead>Error</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {data.whatsapp.daftar_grup.map((grup) => (
                                  <TableRow key={grup.id}>
                                    <TableCell className="font-medium">
                                      {grup.nama_grup}
                                    </TableCell>
                                    <TableCell>
                                      {getWhatsAppStatusBadge(grup.status)}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {formatDateTime(grup.sent_at)}
                                    </TableCell>
                                    <TableCell className="text-sm text-red-600">
                                      {grup.error_message || "-"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
