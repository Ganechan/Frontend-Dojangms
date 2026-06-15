// app/admin/kejuaraan/[id]/kelas/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Interface untuk detail kyorugi
interface KyorugiDetail {
  gender: string;
  label: string;
  batas_bawah: number;
  batas_atas: number;
  kategori_usia: { id: number; nama: string };
  level_kelas: { id: number; nama: string };
}

// Interface untuk detail poomsae
interface PoomsaeDetail {
  gender: string;
  jurus: string;
  format: string;
  kategori_usia: { id: number; nama: string };
  level_kelas: { id: number; nama: string };
}

interface KelasPertandingan {
  id: number;
  tipe: "kyorugi" | "poomsae";
  kelas_id: number;
  detail: KyorugiDetail | PoomsaeDetail;
}

export default function ChampionshipClassesPage() {
  const params = useParams();
  const router = useRouter();
  const kejuaraanId = params.id;
  const [loading, setLoading] = useState(true);
  const [championshipName, setChampionshipName] = useState("");
  const [classes, setClasses] = useState<KelasPertandingan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/kejuaraan/${kejuaraanId}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Gagal mengambil data");
        setChampionshipName(data.data.name);
        setClasses(data.data.kelas_pertandingan || []);
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (kejuaraanId) fetchData();
  }, [kejuaraanId]);

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
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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
                <h1 className="text-2xl font-bold">Kelas Pertandingan</h1>
                <p className="text-sm text-muted-foreground">
                  Kejuaraan:{" "}
                  <span className="font-medium">{championshipName}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Total {classes.length} kelas
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/kejuaraan/${kejuaraanId}/kelas/tambah/kyorugi`}
                >
                  <Button size="sm">+ Tambah Kyorugi</Button>
                </Link>
                <Link
                  href={`/admin/kejuaraan/${kejuaraanId}/kelas/tambah/poomsae`}
                >
                  <Button size="sm" variant="outline">
                    + Tambah Poomsae
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Detail</TableHead>
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
                        Belum ada kelas pertandingan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((kelas) => {
                      const isKyorugi = kelas.tipe === "kyorugi";
                      const detail = kelas.detail;
                      const kategoriNama = detail.kategori_usia?.nama || "-";
                      const levelNama = detail.level_kelas?.nama || "-";
                      const gender = genderLabel(detail.gender);

                      return (
                        <TableRow key={kelas.id}>
                          <TableCell className="capitalize font-medium">
                            {kelas.tipe}
                          </TableCell>
                          <TableCell>
                            {isKyorugi ? (
                              <>
                                <span className="font-medium">
                                  {(detail as KyorugiDetail).label}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({(detail as KyorugiDetail).batas_bawah} -{" "}
                                  {(detail as KyorugiDetail).batas_atas} kg)
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="font-medium">
                                  {(detail as PoomsaeDetail).jurus}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {(detail as PoomsaeDetail).format}
                                </span>
                              </>
                            )}
                          </TableCell>
                          <TableCell>{gender}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{kategoriNama}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{levelNama}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Link
                                href={`/admin/kejuaraan/${kejuaraanId}/kelas/${kelas.id}/tambah-peserta`}
                              >
                                <Button size="sm" variant="ghost">
                                  <Plus className="w-4 h-4" />
                                  Tambah Peserta
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
