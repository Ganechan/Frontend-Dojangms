"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Eye, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Interface untuk data kelas poomsae
interface PoomsaeClass {
  id: number;
  gender: string;
  kategori_usia: {
    id: number;
    nama: string;
  };
  level_kelas: {
    id: number;
    nama: string;
  };
  jurus: {
    id: number;
    nama: string;
  };
  format: {
    id: number;
    nama: string;
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

interface PoomsaeResponse {
  success: boolean;
  message: string;
  data: PoomsaeClass[];
  meta: {
    pagination: PaginationInfo;
  };
}

export default function PoomsaeClassesPage() {
  const [classes, setClasses] = useState<PoomsaeClass[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "putra" | "putri">(
    "all",
  );
  const [kategoriFilter, setKategoriFilter] = useState<
    "all" | "Pra-Cadet" | "Cadet" | "Junior" | "Senior"
  >("all");
  const [levelFilter, setLevelFilter] = useState<
    "all" | "festival" | "pemula" | "prestasi"
  >("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClasses = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kelas-poomsae?page=${page}&per_page=10`,
      );
      const data: PoomsaeResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data");
      }

      if (data.success) {
        setClasses(data.data || []);
        setPagination(data.meta.pagination);
        setCurrentPage(page);
      } else {
        throw new Error(data.message || "Gagal memuat data");
      }
    } catch (error: any) {
      console.error("Error fetching poomsae classes:", error);
      toast.error(error.message || "Gagal memuat data kelas poomsae");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Filtering client‑side
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.jurus.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.format.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.gender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === "all" || cls.gender === genderFilter;
    const matchesKategori =
      kategoriFilter === "all" || cls.kategori_usia.nama === kategoriFilter;
    const matchesLevel =
      levelFilter === "all" || cls.level_kelas.nama === levelFilter;
    return matchesSearch && matchesGender && matchesKategori && matchesLevel;
  });

  // Delete handler
  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/kelas-poomsae/${deletingId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menghapus");
      toast.success(data.message || "Kelas poomsae berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchClasses(1);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const genderLabel = (gender: string) =>
    gender === "putra" ? "Putra" : "Putri";

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
                  <div className="mb-8 flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        Kelas Poomsae
                      </h1>
                      <p className="text-muted-foreground">
                        Kelola kelas pertandingan Poomsae berdasarkan jurus,
                        format, usia, dan level
                      </p>
                    </div>
                    <Link href="/admin/kelas-poomsae/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Kelas
                      </Button>
                    </Link>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Kelas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {pagination.total_data}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Putra
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">
                          {classes.filter((c) => c.gender === "putra").length}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Putri
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-pink-600">
                          {classes.filter((c) => c.gender === "putri").length}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Level Kelas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-amber-600">
                          {new Set(classes.map((c) => c.level_kelas.nama)).size}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Toolbar & Filters */}
                  <div className="bg-card rounded-lg border border-border p-4 mb-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        type="text"
                        placeholder="Cari jurus, format, atau gender..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filter Gender */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Gender
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(["all", "putra", "putri"] as const).map((g) => (
                          <Button
                            key={g}
                            variant={genderFilter === g ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGenderFilter(g)}
                            className="capitalize"
                          >
                            {g === "all"
                              ? "Semua"
                              : g === "putra"
                                ? "Putra"
                                : "Putri"}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Kategori Usia */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Kategori Usia
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            "all",
                            "Pra-Cadet",
                            "Cadet",
                            "Junior",
                            "Senior",
                          ] as const
                        ).map((k) => (
                          <Button
                            key={k}
                            variant={
                              kategoriFilter === k ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setKategoriFilter(k)}
                            className="capitalize"
                          >
                            {k === "all"
                              ? "Semua"
                              : k === "Pra-Cadet"
                                ? "Pra-Cadet"
                                : k}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Level Kelas */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Level Kelas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          ["all", "festival", "pemula", "prestasi"] as const
                        ).map((l) => (
                          <Button
                            key={l}
                            variant={levelFilter === l ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLevelFilter(l)}
                            className="capitalize"
                          >
                            {l === "all" ? "Semua" : l}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Menampilkan {filteredClasses.length} dari{" "}
                      {pagination.total_data} kelas
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Jurus</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Kategori Usia</TableHead>
                          <TableHead>Level Kelas</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredClasses.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Tidak ada kelas poomsae yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredClasses.map((cls) => (
                            <TableRow key={cls.id}>
                              <TableCell className="font-medium">
                                {cls.jurus.nama}
                              </TableCell>
                              <TableCell className="text-sm">
                                {cls.format.nama}
                              </TableCell>
                              <TableCell className="text-sm">
                                {genderLabel(cls.gender)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {cls.kategori_usia.nama}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {cls.level_kelas.nama}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Link href={`/admin/kelas-poomsae/${cls.id}`}>
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Link
                                    href={`/admin/kelas-poomsae/${cls.id}/edit`}
                                  >
                                    <Button size="sm" variant="ghost">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteClick(cls.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
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
                            fetchClasses(pagination.current_page - 1)
                          }
                          disabled={!pagination.has_prev || loading}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchClasses(pagination.current_page + 1)
                          }
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kelas Poomsae</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
