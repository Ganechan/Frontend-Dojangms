"use client"

import { ClipboardCheck, UserPlus, GraduationCap, Trophy, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Aktivitas } from "./types"

interface AktivitasTerbaruProps {
    data: Aktivitas[]
    loading: boolean
}

const activityConfig = {
    absensi: {
        icon: ClipboardCheck,
        iconClass: "bg-blue-50 text-blue-600",
        dotClass: "bg-blue-400",
    },
    murid_bergabung: {
        icon: UserPlus,
        iconClass: "bg-emerald-50 text-emerald-600",
        dotClass: "bg-emerald-400",
    },
    ujian: {
        icon: GraduationCap,
        iconClass: "bg-purple-50 text-purple-600",
        dotClass: "bg-purple-400",
    },
    kejuaraan: {
        icon: Trophy,
        iconClass: "bg-orange-50 text-orange-600",
        dotClass: "bg-orange-400",
    },
}

function formatWaktu(waktu: string): string {
    try {
        return new Date(waktu).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    } catch {
        return waktu
    }
}

function EmptyAktivitas() {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                <Activity className="size-7 text-muted-foreground" />
            </div>
            <div>
                <p className="text-sm font-medium">Belum Ada Aktivitas</p>
                <p className="text-xs text-muted-foreground mt-1">Aktivitas terbaru akan muncul di sini.</p>
            </div>
        </div>
    )
}

export function AktivitasTerbaru({ data, loading }: AktivitasTerbaruProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="size-8 rounded-full flex-shrink-0" />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <EmptyAktivitas />
                ) : (
                    <div className="relative flex flex-col gap-0">
                        {data.map((item, idx) => {
                            const config = activityConfig[item.tipe] ?? activityConfig.absensi
                            const Icon = config.icon
                            const isLast = idx === data.length - 1
                            return (
                                <div key={`${item.tipe}-${idx}`} className="flex gap-3 relative">
                                    {/* Timeline line */}
                                    {!isLast && (
                                        <div className="absolute left-4 top-8 bottom-0 w-px bg-border z-0" />
                                    )}
                                    {/* Icon */}
                                    <div
                                        className={cn(
                                            "size-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 relative",
                                            config.iconClass
                                        )}
                                    >
                                        <Icon className="size-3.5" />
                                    </div>
                                    {/* Content */}
                                    <div className="flex flex-col gap-0.5 pb-4 flex-1 min-w-0">
                                        <p className="text-sm leading-relaxed">{item.deskripsi}</p>
                                        <p className="text-xs text-muted-foreground">{formatWaktu(item.waktu)}</p>
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
