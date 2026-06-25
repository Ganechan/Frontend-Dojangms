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
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Calendar,
  MapPin,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Murid {
  id: number;
  nama: string;
  email: string;
  telepon: string;
}

interface Belt {
  id: number;
  nama: string;
}

interface Peserta {
  id: number;
  murid: Murid;
  belt_asal: Belt;
  belt_tujuan: Belt;
  status: string; // "lulus" atau lainnya
  tanggal_lulus?: string | null;
  tanggal_edit?: string | null;
}

interface ExamData {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  level_ujian: string;
  lokasi: string;
  keterangan: string;
  status: string;
  created_at: string;
  total_peserta: number;
  peserta: Peserta[];
}

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id;
  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `/api/admin/ujian-kenaikan-sabuk/${examId}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data ujian");
        }

        setExam(data.data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan koneksi ke server";
        setError(message);
        toast.error(message);
        console.error("Error fetching exam detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExamDetail();
    }
  }, [examId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string | null) => {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "terjadwal":
        return "default";
      case "selesai":
        return "secondary";
      case "dibatalkan":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPesertaStatusVariant = (status: string) => {
    switch (status) {
      case "lulus":
        return "default";
      case "tidak_lulus":
        return "destructive";
      case "belum_ujian":
        return "secondary";
      default:
        return "outline";
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
              <p className="text-sm text-muted-foreground font-medium">
                Memuat data detail ujian...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !exam) {
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
            <div className="max-w-md w-full space-y-4 text-center">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-4 rounded-xl text-sm font-medium">
                {error || "Data ujian tidak ditemukan atau telah dihapus."}
              </div>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Ujian
              </Button>
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

        <div className="p-4 md:p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Top Actions & Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="h-8 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Detail Jadwal Ujian
              </h1>
              <p className="text-xs text-muted-foreground">
                ID Registrasi Sistem:{" "}
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                  {examId}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-end">
              <Link href={`/exams/${examId}/edit`} passHref>
                <Button className="shadow-sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Detail
                </Button>
              </Link>
            </div>
          </div>

          {/* Grid Informasi Detail Ujian */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="md:col-span-2 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4 items-center justify-between pb-4 border-b border-border/60">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground block">
                      Status Pelaksanaan
                    </span>
                    <Badge
                      variant={getStatusBadgeVariant(exam.status)}
                      className="capitalize px-3 py-0.5 text-sm"
                    >
                      {exam.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-left sm:text-right">
                    <span className="text-xs font-medium text-muted-foreground block">
                      Cakupan Wilayah
                    </span>
                    <Badge
                      variant={
                        exam.level_ujian === "provinsi" ? "default" : "outline"
                      }
                      className="capitalize px-3 py-0.5 text-sm"
                    >
                      Tingkat {exam.level_ujian}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-muted rounded-lg shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground block">
                        Waktu Pelaksanaan
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {exam.level_ujian === "provinsi"
                          ? `${formatDate(exam.tanggal_mulai)} - ${formatDate(exam.tanggal_selesai)}`
                          : formatDate(exam.tanggal_mulai)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-muted rounded-lg shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground block">
                        Lokasi Ujian
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {exam.lokasi}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start sm:col-span-2">
                    <div className="p-2 bg-muted rounded-lg shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground block">
                        Deskripsi / Keterangan
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1 bg-muted/30 p-3 rounded-lg border border-border/40 w-full block">
                        {exam.keterangan || "Tidak ada deskripsi tambahan."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-muted/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-foreground">
                  Log System
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Dibuat Pada
                    </span>
                    <span className="font-medium text-foreground">
                      {exam.created_at
                        ? new Date(exam.created_at).toLocaleString("id-ID")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground">
                      Total Kuota Terdaftar
                    </span>
                    <span className="font-bold text-base text-primary">
                      {exam.total_peserta} Orang
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bagian Daftar Peserta */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Daftar Anggota / Peserta
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daftar murid yang terdaftar mengikuti ujian kenaikan sabuk ini
                </p>
              </div>
              <Button size="sm">Tambah Peserta</Button>
            </div>

            {exam.peserta && exam.peserta.length > 0 ? (
              <Card className="shadow-sm overflow-hidden border border-border p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold pl-5">
                        Nama Lengkap
                      </TableHead>
                      <TableHead className="font-semibold">
                        Kontak & Email
                      </TableHead>
                      <TableHead className="font-semibold">
                        Sabuk Asal
                      </TableHead>
                      <TableHead className="font-semibold">
                        Sabuk Tujuan
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold">
                        Tanggal Lulus
                      </TableHead>
                      <TableHead className="font-semibold">
                        Tanggal Edit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exam.peserta.map((p) => (
                      <TableRow
                        key={p.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground pl-5">
                          {p.murid.nama}
                        </TableCell>
                        <TableCell className="text-xs space-y-0.5">
                          <p className="text-foreground">
                            {p.murid.telepon || "-"}
                          </p>
                          <p className="text-muted-foreground">
                            {p.murid.email || "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.belt_asal.nama}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{p.belt_tujuan.nama}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getPesertaStatusVariant(p.status)}
                            className="capitalize"
                          >
                            {p.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDateTime(p.tanggal_lulus)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDateTime(p.tanggal_edit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-muted/10">
                Belum ada peserta yang terdaftar pada jadwal ujian ini.
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
