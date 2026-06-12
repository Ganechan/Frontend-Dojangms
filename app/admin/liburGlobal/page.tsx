"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { GlobalHolidayTable } from "@/components/admin/liburGlobal/global-libur-table";
import { GlobalHolidayPagination } from "@/components/admin/liburGlobal/global-libur-pagination";
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
import type {
  GlobalHoliday,
  GlobalHolidayListResponse,
  GlobalHolidayPaginationMeta,
} from "@/types/admin/libur-global";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function GlobalHolidayPage() {
  const [data, setData] = useState<GlobalHoliday[]>([]);
  const [meta, setMeta] = useState<GlobalHolidayPaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fungsi fetch data yang bisa dipanggil ulang
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/jadwal/libur-global?page=${page}&limit=${limit}`,
      );
      const result: GlobalHolidayListResponse = await response.json();

      if (result.data) {
        setData(result.data);
        setMeta(result.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch global holidays:", error);
      toast.error("Gagal mengambil data libur global");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  // Auto fetch saat page atau limit berubah
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/jadwal/libur-global/delete/${deleteId}`,
        { method: "DELETE" },
      );
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Gagal menghapus libur global");
        return;
      }

      toast.success(result.message || "Libur global berhasil dihapus");
      setShowDeleteDialog(false);

      // Setelah hapus, refresh data
      if (page === 1) {
        // Jika sudah di halaman 1, panggil fetch ulang manual
        await fetchData();
      } else {
        // Reset ke halaman 1, useEffect akan otomatis memanggil fetchData
        setPage(1);
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Terjadi kesalahan saat menghapus libur global");
    } finally {
      setIsDeleting(false);
    }
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
        <div className="flex flex-1 flex-col bg-neutral-50/50">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="mx-auto max-w-7xl w-full px-4 py-6 md:px-6 md:py-8 space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Manajemen Libur Global
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola hari libur nasional yang berlaku untuk semua jadwal
                  </p>
                </div>
                <Link
                  href="/admin/libur-global/create"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Libur Global
                  </Button>
                </Link>
              </div>

              {/* Main Content Card Container */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-16 space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/70" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Memuat data libur global...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Table Wrapper */}
                    <div className="p-6 overflow-x-auto">
                      <GlobalHolidayTable
                        data={data}
                        onDelete={handleDeleteClick}
                        isDeleting={isDeleting}
                      />
                    </div>

                    {/* Pagination Footer */}
                    <div className="border-t bg-neutral-50/50 px-6 py-4">
                      <GlobalHolidayPagination
                        meta={meta || undefined}
                        onPageSizeChange={handlePageSizeChange}
                        onNextPage={handleNextPage}
                        onPrevPage={handlePrevPage}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Libur Global</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500">
              Apakah Anda yakin ingin menghapus libur global ini? Tindakan ini
              akan mengembalikan jadwal ke status normal dan tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
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
