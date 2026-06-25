"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface KyorugiClassData {
  id: number;
  gender: string;
  label: string;
  batas_bawah: number;
  batas_atas: number;
  kategori_usia: {
    id: number;
    nama: string;
  };
  level_kelas: {
    id: number;
    nama: string;
  };
}

export default function KyorugiClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id;
  const [data, setData] = useState<KyorugiClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/admin/kelas-kyorugi/${classId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data kelas");
        }

        setData(result.data);
      } catch (err: any) {
        const message = err.message || "Terjadi kesalahan saat memuat data";
        setError(message);
        toast.error(message);
        console.error("Error fetching kyorugi class detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchDetail();
    }
  }, [classId]);

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
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">
                Memuat detail kelas kyorugi...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !data) {
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
          <div className="min-h-[calc(100vh-4rem)] p-6 flex items-center justify-center">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/kelas-kyorugi")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
                {error || "Data kelas kyorugi tidak ditemukan"}
              </div>
            </div>
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="mb-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.back()}
                      className="mb-4"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>

                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          Detail Kelas Kyorugi
                        </h1>
                        <p className="text-muted-foreground">
                          Informasi lengkap kelas pertandingan Kyorugi
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/admin/kelas-kyorugi/${data.id}/edit`}>
                          <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            // Implement delete if needed
                            toast.info("Fitur hapus akan segera tersedia");
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Detail Content */}
                  <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Label Kelas
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {data.label}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Gender
                        </p>
                        <Badge
                          variant="outline"
                          className="text-base py-1 px-3"
                        >
                          {genderLabel(data.gender)}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Batas Bawah (kg)
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {data.batas_bawah}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Batas Atas (kg)
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {data.batas_atas}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Kategori Usia
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-base py-1 px-3"
                        >
                          {data.kategori_usia.nama}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Level Kelas
                        </p>
                        <Badge
                          variant="default"
                          className="text-base py-1 px-3"
                        >
                          {data.level_kelas.nama}
                        </Badge>
                      </div>
                    </div>

                    {/* Additional info card (optional) */}
                    <div className="border-t border-border pt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Informasi Tambahan
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <p>ID Kelas: {data.id}</p>
                          <p className="mt-1">
                            Kelas ini diperuntukkan bagi peserta dengan berat
                            badan di atas {data.batas_bawah} kg dan tidak
                            melebihi {data.batas_atas} kg.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
