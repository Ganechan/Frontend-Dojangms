"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface WhatsAppGroupDetail {
  id: number;
  nama_grup: string;
  group_jid: string;
  kelas_id: number | null;
  kelas_nama: string | null;
  status: string;
  created_at: string;
}

interface WhatsAppGroupOption {
  id: string;
  name: string;
}

interface Kelas {
  id: number;
  nama: string;
}

export default function EditWhatsAppGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [groupDetail, setGroupDetail] = useState<WhatsAppGroupDetail | null>(
    null,
  );
  const [groupOptions, setGroupOptions] = useState<WhatsAppGroupOption[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama_grup: "",
    group_jid: "",
    kelas_id: "",
    status: "aktif",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Fetch detail grup, daftar grup WhatsApp, dan daftar kelas secara paralel
        const [detailRes, groupsRes, kelasRes] = await Promise.all([
          fetch(`/api/admin/whatsapp-groups/${groupId}`),
          fetch("/api/admin/whatsapp/groups"),
          fetch("/api/admin/kelas/getallkelas?page=1&limit=100&status=aktif"),
        ]);

        const detailData = await detailRes.json();
        const groupsData = await groupsRes.json();
        const kelasData = await kelasRes.json();

        if (!detailRes.ok)
          throw new Error(detailData.message || "Gagal mengambil data grup");
        if (!groupsRes.ok)
          throw new Error(groupsData.message || "Gagal mengambil daftar grup");
        if (!kelasRes.ok)
          throw new Error(kelasData.message || "Gagal mengambil daftar kelas");

        const detail = detailData.data;
        const groupsArray = groupsData.data || groupsData;
        const kelasArray = kelasData.data || kelasData;

        setGroupDetail(detail);
        setGroupOptions(groupsArray);
        setKelas(kelasArray);

        setFormData({
          nama_grup: detail.nama_grup || "",
          group_jid: detail.group_jid || "",
          kelas_id: detail.kelas_id?.toString() || "",
          status: detail.status || "aktif",
        });
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
        toast.error(err.message || "Gagal memuat data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nama_grup.trim()) {
      toast.error("Nama grup harus diisi");
      return;
    }
    if (!formData.group_jid.trim()) {
      toast.error("Group JID harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nama_grup: formData.nama_grup,
        group_jid: formData.group_jid,
        kelas_id: formData.kelas_id ? parseInt(formData.kelas_id) : null,
        status: formData.status,
      };

      const response = await fetch(`/api/admin/whatsapp-groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Gagal memperbarui grup");

      toast.success(data.message || "Grup berhasil diperbarui");
      router.push("/admin/pengumuman/group-whatsapp");
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui grup");
      toast.error(err.message || "Gagal memperbarui grup");
      console.error("Error updating group:", err);
    } finally {
      setSubmitting(false);
    }
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
          <div className="max-w-3xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/pengumuman/group-whatsapp">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  Edit Grup WhatsApp
                </h1>
                <p className="text-muted-foreground">
                  Perbarui informasi grup WhatsApp
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informasi Grup</CardTitle>
                <CardDescription>
                  Ubah detail grup WhatsApp sesuai kebutuhan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nama Grup */}
                  <div className="space-y-2">
                    <Label htmlFor="nama_grup">Nama Grup *</Label>
                    <Input
                      id="nama_grup"
                      name="nama_grup"
                      placeholder="Masukkan nama grup"
                      value={formData.nama_grup}
                      onChange={handleInputChange}
                      disabled={submitting}
                      required
                    />
                  </div>

                  {/* Group JID */}
                  <div className="space-y-2">
                    <Label htmlFor="group_jid">Group JID *</Label>
                    <Select
                      value={formData.group_jid}
                      onValueChange={(value) =>
                        handleSelectChange("group_jid", value)
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger id="group_jid">
                        <SelectValue placeholder="Pilih group JID" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupOptions.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name} ({group.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Pilih group JID dari daftar grup WhatsApp yang tersedia
                    </p>
                  </div>

                  {/* Kelas (Opsional) */}
                  <div className="space-y-2">
                    <Label htmlFor="kelas_id">Kelas (Opsional)</Label>
                    <Select
                      value={formData.kelas_id}
                      onValueChange={(value) =>
                        handleSelectChange("kelas_id", value)
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger id="kelas_id">
                        <SelectValue placeholder="Pilih kelas (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Tidak Ada</SelectItem>
                        {kelas.map((k) => (
                          <SelectItem key={k.id} value={k.id.toString()}>
                            {k.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Pilih kelas jika grup ini terhubung dengan kelas tertentu
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={submitting}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
