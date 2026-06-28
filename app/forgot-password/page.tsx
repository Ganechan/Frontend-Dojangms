import { ResetPasswordForm } from "@/components/reset-pasword";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Reset Password - Riwayat Kejuaraan",
  description: "Atur ulang password akun Anda",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 py-8">
      <div className="w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </Link>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
