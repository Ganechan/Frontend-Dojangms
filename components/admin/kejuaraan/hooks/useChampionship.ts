import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface Championship {
  id: number;
  name: string;
  level: "kota" | "provinsi" | "nasional" | "internasional";
  location: string;
  start_date: string;
  end_date: string;
}

export interface FormData {
  name: string;
  level: "kota" | "provinsi" | "nasional" | "internasional";
  location: string;
  start_date: Date | null;
  end_date: Date | null;
}

export const LEVEL_OPTIONS = [
  { value: "kota", label: "Kota" },
  { value: "provinsi", label: "Provinsi" },
  { value: "nasional", label: "Nasional" },
  { value: "internasional", label: "Internasional" },
] as const;

export const LEVEL_COLORS: Record<string, string> = {
  kota: "bg-blue-100 text-blue-800",
  provinsi: "bg-yellow-100 text-yellow-800",
  nasional: "bg-orange-100 text-orange-800",
  internasional: "bg-red-100 text-red-800",
};

export const DEFAULT_FORM_DATA: FormData = {
  name: "",
  level: "provinsi",
  location: "",
  start_date: null,
  end_date: null,
};

export function useChampionship() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [championships, setChampionships] = useState<Championship[]>([]);
  const [filteredChampionships, setFilteredChampionships] = useState<
    Championship[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChampionship, setSelectedChampionship] =
    useState<Championship | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all championships
  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BASE_URL}/api/admin/get/championship`);
        if (!response.ok) throw new Error("Failed to fetch championships");
        const result = await response.json();
        setChampionships(result.data || []);
        setFilteredChampionships(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Gagal memuat data kejuaraan");
      } finally {
        setLoading(false);
      }
    };
    fetchChampionships();
  }, []);

  // Filter championships by search query
  useEffect(() => {
    const filtered = championships.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredChampionships(filtered);
    setCurrentPage(1);
  }, [searchQuery, championships]);

  // Dialog handlers
  const handleAddClick = () => {
    setSelectedChampionship(null);
    setFormData(DEFAULT_FORM_DATA);
    setIsDialogOpen(true);
  };

  const handleEditClick = (championship: Championship) => {
    setSelectedChampionship(championship);
    setFormData({
      name: championship.name,
      level: championship.level,
      location: championship.location,
      start_date: new Date(championship.start_date),
      end_date: new Date(championship.end_date),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (championship: Championship) => {
    setSelectedChampionship(championship);
    setIsDeleteDialogOpen(true);
  };

  const handleDetailClick = (championship: Championship) => {
    router.push(`/admin/kejuaraan/${championship.id}`);
  };

  // API calls
  const handleCreateChampionship = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/create/championship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        level: formData.level,
        location: formData.location,
        start_date: format(formData.start_date!, "yyyy-MM-dd"),
        end_date: format(formData.end_date!, "yyyy-MM-dd"),
      }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.message || "Gagal menambahkan kejuaraan");
    }
    const result = await response.json();
    setChampionships((prev) => [...prev, result.data]);
    toast.success("Kejuaraan berhasil ditambahkan");
  };

  const handleUpdateChampionship = async () => {
    const response = await fetch(
      `${BASE_URL}/api/admin/update/championship/${selectedChampionship!.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          level: formData.level,
          location: formData.location,
          start_date: format(formData.start_date!, "yyyy-MM-dd"),
          end_date: format(formData.end_date!, "yyyy-MM-dd"),
        }),
      },
    );
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.message || "Gagal memperbarui kejuaraan");
    }
    const result = await response.json();
    setChampionships((prev) =>
      prev.map((c) => (c.id === selectedChampionship!.id ? result.data : c)),
    );
    toast.success("Kejuaraan berhasil diperbarui");
  };

  const handleSaveChampionship = async () => {
    if (!formData.name.trim()) return toast.error("Nama kejuaraan harus diisi");
    if (!formData.location.trim()) return toast.error("Lokasi harus diisi");
    if (!formData.start_date) return toast.error("Tanggal mulai harus dipilih");
    if (!formData.end_date) return toast.error("Tanggal akhir harus dipilih");

    setIsSubmitting(true);
    try {
      if (selectedChampionship) {
        await handleUpdateChampionship();
      } else {
        await handleCreateChampionship();
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan kejuaraan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedChampionship) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/delete/championship/${selectedChampionship.id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } },
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.message || "Gagal menghapus kejuaraan");
      }
      setChampionships((prev) =>
        prev.filter((c) => c.id !== selectedChampionship.id),
      );
      toast.success("Kejuaraan berhasil dihapus");
      setIsDeleteDialogOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus kejuaraan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    championships,
    filteredChampionships,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedChampionship,
    isSubmitting,
    formData,
    setFormData,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    // Handlers
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleDetailClick,
    handleSaveChampionship,
    handleConfirmDelete,
  };
}
