// components\admin\pelatih\pelatih-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Award, PhoneIcon, MailIcon, Calendar } from "lucide-react";

interface CoachData {
  id: number;
  name: string;
  email: string;
  phone: string;
  jenis_kelamin: string;
  tanggal_bergabung: string;
  status: string;
  pelatih: {
    spesialisasi: string | null;
    sertifikasi: string | null;
  };
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
  kelas_diampu: string[];
  total_murid: number;
  foto: string | null;
}

interface CoachCardProps {
  coach: CoachData;
}

export function CoachCard({ coach }: CoachCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header dengan nama dan status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {coach.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {coach.jenis_kelamin === "laki-laki"
                ? "Pelatih Laki-laki"
                : "Pelatih Perempuan"}
            </p>
          </div>
          <Badge className={getStatusColor(coach.status)}>
            {coach.status === "active" ? "Aktif" : coach.status}
          </Badge>
        </div>

        {/* Informasi Kontak */}
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MailIcon className="h-4 w-4" />
            <a href={`mailto:${coach.email}`} className="hover:text-primary">
              {coach.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PhoneIcon className="h-4 w-4" />
            <a href={`tel:${coach.phone}`} className="hover:text-primary">
              {coach.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Bergabung: {formatDate(coach.tanggal_bergabung)}</span>
          </div>
        </div>

        {/* Sabuk dan Spesialisasi */}
        <div className="space-y-3 mb-6 pb-6 border-b">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Sabuk Saat Ini
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">
              {coach.sabuk_saat_ini.name}
            </p>
          </div>

          {coach.pelatih.spesialisasi && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Spesialisasi
              </p>
              <p className="text-sm text-foreground mt-1">
                {coach.pelatih.spesialisasi}
              </p>
            </div>
          )}

          {coach.pelatih.sertifikasi && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Sertifikasi
              </p>
              <p className="text-sm text-foreground mt-1">
                {coach.pelatih.sertifikasi}
              </p>
            </div>
          )}
        </div>

        {/* Kelas dan Murid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Kelas
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {coach.kelas_diampu.length}
            </p>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Murid
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {coach.total_murid}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
