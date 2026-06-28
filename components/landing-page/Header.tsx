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
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Active section tracking
      const sections = ["home", "about", "programs", "achievements", "gallery", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Beranda", id: "home" },
    { label: "Tentang", id: "about" },
    { label: "Prestasi", id: "achievements" },
    { label: "Kontak", id: "contact" },
  ];

  const handleMenuClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto h-18 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("home")}>
          <div className="relative w-12 h-12">
            <Image
              src={Logo}
              alt="Logo Dojang"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-white font-bold text-sm leading-tight">Dojang</p>
            <p className="text-red-400 font-bold text-sm leading-tight">Joko Tingkir</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                activeSection === item.id
                  ? "text-red-400"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-red-500 rounded-full transition-all duration-300 ${
                  activeSection === item.id ? "w-4/5" : "w-0 group-hover:w-4/5"
                }`}
              />
            </button>
          ))}
          <Link href="/login" className="ml-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-900/30 border-0 px-5 font-semibold transition-all duration-300"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`block w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-red-600/20 text-red-400"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Link href="/login" className="block pt-2">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold border-0"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
