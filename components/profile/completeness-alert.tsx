"use client"

import { useRouter } from "next/navigation"
import { UserRoundPen, CircleCheckBig } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CompletenessAlert({ isComplete }: { isComplete: boolean }) {
  const router = useRouter()

  if (isComplete) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
            <CircleCheckBig className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
              Profil Lengkap
            </h3>
            <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
              Semua informasi profil Anda telah lengkap.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/40">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400">
            <UserRoundPen className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">
              Profil Belum Lengkap
            </h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
              Beberapa informasi profil Anda masih kosong. Lengkapi profil agar
              informasi akun menjadi lebih lengkap.
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/profile/edit")}
          className="w-full shrink-0 sm:w-auto"
        >
          <UserRoundPen className="h-4 w-4" />
          Lengkapi Profil
        </Button>
      </CardContent>
    </Card>
  )
}
