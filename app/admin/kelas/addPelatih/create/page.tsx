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

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status: string;
  spesialisasi: string;
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
}

export default function AddTrainersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("classId");
  const classId = classIdParam ? parseInt(classIdParam, 10) : null;

  const [candidates, setCandidates] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTrainers, setSelectedTrainers] = useState<Set<number>>(
    new Set(),
  );

  // Fetch calon pelatih via route handler Next.js
  useEffect(() => {
    if (!classId) return;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/kelas/${classId}/calon-pelatih`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gagal memuat data");
        setCandidates(data.data || []);
        setSelectedTrainers(new Set());
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data pelatih");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [classId]);

  const filteredTrainers = candidates.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.spesialisasi?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleTrainer = (trainerId: number) => {
    const newSelected = new Set(selectedTrainers);
    if (newSelected.has(trainerId)) newSelected.delete(trainerId);
    else newSelected.add(trainerId);
    setSelectedTrainers(newSelected);
  };

  const selectAll = () => {
    if (
      selectedTrainers.size === filteredTrainers.length &&
      filteredTrainers.length > 0
    ) {
      setSelectedTrainers(new Set());
    } else {
      setSelectedTrainers(new Set(filteredTrainers.map((t) => t.id)));
    }
  };

  const handleAddTrainers = async () => {
    if (selectedTrainers.size === 0 || !classId) return;
    try {
      setSubmitting(true);
      const response = await fetch("/api/admin/kelas/bulkaddpelatih", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas_id: classId,
          user_ids: Array.from(selectedTrainers),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Gagal menambahkan pelatih");
        return;
      }
      toast.success(
        data.message || `${selectedTrainers.size} pelatih berhasil ditambahkan`,
      );
      router.push(`/admin/kelas/${classId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menambahkan pelatih");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (classId) router.push(`/admin/kelas/addPelatih`);
    else router.back();
  };
  //   const handleCancel = () => {
  //     if (classId) router.push(`/admin/kelas/${classId}`);
  //     else router.back();
  //   };

  if (!classId) {
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
            <p className="text-muted-foreground">ID Kelas tidak valid.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin/kelas">Kembali ke Daftar Kelas</Link>
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
                  Kembali
                </button>
                <h1 className="text-2xl font-bold tracking-tight">
                  Tambah Pelatih ke Kelas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pilih satu atau lebih pelatih untuk ditambahkan ke dalam kelas
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
                  onClick={handleAddTrainers}
                  disabled={selectedTrainers.size === 0 || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Menambahkan...
                    </>
                  ) : (
                    `Tambah ${selectedTrainers.size} Pelatih`
                  )}
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Cari nama, email, atau spesialisasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Select All */}
            {!loading && filteredTrainers.length > 0 && (
              <div className="flex items-center gap-2 pb-3 border-b">
                <Checkbox
                  id="select-all"
                  checked={selectedTrainers.size === filteredTrainers.length}
                  onCheckedChange={selectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Pilih Semua ({filteredTrainers.length})
                </label>
              </div>
            )}

            {/* Daftar Pelatih */}
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTrainers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-md border-dashed">
                  {candidates.length === 0
                    ? "Tidak ada pelatih tersedia"
                    : "Tidak ada hasil pencarian"}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {filteredTrainers.map((trainer) => (
                    <div
                      key={trainer.id}
                      className={`flex items-start gap-3 p-4 rounded-md border transition-colors ${selectedTrainers.has(trainer.id) ? "border-primary/40 bg-primary/[0.02]" : "border-border hover:bg-muted/40"}`}
                    >
                      <Checkbox
                        id={`trainer-${trainer.id}`}
                        checked={selectedTrainers.has(trainer.id)}
                        onCheckedChange={() => toggleTrainer(trainer.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`trainer-${trainer.id}`}
                          className="text-sm font-semibold cursor-pointer hover:underline"
                        >
                          {trainer.name}
                        </label>
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>{trainer.email}</p>
                          <p>{trainer.phone}</p>
                          <p className="mt-2 font-medium">
                            Spesialisasi: {trainer.spesialisasi || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 items-end shrink-0">
                        <Badge variant="outline">
                          {trainer.sabuk_saat_ini?.name || "-"}
                        </Badge>
                        <Badge
                          variant={
                            trainer.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {trainer.status === "active" ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTrainers.size > 0 && (
              <div className="bg-muted p-4 rounded-md flex justify-between items-center mt-6">
                <span className="font-medium">
                  {selectedTrainers.size} pelatih terpilih
                </span>
                <Button
                  onClick={handleAddTrainers}
                  disabled={submitting}
                  size="sm"
                >
                  {submitting ? "Memproses..." : "Simpan Pilihan"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
