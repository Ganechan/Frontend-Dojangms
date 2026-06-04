import Image from "next/image";
import Logo from "@/public/logo_dojang.png";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  scrollToSection: (id: string) => void;
}

const menuLinks = [
  { label: "Beranda", id: "home" },
  { label: "Tentang", id: "about" },
  { label: "Program", id: "programs" },
  { label: "Prestasi", id: "achievements" },
  { label: "Galeri", id: "gallery" },
  { label: "Kontak", id: "contact" },
];

const otherLinks = [
  { label: "Login", href: "/login" },
  { label: "Pendaftaran", href: "/register" },
  { label: "FAQ", href: "#" },
];

const socials = [
  { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
  { icon: <Facebook size={16} />, href: "#", label: "Facebook" },
  { icon: <Youtube size={16} />, href: "#", label: "YouTube" },
];

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <Image src={Logo} alt="Logo Dojang" fill className="object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Dojang</p>
                <p className="text-red-400 font-bold text-sm leading-tight">Joko Tingkir</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Membangun karakter melalui seni bela diri sejak tahun 2004.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-5">
              Menu
            </h4>
            <ul className="space-y-3">
              {menuLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-white/60 hover:text-red-400 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-5">
              Lainnya
            </h4>
            <ul className="space-y-3">
              {otherLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-red-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-5">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                Jl. Joko Tingkir No. 123, Salatiga
              </li>
              <li>
                <a
                  href="tel:+628123456789"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-red-400 transition-colors duration-200"
                >
                  <Phone size={14} className="text-red-400 flex-shrink-0" />
                  +62 812 345 6789
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@dojanjokotingkir.com"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-red-400 transition-colors duration-200"
                >
                  <Mail size={14} className="text-red-400 flex-shrink-0" />
                  info@dojanjokotingkir.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
          <p>&copy; 2024 Dojang Joko Tingkir Salatiga. Semua hak dilindungi.</p>
          <p>Made with ❤️ in Salatiga</p>
        </div>
      </div>
    </footer>
  );
}
