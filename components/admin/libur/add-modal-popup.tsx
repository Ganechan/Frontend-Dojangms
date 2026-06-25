// components\admin\libur\add-modal-popup.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CalendarIcon, Loader2, Search, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SCHEDULE_TYPE_LABELS } from "@/types/admin/libur";

// ─── Tipe lokal untuk data jadwal dari API ──────────────────────────────────
interface JadwalItem {
  id: number;
  tipe: "latihan_wajib" | "kelas" | "training_camp";
  nama: string;
  hari: string | null;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  status: "aktif" | "nonaktif";
  kelas_nama: string | null;
}

interface JadwalApiResponse {
  message: string;
  data: JadwalItem[];
}

// ─── Pemetaan warna badge tipe jadwal ───────────────────────────────────────
const TIPE_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  latihan_wajib: "default",
  kelas: "secondary",
  training_camp: "outline",
};

const HARI_LABELS: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface AddHolidayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// ─── Komponen utama ──────────────────────────────────────────────────────────
export function AddHolidayModal({
  open,
  onOpenChange,
  onSuccess,
}: AddHolidayModalProps) {
  // — State data jadwal —
  const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);
  const [isLoadingJadwal, setIsLoadingJadwal] = useState(false);
  const [jadwalSearch, setJadwalSearch] = useState("");
  const [isJadwalOpen, setIsJadwalOpen] = useState(false);

  // — State form —
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalItem | null>(null);
  const [tanggal, setTanggal] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [keterangan, setKeterangan] = useState("");

  // — State submit —
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Fetch daftar jadwal saat modal terbuka ────────────────────────────────
  const fetchJadwal = useCallback(async () => {
    setIsLoadingJadwal(true);
    try {
      const res = await fetch("/api/admin/jadwal?limit=200&status=aktif");

      if (!res.ok) throw new Error("Gagal mengambil data jadwal");
      const result: JadwalApiResponse = await res.json();
      setJadwalList(result.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar jadwal");
    } finally {
      setIsLoadingJadwal(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchJadwal();
      // Reset form saat modal dibuka
      setSelectedJadwal(null);
      setTanggal(undefined);
      setKeterangan("");
      setJadwalSearch("");
    }
  }, [open, fetchJadwal]);

  // ─── Filter jadwal berdasarkan pencarian ──────────────────────────────────
  const filteredJadwal = jadwalList.filter((j) =>
    j.nama.toLowerCase().includes(jadwalSearch.toLowerCase()),
  );

  // ─── Submit form ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJadwal) {
      toast.error("Pilih jadwal terlebih dahulu");
      return;
    }
    if (!tanggal) {
      toast.error("Pilih tanggal libur terlebih dahulu");
      return;
    }
    if (!keterangan.trim()) {
      toast.error("Keterangan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        tanggal: format(tanggal, "yyyy-MM-dd"),
        keterangan: keterangan.trim(),
      };

      const res = await fetch(`/api/admin/jadwal/${selectedJadwal.id}/libur`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Gagal menyimpan data libur");
      }

      toast.success("Libur jadwal berhasil ditambahkan");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Helper: format jam (HH:MM:SS → HH:MM) ───────────────────────────────
  const formatJam = (jam: string) => jam.slice(0, 5);

  // ─── Helper: info jadwal terpilih ─────────────────────────────────────────
  const jadwalInfo = selectedJadwal
    ? [
        selectedJadwal.hari
          ? (HARI_LABELS[selectedJadwal.hari] ?? selectedJadwal.hari)
          : null,
        `${formatJam(selectedJadwal.jam_mulai)} – ${formatJam(selectedJadwal.jam_selesai)}`,
        selectedJadwal.lokasi,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Tambah Libur Jadwal
          </DialogTitle>
          <DialogDescription>
            Pilih jadwal dan tentukan tanggal libur beserta keterangannya.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* ── 1. Pilih Jadwal ── */}
          <div className="space-y-2">
            <Label htmlFor="jadwal-trigger">
              Jadwal <span className="text-destructive">*</span>
            </Label>

            <Popover open={isJadwalOpen} onOpenChange={setIsJadwalOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="jadwal-trigger"
                  variant="outline"
                  role="combobox"
                  aria-expanded={isJadwalOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedJadwal ? (
                    <span className="flex items-center gap-2 truncate">
                      <Badge
                        variant={
                          TIPE_BADGE_VARIANT[selectedJadwal.tipe] ?? "outline"
                        }
                        className="shrink-0 text-xs"
                      >
                        {SCHEDULE_TYPE_LABELS[selectedJadwal.tipe] ??
                          selectedJadwal.tipe}
                      </Badge>
                      <span className="truncate">{selectedJadwal.nama}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Pilih jadwal…</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                {/* Kotak pencarian */}
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Cari nama jadwal…"
                    value={jadwalSearch}
                    onChange={(e) => setJadwalSearch(e.target.value)}
                  />
                </div>

                {/* Daftar jadwal */}
                <div className="max-h-60 overflow-y-auto py-1">
                  {isLoadingJadwal ? (
                    <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memuat jadwal…
                    </div>
                  ) : filteredJadwal.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Jadwal tidak ditemukan.
                    </div>
                  ) : (
                    filteredJadwal.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        className={cn(
                          "flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          selectedJadwal?.id === j.id &&
                            "bg-accent text-accent-foreground",
                        )}
                        onClick={() => {
                          setSelectedJadwal(j);
                          setIsJadwalOpen(false);
                          setJadwalSearch("");
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Badge
                            variant={TIPE_BADGE_VARIANT[j.tipe] ?? "outline"}
                            className="text-xs"
                          >
                            {SCHEDULE_TYPE_LABELS[j.tipe] ?? j.tipe}
                          </Badge>
                          <span className="font-medium truncate">{j.nama}</span>
                        </span>
                        <span className="text-xs text-muted-foreground pl-0.5">
                          {[
                            j.hari ? (HARI_LABELS[j.hari] ?? j.hari) : null,
                            `${formatJam(j.jam_mulai)} – ${formatJam(j.jam_selesai)}`,
                            j.lokasi,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Info singkat jadwal terpilih */}
            {selectedJadwal && jadwalInfo && (
              <p className="text-xs text-muted-foreground px-0.5">
                {jadwalInfo}
              </p>
            )}
          </div>

          {/* ── 2. Tanggal Libur ── */}
          <div className="space-y-2">
            <Label htmlFor="tanggal-trigger">
              Tanggal Libur <span className="text-destructive">*</span>
            </Label>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="tanggal-trigger"
                  variant="outline"
                  className={cn(
                    "w-full justify-start font-normal",
                    !tanggal && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggal
                    ? format(tanggal, "EEEE, dd MMMM yyyy", {
                        locale: localeId,
                      })
                    : "Pilih tanggal…"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={(date) => {
                    setTanggal(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* ── 3. Keterangan ── */}
          <div className="space-y-2">
            <Label htmlFor="keterangan">
              Keterangan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="keterangan"
              placeholder="Contoh: Libur Hari Raya Idul Fitri"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* ── Footer tombol ── */}
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Menyimpan…" : "Simpan Libur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
