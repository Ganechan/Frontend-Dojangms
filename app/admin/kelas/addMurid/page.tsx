"use client";

import * as React from "react";
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
import { SearchIcon, Plus, Loader2, Layers, Edit } from "lucide-react";
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

export default function Page() {
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "aktif" | "nonaktif"
  >("all");
  const [loading, setLoading] = useState(true);

  // Fetch classes data from API
  const fetchClasses = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/admin/kelas/getallkelas?page=${page}&limit=10`,
      );
      const data = await response.json();
      setClasses(data.data || []);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total_data: data.pagination.total_data,
        total_page: data.pagination.total_page,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Filter classes based on search input and status tabs
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

        {/* Main Workspace Wrapper */}
        <div className="flex flex-1 flex-col bg-neutral-50/50">
          <div className="@container/main mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-1 border-b pb-5">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                Manajemen Kelas
              </h1>
              <p className="text-sm text-muted-foreground">
                Kelola alokasi program, cari detail kelas, dan tambahkan
                distribusi murid baru secara instan.
              </p>
            </div>

            {/* Toolbar Filters Card */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-sm space-y-4">
              {/* Search Bar Input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                <Input
                  type="text"
                  placeholder="Cari nama kelas atau deskripsi kurikulum..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-neutral-50/30 focus-visible:bg-white"
                />
              </div>

              {/* Status Segment Control */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200/40">
                  <Button
                    variant={statusFilter === "all" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className={`h-8 px-4 font-medium transition-all ${
                      statusFilter === "all"
                        ? "bg-gray-400 shadow-sm text-neutral-900"
                        : "text-neutral-600"
                    }`}
                  >
                    Semua
                  </Button>
                  <Button
                    variant={statusFilter === "aktif" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter("aktif")}
                    className={`h-8 px-4 font-medium transition-all ${
                      statusFilter === "aktif"
                        ? "bg-gray-400 shadow-sm text-neutral-900"
                        : "text-neutral-600"
                    }`}
                  >
                    Aktif
                  </Button>
                  <Button
                    variant={
                      statusFilter === "nonaktif" ? "secondary" : "ghost"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("nonaktif")}
                    className={`h-8 px-4 font-medium transition-all ${
                      statusFilter === "nonaktif"
                        ? "bg-gray-400 shadow-sm"
                        : "text-neutral-600"
                    }`}
                  >
                    Nonaktif
                  </Button>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 bg-neutral-100/80 px-3 py-1.5 rounded-md border">
                  <Layers className="size-3.5 text-neutral-400" />
                  <span>
                    Total:{" "}
                    <strong className="text-neutral-900">
                      {pagination.total_data}
                    </strong>{" "}
                    Kelas
                  </span>
                </div>
              </div>
            </div>

            {/* Main Data Table View */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-50/70 border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[30%] font-semibold text-neutral-700">
                      Nama Kelas
                    </TableHead>
                    <TableHead className="w-[40%] font-semibold text-neutral-700">
                      Deskripsi Kelas
                    </TableHead>
                    <TableHead className="w-[13%] font-semibold text-neutral-700">
                      Status
                    </TableHead>
                    <TableHead className="w-[17%] text-right font-semibold text-neutral-700">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="size-5 animate-spin text-neutral-400" />
                          <span className="text-sm font-medium">
                            Sinkronisasi data kelas...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-40 text-center text-muted-foreground font-medium"
                      >
                        Tidak ada kelas yang terdeteksi dalam kriteria ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((kelas) => (
                      <TableRow
                        key={kelas.id}
                        className="hover:bg-neutral-50/40 transition-colors"
                      >
                        <TableCell className="font-semibold text-neutral-900 py-4">
                          {kelas.nama}
                        </TableCell>
                        <TableCell className="text-neutral-600 max-w-xs truncate py-4">
                          {kelas.deskripsi || (
                            <span className="text-neutral-400 italic">
                              Tidak ada deskripsi
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={
                              kelas.status === "aktif" ? "default" : "secondary"
                            }
                            className="shadow-none font-medium px-2.5 py-0.5"
                          >
                            {kelas.status === "aktif" ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Button Edit Murid Kelas (Conditional) */}
                            {kelas.status === "aktif" ? (
                              <Link href={`/admin/kelas/addMurid/${kelas.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="shadow-sm border-neutral-200 hover:bg-neutral-500 font-medium"
                                  distribute-id="btn-add"
                                >
                                  <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
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
                                href={`/admin/kelas/addMurid/create?classId=${kelas.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="shadow-sm border-neutral-200 hover:bg-neutral-500 font-medium"
                                  distribute-id="btn-add"
                                >
                                  <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                                  Tambah Murid
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
                                Tambah Murid
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

            {/* Pagination Controls Section */}
            {!loading && pagination.total_page > 1 && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-neutral-500 font-medium">
                  Halaman{" "}
                  <span className="text-neutral-900">{pagination.page}</span>{" "}
                  dari{" "}
                  <span className="text-neutral-900">
                    {pagination.total_page}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchClasses(pagination.page - 1)}
                    disabled={!pagination.has_prev || loading}
                    className="shadow-none"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchClasses(pagination.page + 1)}
                    disabled={!pagination.has_next || loading}
                    className="shadow-none"
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
