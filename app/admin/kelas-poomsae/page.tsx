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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  BookOpen,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

  const genderFilterOptions = [
    { value: "all", label: "Semua" },
    { value: "putra", label: "Putra" },
    { value: "putri", label: "Putri" },
  ] as const;

  const kategoriFilterOptions = [
    { value: "all", label: "Semua" },
    { value: "Pra-Cadet", label: "Pra-Cadet" },
    { value: "Cadet", label: "Cadet" },
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
  ] as const;

  const levelFilterOptions = [
    { value: "all", label: "Semua" },
    { value: "festival", label: "Festival" },
    { value: "pemula", label: "Pemula" },
    { value: "prestasi", label: "Prestasi" },
  ] as const;

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
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Kelas Poomsae
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Kelola kelas pertandingan Poomsae berdasarkan jurus, format,
                    usia, dan level
                  </p>
                </div>
                <Link href="/admin/kelas-poomsae/create">
                  <Button className="w-full sm:w-auto shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kelas
                  </Button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Kelas
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">
                        {pagination.total_data}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah seluruh kelas
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-sky-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">
                      Putra
                    </CardTitle>
                    <Users className="h-4 w-4 text-sky-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                        {classes.filter((c) => c.gender === "putra").length}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kelas putra
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-rose-400">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400">
                      Putri
                    </CardTitle>
                    <Users className="h-4 w-4 text-rose-400" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-rose-500 dark:text-rose-400">
                        {classes.filter((c) => c.gender === "putri").length}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kelas putri
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-amber-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Level Kelas
                    </CardTitle>
                    <Layers className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {new Set(classes.map((c) => c.level_kelas.nama)).size}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah level berbeda
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Toolbar & Filters */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Cari jurus, format, atau gender..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background"
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-8">
                    {/* Filter Gender */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Gender
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {genderFilterOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            variant={
                              genderFilter === opt.value ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setGenderFilter(
                                opt.value as typeof genderFilter,
                              )
                            }
                            className="text-xs h-8"
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Kategori Usia */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Kategori Usia
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {kategoriFilterOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            variant={
                              kategoriFilter === opt.value
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setKategoriFilter(
                                opt.value as typeof kategoriFilter,
                              )
                            }
                            className="text-xs h-8"
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Level Kelas */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Level Kelas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {levelFilterOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            variant={
                              levelFilter === opt.value ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setLevelFilter(opt.value as typeof levelFilter)
                            }
                            className="text-xs h-8 capitalize"
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-1">
                    Menampilkan{" "}
                    <span className="font-medium text-foreground">
                      {filteredClasses.length}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium text-foreground">
                      {pagination.total_data}
                    </span>{" "}
                    kelas
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">Jurus</TableHead>
                        <TableHead className="font-semibold">Format</TableHead>
                        <TableHead className="font-semibold">Gender</TableHead>
                        <TableHead className="font-semibold">
                          Kategori Usia
                        </TableHead>
                        <TableHead className="font-semibold">
                          Level Kelas
                        </TableHead>
                        <TableHead className="text-right font-semibold">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-5 w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-14" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredClasses.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-16 text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                              <p className="text-sm font-medium">
                                Tidak ada kelas poomsae yang ditemukan
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                Coba ubah filter atau kata kunci pencarian
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClasses.map((cls) => (
                          <TableRow
                            key={cls.id}
                            className="group transition-colors"
                          >
                            <TableCell>
                              <p className="font-medium text-foreground leading-snug">
                                {cls.jurus.nama}
                              </p>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {cls.format.nama}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {genderLabel(cls.gender)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {cls.kategori_usia.nama}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {cls.level_kelas.nama}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <div className="flex gap-1 justify-end">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/admin/kelas-poomsae/${cls.id}`}
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>Detail</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/admin/kelas-poomsae/${cls.id}/edit`}
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-muted-foreground hover:text-sky-600"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>Ubah</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                          handleDeleteClick(cls.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Hapus</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Pagination */}
              {pagination.total_page > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Halaman{" "}
                    <span className="font-medium text-foreground">
                      {pagination.current_page}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium text-foreground">
                      {pagination.total_page}
                    </span>
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchClasses(pagination.current_page - 1)
                      }
                      disabled={!pagination.has_prev || loading}
                      className="shadow-sm"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchClasses(pagination.current_page + 1)
                      }
                      disabled={!pagination.has_next || loading}
                      className="shadow-sm"
                    >
                      Selanjutnya
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
