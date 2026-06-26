// app\admin\kelas\addMurid\create\page.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, SearchIcon, Loader2, Users } from "lucide-react";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status: string;
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
}

export default function AddStudentsPage() {
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("classId");
  const classId = classIdParam ? parseInt(classIdParam, 10) : null;
  const router = useRouter();

  const [candidates, setCandidates] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch candidate students (calon murid) via Next.js route handler
  useEffect(() => {
    if (!classId) return;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/kelas/${classId}/calon-murid`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data calon murid");
        }
        setCandidates(data.data || []);
        setSelectedStudents(new Set());
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Gagal memuat data calon murid");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [classId]);

  // Filter students based on search term
  const filteredStudents = candidates.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleStudent = (studentId: number) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const selectAll = () => {
    if (
      selectedStudents.size === filteredStudents.length &&
      filteredStudents.length > 0
    ) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleAddStudents = async () => {
    if (!classId || selectedStudents.size === 0) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/admin/kelas/bulkaddmurid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas_id: classId,
          user_ids: Array.from(selectedStudents),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Gagal menambahkan murid ke kelas");
        return;
      }

      toast.success(
        data.message || `${selectedStudents.size} murid berhasil ditambahkan`,
      );
      setSelectedStudents(new Set());
      setSearchTerm("");

      // Redirect ke halaman detail kelas
      router.push(`/admin/kelas/${classId}`);
      router.refresh();
    } catch (error) {
      console.error("Error adding students:", error);
      toast.error("Terjadi kesalahan sistem saat memproses data");
    } finally {
      setSubmitting(false);
    }
  };

  // Jika classId tidak ada, tampilkan pesan error
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
            <p className="text-muted-foreground">ID Kelas tidak ditemukan.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin/addMurid">Kembali ke Daftar Kelas</Link>
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
        <div className="flex flex-1 flex-col bg-neutral-50/50">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="mx-auto max-w-4xl w-full px-4 py-6 md:px-6 md:py-8 space-y-6">
              {/* Back Link */}
              <div className="flex items-center">
                <Link href={`/admin/kelas/addMurid`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground pl-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Detail Kelas
                  </Button>
                </Link>
              </div>

              {/* Page Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Tambah Murid ke Kelas
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola dan pilih alokasi murid baru untuk bergabung ke dalam
                    program kelas ini.
                  </p>
                </div>
              </div>

              {/* Main Selector Card */}
              <Card className="shadow-sm border-neutral-200 overflow-hidden">
                <CardHeader className="bg-neutral-50/50 border-b py-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">
                      Daftar Calon Murid
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Hanya menampilkan murid aktif yang belum terdaftar di kelas
                    ini.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                      type="text"
                      placeholder="Cari nama atau email murid..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>

                  {/* Select All Row */}
                  {!loading && filteredStudents.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                      <Checkbox
                        id="select-all"
                        checked={
                          filteredStudents.length > 0 &&
                          selectedStudents.size === filteredStudents.length
                        }
                        onCheckedChange={selectAll}
                      />
                      <label
                        htmlFor="select-all"
                        className="text-sm font-semibold cursor-pointer select-none text-neutral-800"
                      >
                        Pilih Semua Murid Terfilter ({filteredStudents.length})
                      </label>
                    </div>
                  )}

                  {/* Students List Wrapper */}
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-2">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-medium">
                          Memuat data murid...
                        </p>
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="text-center py-12 border border-dashed rounded-lg bg-neutral-50/50">
                        <p className="text-sm text-muted-foreground font-medium">
                          {candidates.length === 0
                            ? "Tidak ada murid baru yang tersedia saat ini."
                            : "Tidak menemukan murid dengan kata kunci tersebut."}
                        </p>
                      </div>
                    ) : (
                      filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-150 ${selectedStudents.has(student.id)
                            ? "border-primary/40 bg-primary/[0.02]"
                            : "border-neutral-200 hover:bg-neutral-50/80"
                            }`}
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudents.has(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />

                          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                            <label
                              htmlFor={`student-${student.id}`}
                              className="cursor-pointer block select-none"
                            >
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {student.email}
                              </p>
                            </label>

                            <div className="text-xs text-neutral-500 md:text-right space-y-0.5">
                              <p className="font-medium text-neutral-600">
                                {student.phone || "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-row items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className="whitespace-nowrap bg-white font-medium text-neutral-700 border-neutral-300"
                            >
                              {student.sabuk_saat_ini?.name || "Tanpa Sabuk"}
                            </Badge>
                            <Badge
                              variant={
                                student.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs whitespace-nowrap hidden sm:inline-flex"
                            >
                              {student.status === "active"
                                ? "Aktif"
                                : "Nonaktif"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Summary & Action Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t mt-4">
                    <div className="text-sm text-neutral-600 text-center sm:text-left">
                      {selectedStudents.size > 0 ? (
                        <span className="font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                          {selectedStudents.size} murid dipilih untuk bergabung
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Belum ada murid yang dipilih
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                      <Link
                        href={`/admin/kelas/${classId}`}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          variant="outline"
                          type="button"
                          disabled={submitting}
                        >
                          Batal
                        </Button>
                      </Link>
                      <Button
                        onClick={handleAddStudents}
                        disabled={selectedStudents.size === 0 || submitting}
                        className="w-full sm:w-auto shadow-sm"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          `Konfirmasi Tambah ${selectedStudents.size} Murid`
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
