import { ResetPasswordForm } from "@/components/reset-pasword";

export const metadata = {
  title: "Reset Password - Riwayat Kejuaraan",
  description: "Atur ulang password akun Anda",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 py-8">
      <div className="w-full">
        <ResetPasswordForm />
      </div>
    </main>
  );
}
