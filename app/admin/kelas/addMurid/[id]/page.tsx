"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon, Trash2, ArrowLeft, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DeleteStudentDialog from "@/components/admin/kelas/delete-student-dialog";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status_user: "active" | "inactive";
  tanggal_bergabung: string;
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
  has_next: boolean;
  has_prev: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 200];

export default function StudentsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set(),
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch students menggunakan route handler internal
  const fetchStudents = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/kelas/${classId}/murid?page=${page}&limit=${pageSize}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setStudents(data.data || []);
      setPagination({
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_page: data.pagination.total_page,
        total_data: data.pagination.total_data,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      });
      setSelectedStudents(new Set());
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data murid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) fetchStudents();
  }, [classId, pageSize]);

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    return matchesSearch;
  });

  const toggleStudentSelection = (studentId: number) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) newSelected.delete(studentId);
    else newSelected.add(studentId);
    setSelectedStudents(newSelected);
  };

  const toggleSelectAll = () => {
    if (
      selectedStudents.size === filteredStudents.length &&
      filteredStudents.length > 0
    ) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleDeleteStudent = (studentId: number) => {
    setStudentToDelete(studentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.size > 0) {
      setStudentToDelete(-1); // -1 menandakan bulk delete
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async (studentIds: number[]) => {
    if (studentIds.length === 0) return;
    setIsDeleting(true);
    try {
      if (studentIds.length === 1) {
        // Single delete
        const response = await fetch("/api/admin/kelas/softdeletemurid", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kelas_id: classId, user_id: studentIds[0] }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success("Murid berhasil dihapus dari kelas");
      } else {
        // Bulk delete
        const response = await fetch("/api/admin/kelas/softdeletemurid/bulk", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kelas_id: classId, user_ids: studentIds }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success(`${studentIds.length} murid berhasil dihapus dari kelas`);
      }
      await fetchStudents(1);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menghapus murid");
    } finally {
      setIsDeleting(false);
    }
  };

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

        {/* Main Workspace Wrapper */}
        <div className="flex flex-1 flex-col bg-neutral-50/50">
          <div className="@container/main mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-3 border-b pb-5">
              <div>
                <Link href="/admin/kelas/addMurid">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-neutral-600 hover:text-neutral-900 -ml-2 mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                    Kembali ke Kelas
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                  Daftar Murid Kelas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Lihat data lengkap murid aktif, kelola keanggotaan kelas, atau
                  hapus distribusi alokasi program.
                </p>
              </div>
            </div>

            {/* Toolbar Filters Card */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-sm space-y-4">
              {/* Search Bar Input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                <Input
                  type="text"
                  placeholder="Cari murid berdasarkan nama, email, atau nomor telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-neutral-50/30 focus-visible:bg-white"
                />
              </div>

              {/* Controls Toolbar Segment */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500">
                    Tampilkan:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size} Data
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  {/* Total Badges */}
                  <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 bg-neutral-100/80 px-3 py-1.5 rounded-md border border-neutral-200/40">
                    <Users className="size-3.5 text-neutral-400" />
                    <span>
                      Total:{" "}
                      <strong className="text-neutral-900">
                        {pagination.total_data}
                      </strong>{" "}
                      Murid
                    </span>
                  </div>

                  {/* Bulk Delete Action Button */}
                  {selectedStudents.size > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                      disabled={isDeleting}
                      className="h-8 shadow-sm font-medium animate-in fade-in-50 duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
                      Hapus Selected ({selectedStudents.size})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Data Table View */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-50/70 border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12 py-3 pl-4">
                      <Checkbox
                        checked={
                          selectedStudents.size === filteredStudents.length &&
                          filteredStudents.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-neutral-700">
                      Nama
                    </TableHead>
                    <TableHead className="font-semibold text-neutral-700">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-neutral-700">
                      Telepon
                    </TableHead>
                    <TableHead className="font-semibold text-neutral-700">
                      Tanggal Lahir
                    </TableHead>
                    <TableHead className="font-semibold text-neutral-700">
                      Sabuk
                    </TableHead>
                    <TableHead className="font-semibold text-neutral-700">
                      Status
                    </TableHead>
                    <TableHead className="text-right font-semibold text-neutral-700 pr-4">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="size-5 animate-spin text-neutral-400" />
                          <span className="text-sm font-medium">
                            Sinkronisasi data murid...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-40 text-center text-muted-foreground font-medium"
                      >
                        Tidak ada murid yang terdeteksi dalam kriteria ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        className="hover:bg-neutral-50/40 transition-colors"
                      >
                        <TableCell className="py-4 pl-4">
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onCheckedChange={() =>
                              toggleStudentSelection(student.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-neutral-900 py-4">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-neutral-600 text-sm py-4">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-neutral-600 text-sm py-4">
                          {student.phone}
                        </TableCell>
                        <TableCell className="text-neutral-600 text-sm py-4">
                          {new Date(student.tanggal_lahir).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="bg-neutral-50 font-medium px-2 py-0.5"
                          >
                            {student.sabuk_saat_ini.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={
                              student.status_user === "active"
                                ? "default"
                                : "secondary"
                            }
                            className="shadow-none font-medium px-2.5 py-0.5"
                          >
                            {student.status_user === "active"
                              ? "Aktif"
                              : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4 pr-4">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteStudent(student.id)}
                            disabled={isDeleting}
                            className="h-8 shadow-sm font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls Section */}
            {!loading && pagination.total_page > 1 && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-neutral-500 font-medium">
                  Halaman{" "}
                  <span className="text-neutral-900">
                    {pagination.current_page}
                  </span>{" "}
                  dari{" "}
                  <span className="text-neutral-900">
                    {pagination.total_page}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchStudents(pagination.current_page - 1)}
                    disabled={!pagination.has_prev || loading}
                    className="shadow-none"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchStudents(pagination.current_page + 1)}
                    disabled={!pagination.has_next || loading}
                    className="shadow-none"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Dialog Overlay Component */}
        {studentToDelete !== null && (
          <DeleteStudentDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            studentCount={studentToDelete === -1 ? selectedStudents.size : 1}
            isBulk={studentToDelete === -1}
            onConfirm={() => {
              if (studentToDelete === -1) {
                handleConfirmDelete(Array.from(selectedStudents));
              } else {
                handleConfirmDelete([studentToDelete]);
              }
            }}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
