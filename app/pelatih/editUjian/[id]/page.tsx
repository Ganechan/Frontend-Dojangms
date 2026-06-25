"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Users,
  ClipboardCheck,
  ClipboardPen,
  TrendingUp,
  Search,
  Save,
  Trophy,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  Pencil,
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  tanggal_lahir?: string;
}

interface Belt {
  id: number;
  name: string;
}

interface Peserta {
  peserta_id: number;
  user: User;
  belt_asal: Belt;
  belt_tujuan: Belt;
  status: string;
  tanggal_lulus: string | null;
  tanggal_edit: string | null;
}

interface Ujian {
  id: number;
  level_ujian: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

interface Summary {
  total_peserta: number;
  sudah_diedit: number;
  belum_diedit: number;
  persentase_edit: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    ujian: Ujian;
    summary: Summary;
    peserta: Peserta[];
  };
  pagination: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

interface LocalPeserta extends Peserta {
  localStatus?: string;
}

const STATUS_OPTIONS = [
  { value: "lulus", label: "Lulus" },
  { value: "tidak_lulus", label: "Tidak Lulus" },
  { value: "terdaftar", label: "Terdaftar" },
];

const STATUS_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  lulus: "default",
  tidak_lulus: "destructive",
  terdaftar: "secondary",
};

const STATUS_LABEL: Record<string, string> = {
  lulus: "Lulus",
  tidak_lulus: "Tidak Lulus",
  terdaftar: "Terdaftar",
};

export default function EditHasilUjianPage() {
  const params = useParams();
  const router = useRouter();
  const ujianId = params.id as string;

  const [ujian, setUjian] = useState<Ujian | null>(null);
  const [pesertaList, setPesertaList] = useState<LocalPeserta[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total_peserta: 0,
    sudah_diedit: 0,
    belum_diedit: 0,
    persentase_edit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingErrors, setSavingErrors] = useState<
    { pesertaId: number; message: string }[]
  >([]);

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/pelatih/ujian/${ujianId}/peserta?page=${page}&limit=10`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat data");
      }
      const data: ApiResponse = await res.json();
      if (data.success) {
        setUjian(data.data.ujian);
        setSummary(data.data.summary);
        setPesertaList(data.data.peserta);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        setError(data.message || "Gagal memuat data peserta");
      }
    } catch (err: any) {
      const msg =
        err.message || "Terjadi kesalahan saat mengambil data peserta.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [ujianId]);

  const handleStatusChange = (pesertaId: number, newStatus: string) => {
    setPesertaList((prev) =>
      prev.map((p) =>
        p.peserta_id === pesertaId ? { ...p, localStatus: newStatus } : p,
      ),
    );
    setHasUnsavedChanges(true);
    setSavingErrors((prev) => prev.filter((e) => e.pesertaId !== pesertaId));
  };

  const handleSave = async () => {
    const changedPeserta = pesertaList.filter(
      (p) => p.localStatus !== undefined && p.localStatus !== p.status,
    );
    if (changedPeserta.length === 0) {
      toast.info("Tidak ada perubahan yang perlu disimpan.");
      setHasUnsavedChanges(false);
      return;
    }

    setIsSaving(true);
    setSavingErrors([]);
    const errors: { pesertaId: number; message: string }[] = [];

    for (const p of changedPeserta) {
      try {
        const payload = { status: p.localStatus };
        const res = await fetch(
          `/api/pelatih/ujian/${ujianId}/peserta/${p.peserta_id}/edit`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.message || `Gagal menyimpan untuk ${p.user.name}`,
          );
        }
        const result = await res.json();
        if (!result.success) {
          throw new Error(
            result.message || `Gagal menyimpan untuk ${p.user.name}`,
          );
        }
        // Update lokal
        setPesertaList((prev) =>
          prev.map((item) =>
            item.peserta_id === p.peserta_id
              ? { ...item, status: p.localStatus!, localStatus: undefined }
              : item,
          ),
        );
      } catch (err: any) {
        const msg =
          err.message || `Gagal menyimpan untuk peserta ${p.user.name}`;
        errors.push({ pesertaId: p.peserta_id, message: msg });
        toast.error(msg);
      }
    }

    setIsSaving(false);
    if (errors.length === 0) {
      toast.success("Semua status berhasil disimpan!");
      setHasUnsavedChanges(false);
    } else {
      setSavingErrors(errors);
      toast.warning(
        `Berhasil menyimpan ${changedPeserta.length - errors.length} dari ${changedPeserta.length} peserta.`,
      );
    }
    fetchData(currentPage);
  };

  const handleResetChanges = () => {
    setPesertaList((prev) =>
      prev.map((p) => ({
        ...p,
        localStatus: undefined,
      })),
    );
    setHasUnsavedChanges(false);
    setSavingErrors([]);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: idLocale });
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return format(new Date(dateStr), "d MMMM yyyy HH:mm", {
      locale: idLocale,
    });
  };

  const filteredPeserta = pesertaList.filter((p) =>
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (peserta: LocalPeserta) => {
    const hasError = savingErrors.some(
      (e) => e.pesertaId === peserta.peserta_id,
    );
    if (hasError) {
      return { label: "Gagal Simpan", variant: "destructive" };
    }
    if (
      peserta.localStatus !== undefined &&
      peserta.localStatus !== peserta.status
    ) {
      return { label: "Diubah", variant: "secondary" };
    }
    return {
      label: STATUS_LABEL[peserta.status] || peserta.status,
      variant: STATUS_BADGE_VARIANT[peserta.status] || "outline",
    };
  };

  const startItem = (currentPage - 1) * pagination.per_page + 1;
  const endItem = Math.min(
    currentPage * pagination.per_page,
    pagination.total_data,
  );

  if (loading && !ujian) {
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
          <div className="flex flex-1 flex-col p-6">
            <div className="max-w-7xl mx-auto w-full space-y-8">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-48 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-96 w-full" />
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
              <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <Link href="/pelatih/ujian">
                      <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                      </Button>
                    </Link>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Edit Hasil Ujian Kenaikan Sabuk
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Edit dan perbarui status kelulusan peserta ujian.
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal Memuat Data Peserta</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => fetchData(currentPage)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Coba Lagi
                      </Button>
                    </Alert>
                  )}

                  {ujian && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Ujian</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Level Ujian
                            </p>
                            <p className="text-base font-semibold text-foreground mt-1">
                              {ujian.level_ujian === "kota"
                                ? "Kota"
                                : "Provinsi"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Tanggal Mulai
                            </p>
                            <p className="text-base font-semibold text-foreground mt-1">
                              {formatDate(ujian.tanggal_mulai)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Tanggal Selesai
                            </p>
                            <p className="text-base font-semibold text-foreground mt-1">
                              {formatDate(ujian.tanggal_selesai)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Peserta
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {summary.total_peserta}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          peserta terdaftar
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Sudah Diedit
                        </CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {summary.sudah_diedit}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          sudah diedit
                        </p>
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
                        <div className="text-2xl font-bold text-yellow-600">
                          {summary.belum_diedit}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          belum diedit
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Persentase Edit
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {summary.persentase_edit}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          dari total peserta
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {savingErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal menyimpan beberapa peserta</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc ml-4 mt-1">
                          {savingErrors.map((err) => (
                            <li key={err.pesertaId}>{err.message}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {hasUnsavedChanges && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-900">
                        Anda memiliki perubahan yang belum disimpan.
                      </AlertTitle>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Menyimpan..." : "Simpan Sekarang"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleResetChanges}
                        >
                          Batalkan Perubahan
                        </Button>
                      </div>
                    </Alert>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama peserta..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={!hasUnsavedChanges || isSaving}
                      className="w-full md:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Menyimpan..." : "Simpan Hasil"}
                    </Button>
                  </div>

                  {!loading &&
                    filteredPeserta.length === 0 &&
                    pesertaList.length === 0 && (
                      <div className="text-center py-12">
                        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground">
                          Belum Ada Peserta
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          Tidak ada peserta yang terdaftar pada ujian ini.
                        </p>
                      </div>
                    )}

                  {!loading && filteredPeserta.length > 0 && (
                    <>
                      <div className="hidden md:block">
                        <Card>
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nama Peserta</TableHead>
                                  <TableHead>Sabuk Asal</TableHead>
                                  <TableHead>Sabuk Tujuan</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Tanggal Edit</TableHead>
                                  <TableHead>Aksi</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredPeserta.map((peserta) => (
                                  <TableRow key={peserta.peserta_id}>
                                    <TableCell>
                                      <div>
                                        <p className="font-medium">
                                          {peserta.user.name}
                                        </p>
                                        {peserta.user.email && (
                                          <p className="text-sm text-muted-foreground">
                                            {peserta.user.email}
                                          </p>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {peserta.belt_asal.name}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge>{peserta.belt_tujuan.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={
                                          peserta.localStatus !== undefined
                                            ? peserta.localStatus
                                            : peserta.status
                                        }
                                        onValueChange={(value) =>
                                          handleStatusChange(
                                            peserta.peserta_id,
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-40">
                                          <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {STATUS_OPTIONS.map((option) => (
                                            <SelectItem
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      {peserta.tanggal_edit ? (
                                        <Badge variant="secondary">
                                          {formatDateTime(peserta.tanggal_edit)}
                                        </Badge>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">
                                          -
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Edit"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="md:hidden space-y-4">
                        {filteredPeserta.map((peserta) => (
                          <Card key={peserta.peserta_id}>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {peserta.user.name}
                                  </p>
                                  {peserta.user.email && (
                                    <p className="text-sm text-muted-foreground">
                                      {peserta.user.email}
                                    </p>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Sabuk Asal
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="w-full justify-center"
                                    >
                                      {peserta.belt_asal.name}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Sabuk Tujuan
                                    </p>
                                    <Badge className="w-full justify-center">
                                      {peserta.belt_tujuan.name}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Status
                                  </p>
                                  <Select
                                    value={
                                      peserta.localStatus !== undefined
                                        ? peserta.localStatus
                                        : peserta.status
                                    }
                                    onValueChange={(value) =>
                                      handleStatusChange(
                                        peserta.peserta_id,
                                        value,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {peserta.tanggal_edit && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Tanggal Edit
                                    </p>
                                    <Badge variant="secondary">
                                      {formatDateTime(peserta.tanggal_edit)}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}

                  {!loading && filteredPeserta.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                      <p className="text-sm text-muted-foreground">
                        Menampilkan {startItem} - {endItem} dari{" "}
                        {pagination.total_data} peserta
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => fetchData(currentPage - 1)}
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fetchData(currentPage + 1)}
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
