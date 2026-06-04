"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            401
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Akses Ditolak
          </h2>
          <p className="text-base text-muted-foreground">
            Anda tidak memiliki izin untuk mengakses halaman ini. Silakan
            hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button onClick={() => router.push("/")} className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            Ke Beranda
          </Button>
        </div>

        {/* Help Text */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              Butuh bantuan?
            </span>{" "}
            Hubungi tim dukungan kami untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
}
