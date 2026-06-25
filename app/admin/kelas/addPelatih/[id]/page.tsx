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
import DeleteTrainerDialog from "@/components/admin/kelas/delete-pelatih-dialog";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status_user: "active" | "inactive";
  tanggal_bergabung: string;
  spesialisasi: string;
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
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

export default function TrainersPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [trainers, setTrainers] = useState<Trainer[]>([]);
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
  const [selectedTrainers, setSelectedTrainers] = useState<Set<number>>(
    new Set(),
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch trainers menggunakan route handler internal
  const fetchTrainers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kelas/${classId}/pelatih?page=${page}&limit=${pageSize}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTrainers(data.data || []);
      setPagination({
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_page: data.pagination.total_page,
        total_data: data.pagination.total_data,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });
      setSelectedTrainers(new Set());
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pelatih");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) fetchTrainers();
  }, [classId, pageSize]);

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.phone.includes(searchTerm);
    return matchesSearch;
  });

  const toggleTrainerSelection = (trainerId: number) => {
    const newSelected = new Set(selectedTrainers);
    if (newSelected.has(trainerId)) newSelected.delete(trainerId);
    else newSelected.add(trainerId);
    setSelectedTrainers(newSelected);
  };

  const toggleSelectAll = () => {
    if (
      selectedTrainers.size === filteredTrainers.length &&
      filteredTrainers.length > 0
    ) {
      setSelectedTrainers(new Set());
    } else {
      setSelectedTrainers(new Set(filteredTrainers.map((t) => t.id)));
    }
  };

  const handleDeleteTrainer = (trainerId: number) => {
    setTrainerToDelete(trainerId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedTrainers.size > 0) {
      setTrainerToDelete(-1);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async (trainerIds: number[]) => {
    if (trainerIds.length === 0) return;
    setIsDeleting(true);
    try {
      if (trainerIds.length === 1) {
        const response = await fetch("/api/admin/kelas/softdeletepelatih", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kelas_id: classId, user_id: trainerIds[0] }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success("Pelatih berhasil dihapus dari kelas");
      } else {
        const response = await fetch(
          "/api/admin/kelas/softdeletepelatih/bulk",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kelas_id: classId, user_ids: trainerIds }),
          },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success(
          `${trainerIds.length} pelatih berhasil dihapus dari kelas`,
        );
      }
      setDeleteDialogOpen(false);
      setTrainerToDelete(null);
      // Refresh data ke halaman pertama
      await fetchTrainers(1);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menghapus pelatih");
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
                <div className="max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="mb-6">
                    <Link href="/admin/kelas/addPelatih">
                      <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Kelas
                      </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Daftar Pelatih
                    </h1>
                    <p className="text-muted-foreground">
                      Total pelatih: {pagination.total_data}
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
                      {selectedTrainers.size > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteSelected}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus {selectedTrainers.size} Pelatih
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
                                selectedTrainers.size ===
                                  filteredTrainers.length &&
                                filteredTrainers.length > 0
                              }
                              onCheckedChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telepon</TableHead>
                          <TableHead>Tanggal Lahir</TableHead>
                          <TableHead>Spesialisasi</TableHead>
                          <TableHead>Sabuk</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tanggal Bergabung</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={10}
                              className="text-center py-8"
                            >
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredTrainers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={10}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Tidak ada pelatih yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTrainers.map((trainer) => (
                            <TableRow key={trainer.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedTrainers.has(trainer.id)}
                                  onCheckedChange={() =>
                                    toggleTrainerSelection(trainer.id)
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {trainer.name}
                              </TableCell>
                              <TableCell className="text-sm">
                                {trainer.email}
                              </TableCell>
                              <TableCell className="text-sm">
                                {trainer.phone}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(trainer.tanggal_lahir)}
                              </TableCell>
                              <TableCell className="text-sm capitalize">
                                {trainer.spesialisasi || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {trainer.sabuk_saat_ini?.name || "-"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    trainer.status_user === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {trainer.status_user === "active"
                                    ? "Aktif"
                                    : "Nonaktif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(trainer.tanggal_bergabung)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteTrainer(trainer.id)
                                  }
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="w-4 h-4" />
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
                          onClick={() =>
                            fetchTrainers(pagination.current_page - 1)
                          }
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchTrainers(pagination.current_page + 1)
                          }
                          disabled={!pagination.has_next || loading}
                        >
                          Selanjutnya
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete Dialog */}
                {deleteDialogOpen && (
                  <DeleteTrainerDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    trainerIds={
                      trainerToDelete === -1
                        ? Array.from(selectedTrainers)
                        : [trainerToDelete || 0]
                    }
                    onConfirm={handleConfirmDelete}
                    isMultiple={trainerToDelete === -1}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
