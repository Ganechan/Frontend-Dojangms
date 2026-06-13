"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditExamModalProps {
  examId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditExamModal({
  examId,
  isOpen,
  onClose,
  onSuccess,
}: EditExamModalProps) {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [levelUjian, setLevelUjian] = useState<"kota" | "provinsi">("kota");
  const [tanggal, setTanggal] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [status, setStatus] = useState("terjadwal");

  // Ambil detail data saat modal dibuka - gunakan route handler internal
  useEffect(() => {
    if (isOpen && examId) {
      const fetchExamDetail = async () => {
        try {
          setLoadingFetch(true);
          const response = await fetch(
            `/api/admin/ujian-kenaikan-sabuk/${examId}`,
          );
          const resJson = await response.json();

          if (!response.ok)
            throw new Error(resJson.message || "Gagal mengambil detail ujian");

          const examData = resJson.data;
          setLevelUjian(examData.level_ujian);
          setLokasi(examData.lokasi);
          setKeterangan(examData.keterangan);
          setStatus(examData.status);

          // Mapping tanggal dari database ke form state
          if (examData.level_ujian === "kota") {
            setTanggal(examData.tanggal_mulai || "");
          } else {
            setTanggalMulai(examData.tanggal_mulai || "");
            setTanggalSelesai(examData.tanggal_selesai || "");
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || "Gagal memuat data ujian");
          onClose();
        } finally {
          setLoadingFetch(false);
        }
      };

      fetchExamDetail();
    }
  }, [isOpen, examId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) return;

    // Susun payload dinamis sesuai aturan level ujian
    let payload: Record<string, any> = {
      level_ujian: levelUjian,
      lokasi,
      keterangan,
      status,
    };

    if (levelUjian === "kota") {
      payload.tanggal = tanggal;
    } else {
      payload.tanggal_mulai = tanggalMulai;
      payload.tanggal_selesai = tanggalSelesai;
    }

    try {
      setSubmitting(true);
      // Gunakan relative path ke route handler internal
      const response = await fetch(
        `/api/admin/ujian-kenaikan-sabuk/${examId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message || "Gagal memperbarui ujian");

      toast.success("Data ujian kenaikan sabuk berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ubah Ujian Kenaikan Sabuk</DialogTitle>
          <DialogDescription>
            Perbarui informasi pelaksanaan ujian kenaikan sabuk di bawah ini.
          </DialogDescription>
        </DialogHeader>

        {loadingFetch ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Level Ujian */}
            <div className="space-y-1.5">
              <Label htmlFor="level_ujian">Level Ujian</Label>
              <Select
                value={levelUjian}
                onValueChange={(value: "kota" | "provinsi") =>
                  setLevelUjian(value)
                }
              >
                <SelectTrigger id="level_ujian">
                  <SelectValue placeholder="Pilih level ujian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kota">Kota</SelectItem>
                  <SelectItem value="provinsi">Provinsi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Render Tanggal Dinamis Berdasarkan Tipe */}
            {levelUjian === "kota" ? (
              <div className="space-y-1.5">
                <Label htmlFor="tanggal">Tanggal Pelaksanaan</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                  <Input
                    id="tanggal_mulai"
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                  <Input
                    id="tanggal_selesai"
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Lokasi */}
            <div className="space-y-1.5">
              <Label htmlFor="lokasi">Lokasi Tempat</Label>
              <Input
                id="lokasi"
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: GOR Salatiga"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terjadwal">Terjadwal</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Keterangan */}
            <div className="space-y-1.5">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Tambahkan info tambahan..."
                rows={3}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
