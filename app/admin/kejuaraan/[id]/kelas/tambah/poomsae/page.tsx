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
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface PoomsaeClass {
  id: number;
  gender: string;
  kategori_usia: { id: number; nama: string };
  level_kelas: { id: number; nama: string };
  jurus: { nama: string }; // Sesuai response hanya ada nama
  format: { nama: string }; // Sesuai response hanya ada nama
}

export default function TambahKelasPoomsaePage() {
  const params = useParams();
  const router = useRouter();
  const kejuaraanId = params.id as string;
  const [classes, setClasses] = useState<PoomsaeClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Gunakan endpoint available yang spesifik untuk kejuaraan ini
        const response = await fetch(
          `/api/admin/kejuaraan/${kejuaraanId}/kelas-poomsae/available?page=1&per_page=100`,
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
    fetchClasses();
  }, [kejuaraanId]);

  const handleAddClass = async (kelasId: number) => {
    setSubmitting(kelasId);
    try {
      const response = await fetch(
        `/api/admin/kejuaraan/${kejuaraanId}/kelas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipe: "poomsae", kelas_id: kelasId }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Gagal menambahkan kelas");
      toast.success("Kelas poomsae berhasil ditambahkan ke kejuaraan");
      router.push(`/admin/kejuaraan/${kejuaraanId}/kelas`);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(null);
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
                <h1 className="text-2xl font-bold">Tambah Kelas Poomsae</h1>
                <p className="text-sm text-muted-foreground">
                  Pilih kelas poomsae yang akan ditambahkan ke kejuaraan ini
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
                        Tidak ada kelas poomsae yang tersedia
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((cls) => (
                      <TableRow key={cls.id}>
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
                            onClick={() => handleAddClass(cls.id)}
                            disabled={submitting === cls.id}
                          >
                            {submitting === cls.id && (
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            )}
                            Tambah
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
    </SidebarProvider>
  );
}
