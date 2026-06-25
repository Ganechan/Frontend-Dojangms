"use client";

import { useState, useEffect } from "react";
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
import { SearchIcon, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { EditUserModal } from "@/components/admin/user/edit-user-modal";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status: string;
  created_at: string;
  roles: string[];
  belt: { name: string; achieved_at: string } | null;
}

interface Summary {
  total: number;
  total_murid: number;
  total_admin: number;
  total_pelatih: number;
}

interface Pagination {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
  });
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    total_murid: 0,
    total_admin: 0,
    total_pelatih: 0,
  });
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = (id: number) => {
    setEditUserId(id);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchUsers(pagination.page);
  };

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", pagination.limit.toString());
      params.append("status", statusFilter);
      if (roleFilter) params.append("role", roleFilter);
      if (searchTerm) params.append("search", searchTerm);
      const response = await fetch(`/api/admin/get/user?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memuat data");
      setUsers(data.data);
      setPagination(data.pagination);
      setSummary(data.summary);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearch = () => {
    fetchUsers(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "pelatih":
        return "default";
      case "murid":
        return "secondary";
      default:
        return "outline";
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
        <div className="flex flex-1 flex-col p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Manajemen User
              </h1>
              <p className="text-muted-foreground">
                Daftar semua pengguna sistem (admin, pelatih, murid)
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  Total User
                </p>
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  {summary.total}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  Murid
                </p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  {summary.total_murid}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  Pelatih
                </p>
                <p className="text-xl md:text-2xl font-bold text-indigo-600">
                  {summary.total_pelatih}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  Admin
                </p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">
                  {summary.total_admin}
                </p>
              </div>
            </div>

            {/* Toolbar & Filters */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  type="text"
                  placeholder="Cari nama, email, atau nomor telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-background"
                />
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={roleFilter === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter("")}
                  >
                    Semua Role
                  </Button>
                  <Button
                    variant={roleFilter === "murid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter("murid")}
                  >
                    Murid
                  </Button>
                  <Button
                    variant={roleFilter === "pelatih" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter("pelatih")}
                  >
                    Pelatih
                  </Button>
                  <Button
                    variant={roleFilter === "admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter("admin")}
                  >
                    Admin
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                  >
                    Aktif
                  </Button>
                  <Button
                    variant={
                      statusFilter === "inactive" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("inactive")}
                  >
                    Nonaktif
                  </Button>
                  {/* <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    Semua Status
                  </Button> */}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Sabuk</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Bergabung</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-muted-foreground"
                        >
                          Tidak ada data user
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {user.roles.map((role) => (
                                <Badge
                                  key={role}
                                  variant={getRoleBadgeVariant(role)}
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.belt ? (
                              <span>
                                {user.belt.name}
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({formatDate(user.belt.achieved_at)})
                                </span>
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.status === "active" ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="shadow-xs text-blue-600"
                              onClick={() => handleEditClick(user.id)}
                            >
                              <Edit className="w-4 h-4 mr-1.5" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.total_page > 1 && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  Halaman {pagination.page} dari {pagination.total_page}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(pagination.page - 1)}
                    disabled={!pagination.has_prev || loading}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(pagination.page + 1)}
                    disabled={!pagination.has_next || loading}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <EditUserModal
          userId={editUserId}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={handleEditSuccess}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
