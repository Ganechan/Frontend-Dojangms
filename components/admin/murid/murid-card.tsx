// components/admin/murid/murid-card.tsx
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PhoneIcon, MailIcon, Calendar, Award, ClockIcon } from "lucide-react";

import type { MuridDetail } from "@/types/admin/murid";

interface MuridCardProps {
  murid: MuridDetail;
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

export function MuridCard({ murid }: MuridCardProps) {
  return (
    <>
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {murid.name}
              </h1>
              <p className="text-muted-foreground mt-2">Murid</p>
            </div>
            <Badge className={getStatusClass(murid.status)}>
              {getStatusLabel(murid.status)}
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
                  href={`mailto:${murid.email}`}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {murid.email}
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
                  href={`tel:${murid.phone}`}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {murid.phone}
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
                  {formatDate(murid.tanggal_lahir)}
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
                  {formatDate(murid.created_at)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Informasi Sabuk
          </h2>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              Sabuk Saat Ini
            </p>
            {murid.current_belt ? (
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground text-sm py-1.5 px-3">
                  {murid.current_belt.name}
                  {murid.current_belt.dan_level
                    ? ` (DAN ${murid.current_belt.dan_level})`
                    : ""}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Diraih {formatDate(murid.current_belt.achieved_at)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada data</p>
            )}
          </div>
        </Card>

        {murid.belt_history.length > 0 && (
          <Card className="p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Riwayat Sabuk
            </h2>

            <div className="space-y-3">
              {murid.belt_history.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {entry.name}
                      {entry.dan_level ? ` (DAN ${entry.dan_level})` : ""}
                    </span>
                    {entry.is_current === 1 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Saat Ini
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="h-3 w-3" />
                    {formatDate(entry.achieved_at)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
