"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface WhatsAppGroup {
  id: string;
  name: string;
}

interface Kelas {
  id: number;
  nama: string;
}

export default function TambahGrupWhatsAppPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<
    Record<string, number | null>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [groupsRes, kelasRes] = await Promise.all([
          fetch("/api/admin/whatsapp/groups"),
          fetch("/api/admin/kelas/getallkelas?page=1&limit=100&status=aktif"),
        ]);

        const groupsData = await groupsRes.json();
        const kelasData = await kelasRes.json();

        if (!groupsRes.ok)
          throw new Error(groupsData.message || "Gagal memuat grup");
        if (!kelasRes.ok)
          throw new Error(kelasData.message || "Gagal memuat kelas");

        const groupsArray = groupsData.data || groupsData;
        const kelasArray = kelasData.data || kelasData;

        if (!Array.isArray(groupsArray)) {
          throw new Error("Data grup tidak valid");
        }

        setGroups(groupsArray);
        setKelas(kelasArray);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
        toast.error(err.message || "Gagal memuat data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGroupSelect = (groupId: string, selected: boolean) => {
    if (selected) {
      setSelectedGroups((prev) => ({
        ...prev,
        [groupId]: null, // Default: tidak terhubung dengan kelas
      }));
    } else {
      setSelectedGroups((prev) => {
        const updated = { ...prev };
        delete updated[groupId];
        return updated;
      });
    }
  };

  const handleKelasChange = (groupId: string, kelasId: number | null) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [groupId]: kelasId,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const groupsToAdd = groups
        .filter((g) => selectedGroups[g.id] !== undefined)
        .map((g) => ({
          group_jid: g.id,
          nama_grup: g.name,
          kelas_id: selectedGroups[g.id], // Bisa null
        }));

      if (groupsToAdd.length === 0) {
        setError("Pilih minimal satu grup");
        toast.error("Pilih minimal satu grup");
        return;
      }

      const response = await fetch("/api/admin/whatsapp/groups/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups: groupsToAdd }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Gagal menambahkan grup");

      setSuccess(`${groupsToAdd.length} grup berhasil ditambahkan ke database`);
      toast.success(`${groupsToAdd.length} grup berhasil ditambahkan`);
      setSelectedGroups({});

      setTimeout(() => {
        router.push("/admin/whatsapp-groups");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Gagal menambahkan grup";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error submitting groups:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCount = Object.keys(selectedGroups).length;

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
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Tambah Grup WhatsApp
              </h1>
              <p className="text-muted-foreground">
                Pilih grup WhatsApp yang ingin ditambahkan ke database dan
                tentukan kelas (opsional) untuk setiap grup
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pilihan</CardTitle>
                  <CardDescription>
                    {selectedCount > 0
                      ? `${selectedCount} grup dipilih untuk ditambahkan`
                      : "Belum ada grup yang dipilih"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {selectedCount}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daftar Grup WhatsApp</CardTitle>
                  <CardDescription>
                    Total: {groups.length} grup tersedia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {groups.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Tidak ada grup WhatsApp yang tersedia
                      </div>
                    ) : (
                      groups.map((group) => (
                        <div
                          key={group.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <Checkbox
                            id={group.id}
                            checked={selectedGroups[group.id] !== undefined}
                            onCheckedChange={(checked) =>
                              handleGroupSelect(group.id, checked as boolean)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={group.id}
                              className="font-medium text-sm cursor-pointer block truncate"
                            >
                              {group.name}
                            </label>
                            <p className="text-xs text-muted-foreground truncate">
                              {group.id}
                            </p>
                          </div>

                          {selectedGroups[group.id] !== undefined && (
                            <Select
                              value={
                                selectedGroups[group.id]?.toString() ?? "null"
                              }
                              onValueChange={(value) =>
                                handleKelasChange(
                                  group.id,
                                  value === "null" ? null : parseInt(value),
                                )
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Pilih kelas" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="null">Tidak Ada</SelectItem>
                                {kelas.map((k) => (
                                  <SelectItem
                                    key={k.id}
                                    value={k.id.toString()}
                                  >
                                    {k.nama}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedGroups({});
                    setError(null);
                  }}
                  disabled={selectedCount === 0}
                >
                  Hapus Semua Pilihan
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || selectedCount === 0}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menambahkan...
                    </>
                  ) : (
                    `Tambahkan ${selectedCount} Grup`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
