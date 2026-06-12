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

interface AddStudentsDialogProps {
  classId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddStudentsDialog({
  classId,
  open,
  onOpenChange,
}: AddStudentsDialogProps) {
  const [candidates, setCandidates] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch candidate students
  useEffect(() => {
    if (open && classId) {
      fetchCandidates();
    }
  }, [open, classId]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/admin/kelas/${classId}/calon-murid`,
      );
      const data = await response.json();
      setCandidates(data.data || []);
      setSelectedStudents(new Set());
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search
  const filteredStudents = candidates.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle student selection
  const toggleStudent = (studentId: number) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  // Select all students
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

  // Handle form submission
  const handleAddStudents = async () => {
    if (selectedStudents.size === 0) return;

    try {
      setSubmitting(true);
      const response = await fetch(
        "http://localhost:3001/api/admin/kelas/bulkaddmurid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kelas_id: classId,
            user_ids: Array.from(selectedStudents),
          }),
        },
      );

      if (response.ok) {
        setSelectedStudents(new Set());
        setSearchTerm("");
        onOpenChange(false);
        // Optional: Show success message
        console.log("Students added successfully");
      } else {
        console.error("Failed to add students");
      }
    } catch (error) {
      console.error("Error adding students:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Murid ke Kelas</DialogTitle>
          <DialogDescription>
            Pilih satu atau lebih murid untuk ditambahkan ke kelas ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4"
              data-icon="inline-start"
            />
            <Input
              type="text"
              placeholder="Cari nama atau email murid..."
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
                filteredStudents.length > 0 &&
                selectedStudents.size === filteredStudents.length
              }
              onChange={selectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium cursor-pointer"
            >
              Pilih Semua ({filteredStudents.length})
            </label>
          </div>

          {/* Students List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Memuat data murid...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {candidates.length === 0
                  ? "Tidak ada murid tersedia"
                  : "Tidak ada hasil pencarian"}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.has(student.id)}
                    onChange={() => toggleStudent(student.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`student-${student.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {student.name}
                    </label>
                    <div className="text-xs text-muted-foreground space-y-1 mt-1">
                      <p>{student.email}</p>
                      <p>{student.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {student.sabuk_saat_ini.name}
                    </Badge>
                    <Badge
                      variant={
                        student.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs whitespace-nowrap"
                    >
                      {student.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selection Summary */}
          {selectedStudents.size > 0 && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium text-foreground">
                {selectedStudents.size} murid dipilih
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleAddStudents}
            disabled={selectedStudents.size === 0 || submitting}
            type="submit"
          >
            {submitting
              ? "Menambahkan..."
              : `Tambah ${selectedStudents.size} Murid`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
