// app/pelatih/absensi/[jadwalId]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  ArrowLeft,
  Search,
  RefreshCw,
  Save,
  ChevronDown,
  X,
  Check,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface MuridAbsensi {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  status: string | null;
  catatan: string | null;
}

interface ScheduleDetail {
  jadwal_id: number;
  jadwal_nama: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  murid: MuridAbsensi[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ScheduleDetail;
}

const statusOptions = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
  { value: "izin", label: "Izin" },
  { value: "sakit", label: "Sakit" },
];

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  hadir: "default",
  tidak_hadir: "destructive",
  izin: "secondary",
  sakit: "outline",
};

const statusLabel: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  izin: "Izin",
  sakit: "Sakit",
};

export default function DetailAbsensiPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jadwalId = params.jadwalId as string;
  const tanggalQuery = searchParams.get("tanggal");

  const [data, setData] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mengetahui baris mana yang sedang menampilkan form catatan tambahan
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const [editingStatus, setEditingStatus] = useState<Record<number, string>>(
    {},
  );
  const [editingCatatan, setEditingCatatan] = useState<Record<number, string>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!tanggalQuery) {
      router.push("/pelatih/absensi");
    } else {
      fetchData();
    }
  }, [tanggalQuery, router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/pelatih/absensi/${jadwalId}?tanggal=${tanggalQuery}`;
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

      const initialStatus: Record<number, string> = {};
      const initialCatatan: Record<number, string> = {};
      result.data.murid.forEach((m) => {
        initialStatus[m.user_id] = m.status || "";
        initialCatatan[m.user_id] = m.catatan || "";
      });
      setEditingStatus(initialStatus);
      setEditingCatatan(initialCatatan);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat detail absensi";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [jadwalId, tanggalQuery]);

  const handleStatusChange = (userId: number, value: string) => {
    setEditingStatus((prev) => ({ ...prev, [userId]: value }));

    if (value === "hadir") {
      // Jika statusnya Hadir, hapus catatan kustom dan tutup panel catatan bawah
      setEditingCatatan((prev) => ({ ...prev, [userId]: "" }));
      if (editingRowId === userId) {
        setEditingRowId(null);
      }
    } else {
      // Jika statusnya selain Hadir, otomatis buka panel input catatan di bawahnya
      setEditingRowId(userId);
    }
  };

  const handleCatatanChange = (userId: number, value: string) => {
    setEditingCatatan((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSubmitAll = async () => {
    if (!data) return;

    const daftarAbsensi = data.murid.map((murid) => ({
      user_id: murid.user_id,
      status: editingStatus[murid.user_id] || null,
      catatan: editingCatatan[murid.user_id] || null, // bisa null
    }));

    const payload = {
      daftar_absensi: daftarAbsensi,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/pelatih/absensi/${data.jadwal_id}/${data.tanggal}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan absensi");
      }
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan absensi");
      }
      toast.success("Absensi berhasil diperbarui!");

      // Update data lokal
      setData((prev) => {
        if (!prev) return prev;
        const updatedMurid = prev.murid.map((m) => ({
          ...m,
          status: editingStatus[m.user_id] || null,
          catatan: editingCatatan[m.user_id] || null,
        }));
        return { ...prev, murid: updatedMurid };
      });
      setEditingRowId(null);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan absensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTanggal = (dateString: string) => {
    return format(parseISO(dateString), "d MMMM yyyy", { locale: idLocale });
  };

  const formatJam = (time: string) => {
    return time.substring(0, 5);
  };

  const getStatusBadge = (status: string | null) => {
    if (!status)
      return (
        <Badge variant="outline" className="text-gray-400">
          Belum Diabsen
        </Badge>
      );
    return (
      <Badge variant={statusBadgeVariant[status] || "secondary"}>
        {statusLabel[status] || status}
      </Badge>
    );
  };

  const filteredMurid =
    data?.murid.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <AlertTitle>Gagal Memuat Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            onClick={() => fetchData()}
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
                      <Skeleton className="h-4 w-1/3" />
                    ) : data ? (
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                          {data.jadwal_nama}
                        </h1>
                        <p className="mt-2 text-muted-foreground flex items-center gap-4">
                          <span>
                            <CalendarIcon className="inline size-4 mr-1" />
                            {formatTanggal(data.tanggal)}
                          </span>
                          <span>
                            <Clock className="inline size-4 mr-1" />
                            {formatJam(data.jam_mulai)} -{" "}
                            {formatJam(data.jam_selesai)}
                          </span>
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="p-4 md:p-8">
                  {loading ? (
                    <div className="mb-8 grid gap-4 md:grid-cols-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                      ))}
                    </div>
                  ) : data ? (
                    <>
                      <div className="mb-8 grid gap-4 md:grid-cols-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Total Murid
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {data.murid.length}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Sudah Diabsen
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                              {
                                data.murid.filter(
                                  (m) => m.status && m.status !== "",
                                ).length
                              }
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Belum Diabsen
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                              {
                                data.murid.filter(
                                  (m) => !m.status || m.status === "",
                                ).length
                              }
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Total Hadir
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                              {
                                data.murid.filter((m) => m.status === "hadir")
                                  .length
                              }
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex justify-end mb-6">
                        <Button
                          onClick={handleSubmitAll}
                          disabled={isSubmitting}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSubmitting ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Simpan Perubahan Absensi
                        </Button>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Cari murid..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Daftar Murid</CardTitle>
                          <CardDescription>
                            Klik tombol <strong>Edit Status</strong> untuk
                            mengubah status absensi siswa. Kolom catatan
                            otomatis muncul jika siswa absen kustom.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {filteredMurid.length === 0 ? (
                            <div className="text-center py-8">
                              <Users className="mx-auto size-12 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground mt-2">
                                Tidak ada murid ditemukan
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status Saat Ini</TableHead>
                                    <TableHead className="text-right">
                                      Aksi
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredMurid.map((murid) => {
                                    const showCatatanForm =
                                      editingRowId === murid.user_id;
                                    const currentStatus =
                                      editingStatus[murid.user_id] || "";

                                    return (
                                      <React.Fragment key={murid.user_id}>
                                        <TableRow
                                          className={
                                            showCatatanForm ? "bg-muted/40" : ""
                                          }
                                        >
                                          <TableCell className="font-medium">
                                            <div>
                                              <p>{murid.name}</p>
                                              {murid.catatan && (
                                                <p className="text-xs text-muted-foreground font-normal mt-0.5 italic">
                                                  *Catatan: {murid.catatan}
                                                </p>
                                              )}
                                            </div>
                                          </TableCell>
                                          <TableCell>{murid.email}</TableCell>
                                          <TableCell>
                                            <div className="flex flex-col gap-1 items-start">
                                              {/* Status lama di DB */}
                                              {getStatusBadge(murid.status)}
                                              {/* Indikator jika ada perubahan sebelum disimpan */}
                                              {currentStatus &&
                                                currentStatus !==
                                                  murid.status && (
                                                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                                                    Pilihan baru:{" "}
                                                    {statusLabel[currentStatus]}
                                                  </span>
                                                )}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button
                                                  size="sm"
                                                  variant={
                                                    currentStatus
                                                      ? "default"
                                                      : "outline"
                                                  }
                                                  className={`h-8 min-w-[110px] ${
                                                    currentStatus
                                                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                      : ""
                                                  }`}
                                                  disabled={isSubmitting}
                                                >
                                                  <ChevronDown className="mr-1 h-3.5 w-3.5" />
                                                  {currentStatus
                                                    ? statusLabel[currentStatus]
                                                    : "Edit Status"}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent
                                                align="end"
                                                className="w-48 bg-white"
                                              >
                                                {statusOptions.map((opt) => (
                                                  <DropdownMenuItem
                                                    key={opt.value}
                                                    onClick={() =>
                                                      handleStatusChange(
                                                        murid.user_id,
                                                        opt.value,
                                                      )
                                                    }
                                                    className={`cursor-pointer ${
                                                      currentStatus ===
                                                      opt.value
                                                        ? "bg-muted font-medium"
                                                        : ""
                                                    }`}
                                                  >
                                                    {currentStatus ===
                                                      opt.value && (
                                                      <Check className="mr-2 h-3.5 w-3.5 text-blue-600" />
                                                    )}
                                                    {opt.label}
                                                  </DropdownMenuItem>
                                                ))}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </TableCell>
                                        </TableRow>

                                        {/* Baris Input Catatan Otomatis (muncul jika status aktif dipilih dan bukan 'hadir') */}
                                        {showCatatanForm &&
                                          currentStatus &&
                                          currentStatus !== "hadir" && (
                                            <TableRow className="bg-blue-50/20 border-t-0 animate-in fade-in duration-150">
                                              <TableCell
                                                colSpan={4}
                                                className="p-4"
                                              >
                                                <div className="flex flex-col gap-2 max-w-2xl bg-white p-4 rounded-lg border shadow-sm">
                                                  <div className="flex items-center justify-between">
                                                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                      Alasan / Catatan Tambahan
                                                      untuk (
                                                      {
                                                        statusLabel[
                                                          currentStatus
                                                        ]
                                                      }
                                                      )
                                                    </label>
                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      className="h-6 w-6 text-muted-foreground"
                                                      onClick={() =>
                                                        setEditingRowId(null)
                                                      }
                                                    >
                                                      <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                  </div>
                                                  <Textarea
                                                    placeholder="Contoh: Sakit demam tinggi / Izin ada acara keluarga besar"
                                                    value={
                                                      editingCatatan[
                                                        murid.user_id
                                                      ] || ""
                                                    }
                                                    onChange={(e) =>
                                                      handleCatatanChange(
                                                        murid.user_id,
                                                        e.target.value,
                                                      )
                                                    }
                                                    className="min-h-[60px] bg-white resize-none"
                                                  />
                                                  <div className="flex justify-end">
                                                    <Button
                                                      size="sm"
                                                      variant="secondary"
                                                      className="h-7 text-xs"
                                                      onClick={() =>
                                                        setEditingRowId(null)
                                                      }
                                                    >
                                                      Selesai Mengisi
                                                    </Button>
                                                  </div>
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          )}
                                      </React.Fragment>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
