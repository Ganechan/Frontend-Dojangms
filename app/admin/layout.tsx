"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Bell,
  LogOut,
  Settings,
  User,
  ChevronDown,
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  return (
    <div className="flex h-screen bg-background">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:relative z-50 h-full bg-secondary text-secondary-foreground
          transition-[width] duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "left-0" : "-left-full md:left-0"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* ========== LOGO ========= */}
          <div className="h-16 border-b border-border flex items-center justify-center">
            <button
              onClick={() => collapsed && setCollapsed(false)}
              className="group relative"
            >
              {/* CIRCLE */}
              <div
                className="
        relative
        w-14 h-14 rounded-full bg-white
        flex items-center justify-center
        border shadow-sm
        overflow-hidden
      "
              >
                {/* LOGO */}
                <Image
                  src="/logo_dojang.png"
                  alt="Dojang Logo"
                  width={52}
                  height={52}
                  className={`
          absolute
          transition-all duration-200
          ${collapsed ? "group-hover:opacity-0 group-hover:scale-90" : ""}
        `}
                />

                {/* PANEL LEFT */}
                <PanelLeft
                  className={`
          absolute h-7 w-7 text-foreground
          opacity-0 scale-90
          transition-all duration-200
          ${collapsed ? "group-hover:opacity-100 group-hover:scale-100" : "hidden"}
        `}
                />
              </div>

              {/* TOOLTIP */}
              {collapsed && (
                <div
                  className="
          absolute left-full ml-2 top-1/2 -translate-y-1/2
          px-3 py-2 rounded bg-black text-white text-xs
          opacity-0 group-hover:opacity-100
          transition whitespace-nowrap
        "
                >
                  Buka Sidebar
                </div>
              )}
            </button>
          </div>

          {/* ========== MENU ========= */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 rounded-lg px-4 py-3
                    transition-all duration-200
                    ${collapsed ? "justify-center" : ""}
                    ${
                      active
                        ? "bg-primary text-primary-foreground shadow"
                        : "hover:bg-primary/10"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
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

          {/* ========== FOOTER ========= */}
          <div className="p-4 border-t border-border">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ========== TOPBAR ========= */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {/* MOBILE */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <PanelLeft />
            </Button>

            {/* DESKTOP */}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setCollapsed(true)}
              >
                <PanelLeft />
              </Button>
            )}

            <h1 className="hidden md:block font-semibold">
              Sistem Informasi Manajemen Dojang
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5" />

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                  AD
                </div>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow">
                  <button className="w-full px-4 py-2 flex gap-2 hover:bg-muted">
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button className="w-full px-4 py-2 flex gap-2 hover:bg-muted">
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <button className="w-full px-4 py-2 flex gap-2 text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {children}
        </main>
      </div>

      {/* ========== MOBILE OVERLAY ========= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
