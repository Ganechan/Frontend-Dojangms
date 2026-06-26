"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/apiClient";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Clock, MapPin, Tag, Trophy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Kelas } from "@/types/admin/jadwal";

// Interface untuk data Kejuaraan berdasarkan response API
interface Kejuaraan {
  id: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
}

const DAYS = [
  { value: "senin", label: "Senin" },
  { value: "selasa", label: "Selasa" },
  { value: "rabu", label: "Rabu" },
  { value: "kamis", label: "Kamis" },
  { value: "jumat", label: "Jumat" },
  { value: "sabtu", label: "Sabtu" },
  { value: "minggu", label: "Minggu" },
];

const SCHEDULE_TYPES = [
  { value: "latihan_wajib", label: "Latihan Wajib" },
  { value: "kelas", label: "Kelas" },
  { value: "training_camp", label: "Training Camp" },
];

export function CreateScheduleForm() {
  const [scheduleType, setScheduleType] = useState<string>("latihan_wajib");
  const [isReplacement, setIsReplacement] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [kejuaraanList, setKejuaraanList] = useState<Kejuaraan[]>([]);
  const [isLoadingKelas, setIsLoadingKelas] = useState(false);
  const [isLoadingKejuaraan, setIsLoadingKejuaraan] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state (ditambahkan kejuaraan_id)
  const [formData, setFormData] = useState({
    tipe: "latihan_wajib",
    nama: "",
    jam_mulai: "",
    jam_selesai: "",
    lokasi: "",
    hari: "",
    effective_from: "",
    kelas_id: "",
    kejuaraan_id: "",
    tanggal: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });

  // Fetch kelas list
  useEffect(() => {
    const fetchKelas = async () => {
      setIsLoadingKelas(true);
      try {
        const data = await apiFetch<any>(
          "/api/admin/kelas/getallkelas?page=1&limit=100&status=aktif",
        );
        if (data.data) {
          setKelasList(data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch kelas:", error);
        toast.error(error.message || "Gagal mengambil data kelas");
      } finally {
        setIsLoadingKelas(false);
      }
    };

    fetchKelas();
  }, []);

  // Fetch kejuaraan list (hanya dipicu ketika tipe training_camp dipilih)
  useEffect(() => {
    if (scheduleType !== "training_camp") return;

    const fetchKejuaraan = async () => {
      setIsLoadingKejuaraan(true);
      try {
        const data = await apiFetch<any>(
          "/api/admin/kejuaraan/getall?page=1&limit=10&status=akan_datang",
        );
        if (data.success && data.data) {
          setKejuaraanList(data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch kejuaraan:", error);
        toast.error(error.message || "Gagal mengambil data kejuaraan");
      } finally {
        setIsLoadingKejuaraan(false);
      }
    };

    fetchKejuaraan();
  }, [scheduleType]);

  // Update form when schedule type changes
  useEffect(() => {
    setFormData({
      tipe: scheduleType,
      nama: "",
      jam_mulai: "",
      jam_selesai: "",
      lokasi: "",
      hari: "",
      effective_from: "",
      kelas_id: "",
      kejuaraan_id: "",
      tanggal: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
    });
    setErrors({});
  }, [scheduleType, isReplacement]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama jadwal harus diisi";
    }
    if (!formData.jam_mulai) {
      newErrors.jam_mulai = "Jam mulai harus diisi";
    }
    if (!formData.jam_selesai) {
      newErrors.jam_selesai = "Jam selesai harus diisi";
    }
    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi harus diisi";
    }

    if (scheduleType === "latihan_wajib") {
      if (!formData.hari) {
        newErrors.hari = "Hari harus dipilih";
      }
      if (!formData.effective_from) {
        newErrors.effective_from = "Tanggal efektif harus diisi";
      }
    } else if (scheduleType === "kelas") {
      if (!formData.kelas_id) {
        newErrors.kelas_id = "Kelas harus dipilih";
      }
      if (isReplacement) {
        if (!formData.tanggal) {
          newErrors.tanggal = "Tanggal harus diisi";
        }
      } else {
        if (!formData.hari) {
          newErrors.hari = "Hari harus dipilih";
        }
        if (!formData.effective_from) {
          newErrors.effective_from = "Tanggal efektif harus diisi";
        }
      }
    } else if (scheduleType === "training_camp") {
      if (!formData.kejuaraan_id) {
        newErrors.kejuaraan_id = "Kejuaraan harus dipilih";
      }
      if (!formData.tanggal_mulai) {
        newErrors.tanggal_mulai = "Tanggal mulai harus diisi";
      }
      if (!formData.tanggal_selesai) {
        newErrors.tanggal_selesai = "Tanggal selesai harus diisi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Auto fill lokasi dan tanggal berdasarkan kejuaraan yang dipilih (Opsional / Membantu User)
  const handleKejuaraanChange = (value: string) => {
    const selectedKejuaraan = kejuaraanList.find(
      (k) => k.id.toString() === value,
    );

    setFormData((prev) => ({
      ...prev,
      kejuaraan_id: value,
      lokasi: selectedKejuaraan ? selectedKejuaraan.location : prev.lokasi,
      tanggal_mulai: selectedKejuaraan
        ? selectedKejuaraan.start_date
        : prev.tanggal_mulai,
      tanggal_selesai: selectedKejuaraan
        ? selectedKejuaraan.end_date
        : prev.tanggal_selesai,
    }));

    if (errors.kejuaraan_id) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.kejuaraan_id;
        return newErrors;
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Prepare the payload based on schedule type
      let payload: any = {
        tipe: formData.tipe,
        nama: formData.nama,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        lokasi: formData.lokasi,
      };

      if (scheduleType === "latihan_wajib") {
        payload = {
          ...payload,
          hari: formData.hari,
          effective_from: formData.effective_from,
        };
      } else if (scheduleType === "kelas") {
        payload.kelas_id = Number(formData.kelas_id);
        if (isReplacement) {
          payload.tanggal = formData.tanggal;
        } else {
          payload.hari = formData.hari;
          payload.effective_from = formData.effective_from;
        }
      } else if (scheduleType === "training_camp") {
        payload = {
          ...payload,
          kejuaraan_id: Number(formData.kejuaraan_id),
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai,
        };
      }

      const data = await apiFetch<any>("/api/admin/jadwal/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success(data.message || "Jadwal berhasil dibuat");
      setFormData({
        tipe: scheduleType,
        nama: "",
        jam_mulai: "",
        jam_selesai: "",
        lokasi: "",
        hari: "",
        effective_from: "",
        kelas_id: "",
        kejuaraan_id: "",
        tanggal: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
      });
      setErrors({});
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      toast.error(error.message || "Terjadi kesalahan saat membuat jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-border/40 pb-6 mb-6">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Buat Jadwal Baru
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Tambahkan jadwal latihan wajib, kelas, atau training camp untuk sistem
          manajemen taekwondo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Kiri: Informasi Dasar */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-none mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Informasi Dasar
              </h3>

              {/* Schedule Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tipe Jadwal
                </label>
                <Select
                  value={scheduleType}
                  onValueChange={(value) => {
                    setScheduleType(value);
                    setIsReplacement(false);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kejuaraan Selection - Muncul khusus untuk Training Camp */}
              {scheduleType === "training_camp" && (
                <div className="space-y-2">
                  <label
                    htmlFor="kejuaraan_id"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4 text-primary" /> Pilih Kejuaraan
                  </label>
                  <Select
                    value={formData.kejuaraan_id}
                    onValueChange={handleKejuaraanChange}
                    disabled={isLoadingKejuaraan}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingKejuaraan
                            ? "Mengambil data..."
                            : "Pilih kejuaraan yang diikuti"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {kejuaraanList.map((kejuaraan) => (
                        <SelectItem
                          key={kejuaraan.id}
                          value={kejuaraan.id.toString()}
                        >
                          {kejuaraan.name} ({kejuaraan.level.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kejuaraan_id && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.kejuaraan_id}
                    </p>
                  )}
                </div>
              )}

              {/* Common Fields */}
              <div className="space-y-2">
                <label
                  htmlFor="nama"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nama Jadwal
                </label>
                <Input
                  id="nama"
                  name="nama"
                  placeholder={
                    scheduleType === "training_camp"
                      ? "Contoh: TC Persiapan Walikota Cup"
                      : "Contoh: Latihan Wajib - Senin"
                  }
                  value={formData.nama}
                  onChange={handleInputChange}
                />
                {errors.nama && (
                  <p className="mt-1 text-sm text-destructive">{errors.nama}</p>
                )}
              </div>

              {/* Kelas Selection - for Kelas type */}
              {scheduleType === "kelas" && (
                <div className="space-y-2">
                  <label
                    htmlFor="kelas_id"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Pilih Kelas
                  </label>
                  <Select
                    value={formData.kelas_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, kelas_id: value }))
                    }
                    disabled={isLoadingKelas}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {kelasList.map((kelas) => (
                        <SelectItem key={kelas.id} value={kelas.id.toString()}>
                          {kelas.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kelas_id && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.kelas_id}
                    </p>
                  )}
                </div>
              )}

              {/* Replacement Class Checkbox */}
              {scheduleType === "kelas" && (
                <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border/50">
                  <Checkbox
                    id="replacement"
                    checked={isReplacement}
                    onCheckedChange={(checked) =>
                      setIsReplacement(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="replacement"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Ini adalah Kelas Pengganti
                  </label>
                </div>
              )}

              {/* Day Selection - for Latihan Wajib and regular Kelas */}
              {(scheduleType === "latihan_wajib" ||
                (scheduleType === "kelas" && !isReplacement)) && (
                <div className="space-y-2">
                  <label
                    htmlFor="hari"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hari Pelaksanaan
                  </label>
                  <Select
                    value={formData.hari}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, hari: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih hari" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.hari && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.hari}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Kanan: Waktu & Lokasi */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-none mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Waktu & Lokasi
              </h3>

              {/* Effective From - for Latihan Wajib and regular Kelas */}
              {(scheduleType === "latihan_wajib" ||
                (scheduleType === "kelas" && !isReplacement)) && (
                <div className="space-y-2">
                  <label
                    htmlFor="effective_from"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    Tanggal Efektif{" "}
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  </label>
                  <Input
                    id="effective_from"
                    name="effective_from"
                    type="date"
                    value={formData.effective_from}
                    onChange={handleInputChange}
                  />
                  {errors.effective_from && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.effective_from}
                    </p>
                  )}
                </div>
              )}

              {/* Date for Replacement Class */}
              {scheduleType === "kelas" && isReplacement && (
                <div className="space-y-2">
                  <label
                    htmlFor="tanggal"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    Tanggal Kelas Pengganti{" "}
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  </label>
                  <Input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                  />
                  {errors.tanggal && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.tanggal}
                    </p>
                  )}
                </div>
              )}

              {/* Training Camp Dates */}
              {scheduleType === "training_camp" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="tanggal_mulai"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      Tanggal Mulai{" "}
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    </label>
                    <Input
                      id="tanggal_mulai"
                      name="tanggal_mulai"
                      type="date"
                      value={formData.tanggal_mulai}
                      onChange={handleInputChange}
                    />
                    {errors.tanggal_mulai && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.tanggal_mulai}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="tanggal_selesai"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      Tanggal Selesai{" "}
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    </label>
                    <Input
                      id="tanggal_selesai"
                      name="tanggal_selesai"
                      type="date"
                      value={formData.tanggal_selesai}
                      onChange={handleInputChange}
                    />
                    {errors.tanggal_selesai && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.tanggal_selesai}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Time Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="jam_mulai"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Jam Mulai
                  </label>
                  <Input
                    id="jam_mulai"
                    name="jam_mulai"
                    type="time"
                    value={formData.jam_mulai}
                    onChange={handleInputChange}
                  />
                  {errors.jam_mulai && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.jam_mulai}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="jam_selesai"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Jam Selesai
                  </label>
                  <Input
                    id="jam_selesai"
                    name="jam_selesai"
                    type="time"
                    value={formData.jam_selesai}
                    onChange={handleInputChange}
                  />
                  {errors.jam_selesai && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.jam_selesai}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="lokasi"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  Lokasi <MapPin className="w-4 h-4 text-muted-foreground" />
                </label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  placeholder="Contoh: Dojang Utama"
                  value={formData.lokasi}
                  onChange={handleInputChange}
                />
                {errors.lokasi && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.lokasi}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full sm:w-auto"
              size="lg"
              disabled={isSubmitting || isLoadingKelas || isLoadingKejuaraan}
            >
              {isSubmitting ? "Menyimpan Jadwal..." : "Simpan Jadwal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
