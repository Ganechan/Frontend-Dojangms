"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  Users,
  Link2,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Interface untuk detail grup WhatsApp
interface WhatsAppGroupDetail {
  id: number;
  nama_grup: string;
  group_jid: string;
  kelas_id: number | null;
  kelas_nama: string | null;
  status: string;
  created_at: string;
}

export default function WhatsAppGroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id;
  const [data, setData] = useState<WhatsAppGroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/admin/whatsapp-groups/${groupId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data grup");
        }

        setData(result.data);
      } catch (err: any) {
        const message = err.message || "Terjadi kesalahan saat memuat data";
        setError(message);
        toast.error(message);
        console.error("Error fetching group detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchDetail();
    }
  }, [groupId]);

  const getStatusBadgeVariant = (status: string) => {
    return status === "aktif" ? "default" : "secondary";
  };

  const getStatusLabel = (status: string) => {
    return status === "aktif" ? "Aktif" : "Nonaktif";
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                Memuat detail grup WhatsApp...
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
                onClick={() => router.push("/admin/whatsapp-groups")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
                {error || "Data grup WhatsApp tidak ditemukan"}
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
          <div className="p-6 bg-background">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-6">
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
                      {data.nama_grup}
                    </h1>
                    <p className="text-muted-foreground">
                      Detail grup WhatsApp
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/whatsapp-groups/${data.id}/edit`}>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => {
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
                      Nama Grup
                    </p>
                    <p className="text-lg font-semibold">{data.nama_grup}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Status
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(data.status)}
                      className="text-base py-1 px-3"
                    >
                      {getStatusLabel(data.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Group JID
                    </p>
                    <p className="text-sm font-mono bg-muted/30 p-2 rounded border border-border break-all">
                      {data.group_jid}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Kelas
                    </p>
                    {data.kelas_id ? (
                      <Badge variant="outline" className="text-base py-1 px-3">
                        {data.kelas_nama || `ID: ${data.kelas_id}`}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">
                        Tidak terhubung dengan kelas
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Tanggal Dibuat
                    </p>
                    <p className="text-lg font-semibold">
                      {formatDateTime(data.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      ID Grup
                    </p>
                    <p className="text-lg font-semibold">#{data.id}</p>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="border-t pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Informasi Tambahan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>
                        Grup WhatsApp ini terdaftar di sistem sejak{" "}
                        {formatDateTime(data.created_at)}.
                      </p>
                      {data.kelas_id && (
                        <p className="mt-1">
                          Grup ini terhubung dengan kelas{" "}
                          <strong>
                            {data.kelas_nama || `ID ${data.kelas_id}`}
                          </strong>
                          .
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
