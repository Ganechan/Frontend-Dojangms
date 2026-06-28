"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { MuridDashboardData } from "./types"

interface AbsensiStatistikProps {
  data: MuridDashboardData | null
  loading: boolean
}

interface StatRowProps {
  label: string
  value: number
  total: number
  valueClass?: string
  barClass?: string
}

function StatRow({ label, value, total, valueClass = "", barClass = "bg-muted-foreground" }: StatRowProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`text-sm font-semibold ${valueClass}`}>
          {value} <span className="text-xs text-muted-foreground font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function AbsensiStatistik({ data, loading }: AbsensiStatistikProps) {
  if (loading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const stat = data?.absensi.statistik
  const total = stat?.total_pertemuan ?? 0
  const persentase = stat?.persentase_kehadiran ?? 0

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Statistik Absensi</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">Total Pertemuan</span>
          <span className="text-xl font-bold">{total}</span>
        </div>

        <StatRow
          label="Hadir"
          value={Number(stat?.hadir) || 0}
          total={total}
          valueClass="text-emerald-600"
          barClass="bg-emerald-500"
        />
        <StatRow
          label="Izin"
          value={Number(stat?.izin) || 0}
          total={total}
          valueClass="text-yellow-600"
          barClass="bg-yellow-400"
        />
        <StatRow
          label="Sakit"
          value={Number(stat?.sakit) || 0}
          total={total}
          valueClass="text-blue-600"
          barClass="bg-blue-400"
        />
        <StatRow
          label="Alpha"
          value={Number(stat?.alpha) || 0}
          total={total}
          valueClass="text-red-500"
          barClass="bg-red-400"
        />

        <div className="flex flex-col gap-1.5 pt-1 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Persentase Kehadiran</span>
            <span className="text-sm font-bold text-emerald-600">{persentase}%</span>
          </div>
          <Progress value={persentase} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
