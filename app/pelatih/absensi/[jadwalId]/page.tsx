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
  UserCheck,
  FileEdit,
  X,
  Check,
  Save,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
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
  };

  const handleCatatanChange = (userId: number, value: string) => {
    setEditingCatatan((prev) => ({ ...prev, [userId]: value }));
  };

  const handleInstantHadir = (userId: number) => {
    setEditingStatus((prev) => ({ ...prev, [userId]: "hadir" }));
  };

  const handleOpenAbsenForm = (userId: number) => {
    if (!editingStatus[userId]) {
      setEditingStatus((prev) => ({ ...prev, [userId]: "tidak_hadir" }));
    }
    setActiveRowId(activeRowId === userId ? null : userId);
  };

  const handleSubmitAll = async () => {
    if (!data) return;

    const daftarAbsensi = data.murid.map((murid) => ({
      user_id: murid.user_id,
      status: editingStatus[murid.user_id] || null,
      catatan: editingCatatan[murid.user_id] || null,
    }));

    const payload = {
      jadwal_id: data.jadwal_id,
      tanggal: data.tanggal,
      daftar_absensi: daftarAbsensi,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pelatih/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan absensi");
      }
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan absensi");
      }
      toast.success("Absensi berhasil disimpan!");

      setData((prev) => {
        if (!prev) return prev;
        const updatedMurid = prev.murid.map((m) => ({
          ...m,
          status: editingStatus[m.user_id] || null,
          catatan: editingCatatan[m.user_id] || null,
        }));
        return { ...prev, murid: updatedMurid };
      });
      setActiveRowId(null);
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
                          Simpan Semua Absensi
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
                            Gunakan tombol cepat Hadir atau klik Absen untuk
                            mengubah status kustom dan menambahkan catatan
                            murid.
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
                                    const isFormOpen =
                                      activeRowId === murid.user_id;
                                    return (
                                      <React.Fragment key={murid.user_id}>
                                        <TableRow
                                          className={
                                            isFormOpen ? "bg-muted/40" : ""
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
                                            {getStatusBadge(murid.status)}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                              <Button
                                                size="sm"
                                                variant={
                                                  editingStatus[
                                                    murid.user_id
                                                  ] === "hadir"
                                                    ? "default"
                                                    : "outline"
                                                }
                                                className="h-8"
                                                onClick={() =>
                                                  handleInstantHadir(
                                                    murid.user_id,
                                                  )
                                                }
                                                disabled={isSubmitting}
                                              >
                                                <UserCheck className="mr-1 size-4" />{" "}
                                                Hadir
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant={
                                                  isFormOpen
                                                    ? "secondary"
                                                    : "outline"
                                                }
                                                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() =>
                                                  handleOpenAbsenForm(
                                                    murid.user_id,
                                                  )
                                                }
                                                disabled={isSubmitting}
                                              >
                                                <FileEdit className="mr-1 size-4" />{" "}
                                                {isFormOpen ? "Tutup" : "Absen"}
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                        {isFormOpen && (
                                          <TableRow className="bg-muted/30 border-t-0 animate-in fade-in duration-200">
                                            <TableCell
                                              colSpan={4}
                                              className="p-4 bg-blue-50/30"
                                            >
                                              <div className="flex flex-col gap-4 md:flex-row md:items-start max-w-4xl">
                                                <div className="flex-1 space-y-1.5">
                                                  <label className="text-xs font-semibold text-muted-foreground">
                                                    Pilih Status Absensi
                                                  </label>
                                                  <Select
                                                    value={
                                                      editingStatus[
                                                        murid.user_id
                                                      ] || ""
                                                    }
                                                    onValueChange={(val) =>
                                                      handleStatusChange(
                                                        murid.user_id,
                                                        val,
                                                      )
                                                    }
                                                  >
                                                    <SelectTrigger className="w-full bg-white">
                                                      <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {statusOptions.map(
                                                        (opt) => (
                                                          <SelectItem
                                                            key={opt.value}
                                                            value={opt.value}
                                                          >
                                                            {opt.label}
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex-[2] space-y-1.5">
                                                  <label className="text-xs font-semibold text-muted-foreground">
                                                    Catatan Tambahan (Opsional)
                                                  </label>
                                                  <Textarea
                                                    placeholder="Contoh: Izin ke luar kota / Sakit demam dengan surat dokter"
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
                                                    className="min-h-[40px] bg-white resize-none"
                                                  />
                                                </div>
                                                <div className="flex items-end justify-end gap-2 md:pt-6">
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      setActiveRowId(null)
                                                    }
                                                    className="h-9 px-3 text-muted-foreground"
                                                    disabled={isSubmitting}
                                                  >
                                                    <X className="mr-1 size-4" />{" "}
                                                    Batal
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => {
                                                      setActiveRowId(null);
                                                      toast.info(
                                                        'Perubahan disimpan sementara. Klik "Simpan Semua Absensi" untuk menyimpan.',
                                                      );
                                                    }}
                                                    disabled={isSubmitting}
                                                  >
                                                    Terapkan
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
