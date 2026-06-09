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

interface BeltStyle {
  bg: string;
  text: string;
  border: string;
  dotBg: string;
  indicator: React.ReactNode;
}

function getBeltStyle(beltName: string): BeltStyle {
  const name = beltName.toLowerCase();

  // Sabuk Hitam
  if (name.includes("hitam")) {
    return {
      bg: "bg-zinc-950 text-zinc-50 border-zinc-800",
      text: "text-zinc-50",
      border: "border-zinc-800",
      dotBg: "bg-zinc-900 border-zinc-800",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-zinc-700 bg-zinc-900">
          <span className="h-full w-full bg-zinc-950" />
        </span>
      ),
    };
  }

  // Sabuk Merah dengan Ujung Hitam
  if (name.includes("merah") && name.includes("hitam")) {
    return {
      bg: "bg-rose-50/80 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200 border-rose-200 dark:border-rose-900/50",
      text: "text-rose-900 dark:text-rose-200",
      border: "border-rose-200 dark:border-rose-900/50",
      dotBg: "bg-rose-100 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-rose-300 dark:border-rose-800">
          <span className="h-full w-[70%] bg-rose-600" />
          <span className="h-full w-[30%] bg-zinc-900" />
        </span>
      ),
    };
  }

  // Sabuk Merah
  if (name.includes("merah")) {
    return {
      bg: "bg-rose-50/50 dark:bg-rose-950/10 text-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-950/30",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-950/30",
      dotBg: "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-rose-300 dark:border-rose-800">
          <span className="h-full w-full bg-rose-600" />
        </span>
      ),
    };
  }

  // Sabuk Biru dengan Ujung Merah
  if (name.includes("biru") && name.includes("merah")) {
    return {
      bg: "bg-blue-50/80 dark:bg-blue-950/20 text-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-900/50",
      text: "text-blue-900 dark:text-blue-200",
      border: "border-blue-200 dark:border-blue-900/50",
      dotBg: "bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-blue-300 dark:border-blue-800">
          <span className="h-full w-[70%] bg-blue-600" />
          <span className="h-full w-[30%] bg-rose-600" />
        </span>
      ),
    };
  }

  // Sabuk Biru
  if (name.includes("biru")) {
    return {
      bg: "bg-blue-50/50 dark:bg-blue-950/10 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-950/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-950/30",
      dotBg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-blue-300 dark:border-blue-800">
          <span className="h-full w-full bg-blue-600" />
        </span>
      ),
    };
  }

  // Sabuk Hijau dengan Ujung Biru
  if (name.includes("hijau") && name.includes("biru")) {
    return {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/50",
      text: "text-emerald-900 dark:text-emerald-200",
      border: "border-emerald-200 dark:border-emerald-900/50",
      dotBg: "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-emerald-300 dark:border-emerald-800">
          <span className="h-full w-[70%] bg-emerald-600" />
          <span className="h-full w-[30%] bg-blue-600" />
        </span>
      ),
    };
  }

  // Sabuk Hijau
  if (name.includes("hijau")) {
    return {
      bg: "bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-950/30",
      dotBg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-emerald-300 dark:border-emerald-800">
          <span className="h-full w-full bg-emerald-600" />
        </span>
      ),
    };
  }

  // Sabuk Kuning dengan Ujung Hijau
  if (name.includes("kuning") && name.includes("hijau")) {
    return {
      bg: "bg-amber-50/80 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-900/50",
      text: "text-amber-900 dark:text-amber-200",
      border: "border-amber-200 dark:border-amber-900/50",
      dotBg: "bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-amber-300 dark:border-amber-800">
          <span className="h-full w-[70%] bg-amber-400" />
          <span className="h-full w-[30%] bg-emerald-600" />
        </span>
      ),
    };
  }

  // Sabuk Kuning
  if (name.includes("kuning")) {
    return {
      bg: "bg-amber-50/55 dark:bg-amber-950/10 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-950/30",
      text: "text-amber-800 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-950/30",
      dotBg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-amber-300 dark:border-amber-800">
          <span className="h-full w-full bg-amber-400" />
        </span>
      ),
    };
  }

  // Sabuk Putih dengan Ujung Kuning
  if (name.includes("putih") && name.includes("kuning")) {
    return {
      bg: "bg-slate-50/80 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
      text: "text-slate-800 dark:text-slate-200",
      border: "border-slate-200 dark:border-slate-700",
      dotBg: "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-slate-300 dark:border-slate-700">
          <span className="h-full w-[70%] bg-white" />
          <span className="h-full w-[30%] bg-amber-400" />
        </span>
      ),
    };
  }

  // Sabuk Putih
  if (name.includes("putih")) {
    return {
      bg: "bg-slate-50/50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/50",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-200 dark:border-slate-700/50",
      dotBg: "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700",
      indicator: (
        <span className="flex h-3.5 w-7 overflow-hidden rounded border border-slate-300 dark:border-slate-700">
          <span className="h-full w-full bg-white" />
        </span>
      ),
    };
  }

  // Default
  return {
    bg: "bg-muted/40 text-foreground border-border",
    text: "text-foreground",
    border: "border-border",
    dotBg: "bg-muted border-border",
    indicator: (
      <span className="flex h-3.5 w-7 overflow-hidden rounded border border-border bg-muted" />
    ),
  };
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
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Informasi Sabuk
            </h2>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Sabuk Saat Ini
            </p>
            {murid.current_belt ? (() => {
              const style = getBeltStyle(murid.current_belt.name);
              return (
                <div className={`flex items-center justify-between p-4 rounded-xl border ${style.bg} ${style.border}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center">
                      {style.indicator}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">
                        {murid.current_belt.name}
                        {murid.current_belt.dan_level
                          ? ` (DAN ${murid.current_belt.dan_level})`
                          : ""}
                      </span>
                      <span className="text-xs opacity-80 mt-0.5">
                        Diraih pada {formatDate(murid.current_belt.achieved_at)}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-transparent">
                    Aktif
                  </Badge>
                </div>
              );
            })() : (
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Belum ada data sabuk</p>
              </div>
            )}
          </div>
        </Card>

        {murid.belt_history.length > 0 && (
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <ClockIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Riwayat Sabuk
              </h2>
            </div>

            <div className="relative space-y-0">
              {murid.belt_history.map((entry, idx) => {
                const style = getBeltStyle(entry.name);
                return (
                  <div
                    key={idx}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Timeline line */}
                    {idx < murid.belt_history.length - 1 && (
                      <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-border" />
                    )}

                    {/* Timeline dot */}
                    <div className="relative z-10 mt-1.5 flex-shrink-0">
                      <div
                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 ${
                          entry.is_current === 1
                            ? "bg-primary border-primary"
                            : `${style.dotBg} group-hover:border-primary/50`
                        } transition-colors`}
                      >
                        <Award
                          className={`h-3.5 w-3.5 ${
                            entry.is_current === 1
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-primary"
                          } transition-colors`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 p-4 rounded-xl mb-3 border transition-colors ${
                        entry.is_current === 1
                          ? `${style.bg} ${style.border}`
                          : "bg-muted/40 border-border hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          {style.indicator}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {entry.name}
                              {entry.dan_level
                                ? ` (DAN ${entry.dan_level})`
                                : ""}
                            </span>
                            {entry.is_current === 1 && (
                              <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                                Saat Ini
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs opacity-75">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(entry.achieved_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
