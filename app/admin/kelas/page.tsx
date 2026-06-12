// app\admin\kelas\page.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, School, CheckCircle, XCircle } from "lucide-react";
import { KelasTableToolbar } from "@/components/admin/kelas/kelas-table-toolbar";
import { KelasTable } from "@/components/admin/kelas/kelas-table";
import { KelasTablePagination } from "@/components/admin/kelas/kelas-table-pagination";
import type {
  Kelas,
  KelasListResponse,
  KelasStatusCounts,
  PaginationMeta,
  ActiveKelasTab,
} from "@/types/admin/kelas";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// Import modal komponen
import { CreateKelasModal } from "@/components/admin/kelas/create-kelas-form";

export default function KelasPage() {
  const [data, setData] = useState<Kelas[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [statusCounts, setStatusCounts] = useState<KelasStatusCounts | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<ActiveKelasTab>("total");
  // State untuk modal
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch data
  const fetchKelasList = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (search) {
        params.append("search", search);
      }

      if (activeStatus !== "total") {
        params.append("status", activeStatus);
      }

      const response = await fetch(
        `http://localhost:3001/api/admin/kelas/getallkelas?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data kelas");
      }

      const result: KelasListResponse = await response.json();

      setData(result.data);
      setMeta(result.pagination);

      // Calculate status counts
      const counts: KelasStatusCounts = {
        total: Number(result.summary.total_kelas),
        aktif: Number(result.summary.total_kelas_aktif),
        nonaktif: Number(result.summary.total_kelas_nonaktif),
      };
      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching kelas:", error);
      toast.error("Gagal mengambil data kelas");
      setData([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, activeStatus]);

  useEffect(() => {
    fetchKelasList();
  }, [fetchKelasList]);

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleStatusChange = (status: ActiveKelasTab) => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleNextPage = () => {
    if (meta?.has_next) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (meta?.has_prev) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  // Callback setelah berhasil tambah kelas
  const handleCreateSuccess = () => {
    fetchKelasList();
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
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              {/* Header section with title and quick action */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Manajemen Kelas
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Kelola data kelas taekwondo dan informasi peserta
                  </p>
                </div>
                <div>
                  {/* Ganti Link dengan Button yang membuka modal */}
                  <Button
                    className="w-full sm:w-auto shadow-sm"
                    onClick={() => setModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kelas
                  </Button>
                </div>
              </div>

              {/* Stats Cards - tetap sama */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Kelas
                    </CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading && !statusCounts ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">
                        {statusCounts?.total ?? 0}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah seluruh kelas taekwondo
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-emerald-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-450">
                      Kelas Aktif
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    {isLoading && !statusCounts ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {statusCounts?.aktif ?? 0}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kelas yang sedang berjalan
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-rose-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-455">
                      Kelas Tidak Aktif
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-rose-500" />
                  </CardHeader>
                  <CardContent>
                    {isLoading && !statusCounts ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                        {statusCounts?.nonaktif ?? 0}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Kelas yang dinonaktifkan
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs
                value={activeStatus}
                onValueChange={(v) => handleStatusChange(v as ActiveKelasTab)}
                className="w-full space-y-6"
              >
                <KelasTableToolbar
                  table={null as any}
                  statusCounts={statusCounts || undefined}
                  onSearchChange={handleSearchChange}
                  onStatusChange={handleStatusChange}
                  initialSearch={search}
                  initialStatus={activeStatus}
                  isLoading={isLoading}
                />

                <TabsContent
                  value="total"
                  className="space-y-4 focus-visible:outline-none"
                >
                  <KelasTable
                    data={data}
                    pageCount={meta?.total_page || 1}
                    pageSize={limit}
                    isLoading={isLoading}
                    onDeleteSuccess={fetchKelasList}
                  />
                  <KelasTablePagination
                    meta={meta || undefined}
                    onPageSizeChange={handlePageSizeChange}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                  />
                </TabsContent>

                <TabsContent
                  value="aktif"
                  className="space-y-4 focus-visible:outline-none"
                >
                  <KelasTable
                    data={data}
                    pageCount={meta?.total_page || 1}
                    pageSize={limit}
                    isLoading={isLoading}
                    onDeleteSuccess={fetchKelasList}
                  />
                  <KelasTablePagination
                    meta={meta || undefined}
                    onPageSizeChange={handlePageSizeChange}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                  />
                </TabsContent>

                <TabsContent
                  value="nonaktif"
                  className="space-y-4 focus-visible:outline-none"
                >
                  <KelasTable
                    data={data}
                    pageCount={meta?.total_page || 1}
                    pageSize={limit}
                    isLoading={isLoading}
                    onDeleteSuccess={fetchKelasList}
                  />
                  <KelasTablePagination
                    meta={meta || undefined}
                    onPageSizeChange={handlePageSizeChange}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Modal Tambah Kelas */}
      <CreateKelasModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </SidebarProvider>
  );
}
