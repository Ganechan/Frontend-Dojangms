"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Lock, Loader2, KeyRound } from "lucide-react";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  foto: string | null;
  roles: string[];
}

interface ApiResponse {
  success: boolean;
  data: UserProfile;
}

interface FormState {
  new_password: string;
  confirm_password: string;
}

interface FieldErrors {
  new_password?: string;
  confirm_password?: string;
}

export default function UbahPassword() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    new_password: "",
    confirm_password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch profile via internal API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Gagal memuat profil");
        }
        const json: ApiResponse = await res.json();
        if (json.success) {
          setProfile(json.data);
        } else {
          setProfileError("Gagal memuat profil pengguna.");
        }
      } catch {
        setProfileError("Tidak dapat terhubung ke server.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    if (password.length < 6)
      return { level: 1, label: "Lemah", color: "#ef4444" };
    if (password.length < 10)
      return { level: 2, label: "Sedang", color: "#f59e0b" };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    if (score >= 2) return { level: 3, label: "Kuat", color: "#10b981" };
    return { level: 2, label: "Sedang", color: "#f59e0b" };
  };

  const strength = getPasswordStrength(form.new_password);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.new_password) {
      errors.new_password = "Password baru wajib diisi.";
    } else if (form.new_password.length < 8) {
      errors.new_password = "Password minimal 8 karakter.";
    }
    if (!form.confirm_password) {
      errors.confirm_password = "Konfirmasi password wajib diisi.";
    } else if (form.new_password !== form.confirm_password) {
      errors.confirm_password = "Password tidak cocok.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: profile.email,
          phone: profile.phone,
          new_password: form.new_password,
          confirm_password: form.confirm_password,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Password berhasil diubah.");
        setSubmitResult({
          type: "success",
          message: "Password berhasil diubah.",
        });
        setForm({ new_password: "", confirm_password: "" });
      } else {
        const msg = json.message || "Gagal mengubah password.";
        toast.error(msg);
        setSubmitResult({ type: "error", message: msg });
      }
    } catch {
      const msg = "Tidak dapat terhubung ke server.";
      toast.error(msg);
      setSubmitResult({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarUrl = (foto: string | null) => {
    if (!foto) return undefined;
    if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
    return `/api/auth/avatar?path=${encodeURIComponent(foto)}`;
  };

  const avatarUrl = profile?.foto ? getAvatarUrl(profile.foto) : null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
              <div className="mx-auto w-full max-w-4xl space-y-6">
                
                {/* Back Navigation & Header */}
                <div className="space-y-4">
                  <Link href="/admin-complete-profile" className="inline-flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali ke Profil
                    </Button>
                  </Link>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">
                        Ubah Password
                      </h1>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        Perbarui kata sandi akun Anda demi keamanan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr]">
                  
                  {/* Left Column: User Card */}
                  <Card className="rounded-xl overflow-hidden shadow-sm border h-fit">
                    <CardHeader className="bg-muted/30 border-b pt-5 pb-4 px-6">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Profil Pengguna
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col items-center">
                      {loadingProfile ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                          <Skeleton className="h-24 w-24 rounded-full" />
                          <div className="space-y-2 w-full flex flex-col items-center">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3.5 w-40" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </div>
                      ) : profileError ? (
                        <p className="text-sm text-destructive text-center">{profileError}</p>
                      ) : profile ? (
                        <div className="flex flex-col items-center gap-4 text-center w-full">
                          <Avatar className="h-24 w-24 border-2 border-background shadow-sm">
                            {avatarUrl ? (
                              <AvatarImage
                                src={avatarUrl}
                                alt={profile.name}
                                className="object-cover"
                              />
                            ) : null}
                            <AvatarFallback className="text-xl font-semibold bg-primary/5 text-primary">
                              {profile.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1">
                            <p className="font-semibold text-base leading-none text-foreground">
                              {profile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.email}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {profile.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="secondary"
                                className="capitalize text-[10px] font-semibold py-0.5 px-2"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>

                  {/* Right Column: Reset Form */}
                  <Card className="rounded-xl overflow-hidden shadow-sm border">
                    <CardHeader className="bg-muted/30 border-b pt-5 pb-4 px-6">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        Form Ubah Password
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        
                        {/* New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="new_password">Password Baru</Label>
                          <div className="relative">
                            <Input
                              id="new_password"
                              name="new_password"
                              type={showNew ? "text" : "password"}
                              value={form.new_password}
                              onChange={handleChange}
                              placeholder="Masukkan password baru"
                              className={
                                fieldErrors.new_password
                                  ? "border-destructive focus-visible:ring-destructive pr-10"
                                  : "pr-10"
                              }
                              autoComplete="new-password"
                              disabled={submitting || loadingProfile}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNew((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                              tabIndex={-1}
                              aria-label={
                                showNew ? "Sembunyikan password" : "Tampilkan password"
                              }
                              disabled={submitting || loadingProfile}
                            >
                              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>

                          {/* Password Strength Meter */}
                          {form.new_password && strength && (
                            <div className="space-y-1.5 pt-1">
                              <div className="flex gap-1.5">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="h-1 flex-1 rounded-full transition-all duration-300"
                                    style={{
                                      backgroundColor: i <= strength.level ? strength.color : "currentColor",
                                      opacity: i <= strength.level ? 1 : 0.15
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-muted-foreground">Kekuatan Password:</span>
                                <span className="font-semibold" style={{ color: strength.color }}>
                                  {strength.label}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {fieldErrors.new_password && (
                            <p className="text-sm text-destructive">{fieldErrors.new_password}</p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm_password"
                              name="confirm_password"
                              type={showConfirm ? "text" : "password"}
                              value={form.confirm_password}
                              onChange={handleChange}
                              placeholder="Ulangi password baru"
                              className={
                                fieldErrors.confirm_password
                                  ? "border-destructive focus-visible:ring-destructive pr-10"
                                  : form.confirm_password && form.confirm_password === form.new_password
                                  ? "border-emerald-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 pr-10"
                                  : "pr-10"
                              }
                              autoComplete="new-password"
                              disabled={submitting || loadingProfile}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirm((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                              tabIndex={-1}
                              aria-label={
                                showConfirm ? "Sembunyikan password" : "Tampilkan password"
                              }
                              disabled={submitting || loadingProfile}
                            >
                              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          
                          {form.confirm_password && form.confirm_password === form.new_password && (
                            <p className="text-xs text-emerald-600 font-medium">✓ Password cocok</p>
                          )}
                          {fieldErrors.confirm_password && (
                            <p className="text-sm text-destructive">{fieldErrors.confirm_password}</p>
                          )}
                        </div>

                        {/* Tip Box */}
                        <div className="rounded-lg border bg-muted/40 p-4 space-y-1.5">
                          <p className="text-xs font-semibold text-primary">Tips password yang aman:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                            <li>Minimal 8 karakter</li>
                            <li>Kombinasi huruf besar, huruf kecil, dan angka</li>
                            <li>Gunakan simbol khusus (!@#$%) untuk keamanan ekstra</li>
                          </ul>
                        </div>

                        {/* Result Alert Banner */}
                        {submitResult && (
                          <div
                            className={`p-3 rounded-lg border text-sm font-medium ${
                              submitResult.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                : "bg-destructive/10 border-destructive/20 text-destructive"
                            }`}
                          >
                            {submitResult.type === "success" ? "✓ " : "✕ "}
                            {submitResult.message}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin-complete-profile")}
                            disabled={submitting || loadingProfile}
                          >
                            Batal
                          </Button>
                          <Button
                            type="submit"
                            disabled={submitting || loadingProfile}
                            className="gap-2"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Menyimpan...
                              </>
                            ) : (
                              "Simpan Password"
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
