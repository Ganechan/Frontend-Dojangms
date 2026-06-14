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
import { SearchIcon, Plus, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Kelas {
  id: number;
  nama: string;
  deskripsi: string;
  status: "aktif" | "nonaktif";
}

interface PaginationInfo {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function TrainersPage() {
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "aktif" | "nonaktif"
  >("all");
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
  });

  const fetchClasses = async (page: number = 1) => {
    try {
      setLoading(true);
      // Gunakan route handler internal (pastikan sudah ada)
      const response = await fetch(
        `/api/admin/kelas/getallkelas?page=${page}&limit=10`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setClasses(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((kelas) => {
    const matchesSearch =
      kelas.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelas.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || kelas.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex flex-1 flex-col p-6 bg-background">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manajemen Pelatih Kelas
              </h1>
              <p className="text-muted-foreground">
                Kelola kelas dan tentukan pelatih yang bertanggung jawab
              </p>
            </div>

            {/* Toolbar */}
            <div className="bg-card rounded-lg border p-4 space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Cari kelas atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    Semua
                  </Button>
                  <Button
                    variant={statusFilter === "aktif" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("aktif")}
                  >
                    Aktif
                  </Button>
                  <Button
                    variant={
                      statusFilter === "nonaktif" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("nonaktif")}
                  >
                    Nonaktif
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {pagination.total_data} kelas
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nama Kelas</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="text-right w-[180px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Tidak ada kelas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((kelas) => (
                      <TableRow key={kelas.id}>
                        <TableCell className="font-semibold">
                          {kelas.nama}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {kelas.deskripsi || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              kelas.status === "aktif" ? "default" : "secondary"
                            }
                          >
                            {kelas.status === "aktif" ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Button Edit Pelatih Kelas (Conditional) */}
                            {kelas.status === "aktif" ? (
                              <Link
                                href={`/admin/kelas/addPelatih/${kelas.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="shadow-sm border-neutral-200 hover:bg-neutral-500 font-medium"
                                  distribute-id="btn-add"
                                >
                                  <Edit className="size-3.5 mr-1.5 stroke-[2.5]" />
                                  Edit
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="shadow-sm font-medium opacity-50 cursor-not-allowed"
                              >
                                <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                                Edit
                              </Button>
                            )}
                            {/* Button Tambah Murid (Conditional) */}
                            {kelas.status === "aktif" ? (
                              <Link
                                href={`/admin/kelas/addPelatih/create?classId=${kelas.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="shadow-sm border-neutral-200 hover:bg-neutral-500 font-medium"
                                  distribute-id="btn-add"
                                >
                                  <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                                  Tambah Pelatih
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="shadow-sm font-medium opacity-50 cursor-not-allowed"
                              >
                                <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                                Tambah Pelatih
                              </Button>
                            )}
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
              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground">
                  Halaman {pagination.page} dari {pagination.total_page}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchClasses(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchClasses(pagination.page + 1)}
                    disabled={!pagination.has_next}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
