"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProfileResponse, UserProfile } from "@/lib/profile/types";
import { calculateCompleteness } from "@/lib/profile/profile-utils";
import { ProfileHeaderCard } from "@/components/profile/profile-header-card";
import { CompletenessAlert } from "@/components/profile/completeness-alert";
import { ProfileInformation } from "@/components/profile/profile-information";
import { CompletenessCard } from "@/components/profile/completeness-card";
import { QuickActions } from "@/components/pelatih/quick-actions";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileError } from "@/components/profile/profile-error";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/auth/profile");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memuat profil");
      }
      const result: ProfileResponse = await response.json();
      setProfile(result.data);
    } catch (err) {
      console.log("[v0] Failed to fetch profile:", err);
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <main className="min-h-screen bg-muted/30">
                <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
                  <header className="mb-8 space-y-1.5">
                    <h1 className="text-3xl font-semibold tracking-tight text-balance">
                      Profil Saya
                    </h1>
                    <p className="text-muted-foreground text-pretty">
                      Lihat informasi akun dan lengkapi data profil Anda.
                    </p>
                  </header>

                  {loading ? (
                    <ProfileSkeleton />
                  ) : error || !profile ? (
                    <ProfileError onRetry={fetchProfile} />
                  ) : (
                    <div className="space-y-6">
                      <ProfileHeaderCard profile={profile} />
                      <CompletenessAlert
                        isComplete={
                          calculateCompleteness(profile).percent === 100
                        }
                      />
                      <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                          <ProfileInformation profile={profile} />
                        </div>
                        <div className="space-y-6">
                          <CompletenessCard profile={profile} />
                          <QuickActions />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
