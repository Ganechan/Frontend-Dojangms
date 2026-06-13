"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "lucide-react";

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

interface AddTrainersDialogProps {
  classId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTrainersDialog({
  classId,
  open,
  onOpenChange,
}: AddTrainersDialogProps) {
  const [candidates, setCandidates] = useState<Trainer[]>([]);
  const [selectedTrainers, setSelectedTrainers] = useState<Set<number>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch candidate trainers
  useEffect(() => {
    if (open && classId) {
      fetchCandidates();
    }
  }, [open, classId]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3001/api/admin/kelas/${classId}/calon-pelatih`,
      );
      const data = await response.json();
      setCandidates(data.data || []);
      setSelectedTrainers(new Set());
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Gagal memuat data pelatih");
    } finally {
      setLoading(false);
    }
  };

  // Filter trainers based on search
  const filteredTrainers = candidates.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.spesialisasi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle trainer selection
  const toggleTrainer = (trainerId: number) => {
    const newSelected = new Set(selectedTrainers);
    if (newSelected.has(trainerId)) {
      newSelected.delete(trainerId);
    } else {
      newSelected.add(trainerId);
    }
    setSelectedTrainers(newSelected);
  };

  // Select all trainers
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

  // Handle form submission
  const handleAddTrainers = async () => {
    if (selectedTrainers.size === 0) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await fetch(
        "http://localhost:3001/api/admin/kelas/bulkaddpelatih",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kelas_id: classId,
            user_ids: Array.from(selectedTrainers),
          }),
        },
      );

      if (response.ok) {
        setSelectedTrainers(new Set());
        setSearchTerm("");
        onOpenChange(false);
      } else {
        setError("Gagal menambahkan pelatih");
      }
    } catch (error) {
      console.error("Error adding trainers:", error);
      setError("Terjadi kesalahan saat menambahkan pelatih");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pelatih ke Kelas</DialogTitle>
          <DialogDescription>
            Pilih satu atau lebih pelatih untuk ditambahkan ke kelas ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-md p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4"
              data-icon="inline-start"
            />
            <Input
              type="text"
              placeholder="Cari nama, email, atau spesialisasi pelatih..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Checkbox
              id="select-all"
              checked={
                filteredTrainers.length > 0 &&
                selectedTrainers.size === filteredTrainers.length
              }
              onChange={selectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium cursor-pointer"
            >
              Pilih Semua ({filteredTrainers.length})
            </label>
          </div>

          {/* Trainers List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Memuat data pelatih...
              </div>
            ) : filteredTrainers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {candidates.length === 0
                  ? "Tidak ada pelatih tersedia"
                  : "Tidak ada hasil pencarian"}
              </div>
            ) : (
              filteredTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={`trainer-${trainer.id}`}
                    checked={selectedTrainers.has(trainer.id)}
                    onChange={() => toggleTrainer(trainer.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`trainer-${trainer.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {trainer.name}
                    </label>
                    <div className="text-xs text-muted-foreground space-y-1 mt-1">
                      <p>{trainer.email}</p>
                      <p>{trainer.phone}</p>
                      <p className="text-xs font-medium text-foreground">
                        Spesialisasi: {trainer.spesialisasi}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {trainer.sabuk_saat_ini.name}
                    </Badge>
                    <Badge
                      variant={
                        trainer.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs whitespace-nowrap"
                    >
                      {trainer.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selection Summary */}
          {selectedTrainers.size > 0 && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium text-foreground">
                {selectedTrainers.size} pelatih dipilih
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleAddTrainers}
            disabled={selectedTrainers.size === 0 || submitting}
            type="submit"
          >
            {submitting
              ? "Menambahkan..."
              : `Tambah ${selectedTrainers.size} Pelatih`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
