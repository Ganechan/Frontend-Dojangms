"use client"

import { useRouter } from "next/navigation"
import {
    ShieldX,
    ArrowLeft,
    RefreshCcw,
    CircleAlert,
    CheckCircle2,
    ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// In a real app this data comes from the auth session / API response.
// For now we use a mock so the page is fully previewable without a backend.
const MOCK_DATA = {
    status: "rejected",
    reject_reason: "Nomor WhatsApp tidak valid. Silakan gunakan nomor yang aktif.",
}

export default function AccountRejectedPage() {
    const router = useRouter()

    const rejectReason =
        MOCK_DATA.reject_reason?.trim() ||
        "Administrator tidak memberikan alasan penolakan."

    const handleReregister = () => {
        router.push("/register")
    }

    const handleBackToLogin = () => {
        router.push("/login")
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[650px] flex flex-col gap-6">

                {/* Top icon + title */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center justify-center size-24 rounded-full bg-red-50 border-2 border-red-100">
                        <ShieldX className="size-11 text-red-500" strokeWidth={1.75} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                            Pendaftaran Ditolak
                        </h1>
                        <p className="text-sm leading-relaxed text-muted-foreground max-w-[480px]">
                            Maaf, pendaftaran akun Anda belum dapat disetujui oleh administrator.
                            Silakan baca alasan penolakan di bawah ini, lakukan perbaikan yang
                            diperlukan, kemudian ajukan pendaftaran kembali.
                        </p>
                    </div>
                </div>

                {/* Status card */}
                <Card className="border border-border shadow-none rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-red-500" />
                            Status Akun
                        </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground">Ditolak</span>
                                <Badge variant="destructive" className="text-xs px-3 py-1 rounded-full font-medium">
                                    Rejected
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rejection reason card */}
                <Card className="border border-red-100 bg-red-50/50 shadow-none rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
                            <CircleAlert className="size-4 text-red-600" />
                            Alasan Penolakan
                        </CardTitle>
                    </CardHeader>
                    <Separator className="bg-red-100" />
                    <CardContent className="pt-4">
                        <p className="text-sm leading-relaxed text-red-900">
                            {rejectReason}
                        </p>
                    </CardContent>
                </Card>

                {/* Next steps card */}
                <Card className="border border-border shadow-none rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <ListChecks className="size-4 text-muted-foreground" />
                            Langkah Selanjutnya
                        </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                        <ul className="flex flex-col gap-2.5">
                            {[
                                "Periksa kembali data yang Anda masukkan.",
                                "Pastikan seluruh informasi sudah benar dan lengkap.",
                                "Hubungi administrator apabila membutuhkan bantuan.",
                                "Setelah memperbaiki data, silakan lakukan pendaftaran kembali.",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed"
                                >
                                    <span className="mt-1.5 shrink-0 size-1.5 rounded-full bg-muted-foreground/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleReregister}
                        className="flex-1 h-10 rounded-lg font-medium transition-colors"
                    >
                        <RefreshCcw className="size-4 mr-2" />
                        Daftar Ulang
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleBackToLogin}
                        className="flex-1 h-10 rounded-lg font-medium border-border text-foreground hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Kembali ke Login
                    </Button>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-muted-foreground">
                    Jika Anda merasa terjadi kesalahan, silakan hubungi administrator Dojang.
                </p>

            </div>
        </main>
    )
}
