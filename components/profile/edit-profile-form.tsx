"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import type { UserProfile } from "@/lib/profile/types";
import {
  profileEditSchema,
  type ProfileEditValues,
} from "@/lib/profile/profile-edit-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditPhotoCard } from "./edit-photo-card";

interface EditProfileFormProps {
  profile: UserProfile;
}

function normalizeGender(value: string | null): string {
  if (!value) return "";
  const v = value.toLowerCase();
  if (v === "l" || v === "laki-laki" || v === "male") return "Laki-laki";
  if (v === "p" || v === "perempuan" || v === "female") return "Perempuan";
  return value;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.foto);

  const form = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema) as Resolver<ProfileEditValues>,
    defaultValues: {
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      alamat: profile.alamat ?? "",
      jenis_kelamin: normalizeGender(profile.jenis_kelamin),
      nama_wali: profile.nama_wali ?? "",
      no_wali: profile.no_wali ?? "",
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleSelectFile(file: File) {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      toast.error("Format foto harus JPG, JPEG atau PNG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2 MB.");
      return;
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(values: ProfileEditValues) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("alamat", values.alamat ?? "");
      // PERBAIKAN: Kirim jenis_kelamin dalam lowercase
      formData.append(
        "jenis_kelamin",
        values.jenis_kelamin ? values.jenis_kelamin.toLowerCase() : "",
      );
      formData.append("nama_wali", values.nama_wali ?? "");
      formData.append("no_wali", values.no_wali ?? "");
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui profil");
      }

      toast.success("Profil berhasil diperbarui.");
      router.push("/admin-complete-profile");
      router.refresh();
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr]"
      >
        <EditPhotoCard
          previewUrl={previewUrl}
          name={form.watch("name") || profile.name}
          disabled={submitting}
          onSelectFile={handleSelectFile}
        />

        <Card className="rounded-xl overflow-hidden shadow-sm border">
          <CardHeader className="bg-muted/30 border-b pt-5 pb-4 px-6">
            <CardTitle className="text-lg font-semibold">Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <fieldset disabled={submitting} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Lengkap <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nomor HP <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="08xxxxxxxxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jenis_kelamin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Masukkan alamat lengkap"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nama_wali"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Wali</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama wali" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="no_wali"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor HP Wali</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="08xxxxxxxxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => router.push("/admin-complete-profile")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
