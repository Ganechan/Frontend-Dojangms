// pages\admin\user\user-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, UserPlus, UserCog } from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

type Role = "admin" | "pelatih" | "murid";

const ROLES: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "pelatih", label: "Pelatih" },
  { value: "murid", label: "Murid" },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const baseSchema = {
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z
    .string()
    .min(9, "Nomor telepon minimal 9 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^\d+$/, "Hanya angka yang diperbolehkan"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  roles: z
    .array(z.enum(["admin", "pelatih", "murid"]))
    .min(1, "Pilih minimal satu role"),
  belt_id: z.string().min(1, "Sabuk wajib dipilih"),
};

const addSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .optional()
    .or(z.literal("")),
});

type AddFormValues = z.infer<typeof addSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = AddFormValues | EditFormValues;

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserFormProps {
  mode: "add" | "edit";
  userId?: number;
  defaultValues?: Partial<EditFormValues>;
}

// ─── Component ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function UserForm({
  mode,
  userId,
  defaultValues,
}: UserFormProps) {
  const router = useRouter();
  const [belts, setBelts] = useState<Belt[]>([]);
  const [loadingBelts, setLoadingBelts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const schema = isEdit ? editSchema : addSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      tanggal_lahir: "",
      roles: [],
      belt_id: "",
      ...defaultValues,
    },
  });

  // Fetch belts
  useEffect(() => {
    const fetchBelts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/public/get/belt`);
        const json = await res.json();
        setBelts(json.data ?? []);
      } catch {
        toast.error("Gagal memuat data sabuk");
      } finally {
        setLoadingBelts(false);
      }
    };
    fetchBelts();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value as never);
      });
    }
  }, [defaultValues, isEdit]);

  // Submit
  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        belt_id: Number(values.belt_id),
        // Don't send empty password on edit
        ...(isEdit && !values.password ? { password: undefined } : {}),
      };

      const url = isEdit
        ? `${BASE_URL}/api/admin/update/user/${userId}`
        : `${BASE_URL}/api/admin/create/user`;

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Terjadi kesalahan");
      }

      toast.success(
        isEdit ? "User berhasil diperbarui" : "User berhasil dibuat",
      );
      router.push("/admin/user");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            {isEdit ? (
              <UserCog className="h-5 w-5 text-white" />
            ) : (
              <UserPlus className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEdit ? "Edit User" : "Tambah User"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEdit
                ? "Perbarui informasi pengguna yang ada"
                : "Buat akun pengguna baru dalam sistem"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info Card */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Informasi Pribadi
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Data diri pengguna
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama lengkap"
                          className="bg-white border-slate-200 focus-visible:ring-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contoh@email.com"
                          className="bg-white border-slate-200 focus-visible:ring-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Nomor Telepon
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="08123456789"
                          className="bg-white border-slate-200 focus-visible:ring-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tanggal Lahir */}
                <FormField
                  control={form.control}
                  name="tanggal_lahir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Tanggal Lahir
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-white border-slate-200 focus-visible:ring-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Account Card */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Akun &amp; Keamanan
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  {isEdit
                    ? "Kosongkan kolom password jika tidak ingin mengubah"
                    : "Kata sandi untuk login pengguna"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Password{" "}
                        {isEdit && (
                          <span className="text-slate-400 font-normal">
                            (opsional)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            isEdit
                              ? "Biarkan kosong jika tidak berubah"
                              : "Minimal 8 karakter"
                          }
                          className="bg-white border-slate-200 focus-visible:ring-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Role & Belt Card */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Role &amp; Sabuk
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Atur hak akses dan tingkat sabuk pengguna
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Roles */}
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Role</FormLabel>
                      <div className="flex flex-wrap gap-4 pt-1">
                        {ROLES.map((role) => (
                          <FormField
                            key={role.value}
                            control={form.control}
                            name="roles"
                            render={({ field }) => {
                              const checked =
                                field.value?.includes(role.value) ?? false;
                              return (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(val) => {
                                        const current = field.value ?? [];
                                        if (val) {
                                          field.onChange([
                                            ...current,
                                            role.value,
                                          ]);
                                        } else {
                                          field.onChange(
                                            current.filter(
                                              (r) => r !== role.value,
                                            ),
                                          );
                                        }
                                      }}
                                      className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-slate-700 cursor-pointer">
                                    {role.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Belt */}
                <FormField
                  control={form.control}
                  name="belt_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Sabuk</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() ?? ""}
                        disabled={loadingBelts}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 focus:ring-slate-400">
                            <SelectValue
                              placeholder={
                                loadingBelts
                                  ? "Memuat data sabuk..."
                                  : "Pilih tingkat sabuk"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {belts.map((belt) => (
                            <SelectItem
                              key={belt.id}
                              value={belt.id.toString()}
                            >
                              <span className="flex items-center gap-2">
                                {belt.name}
                                {belt.dan_level !== null && (
                                  <span className="text-xs text-slate-400">
                                    (DAN {belt.dan_level})
                                  </span>
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-100"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEdit ? "Menyimpan..." : "Membuat..."}
                  </>
                ) : isEdit ? (
                  "Simpan Perubahan"
                ) : (
                  "Buat User"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
