"use client"

import {
    School,
    BookOpen,
    Users,
    ClipboardCheck,
    Trophy,
    GraduationCap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardData } from "./types"
import { cn } from "@/lib/utils"

interface SummaryCardsProps {
    data: DashboardData | null
    loading: boolean
}

const cards = [
    {
        key: "total_kelas",
        label: "Total Kelas",
        icon: School,
        iconClass: "text-foreground bg-muted",
        valueClass: "",
    },
    {
        key: "kelas_aktif",
        label: "Kelas Aktif",
        icon: BookOpen,
        iconClass: "text-emerald-600 bg-emerald-50",
        valueClass: "text-emerald-600",
    },
    {
        key: "total_murid",
        label: "Total Murid Aktif",
        icon: Users,
        iconClass: "text-blue-600 bg-blue-50",
        valueClass: "text-blue-600",
    },
    {
        key: "absensi_hari_ini",
        label: "Absensi Hari Ini",
        icon: ClipboardCheck,
        iconClass: "text-foreground bg-muted",
        valueClass: "",
    },
    {
        key: "kejuaraan",
        label: "Kejuaraan Akan Datang",
        icon: Trophy,
        iconClass: "text-orange-600 bg-orange-50",
        valueClass: "text-orange-600",
    },
    {
        key: "ujian",
        label: "Ujian Akan Datang",
        icon: GraduationCap,
        iconClass: "text-purple-600 bg-purple-50",
        valueClass: "text-purple-600",
    },
]

function getValue(key: string, data: DashboardData): number {
    switch (key) {
        case "total_kelas":
            return data.kelas.total
        case "kelas_aktif":
            return Number(data.kelas.aktif)
        case "total_murid":
            return data.murid.total_aktif
        case "absensi_hari_ini":
            return data.absensi.hari_ini.total
        case "kejuaraan":
            return data.kejuaraan_akan_datang.length
        case "ujian":
            return data.ujian_akan_datang.length
        default:
            return 0
    }
}

export function SummaryCards({ data, loading }: SummaryCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-4">
                        <CardContent className="p-0 flex flex-col gap-3">
                            <Skeleton className="size-10 rounded-lg" />
                            <Skeleton className="h-7 w-12" />
                            <Skeleton className="h-4 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cards.map((card) => {
                const Icon = card.icon
                const value = data ? getValue(card.key, data) : 0
                return (
                    <Card key={card.key} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-0 flex flex-col gap-3">
                            <div className={cn("size-10 rounded-lg flex items-center justify-center", card.iconClass)}>
                                <Icon className="size-5" />
                            </div>
                            <p className={cn("text-2xl font-bold", card.valueClass)}>{value}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{card.label}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
