interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-secondary text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Dojang Joko Tingkir</h4>
            <p className="text-sm text-white/70">
              Membangun karakter melalui seni bela diri sejak tahun 2004
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="hover:text-primary transition"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-primary transition"
                >
                  Tentang
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("programs")}
                  className="hover:text-primary transition"
                >
                  Program
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Sosial Media</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Lainnya</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/login" className="hover:text-primary transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-primary transition">
                  Pendaftaran
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>&copy; 2024 Dojang Joko Tingkir Salatiga. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
