"use client"

import { CalendarDays, MapPin, Trophy, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { MuridDashboardData } from "./types"

interface AgendaMendatangProps {
  data: MuridDashboardData | null
  loading: boolean
}

function countdownLabel(days: number): string {
  if (days < 0) return "Sudah Lewat"
  if (days === 0) return "Hari Ini"
  if (days === 1) return "Besok"
  return `${days} Hari Lagi`
}

interface AgendaItem {
  id: number | string
  judul: string
  lokasi: string
  tanggal: string
  hari_menuju: number
  tipe: "kejuaraan" | "ujian"
}

export function AgendaMendatang({ data, loading }: AgendaMendatangProps) {
  if (loading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <Skeleton className="size-8 rounded-full" />
                {i < 3 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex flex-col gap-2 flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Map kejuaraan_akan_datang to normalized items
  const kejuaraan: AgendaItem[] = (data?.kejuaraan_akan_datang ?? []).map((k) => ({
    id: k.id,
    judul: k.kejuaraan_nama,
    lokasi: k.location,
    tanggal: k.start_date,
    hari_menuju: k.hari_menuju,
    tipe: "kejuaraan" as const,
  }))

  // Map ujian_akan_datang to normalized items
  const ujian: AgendaItem[] = (data?.ujian_akan_datang ?? []).map((u) => ({
    id: u.id,
    judul: `Ujian ${u.belt_asal} → ${u.belt_tujuan}`,
    lokasi: u.lokasi,
    tanggal: u.tanggal_mulai,
    hari_menuju: u.hari_menuju,
    tipe: "ujian" as const,
  }))

  const combined: AgendaItem[] = [...kejuaraan, ...ujian].sort(
    (a, b) => a.hari_menuju - b.hari_menuju
  )

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Agenda Mendatang</CardTitle>
      </CardHeader>
      <CardContent>
        {combined.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center">
              <CalendarDays className="size-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Tidak Ada Agenda Mendatang</p>
            <p className="text-xs text-muted-foreground">Belum ada kejuaraan atau ujian yang terjadwal.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {combined.map((item, idx) => {
              const isKejuaraan = item.tipe === "kejuaraan"
              const Icon = isKejuaraan ? Trophy : GraduationCap
              const iconBg = isKejuaraan ? "bg-orange-100 text-orange-600" : "bg-purple-100 text-purple-600"
              const badgeCls = isKejuaraan
                ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                : "bg-purple-100 text-purple-700 hover:bg-purple-100"
              const isLast = idx === combined.length - 1

              return (
                <div key={`${item.tipe}-${item.id}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", iconBg)}>
                      <Icon className="size-4" />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
                  </div>
                  <div className={cn("flex flex-col gap-1.5 flex-1", !isLast && "pb-5")}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">{item.judul}</p>
                      <Badge className={cn("border-0 text-xs font-medium whitespace-nowrap shrink-0", badgeCls)}>
                        {countdownLabel(item.hari_menuju)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>{item.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0" />
                      <span>
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
