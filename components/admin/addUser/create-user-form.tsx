// components\admin\anggota\create\create-user-form.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus, ShieldAlert, BadgeCheck } from "lucide-react";

type Role = "murid" | "pelatih" | "admin";
type Spesialisasi = "kyorugi" | "poomsae" | "kyorugi & poomsae";

interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CreateUserForm() {
  const [role, setRole] = useState<Role>("murid");
  const [belts, setBelts] = useState<Belt[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    tanggal_lahir: "",
    status: "active",
    belt_id: "",
    spesialisasi: "kyorugi" as Spesialisasi,
    sertifikasi: "",
  });

  // Fetch belts on mount
  useEffect(() => {
    const fetchBelts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/public/get/belt`);
        const data = await response.json();
        setBelts(data.data);
        // Set default belt_id to first belt
        if (data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            belt_id: data.data[0].id.toString(),
          }));
        }
      } catch (err) {
        toast.error("Gagal memuat data sabuk");
        console.error(err);
      }
    };
    fetchBelts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Nama harus diisi";
    if (!formData.email.trim()) return "Email harus diisi";
    // Tambahkan validasi format email:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Format email tidak valid";
    if (!formData.password.trim()) return "Password harus diisi";
    if (formData.password.length < 6) return "Password minimal 6 karakter";
    if (!formData.phone.trim()) return "Nomor telepon harus diisi";
    if (!formData.tanggal_lahir) return "Tanggal lahir harus diisi";
    if (!formData.belt_id && role !== "admin") return "Sabuk harus dipilih";
    if (role === "pelatih") {
      const selectedBelt = belts.find(
        (belt) => belt.id === Number(formData.belt_id),
      );

      if (!selectedBelt) {
        return "Sabuk tidak ditemukan";
      }

      if (selectedBelt.order_level < 8) {
        return "Pelatih minimal harus memiliki sabuk Merah";
      }
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, any> = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        tanggal_lahir: formData.tanggal_lahir,
        status: formData.status,
        roles: [role],
      };

      if (role === "murid") {
        payload.belt_id = parseInt(formData.belt_id);
      } else if (role === "pelatih") {
        payload.belt_id = parseInt(formData.belt_id);
        payload.spesialisasi = formData.spesialisasi;
        payload.sertifikasi = formData.sertifikasi;
      }

      const response = await fetch("/api/admin/create/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Gagal membuat pengguna");
        return;
      }

      toast.success(`Pengguna ${role} berhasil dibuat!`, { duration: 3000 });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        tanggal_lahir: "",
        status: "active",
        belt_id: belts.length > 0 ? belts[0].id.toString() : "",
        spesialisasi: "kyorugi",
        sertifikasi: "",
      });
    } catch (err) {
      toast.error("Terjadi kesalahan saat membuat pengguna");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-border/50 shadow-sm pt-0">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-8 pt-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Buat Pengguna Baru
            </CardTitle>
            <CardDescription className="text-base mt-1.5">
              Tambahkan murid, pelatih, atau admin baru ke dalam sistem.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8">
        {/* Role Selection */}
        <div className="mb-8">
          <Label className="text-base font-semibold mb-4 block text-foreground/90">
            Pilih Role Pengguna
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["murid", "pelatih", "admin"] as const).map((r) => (
              <label
                key={r}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  role === r
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/50 bg-background hover:border-primary/30 hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="sr-only"
                />
                {r === "murid" && <UserPlus className="h-6 w-6 mb-2" />}
                {r === "pelatih" && <BadgeCheck className="h-6 w-6 mb-2" />}
                {r === "admin" && <ShieldAlert className="h-6 w-6 mb-2" />}
                <span className="font-medium capitalize">{r}</span>
              </label>
            ))}
          </div>
        </div>

        <form
          id="create-user-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nama@email.com"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimal 6 karakter"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0812xxxxxx"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input
                id="tanggal_lahir"
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleInputChange}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status Akun</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(role === "murid" || role === "pelatih") && (
            <div className="p-5 rounded-xl border border-border/50 bg-muted/20 space-y-4">
              <h3 className="font-medium text-foreground">
                Informasi Taekwondo
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="belt_id">Sabuk Saat Ini</Label>
                  <Select
                    value={formData.belt_id}
                    onValueChange={(value) =>
                      handleSelectChange("belt_id", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih tingkatan sabuk" />
                    </SelectTrigger>
                    <SelectContent>
                      {belts.map((belt) => (
                        <SelectItem key={belt.id} value={belt.id.toString()}>
                          {belt.name}{" "}
                          {belt.dan_level ? `(DAN ${belt.dan_level})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {role === "pelatih" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="spesialisasi">Spesialisasi</Label>
                      <Select
                        value={formData.spesialisasi}
                        onValueChange={(value) =>
                          handleSelectChange("spesialisasi", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih spesialisasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kyorugi">Kyorugi</SelectItem>
                          <SelectItem value="poomsae">Poomsae</SelectItem>
                          <SelectItem value="kyorugi & poomsae">
                            Kyorugi & Poomsae
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="sertifikasi">
                        Sertifikasi{" "}
                        <span className="text-muted-foreground font-normal">
                          (opsional)
                        </span>
                      </Label>
                      <Input
                        id="sertifikasi"
                        name="sertifikasi"
                        value={formData.sertifikasi}
                        onChange={handleInputChange}
                        placeholder="Contoh: Sabuk Hitam Kukkiwon, Pelatih Nasional"
                        className="h-11"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="px-6 py-6 border-t border-border/50 bg-muted/10">
        <Button
          type="submit"
          form="create-user-form"
          disabled={loading}
          className="w-full sm:w-auto ml-auto h-11 px-8"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Buat Pengguna"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
