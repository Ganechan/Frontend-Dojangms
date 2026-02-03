"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const MAX_PHONE_DIGITS = 12;
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [pernahTaekwondo, setPernahTaekwondo] = useState<"ya" | "tidak" | "">(
    "",
  );
  const [belts, setBelts] = useState<any[]>([]);
  const [beltId, setBeltId] = useState<string>("");

  // Helper function to get days in a month
  const getDaysInMonth = (month: number, year: number) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  // Generate arrays for dropdowns
  const months = [
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const daysInSelectedMonth = getDaysInMonth(
    parseInt(formData.month),
    parseInt(formData.year),
  );
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (pernahTaekwondo === "ya") {
      fetch(`${BASE_URL}/api/public/get/belt`)
        .then((res) => res.json())
        .then((data) => {
          setBelts(data.data || data);
        })
        .catch(() => {
          alert("Gagal mengambil data sabuk");
        });
    }
  }, [pernahTaekwondo]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok");
      return;
    }

    if (!formData.day || !formData.month || !formData.year) {
      alert("Mohon lengkapi tanggal lahir");
      return;
    }

    setIsLoading(true);

    // Construct date in YYYY-MM-DD format
    const tanggalLahir = `${formData.year}-${formData.month}-${formData.day.padStart(2, "0")}`;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: `+62${formData.phone}`,
          tanggal_lahir: tanggalLahir,
          belt_id: pernahTaekwondo === "ya" ? beltId : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal mendaftar");
        return;
      }

      router.push("/login");
    } catch (error) {
      alert("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
    return labels[passwordStrength - 1] || "Masukkan password";
  };

  const getPasswordStrengthColor = () => {
    const colors = [
      "bg-destructive",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ];
    return colors[passwordStrength - 1] || "bg-border";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </Link>

        {/* Card */}
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
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Full Name Field */}
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
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-10"
                    />
                  </div>

                  {/* Email Field */}
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
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="h-10"
                    />
                  </div>

                  {/* Password Field */}
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
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition ${
                                i < passwordStrength
                                  ? getPasswordStrengthColor()
                                  : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Kekuatan:{" "}
                          <span className="font-medium">
                            {getPasswordStrengthLabel()}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
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
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Match Indicator */}
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

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Phone Field */}
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

                          // optional: cegah diawali 0
                          if (value.startsWith("0")) {
                            value = value.slice(1);
                          }

                          // batas maksimal digit
                          if (value.length > MAX_PHONE_DIGITS) {
                            value = value.slice(0, MAX_PHONE_DIGITS);
                          }

                          setFormData({ ...formData, phone: value });
                        }}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Tanggal Lahir Field - Three Dropdowns */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tanggal Lahir</Label>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Year Dropdown */}
                      <div>
                        <Select
                          value={formData.year}
                          onValueChange={(value) => {
                            setFormData({ ...formData, year: value });
                            // Reset day if it exceeds the new year's max days (for leap year)
                            const maxDays = getDaysInMonth(
                              parseInt(formData.month),
                              parseInt(value),
                            );
                            if (parseInt(formData.day) > maxDays) {
                              setFormData((prev) => ({ ...prev, day: "" }));
                            }
                          }}
                          required
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
                      </div>

                      {/* Month Dropdown */}
                      <div>
                        <Select
                          value={formData.month}
                          onValueChange={(value) => {
                            setFormData({ ...formData, month: value });
                            // Reset day if it exceeds the new month's max days
                            const maxDays = getDaysInMonth(
                              parseInt(value),
                              parseInt(formData.year),
                            );
                            if (parseInt(formData.day) > maxDays) {
                              setFormData((prev) => ({ ...prev, day: "" }));
                            }
                          }}
                          required
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Bulan" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Day Dropdown */}
                      <div>
                        <Select
                          value={formData.day}
                          onValueChange={(value) =>
                            setFormData({ ...formData, day: value })
                          }
                          required
                        >
                          <SelectTrigger className="h-10 w-auto">
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
                  </div>

                  {/* Pernah Taekwondo Field - Enhanced Design */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Pernah ikut Taekwondo?
                    </Label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPernahTaekwondo("ya")}
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
                            className={`text-sm font-medium ${
                              pernahTaekwondo === "ya"
                                ? "text-primary"
                                : "text-foreground"
                            }`}
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
                            className={`text-sm font-medium ${
                              pernahTaekwondo === "tidak"
                                ? "text-primary"
                                : "text-foreground"
                            }`}
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

                  {/* Pilih Sabuk - Enhanced Design with Shadcn Select */}
                  {pernahTaekwondo === "ya" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Sabuk Terakhir
                      </Label>
                      <Select
                        value={beltId}
                        onValueChange={(value) => setBeltId(value)}
                        required
                      >
                        <SelectTrigger className="w-full h-11 border-2">
                          <SelectValue placeholder="Pilih sabuk terakhir Anda" />
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-md hover:shadow-lg"
                disabled={
                  isLoading || formData.password !== formData.confirmPassword
                }
              >
                {isLoading ? "Membuat Akun..." : "Daftar"}
              </Button>
            </form>

            {/* Sign in link */}
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

        {/* Footer text
        <p className="text-center text-xs text-muted-foreground mt-6">
          Dengan mendaftar, Anda menyetujui{" "}
          <Link
            href="#"
            className="text-primary hover:text-primary/80 transition"
          >
            Syarat Layanan
          </Link>{" "}
          kami
        </p> */}
      </div>
    </div>
  );
}
