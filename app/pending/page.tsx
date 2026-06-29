"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Clock3,
  RefreshCw,
  LogOut,
  Info,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function AccountPendingPage() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate a brief loading state before reloading
    setTimeout(() => {
      window.location.reload()
    }, 800)
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[600px] flex flex-col gap-6">

        {/* Top icon */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center size-24 rounded-full bg-amber-50 border-2 border-amber-100">
            <Clock3 className="size-11 text-amber-500" strokeWidth={1.75} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Menunggu Persetujuan Admin
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-[480px]">
              Pendaftaran Anda berhasil.{" "}
              Akun Anda sedang menunggu proses verifikasi oleh administrator.{" "}
              Anda akan dapat menggunakan seluruh fitur aplikasi setelah akun disetujui.
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border border-border shadow-none rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-amber-500" />
              Status Akun
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 font-medium text-xs px-3 py-1 rounded-full"
              >
                <span className="mr-1.5 inline-block size-2 rounded-full bg-amber-400" />
                Pending
              </Badge>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-muted-foreground">Keterangan</span>
              <span className="text-sm text-foreground text-right">
                Menunggu aktivasi administrator.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="border border-amber-100 bg-amber-50/60 shadow-none rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <Info className="size-4 text-amber-600" />
              Apa yang harus saya lakukan?
            </CardTitle>
          </CardHeader>
          <Separator className="bg-amber-100" />
          <CardContent className="pt-4">
            <ul className="flex flex-col gap-2.5">
              {[
                "Tunggu hingga administrator menyetujui akun Anda.",
                "Setelah akun aktif, silakan login kembali.",
                "Jika proses terlalu lama, hubungi administrator Dojang.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-amber-900 leading-relaxed">
                  <span className="mt-1.5 shrink-0 size-1.5 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium h-10 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`size-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Memperbarui..." : "Refresh Status"}
          </Button>

          <Button
            variant="outline"
            onClick={handleBackToLogin}
            disabled={isRefreshing}
            className="flex-1 h-10 rounded-lg font-medium border-border text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="size-4 mr-2" />
            Kembali ke Login
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground">
          Terima kasih telah mendaftar di Dojang Management System.
        </p>

      </div>
    </main>
  )
}
