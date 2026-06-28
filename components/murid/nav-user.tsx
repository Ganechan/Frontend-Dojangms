// components/admin/nav-user.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/Useauth";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  foto: string | null;
  phone: string | null;
  alamat: string | null;
  jenis_kelamin: string | null;
  nama_wali: string | null;
  no_wali: string | null;
  tanggal_lahir: string | null;
  status: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const { logout, isLoading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<UserProfile | null>(null); // ✅ perbaiki typo
  const [loading, setLoading] = useState(true); // ✅ perbaiki typo

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Gagal mengambil data profil");
        }
        const result: ProfileResponse = await response.json();
        if (result.success) {
          setUserData(result.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Gagal memuat data profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarUrl = (foto: string | null) => {
    if (!foto) return undefined;
    if (foto.startsWith("http://") || foto.startsWith("https://")) {
      return foto;
    }
    return `/api/auth/avatar?path=${encodeURIComponent(foto)}`;
  };

  const displayName = userData?.name || "Loading...";
  const displayEmail = userData?.email || "memuat data...";
  const avatarUrl = getAvatarUrl(userData?.foto ?? null);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : (
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    {loading ? "..." : getInitials(displayName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : (
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {loading ? "..." : getInitials(displayName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/murid-complete-profile")}
              >
                <IconUserCircle className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              disabled={isLoading}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              {isLoading ? "Keluar..." : "Log Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
