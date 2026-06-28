"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import type { UserProfile } from "@/lib/profile/types";
import { AppSidebar } from "@/components/murid/app-sidebar";
import { SiteHeader } from "@/components/murid/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { EditProfileSkeleton } from "@/components/profile/edit-profile-skeleton";
import { ProfileError } from "@/components/profile/profile-error";
import { Button } from "@/components/ui/button";

interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Gunakan fetch internal dengan credentials
      const response = await fetch("/api/auth/profile", {
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengambil data profil");
      }
      const result: ProfileResponse = await response.json();
      if (result.success) {
        setProfile(result.data);
      } else {
        throw new Error(result.message || "Gagal mengambil data profil");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat data profil",
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
                  <Link href="/murid-complete-profile" className="inline-flex">
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
                        Edit Profil
                      </h1>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        Perbarui informasi akun Anda.
                      </p>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <EditProfileSkeleton />
                ) : error || !profile ? (
                  <ProfileError onRetry={fetchProfile} />
                ) : (
                  <EditProfileForm profile={profile} />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

