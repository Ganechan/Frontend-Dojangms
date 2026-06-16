"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserRoleData {
  id: number;
  name: string;
  roles: string[];
}

interface RoleOption {
  id: number;
  name: string;
}

interface EditUserModalProps {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditUserModal({
  userId,
  open,
  onOpenChange,
  onSuccess,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<UserRoleData | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Ambil daftar role yang tersedia dari API
  useEffect(() => {
    if (open) {
      const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
          const res = await fetch("/api/admin/get/roles");
          const data = await res.json();
          if (res.ok) {
            setRoleOptions(data.data);
          } else {
            toast.error(data.message || "Gagal mengambil data roles");
          }
        } catch (err) {
          console.error(err);
          toast.error("Gagal mengambil data roles");
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchRoles();
    }
  }, [open]);

  // Ambil data user
  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/get/user/${userId}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Gagal mengambil data");
          setUser(data.data);
          setSelectedRoles(data.data.roles);
        } catch (err: any) {
          toast.error(err.message);
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [open, userId, onOpenChange]);

  const handleRoleToggle = (roleName: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles((prev) => [...prev, roleName]);
    } else {
      if (selectedRoles.length === 1 && selectedRoles.includes(roleName)) {
        toast.error("User harus memiliki minimal 1 role");
        return;
      }
      setSelectedRoles((prev) => prev.filter((r) => r !== roleName));
    }
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      toast.error("Pilih minimal satu role");
      return;
    }
    setSubmitting(true);
    try {
      // Gunakan endpoint PATCH yang baru
      const res = await fetch(`/api/admin/update/roles/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: selectedRoles }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update role");
      toast.success("Role user berhasil diperbarui");
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRoles) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role User</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : user ? (
          <div className="space-y-4 py-2">
            <div>
              <Label>Nama</Label>
              <Input value={user.name} disabled className="bg-muted" />
            </div>
            <div>
              <Label className="mb-2 block">Roles</Label>
              <div className="space-y-2">
                {roleOptions.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.name)}
                      onCheckedChange={(checked) =>
                        handleRoleToggle(role.name, !!checked)
                      }
                    />
                    <label
                      htmlFor={`role-${role.id}`}
                      className="text-sm capitalize"
                    >
                      {role.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            User tidak ditemukan
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
