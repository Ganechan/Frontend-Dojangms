"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
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

interface PoomsaeClassInChampionship {
  kelas_kejuaraan_id: number;
  kelas_id: number;
  gender: string;
  jurus: { nama: string };
  format: { nama: string };
  kategori_usia: { id: number; nama: string };
  level_kelas: { id: number; nama: string };
}

export default function PoomsaeClassesInChampionshipPage() {
  const params = useParams();
  const router = useRouter();
  const kejuaraanId = params.id as string;
  const [classes, setClasses] = useState<PoomsaeClassInChampionship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kejuaraan/${kejuaraanId}/kelas-poomsae?page=1&per_page=100`,
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setClasses(data.data);
      } else {
        throw new Error(data.message || "Gagal memuat data");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data kelas poomsae");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [kejuaraanId]);

  const handleDeleteClick = (kelasKejuaraanId: number) => {
    setDeletingId(kelasKejuaraanId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/kejuaraan/kelas-kejuaraan/delete/${deletingId}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Gagal menghapus kelas");
      }
      toast.success(
        data.message || "Kelas poomsae berhasil dihapus dari kejuaraan",
      );
      setDeleteDialogOpen(false);
      setDeletingId(null);
      await fetchClasses(); // refresh daftar
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const genderLabel = (gender: string) =>
    gender === "putra" ? "Putra" : "Putri";

  if (loading) {
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
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
        <div className="flex flex-1 flex-col p-6 bg-background">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  Kelas Poomsae dalam Kejuaraan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Daftar kelas poomsae yang telah ditambahkan ke kejuaraan ini
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jurus</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Kategori Usia</TableHead>
                    <TableHead>Level Kelas</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Belum ada kelas poomsae yang ditambahkan
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((cls) => (
                      <TableRow key={cls.kelas_kejuaraan_id}>
                        <TableCell className="font-medium">
                          {cls.jurus.nama}
                        </TableCell>
                        <TableCell>{cls.format.nama}</TableCell>
                        <TableCell>{genderLabel(cls.gender)}</TableCell>
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
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteClick(cls.kelas_kejuaraan_id)
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
              Apakah Anda yakin ingin menghapus kelas ini dari kejuaraan?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
