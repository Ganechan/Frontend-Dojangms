"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Peserta {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  belt_id: number;
  sabuk_saat_ini: {
    id: number;
    nama: string;
    order: number;
  };
}

export default function AddParticipantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examIdParam = searchParams.get("examId");
  const examId = examIdParam ? parseInt(examIdParam, 10) : null;

  const [candidates, setCandidates] = useState<Peserta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(
    new Set(),
  );

  // Fetch calon peserta via route handler Next.js
  useEffect(() => {
    if (!examId) return;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/ujian-kenaikan-sabuk/${examId}/calon-peserta`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gagal memuat data");
        setCandidates(data.data || []);
        setSelectedParticipants(new Set());
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data calon peserta");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [examId]);

  const filteredParticipants = candidates.filter(
    (peserta) =>
      peserta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.phone.includes(searchTerm),
  );

  const toggleParticipant = (id: number) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedParticipants(newSelected);
  };

  const selectAll = () => {
    if (
      selectedParticipants.size === filteredParticipants.length &&
      filteredParticipants.length > 0
    ) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(new Set(filteredParticipants.map((p) => p.id)));
    }
  };

  const handleAddParticipants = async () => {
    if (selectedParticipants.size === 0 || !examId) return;
    try {
      setSubmitting(true);
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/${examId}/peserta/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            peserta_list: Array.from(selectedParticipants),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Gagal menambahkan peserta");
        return;
      }
      toast.success(
        data.message ||
          `${selectedParticipants.size} peserta berhasil ditambahkan`,
      );
      router.push(`/admin/ujianKenaikanSabuk/${examId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menambahkan peserta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (examId) router.push(`/admin/ujianKenaikanSabuk/ujian-terjadwal`);
    else router.back();
  };

  if (!examId) {
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
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-muted-foreground">ID Ujian tidak valid.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin/ujianKenaikanSabuk">
                Kembali ke Daftar Ujian
              </Link>
            </Button>
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
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b pb-5">
              <div className="space-y-1">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 group"
                >
                  <ArrowLeft className="size-4 transform group-hover:-translate-x-0.5 transition-transform" />
                  Kembali ke Daftar Ujian
                </button>
                <h1 className="text-2xl font-bold tracking-tight">
                  Tambah Peserta ke Ujian
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pilih satu atau lebih murid untuk didaftarkan ke dalam ujian
                  ini
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleAddParticipants}
                  disabled={selectedParticipants.size === 0 || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Menambahkan...
                    </>
                  ) : (
                    `Tambah ${selectedParticipants.size} Peserta`
                  )}
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Cari nama, email, atau nomor telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Select All */}
            {!loading && filteredParticipants.length > 0 && (
              <div className="flex items-center gap-2 pb-3 border-b">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedParticipants.size === filteredParticipants.length
                  }
                  onCheckedChange={selectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Pilih Semua ({filteredParticipants.length})
                </label>
              </div>
            )}

            {/* Daftar Peserta */}
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredParticipants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-md border-dashed">
                  {candidates.length === 0
                    ? "Tidak ada calon peserta yang tersedia"
                    : "Tidak ada hasil pencarian"}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {filteredParticipants.map((peserta) => (
                    <div
                      key={peserta.id}
                      className={`flex items-start gap-3 p-4 rounded-md border transition-colors ${
                        selectedParticipants.has(peserta.id)
                          ? "border-primary/40 bg-primary/[0.02]"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <Checkbox
                        id={`peserta-${peserta.id}`}
                        checked={selectedParticipants.has(peserta.id)}
                        onCheckedChange={() => toggleParticipant(peserta.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`peserta-${peserta.id}`}
                          className="text-sm font-semibold cursor-pointer hover:underline"
                        >
                          {peserta.name}
                        </label>
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>{peserta.email}</p>
                          <p>{peserta.phone}</p>
                          <p className="mt-2 font-medium">
                            Tanggal Lahir:{" "}
                            {new Date(peserta.tanggal_lahir).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <Badge variant="outline">
                          {peserta.sabuk_saat_ini?.nama || "-"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedParticipants.size > 0 && (
              <div className="bg-muted p-4 rounded-md flex justify-between items-center mt-6">
                <span className="font-medium">
                  {selectedParticipants.size} peserta terpilih
                </span>
                <Button
                  onClick={handleAddParticipants}
                  disabled={submitting}
                  size="sm"
                >
                  {submitting ? "Memproses..." : "Tambah Peserta"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
