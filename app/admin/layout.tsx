"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Trophy,
  LogOut,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  /* ================= STATE ================= */
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ============ LOAD FROM LOCALSTORAGE ============ */
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, []);

  /* ============ SAVE TO LOCALSTORAGE ============ */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed, mounted]);

  if (!mounted) return null;

  /* ================= MENU ================= */
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User", href: "/admin/user", icon: Users },
    {
      name: "Kejuaraan",
      href: "/admin/kejuaraan",
      icon: Trophy,
    },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  /* ================= GET CURRENT PAGE NAME ================= */
  const getCurrentPageName = () => {
    const currentMenu = menuItems.find((item) => isActive(item.href));
    return currentMenu ? currentMenu.name : "Dashboard";
  };

  /* ================= HANDLE LOGOUT ================= */
  const handleLogout = () => {
    // Tambahkan logic logout di sini
    console.log("Logout clicked");
    // Contoh: redirect ke halaman login
    // router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:relative z-50 h-full bg-white text-sidebar-fg border-r
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-52"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* ========== LOGO ========= */}
          <div className="h-16 border-b border-border flex items-center justify-center px-3">
            <button
              onClick={() => collapsed && setCollapsed(false)}
              className="group relative"
            >
              {/* LOGO - No Circle */}
              <div className="relative flex items-center justify-center">
                {/* LOGO IMAGE */}
                <Image
                  src="/logo_dojang.png"
                  alt="Dojang Logo"
                  width={collapsed ? 40 : 100}
                  height={collapsed ? 40 : 40}
                  className={`
                    transition-all duration-200 object-contain
                    ${collapsed ? "group-hover:opacity-0 group-hover:scale-90" : ""}
                  `}
                  priority
                />

                {/* PANEL LEFT ICON - Show on hover when collapsed */}
                {collapsed && (
                  <PanelLeft
                    className="
                      absolute h-5 w-5 text-foreground
                      opacity-0 scale-90
                      transition-all duration-200
                      group-hover:opacity-100 group-hover:scale-100
                    "
                  />
                )}
              </div>

              {/* TOOLTIP */}
              {collapsed && (
                <div
                  className="
          absolute left-full ml-2 top-1/2 -translate-y-1/2
          px-3 py-2 rounded bg-black text-white text-xs
          opacity-0 group-hover:opacity-100
          transition whitespace-nowrap z-50
        "
                >
                  Buka Sidebar
                </div>
              )}
            </button>
          </div>

          {/* ========== MENU ========= */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm
                    transition-all duration-200
                    ${collapsed ? "justify-center" : ""}
                    ${
                      active
                        ? "bg-primary text-primary-foreground shadow"
                        : "hover:bg-primary/10"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span>{item.name}</span>}

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ========== FOOTER - PROFILE WITH DROPDOWN ========= */}
          <div className="p-3 border-t border-border">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted transition ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                {/* Avatar */}
                <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                  AD
                </div>

                {/* Name & Email - Only show when not collapsed */}
                {!collapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-xs font-semibold text-foreground truncate">
                      Admin
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      admin@dojang.com
                    </p>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {profileOpen && !collapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      // Navigate to profile
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 bottom-0 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                  Profile
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ========== TOPBAR - SIMPLIFIED ========= */}
        <header className="h-16 border-b bg-muted/30 flex items-center px-6">
          <div className="flex items-center gap-4">
            {/* MOBILE MENU TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>

            {/* DESKTOP COLLAPSE TOGGLE */}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setCollapsed(true)}
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            )}

            {/* CURRENT PAGE NAME */}
            <h1 className="text-lg font-semibold text-foreground">
              {getCurrentPageName()}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {children}
        </main>
      </div>

      {/* ========== MOBILE OVERLAY ========= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
