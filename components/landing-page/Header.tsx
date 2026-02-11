"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/public/logo_dojang.png";

interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Beranda", id: "home" },
    { label: "Tentang", id: "about" },
    { label: "Program", id: "programs" },
    { label: "Prestasi", id: "achievements" },
    { label: "Galeri", id: "gallery" },
    { label: "Kontak", id: "contact" },
  ];

  const handleMenuClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center h-full">
          <div className="relative w-24 h-24">
            <Image
              src={Logo}
              alt="Logo Dojang"
              fill
              className="object-contain scale-125"
              priority
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium hover:text-primary transition"
            >
              {item.label}
            </button>
          ))}
          <Link href="/login">
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-3 space-y-2 max-w-7xl mx-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                {item.label}
              </button>
            ))}
            <Link href="/login">
              <Button
                size="sm"
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
