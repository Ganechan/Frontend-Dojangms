"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Award } from "lucide-react";
import { useRegister } from "@/hooks/Useregister";

const MAX_PHONE_DIGITS = 12;

const MONTHS = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

function getDaysInMonth(month: number, year: number): number {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
}

const STRENGTH_LABELS = [
  "Sangat Lemah",
  "Lemah",
  "Cukup",
  "Kuat",
  "Sangat Kuat",
];
const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-green-600",
];

export default function RegisterPage() {
  const { isLoading, error, belts, isBeltsLoading, register, fetchBelts } =
    useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [pernahTaekwondo, setPernahTaekwondo] = useState<"ya" | "tidak" | "">(
    "",
  );
  const [beltId, setBeltId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    day: "",
    month: "",
    year: "",
    password: "",
    confirmPassword: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const daysInMonth = getDaysInMonth(
    parseInt(formData.month),
    parseInt(formData.year),
  );
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) return;
    if (!formData.day || !formData.month || !formData.year) return;

    const tanggalLahir = `${formData.year}-${formData.month}-${formData.day.padStart(2, "0")}`;

    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: `+62${formData.phone}`,
      tanggal_lahir: tanggalLahir,
      belt_id: pernahTaekwondo === "ya" && beltId ? Number(beltId) : null,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2 flex flex-col items-center text-center">
            <Link href="/">
              <Image
                src="/logo_dojang.png"
                alt="Logo Dojang"
                width={150}
                height={150}
                className="mb-2"
                priority
              />
            </Link>
            <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
            <CardDescription>
              Isi formulir di bawah untuk mendaftar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ── Kolom Kiri ── */}
                <div className="space-y-4">
                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                      disabled={isLoading}
                      className="h-10"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-10"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                        aria-label={
                          showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition ${
                                i < passwordStrength
                                  ? STRENGTH_COLORS[passwordStrength - 1]
                                  : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Kekuatan:{" "}
                          <span className="font-medium">
                            {STRENGTH_LABELS[passwordStrength - 1] ??
                              "Masukkan password"}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password Anda"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        required
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                        aria-label={
                          showConfirmPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && (
                      <div className="flex items-center gap-2 text-sm">
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-green-500">
                              Password cocok
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-destructive" />
                            <span className="text-destructive">
                              Password tidak cocok
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Kolom Kanan ── */}
                <div className="space-y-4">
                  {/* Nomor HP */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Nomor HP
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm text-muted-foreground">
                        +62
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="81234567890"
                        value={formData.phone}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.startsWith("0")) value = value.slice(1);
                          if (value.length > MAX_PHONE_DIGITS)
                            value = value.slice(0, MAX_PHONE_DIGITS);
                          setFormData((prev) => ({ ...prev, phone: value }));
                        }}
                        disabled={isLoading}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Nomor HP wajib yang sudah terdaftar di WhatsApp
                    </p>
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tanggal Lahir</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select
                        value={formData.year}
                        onValueChange={(value) => {
                          const maxDays = getDaysInMonth(
                            parseInt(formData.month),
                            parseInt(value),
                          );
                          setFormData((prev) => ({
                            ...prev,
                            year: value,
                            day: parseInt(prev.day) > maxDays ? "" : prev.day,
                          }));
                        }}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={formData.month}
                        onValueChange={(value) => {
                          const maxDays = getDaysInMonth(
                            parseInt(value),
                            parseInt(formData.year),
                          );
                          setFormData((prev) => ({
                            ...prev,
                            month: value,
                            day: parseInt(prev.day) > maxDays ? "" : prev.day,
                          }));
                        }}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={formData.day}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, day: value }))
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Hari" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem
                              key={day}
                              value={day.toString().padStart(2, "0")}
                            >
                              {day.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pernah Taekwondo */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Pernah ikut Taekwondo?
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPernahTaekwondo("ya");
                          fetchBelts();
                        }}
                        className={`relative h-20 rounded-lg border-2 transition-all duration-200 ${
                          pernahTaekwondo === "ya"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              pernahTaekwondo === "ya"
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Award className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-sm font-medium ${pernahTaekwondo === "ya" ? "text-primary" : "text-foreground"}`}
                          >
                            Ya
                          </span>
                        </div>
                        {pernahTaekwondo === "ya" && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPernahTaekwondo("tidak");
                          setBeltId("");
                        }}
                        className={`relative h-20 rounded-lg border-2 transition-all duration-200 ${
                          pernahTaekwondo === "tidak"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              pernahTaekwondo === "tidak"
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <span className="text-xl">✕</span>
                          </div>
                          <span
                            className={`text-sm font-medium ${pernahTaekwondo === "tidak" ? "text-primary" : "text-foreground"}`}
                          >
                            Tidak
                          </span>
                        </div>
                        {pernahTaekwondo === "tidak" && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Pilih Sabuk */}
                  {pernahTaekwondo === "ya" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Sabuk Terakhir
                      </Label>
                      <Select
                        value={beltId}
                        onValueChange={setBeltId}
                        disabled={isBeltsLoading}
                        required
                      >
                        <SelectTrigger className="w-full h-11 border-2">
                          <SelectValue
                            placeholder={
                              isBeltsLoading
                                ? "Memuat..."
                                : "Pilih sabuk terakhir Anda"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {belts.map((belt) => (
                            <SelectItem key={belt.id} value={String(belt.id)}>
                              {belt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {beltId && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          Sabuk terpilih
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium shadow-md hover:shadow-lg transition-all"
                disabled={
                  isLoading || formData.password !== formData.confirmPassword
                }
              >
                {isLoading ? "Membuat Akun..." : "Daftar"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 transition font-medium"
              >
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
