"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Users,
  Award,
  PhoneIcon,
  MailIcon,
  Calendar,
  MapPin,
} from "lucide-react";

import type { CoachDetail } from "@/types/admin/pelatih";

interface CoachCardProps {
  coach: CoachDetail;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Aktif";
    case "inactive":
      return "Tidak Aktif";
    case "suspended":
      return "Ditangguhkan";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "active":
      return "border-transparent bg-emerald-100 text-emerald-800";
    case "inactive":
      return "border-transparent bg-slate-100 text-slate-800";
    case "suspended":
      return "border-transparent bg-rose-100 text-rose-800";
    default:
      return "border-transparent bg-blue-100 text-blue-800";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CoachCard({ coach }: CoachCardProps) {
  return (
    <div className="space-y-6">
      {/* ── Informasi Dasar ── */}
      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{coach.name}</h1>
            <p className="text-muted-foreground mt-2">
              {coach.jenis_kelamin === "laki-laki"
                ? "Pelatih Laki-laki"
                : "Pelatih Perempuan"}
            </p>
          </div>
          <Badge className={getStatusClass(coach.status)}>
            {getStatusLabel(coach.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Email
            </p>
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-primary" />
              <a
                href={`mailto:${coach.email}`}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {coach.email}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Nomor Telepon
            </p>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-primary" />
              <a
                href={`tel:${coach.phone}`}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {coach.phone}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Tanggal Lahir
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                {formatDate(coach.tanggal_lahir)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Tanggal Bergabung
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                {formatDate(coach.tanggal_bergabung)}
              </span>
            </div>
          </div>
        </div>

        {coach.alamat && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Alamat
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-sm text-foreground">{coach.alamat}</p>
            </div>
          </div>
        )}
      </Card>

      {/* ── Informasi Keahlian ── */}
      <Card className="p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Informasi Keahlian
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              Sabuk Saat Ini
            </p>
            {coach.sabuk_saat_ini ? (
              <Badge className="bg-primary text-primary-foreground text-sm py-1.5 px-3">
                {coach.sabuk_saat_ini.name}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada data</p>
            )}
          </div>

          {coach.pelatih.spesialisasi && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                Spesialisasi
              </p>
              <p className="text-sm text-foreground">
                {coach.pelatih.spesialisasi}
              </p>
            </div>
          )}

          {coach.pelatih.sertifikasi && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                Sertifikasi
              </p>
              <p className="text-sm text-foreground">
                {coach.pelatih.sertifikasi}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Statistik Mengajar ── */}
      <Card className="p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Statistik Mengajar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Award className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold text-blue-600 uppercase">
                Total Kelas
              </p>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {coach.kelas_diampu.length}
            </p>
          </div>

          <div className="p-6 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-600 uppercase">
                Total Murid
              </p>
            </div>
            <p className="text-4xl font-bold text-emerald-600">
              {coach.total_murid}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Daftar Kelas ── */}
      {coach.kelas_diampu.length > 0 && (
        <Card className="p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Daftar Kelas yang Diampu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coach.kelas_diampu.map((kelas) => (
              <div
                key={kelas.id}
                className="p-4 bg-secondary rounded-lg border border-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{kelas.nama}</p>
                  <Badge variant="outline" className="text-xs">
                    {kelas.jumlah_murid} murid
                  </Badge>
                </div>

                {kelas.jadwal.length > 0 && (
                  <div className="space-y-1">
                    {kelas.jadwal.map((j, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground">
                        {j.hari} • {j.jam_mulai}–{j.jam_selesai}
                        {j.lokasi ? ` • ${j.lokasi}` : ""}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
