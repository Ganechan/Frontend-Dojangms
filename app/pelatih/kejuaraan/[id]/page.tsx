// app\pelatih\kejuaraan\[id]\page.tsx
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
}

interface Belt {
  id: number;
  name: string;
}

interface KelasKejuaraan {
  id: number;
  tipe: string;
  detail: string;
}

interface Peserta {
  peserta_id: number;
  user: User;
  belt: Belt;
  kelas_kejuaraan: KelasKejuaraan;
  hasil: string | null;
  is_edited: boolean;
}

interface Kejuaraan {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    kejuaraan: Kejuaraan;
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
  localHasil?: string;
}

const HASIL_OPTIONS = [
  { value: "juara1", label: "Juara 1" },
  { value: "juara2", label: "Juara 2" },
  { value: "juara3", label: "Juara 3" },
  { value: "peserta", label: "Tidak Meraih Medali" },
];

export default function InputHasilKejuaraanPage() {
  const params = useParams();
  const router = useRouter();
  const kejuaranId = params.id as string;

  const [kejuaraan, setKejuaraan] = useState<Kejuaraan | null>(null);
  const [pesertaList, setPesertaList] = useState<LocalPeserta[]>([]);
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
      const url = `/api/pelatih/kejuaraan/${kejuaranId}/peserta?page=${page}&limit=10`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat data");
      }
      const data: ApiResponse = await res.json();
      if (data.success) {
        setKejuaraan(data.data.kejuaraan);
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
  }, [kejuaranId]);

  const handleHasilChange = (pesertaId: number, newHasil: string) => {
    setPesertaList((prev) =>
      prev.map((p) =>
        p.peserta_id === pesertaId ? { ...p, localHasil: newHasil } : p,
      ),
    );
    setHasUnsavedChanges(true);
    setSavingErrors((prev) => prev.filter((e) => e.pesertaId !== pesertaId));
  };

  const handleSave = async () => {
    const changedPeserta = pesertaList.filter(
      (p) => p.localHasil !== undefined && p.localHasil !== p.hasil,
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
        const payload = { hasil: p.localHasil };
        const res = await fetch(
          `/api/pelatih/kejuaraan/${kejuaranId}/peserta/${p.peserta_id}`,
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
              ? {
                  ...item,
                  hasil: p.localHasil!,
                  is_edited: true,
                  localHasil: undefined,
                }
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
      toast.success("Semua hasil berhasil disimpan!");
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
        localHasil: undefined,
      })),
    );
    setHasUnsavedChanges(false);
    setSavingErrors([]);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: idLocale });
  };

  const filteredPeserta = pesertaList.filter((p) =>
    `${p.user.name} ${p.kelas_kejuaraan.detail} ${p.kelas_kejuaraan.tipe}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const sudahDiinput = pesertaList.filter(
    (p) => p.hasil !== null || (p.localHasil && p.localHasil !== ""),
  ).length;
  const belumDiinput = pesertaList.length - sudahDiinput;
  const persentaseInput =
    pesertaList.length > 0
      ? Math.round((sudahDiinput / pesertaList.length) * 100)
      : 0;

  const getStatusBadge = (peserta: LocalPeserta) => {
    const hasError = savingErrors.some(
      (e) => e.pesertaId === peserta.peserta_id,
    );
    if (hasError) {
      return { label: "Gagal Simpan", variant: "destructive" };
    }
    if (
      peserta.localHasil !== undefined &&
      peserta.localHasil !== peserta.hasil
    ) {
      return { label: "Diubah", variant: "secondary" };
    }
    if (peserta.is_edited) {
      return { label: "Sudah Disimpan", variant: "default" };
    }
    return { label: "Belum Disimpan", variant: "outline" };
  };

  const startItem = (currentPage - 1) * pagination.per_page + 1;
  const endItem = Math.min(
    currentPage * pagination.per_page,
    pagination.total_data,
  );

  if (loading && !kejuaraan) {
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
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/pelatih">
                            Dashboard
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/pelatih/kejuaraan">
                            Kejuaraan
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <span>Input Hasil</span>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <Link href="/pelatih/kejuaraan">
                      <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                      </Button>
                    </Link>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Input Hasil Kejuaraan
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Input dan perbarui hasil peserta kejuaraan.
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

                  {kejuaraan && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Kejuaraan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Nama Kejuaraan
                            </p>
                            <p className="text-base font-semibold text-foreground mt-1">
                              {kejuaraan.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Tanggal Mulai
                            </p>
                            <p className="text-base font-semibold text-foreground mt-1">
                              {formatDate(kejuaraan.start_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Tanggal Selesai
                            </p>
                            <p className="text-base font-semibold text-foreground mt-1">
                              {formatDate(kejuaraan.end_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Status
                            </p>
                            <Badge className="mt-1">Berlangsung</Badge>
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
                          {pesertaList.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          peserta terdaftar
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Sudah Diinput
                        </CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {sudahDiinput}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          hasil sudah diinput
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Belum Diinput
                        </CardTitle>
                        <ClipboardPen className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                          {belumDiinput}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          belum ada hasil
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Persentase Input
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {persentaseInput}%
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
                          Tidak ada peserta yang terdaftar pada kejuaraan ini.
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
                                  <TableHead>Sabuk</TableHead>
                                  <TableHead>Kategori</TableHead>
                                  <TableHead>Jenis</TableHead>
                                  <TableHead>Hasil</TableHead>
                                  <TableHead>Status</TableHead>
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
                                        {peserta.belt.name}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {peserta.kelas_kejuaraan.detail}
                                    </TableCell>
                                    <TableCell>
                                      <Badge>
                                        {peserta.kelas_kejuaraan.tipe ===
                                        "kyorugi"
                                          ? "Kyorugi"
                                          : "Poomsae"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={
                                          peserta.localHasil !== undefined
                                            ? peserta.localHasil
                                            : peserta.hasil || ""
                                        }
                                        onValueChange={(value) =>
                                          handleHasilChange(
                                            peserta.peserta_id,
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-40">
                                          <SelectValue placeholder="Pilih hasil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {HASIL_OPTIONS.map((option) => (
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
                                      <Badge
                                        variant={
                                          getStatusBadge(peserta).variant as any
                                        }
                                      >
                                        {getStatusBadge(peserta).label}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button variant="ghost" size="sm">
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
                                      Sabuk
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="w-full justify-center"
                                    >
                                      {peserta.belt.name}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Kategori
                                    </p>
                                    <Badge className="w-full justify-center">
                                      {peserta.kelas_kejuaraan.detail}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Jenis
                                    </p>
                                    <Badge
                                      variant="secondary"
                                      className="w-full justify-center"
                                    >
                                      {peserta.kelas_kejuaraan.tipe ===
                                      "kyorugi"
                                        ? "Kyorugi"
                                        : "Poomsae"}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Status
                                    </p>
                                    <Badge
                                      variant={
                                        getStatusBadge(peserta).variant as any
                                      }
                                      className="w-full justify-center"
                                    >
                                      {getStatusBadge(peserta).label}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Hasil
                                  </p>
                                  <Select
                                    value={
                                      peserta.localHasil !== undefined
                                        ? peserta.localHasil
                                        : peserta.hasil || ""
                                    }
                                    onValueChange={(value) =>
                                      handleHasilChange(
                                        peserta.peserta_id,
                                        value,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Pilih hasil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {HASIL_OPTIONS.map((option) => (
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
