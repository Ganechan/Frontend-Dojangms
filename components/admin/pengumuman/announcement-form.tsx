// components\admin\pengumuman\announcement-form.tsx
"use client";

import { useState, useEffect } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface AnnouncementFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

interface Role {
  id: number;
  name: string;
}

interface Kelas {
  id: number;
  nama: string;
}

interface User {
  id: number;
  name: string;
}

interface WhatsAppGroup {
  id: number;
  nama_grup: string;
}

export function AnnouncementForm({
  form,
  onSubmit,
  isLoading,
}: AnnouncementFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [kelases, setKelases] = useState<Kelas[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [whatsappGroups, setWhatsappGroups] = useState<WhatsAppGroup[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingKelas, setLoadingKelas] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const targetType = form.watch("target_type");
  const kirimWhatsapp = form.watch("kirim_whatsapp");
  const whatsappScope = form.watch("whatsapp_scope");
  const userIndividuRole = form.watch("user_individu_role");
  const selectedUserIds = form.watch("user_ids");
  const status = form.watch("status");

  // Fetch roles
  useEffect(() => {
    if (targetType === "role") {
      fetchRoles();
    }
  }, [targetType]);

  // Fetch kelas
  useEffect(() => {
    if (targetType === "kelas") {
      fetchKelas();
    }
  }, [targetType]);

  // Fetch users for individu
  useEffect(() => {
    if (targetType === "individu" && userIndividuRole) {
      fetchUsers(userIndividuRole);
    }
  }, [targetType, userIndividuRole]);

  // Fetch whatsapp groups
  useEffect(() => {
    if (kirimWhatsapp && whatsappScope === "grup_tertentu") {
      fetchWhatsappGroups();
    }
  }, [kirimWhatsapp, whatsappScope]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await fetch("/api/admin/get/roles");
      const data = await response.json();
      if (response.ok) {
        setRoles(data.data || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchKelas = async () => {
    try {
      setLoadingKelas(true);
      const response = await fetch(
        "/api/admin/kelas/getallkelas?page=1&limit=100&status=aktif",
      );
      const data = await response.json();
      if (response.ok) {
        setKelases(data.data || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch kelas:", err);
    } finally {
      setLoadingKelas(false);
    }
  };

  const fetchUsers = async (role: string) => {
    try {
      setLoadingUsers(true);
      const endpoint =
        role === "murid"
          ? "/api/admin/get/user/murid"
          : "/api/admin/get/user/pelatih";
      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchWhatsappGroups = async () => {
    try {
      setLoadingGroups(true);
      const response = await fetch("/api/admin/whatsapp-groups/terdaftar");
      const data = await response.json();
      if (response.ok) {
        setWhatsappGroups(data.data || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch whatsapp groups:", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleToggleUser = (userId: number) => {
    const current: number[] = form.getValues("user_ids") || [];

    const updated = current.includes(userId)
      ? current.filter((id: number) => id !== userId)
      : [...current, userId];

    form.setValue("user_ids", updated);
  };

  const handleRemoveUser = (userId: number) => {
    const current: number[] = form.getValues("user_ids") || [];

    const updated = current.filter((id: number) => id !== userId);

    form.setValue("user_ids", updated);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Informasi Pengumuman */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengumuman</CardTitle>
          <CardDescription>Isi judul dan isi pengumuman</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="judul">Judul Pengumuman *</Label>
            <Controller
              name="judul"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="judul"
                    placeholder="Masukkan judul pengumuman"
                    {...field}
                    className={error ? "border-red-500" : ""}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      {error && (
                        <p className="text-sm text-red-500">{error.message}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/200
                    </span>
                  </div>
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isi">Isi Pengumuman *</Label>
            <Controller
              name="isi"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Textarea
                    id="isi"
                    placeholder="Masukkan isi pengumuman"
                    rows={6}
                    {...field}
                    className={error ? "border-red-500" : ""}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      {error && (
                        <p className="text-sm text-red-500">{error.message}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/5000
                    </span>
                  </div>
                </>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Target Pengumuman */}
      <Card>
        <CardHeader>
          <CardTitle>Target Pengumuman</CardTitle>
          <CardDescription>
            Pilih siapa yang akan menerima pengumuman ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="target_type"
            control={form.control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="global" id="target_global" />
                  <Label
                    htmlFor="target_global"
                    className="font-normal cursor-pointer"
                  >
                    Semua Pengguna
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="role" id="target_role" />
                  <Label
                    htmlFor="target_role"
                    className="font-normal cursor-pointer"
                  >
                    Berdasarkan Role
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kelas" id="target_kelas" />
                  <Label
                    htmlFor="target_kelas"
                    className="font-normal cursor-pointer"
                  >
                    Berdasarkan Kelas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individu" id="target_individu" />
                  <Label
                    htmlFor="target_individu"
                    className="font-normal cursor-pointer"
                  >
                    Individu
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          {/* Role Target */}
          {targetType === "role" && (
            <div className="mt-4 pl-6 space-y-2 border-l-2 border-border">
              <Label htmlFor="role_select">Pilih Role</Label>
              <Controller
                name="target_role"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={loadingRoles}
                    >
                      <SelectTrigger
                        id="role_select"
                        className={error ? "border-red-500" : ""}
                      >
                        <SelectValue
                          placeholder={
                            loadingRoles ? "Memuat..." : "Pilih role"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className="text-sm text-red-500">{error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          {/* Kelas Target */}
          {targetType === "kelas" && (
            <div className="mt-4 pl-6 space-y-2 border-l-2 border-border">
              <Label htmlFor="kelas_select">Pilih Kelas</Label>
              <Controller
                name="kelas_id"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      disabled={loadingKelas}
                    >
                      <SelectTrigger
                        id="kelas_select"
                        className={error ? "border-red-500" : ""}
                      >
                        <SelectValue
                          placeholder={
                            loadingKelas ? "Memuat..." : "Pilih kelas"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {kelases.map((kelas) => (
                          <SelectItem key={kelas.id} value={String(kelas.id)}>
                            {kelas.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className="text-sm text-red-500">{error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          {/* Individu Target */}
          {targetType === "individu" && (
            <div className="mt-4 pl-6 space-y-3 border-l-2 border-border">
              <div className="space-y-2">
                <Label htmlFor="individu_role">Pilih Role</Label>
                <Controller
                  name="user_individu_role"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="individu_role">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="murid">Murid</SelectItem>
                        <SelectItem value="pelatih">Pelatih</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {userIndividuRole && (
                <div className="space-y-2">
                  <Label>
                    Pilih {userIndividuRole === "murid" ? "Murid" : "Pelatih"}
                  </Label>
                  <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                    {loadingUsers ? (
                      <p className="text-sm text-muted-foreground">Memuat...</p>
                    ) : users.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Tidak ada data
                      </p>
                    ) : (
                      users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`user_${user.id}`}
                            checked={
                              selectedUserIds?.includes(user.id) || false
                            }
                            onCheckedChange={() => handleToggleUser(user.id)}
                          />
                          <Label
                            htmlFor={`user_${user.id}`}
                            className="font-normal cursor-pointer"
                          >
                            {user.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Selected Users */}
              {selectedUserIds && selectedUserIds.length > 0 && (
                <div className="space-y-2">
                  <Label>Dipilih ({selectedUserIds.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserIds.map((userId: number) => {
                      const user = users.find((u) => u.id === userId);
                      return (
                        <Badge
                          key={userId}
                          variant="secondary"
                          className="pl-2 pr-1 py-1"
                        >
                          <span className="text-sm">{user?.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(userId)}
                            className="ml-1 hover:text-foreground"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>Pengiriman WhatsApp</CardTitle>
          <CardDescription>
            Pilih untuk mengirim ke grup WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="kirim_whatsapp"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  id="kirim_whatsapp"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="kirim_whatsapp"
              className="font-normal cursor-pointer"
            >
              Kirim ke WhatsApp
            </Label>
          </div>

          {kirimWhatsapp && (
            <div className="mt-4 pl-6 space-y-3 border-l-2 border-border">
              <Controller
                name="whatsapp_scope"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="semua_grup" id="scope_semua" />
                      <Label
                        htmlFor="scope_semua"
                        className="font-normal cursor-pointer"
                      >
                        Semua Grup
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="grup_besar_saja"
                        id="scope_besar"
                      />
                      <Label
                        htmlFor="scope_besar"
                        className="font-normal cursor-pointer"
                      >
                        Grup Besar Saja
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="grup_tertentu"
                        id="scope_tertentu"
                      />
                      <Label
                        htmlFor="scope_tertentu"
                        className="font-normal cursor-pointer"
                      >
                        Grup Tertentu
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {/* Grup Tertentu */}
              {whatsappScope === "grup_tertentu" && (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="group_select">Pilih Grup</Label>
                  <Controller
                    name="whatsapp_group_id"
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(v) => field.onChange(parseInt(v))}
                          disabled={loadingGroups}
                        >
                          <SelectTrigger
                            id="group_select"
                            className={error ? "border-red-500" : ""}
                          >
                            <SelectValue
                              placeholder={
                                loadingGroups ? "Memuat..." : "Pilih grup"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {whatsappGroups.map((group) => (
                              <SelectItem
                                key={group.id}
                                value={String(group.id)}
                              >
                                {group.nama_grup}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {error && (
                          <p className="text-sm text-red-500">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Publikasi */}
      <Card>
        <CardHeader>
          <CardTitle>Publikasi</CardTitle>
          <CardDescription>
            Pilih bagaimana pengumuman akan dikirim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="status_draft" />
                  <Label
                    htmlFor="status_draft"
                    className="font-normal cursor-pointer"
                  >
                    Simpan Draft
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="terjadwal" id="status_scheduled" />
                  <Label
                    htmlFor="status_scheduled"
                    className="font-normal cursor-pointer"
                  >
                    Jadwalkan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="terkirim" id="status_sent" />
                  <Label
                    htmlFor="status_sent"
                    className="font-normal cursor-pointer"
                  >
                    Kirim Sekarang
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          {/* Scheduled Date/Time */}
          {status === "terjadwal" && (
            <div className="mt-4 pl-6 space-y-3 border-l-2 border-border">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">
                  Tanggal & Waktu Pengiriman
                </Label>
                <Controller
                  name="scheduled_at"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        id="scheduled_date"
                        type="datetime-local"
                        {...field}
                        className={error ? "border-red-500" : ""}
                      />
                      {error && (
                        <p className="text-sm text-red-500">{error.message}</p>
                      )}
                    </>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Format: YYYY-MM-DD HH:mm:ss
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
