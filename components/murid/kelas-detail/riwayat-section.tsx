"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ClipboardList } from "lucide-react";
import { AbsensiBadge } from "./absensi-badge";
import { formatTanggalSingkat } from "@/types/murid/format";
import type { AbsensiStatusFilter, RiwayatAbsensi } from "@/types/murid/kelas";

const STATUS_OPTIONS: { value: AbsensiStatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "hadir", label: "Hadir" },
  { value: "izin", label: "Izin" },
  { value: "sakit", label: "Sakit" },
  { value: "alpha", label: "Alpha" },
];

function RiwayatEmptyState() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ClipboardList
            className="h-7 w-7 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">Belum ada riwayat absensi</h3>
          <p className="text-sm text-muted-foreground">
            Riwayat absensi akan muncul setelah latihan berlangsung.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiwayatSection({ riwayat }: { riwayat: RiwayatAbsensi[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AbsensiStatusFilter>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return riwayat.filter((item) => {
      const matchStatus = status === "all" || item.status === status;
      const matchSearch =
        !query || item.jadwal_nama.toLowerCase().includes(query);
      return matchStatus && matchSearch;
    });
  }, [riwayat, search, status]);

  const formatJam = (jam: string | undefined) => {
    if (!jam) return "-";
    // Jika format HH:MM:SS, ambil 5 karakter pertama
    return jam.length > 5 ? jam.substring(0, 5) : jam;
  };

  return (
    <section className="flex flex-col gap-4" aria-labelledby="riwayat-heading">
      <div className="flex flex-col gap-1">
        <h2
          id="riwayat-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Riwayat Absensi
        </h2>
        <p className="text-sm text-muted-foreground">
          Daftar kehadiran Anda pada kelas ini.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari jadwal..."
            className="pl-9"
            aria-label="Cari jadwal absensi"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as AbsensiStatusFilter)}
        >
          <SelectTrigger
            className="sm:w-44"
            aria-label="Filter status kehadiran"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {riwayat.length === 0 ? (
        <RiwayatEmptyState />
      ) : filtered.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada riwayat yang cocok dengan filter.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.absensi_id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {formatTanggalSingkat(item.tanggal)}
                    </TableCell>
                    <TableCell>{item.jadwal_nama}</TableCell>
                    <TableCell>{item.hari}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {item.jam_mulai && item.jam_selesai
                        ? `${formatJam(item.jam_mulai)} - ${formatJam(item.jam_selesai)}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <AbsensiBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.catatan || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((item) => (
              <Card key={item.absensi_id} className="shadow-sm">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{item.jadwal_nama}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatTanggalSingkat(item.tanggal)} &middot;{" "}
                        {item.hari}
                      </span>
                    </div>
                    <AbsensiBadge status={item.status} />
                  </div>
                  <div className="flex flex-col gap-1 border-t pt-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Jam</span>
                      <span className="tabular-nums">
                        {item.jam_mulai && item.jam_selesai
                          ? `${formatJam(item.jam_mulai)} - ${formatJam(item.jam_selesai)}`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Catatan</span>
                      <span className="text-right">{item.catatan || "-"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function RiwayatSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 sm:w-44" />
      </div>
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
