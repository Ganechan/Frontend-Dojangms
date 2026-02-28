// components/client/admin/kejuaraan/championship-dashboard-client.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChampionshipTable } from "@/components/admin/kejuaraan/championship-table";
import { toast } from "sonner";

interface Championship {
  id: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
  status: "akan datang" | "berlangsung" | "selesai";
}

export function ChampionshipDashboardClient() {
  const router = useRouter();
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchChampionships();
  }, [currentPage, limit]);

  const fetchChampionships = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/admin/get/championship?limit=${limit}&page=${currentPage}`,
      );
      const result = await response.json();

      if (result.data) {
        setChampionships(result.data);
        setTotalItems(result.total || result.data.length);
      }
    } catch (error) {
      console.error("Error fetching championships:", error);
      toast.error("Gagal mengambil data kejuaraan");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    router.push("/admin/kejuaraan/add");
  };

  const handleEditClick = (championship: Championship) => {
    router.push(`/admin/kejuaraan/edit/${championship.id}`);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kejuaraan ini?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/delete/championship/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Gagal menghapus kejuaraan");
      }

      toast.success("Kejuaraan berhasil dihapus");
      fetchChampionships();
    } catch (error) {
      console.error("Error deleting championship:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus kejuaraan",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
          <p className="mt-4 text-gray-600">Memuat data kejuaraan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Kejuaraan</h1>
        <p className="text-gray-600 mt-2">
          Kelola dan monitor semua kejuaraan taekwondo
        </p>
      </div>
      <ChampionshipTable
        data={championships}
        totalItems={totalItems}
        currentPage={currentPage}
        limit={limit}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        selectedStatus={selectedStatus}
        onStatusFilterChange={setSelectedStatus}
        onPageChange={setCurrentPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}
