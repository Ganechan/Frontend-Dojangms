"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Interface untuk data kelas (mendukung kyorugi dan poomsae)
interface KelasInfo {
  id: number;
  tipe: "kyorugi" | "poomsae";
  gender: string;
  // kyorugi
  label?: string;
  batas_bawah?: number;
  batas_atas?: number;
  // poomsae
  jurus?: { id: number; nama: string };
  format?: { id: number; nama: string };
  // common
  kategori_usia: { id: number; nama: string };
  level_kelas: { id: number; nama: string };
}

// Interface untuk data peserta
interface PesertaKelas {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  tahun_lahir: number;
  belt: { id: number; nama: string };
  hasil: string;
  catatan: string | null;
  is_edited: boolean;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 200];

export default function EditKelasPesertaPage() {
  const params = useParams();
  const router = useRouter();
  const kejuaraanId = params.id as string;
  const kelasId = params.kelasId as string;

  const [kelasInfo, setKelasInfo] = useState<KelasInfo | null>(null);
  const [participants, setParticipants] = useState<PesertaKelas[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(
    new Set(),
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kejuaraan/kelas-kejuaraan/${kelasId}/peserta?page=${page}&limit=${pageSize}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memuat data");
      setKelasInfo(data.kelas);
      setParticipants(data.data || []);
      setPagination({
        current_page: data.meta.pagination.current_page,
        per_page: data.meta.pagination.per_page,
        total_page: data.meta.pagination.total_page,
        total_data: data.meta.pagination.total_data,
        has_next: data.meta.pagination.has_next,
        has_prev: data.meta.pagination.has_prev,
      });
      setSelectedParticipants(new Set());
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memuat data peserta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kelasId) fetchData();
  }, [kelasId, pageSize]);

  const filteredParticipants = participants.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      p.phone.includes(searchTerm)
    );
  });

  const toggleSelect = (userId: number) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(userId)) newSelected.delete(userId);
    else newSelected.add(userId);
    setSelectedParticipants(newSelected);
  };

  const toggleSelectAll = () => {
    if (
      selectedParticipants.size === filteredParticipants.length &&
      filteredParticipants.length > 0
    ) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(
        new Set(filteredParticipants.map((p) => p.user_id)),
      );
    }
  };

  const handleDeleteClick = (userId: number) => {
    setParticipantToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedParticipants.size > 0) {
      setParticipantToDelete(-1);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    let userIds: number[] = [];
    if (participantToDelete === -1) {
      userIds = Array.from(selectedParticipants);
    } else {
      userIds = [participantToDelete];
    }
    if (userIds.length === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/kejuaraan/kelas-kejuaraan/${kelasId}/peserta/bulk`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_ids: userIds }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Gagal menghapus peserta");
      toast.success(
        data.message || `${userIds.length} peserta berhasil dihapus dari kelas`,
      );
      setDeleteDialogOpen(false);
      setParticipantToDelete(null);
      await fetchData(1);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat menghapus peserta");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const genderLabel = (gender: string) =>
    gender === "putra" ? "Putra" : "Putri";

  if (!kelasId) {
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
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-muted-foreground">ID Kelas tidak valid.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={`/admin/kejuaraan/${kejuaraanId}/kelas`}>
                Kembali ke Daftar Kelas
              </Link>
            </Button>
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
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <Link href={`/admin/kejuaraan/${kejuaraanId}/kelas`}>
                  <Button variant="outline" size="sm" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar Kelas
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Daftar Peserta Kelas{" "}
                  {kelasInfo?.tipe === "kyorugi"
                    ? kelasInfo?.label
                    : kelasInfo?.tipe === "poomsae"
                      ? kelasInfo?.jurus?.nama
                      : "-"}
                </h1>
                {kelasInfo && (
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">
                      {genderLabel(kelasInfo.gender)}
                    </Badge>
                    <Badge variant="outline">
                      {kelasInfo.kategori_usia?.nama || "-"}
                    </Badge>
                    <Badge variant="secondary">
                      {kelasInfo.level_kelas?.nama || "-"}
                    </Badge>
                    {kelasInfo.tipe === "kyorugi" && (
                      <span>
                        Berat: {kelasInfo.batas_bawah} - {kelasInfo.batas_atas}{" "}
                        kg
                      </span>
                    )}
                    {kelasInfo.tipe === "poomsae" && (
                      <span>Format: {kelasInfo.format?.nama || "-"}</span>
                    )}
                  </div>
                )}
                <p className="text-muted-foreground mt-2">
                  Total peserta: {pagination.total_data}
                </p>
              </div>

              {/* Toolbar */}
              <div className="bg-card rounded-lg border border-border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 relative w-full">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                      type="text"
                      placeholder="Cari nama, email, atau telepon..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(val) => setPageSize(Number(val))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          Tampilkan: {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedParticipants.size > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus {selectedParticipants.size} Peserta
                    </Button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedParticipants.size ===
                              filteredParticipants.length &&
                            filteredParticipants.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                      <TableHead>Sabuk</TableHead>
                      <TableHead>Hasil</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredParticipants.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada peserta yang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredParticipants.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedParticipants.has(p.user_id)}
                              onCheckedChange={() => toggleSelect(p.user_id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {p.name}
                          </TableCell>
                          <TableCell className="text-sm">{p.email}</TableCell>
                          <TableCell className="text-sm">{p.phone}</TableCell>
                          <TableCell className="text-sm">
                            {formatDate(p.tanggal_lahir)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {p.belt?.nama || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{p.hasil || "-"}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {p.catatan || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(p.user_id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.total_page > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Halaman {pagination.current_page} dari{" "}
                    {pagination.total_page}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchData(pagination.current_page - 1)}
                      disabled={!pagination.has_prev || loading}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchData(pagination.current_page + 1)}
                      disabled={!pagination.has_next || loading}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Peserta</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus{" "}
                  {participantToDelete === -1
                    ? `${selectedParticipants.size} peserta`
                    : "peserta ini"}{" "}
                  dari kelas? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
