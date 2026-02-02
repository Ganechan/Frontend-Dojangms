"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  Star,
  Users,
  Trophy,
  Award,
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">
                Joko Tingkir Salatiga
              </h1>
              <p className="text-xs text-muted-foreground">Taekwondo Club</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium hover:text-primary transition"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:text-primary transition"
            >
              Tentang
            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className="text-sm font-medium hover:text-primary transition"
            >
              Program
            </button>
            <button
              onClick={() => scrollToSection("achievements")}
              className="text-sm font-medium hover:text-primary transition"
            >
              Prestasi
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-sm font-medium hover:text-primary transition"
            >
              Galeri
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium hover:text-primary transition"
            >
              Kontak
            </button>
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
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                Tentang
              </button>
              <button
                onClick={() => scrollToSection("programs")}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                Program
              </button>
              <button
                onClick={() => scrollToSection("achievements")}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                Prestasi
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                Galeri
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left py-2 px-3 hover:bg-muted rounded"
              >
                Kontak
              </button>
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

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        <Image
          src="/yuji-itadori.jpg"
          alt="Taekwondo Athletes Training"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
            Dojang Joko Tingkir
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Membangun Karakter Melalui Seni Bela Diri
          </p>
          <p className="text-lg mb-8 text-gray-300">Salatiga, Jawa Tengah</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 px-8"
              onClick={() => scrollToSection("contact")}
            >
              Daftar Latihan
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20 bg-transparent"
              onClick={() => scrollToSection("contact")}
            >
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Tentang Dojang Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sejarah & Visi
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Dojang Joko Tingkir Salatiga didirikan dengan komitmen untuk
                menyebarkan nilai-nilai taekwondo yang luhur kepada masyarakat
                Salatiga dan sekitarnya.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Visi:</strong> Membentuk atlet berprestasi dan
                berkarakter melalui taekwondo
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Misi:</strong> Memberikan pelayanan terbaik, pembinaan
                profesional, dan pengembangan taekwondo untuk semua kalangan
              </p>
            </div>
            <div>
              <Image
                src="/belt-ceremony.jpg"
                alt="Dojang Facility"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Statistik Dojang
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-4xl font-bold mb-2">20+</div>
              <p className="text-lg">Tahun Berdiri</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-4xl font-bold mb-2">300+</div>
              <p className="text-lg">Anggota Aktif</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-lg">Sabuk Hitam</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-lg">Prestasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Program Latihan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Kelas Anak",
                age: "5 - 12 tahun",
                schedule: "Senin - Jumat: 15:00 - 16:30",
                benefits: ["Disiplin", "Kepercayaan Diri", "Kebugaran"],
              },
              {
                title: "Kelas Remaja",
                age: "13 - 17 tahun",
                schedule: "Senin - Jumat: 16:45 - 18:15",
                benefits: ["Teknik Lanjutan", "Kompetisi", "Leadership"],
              },
              {
                title: "Kelas Dewasa",
                age: "18+ tahun",
                schedule: "Senin - Jumat: 18:30 - 20:00",
                benefits: ["Fitness", "Self-Defense", "Spiritual"],
              },
              {
                title: "Kelas Prestasi",
                age: "Seleksi Atlet",
                schedule: "Sabtu - Minggu: 10:00 - 12:00",
                benefits: [
                  "Persiapan Kompetisi",
                  "Program Intensif",
                  "Mentoring",
                ],
              },
            ].map((program, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow border-2 border-primary/20"
              >
                <CardHeader>
                  <CardTitle className="text-primary">
                    {program.title}
                  </CardTitle>
                  <CardDescription>{program.age}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {program.schedule}
                  </p>
                  <div className="space-y-2">
                    {program.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Fasilitas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Matras Berkualitas",
                desc: "Matras premium untuk keselamatan",
              },
              {
                title: "Ruang Luas",
                desc: "Area latihan yang nyaman dan luas",
              },
              {
                title: "Peralatan Lengkap",
                desc: "Semua alat latihan tersedia",
              },
              {
                title: "Loker & Fasilitas",
                desc: "Tempat penyimpanan dan kamar mandi",
              },
            ].map((facility, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="text-primary" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{facility.title}</h3>
                <p className="text-gray-600 text-sm">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Prestasi & Penghargaan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Juara Umum Kompetisi Taekwondo Kota Salatiga 2023",
              "Medali Emas Kejuaraan Tingkat Provinsi 2023",
              "Atlet Terbaik Kategori -54kg Nasional",
              "Tim Poomsae Perak Kejuaraan Nasional",
              "Juara Kelas Individu Putra & Putri",
              "Penghargaan Dedikasi Dojang Terbaik",
            ].map((achievement, index) => (
              <div
                key={index}
                className="bg-primary/5 border-l-4 border-primary p-6 rounded hover:shadow-lg transition"
              >
                <div className="flex items-start gap-3">
                  <Award
                    className="text-primary mt-1 flex-shrink-0"
                    size={24}
                  />
                  <p className="text-gray-800">{achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Jadwal Latihan
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Hari</th>
                  <th className="px-6 py-3 text-left">Waktu</th>
                  <th className="px-6 py-3 text-left">Kategori</th>
                  <th className="px-6 py-3 text-left">Pelatih</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    day: "Senin - Jumat",
                    time: "15:00 - 16:30",
                    category: "Anak-anak",
                    trainer: "Trainer Junior",
                  },
                  {
                    day: "Senin - Jumat",
                    time: "16:45 - 18:15",
                    category: "Remaja",
                    trainer: "Trainer Senior",
                  },
                  {
                    day: "Senin - Jumat",
                    time: "18:30 - 20:00",
                    category: "Dewasa",
                    trainer: "Master Utama",
                  },
                  {
                    day: "Sabtu",
                    time: "10:00 - 12:00",
                    category: "Prestasi",
                    trainer: "Master & Pelatih",
                  },
                  {
                    day: "Minggu",
                    time: "10:00 - 12:00",
                    category: "Poomsae",
                    trainer: "Spesialis",
                  },
                ].map((schedule, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">{schedule.day}</td>
                    <td className="px-6 py-4">{schedule.time}</td>
                    <td className="px-6 py-4">{schedule.category}</td>
                    <td className="px-6 py-4 text-primary font-medium">
                      {schedule.trainer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Testimoni</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                role: "Orang tua siswa",
                content:
                  "Anak saya sangat senang latihan di Dojang Joko Tingkir. Tidak hanya belajar taekwondo, tapi juga karakter dan disiplin.",
                rating: 5,
              },
              {
                name: "Siti Nurhaliza",
                role: "Atlet Prestasi",
                content:
                  "Program latihan di sini sangat profesional. Saya berhasil meraih medali emas berkat bimbingan para master.",
                rating: 5,
              },
              {
                name: "Ahmad Wijaya",
                role: "Kelas Dewasa",
                content:
                  "Latihan taekwondo membantu saya lebih fit dan percaya diri. Lingkungan di dojang sangat mendukung.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Galeri</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Latihan Rutin Harian",
              "Ujian Sabuk",
              "Kompetisi Tingkat Kota",
              "Acara Poomsae",
              "Gathering Taekwondo",
              "Pembukaan Cabang Baru",
            ].map((title, index) => (
              <div
                key={index}
                className="relative h-64 bg-gradient-to-br from-primary to-primary/50 rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <span className="text-white font-semibold text-center px-4">
                    {title}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              Lihat Galeri Lengkap
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Mulai Perjalanan Taekwondo Anda Bersama Kami
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Bergabunglah dengan ribuan atlet yang telah merasakan transformasi
            melalui taekwondo
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 px-12 font-bold text-lg"
            onClick={() => scrollToSection("contact")}
          >
            Daftar Sekarang
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Hubungi Kami</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">
                Informasi Kontak
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-2">Alamat</h4>
                  <p className="text-gray-700">
                    Jl. Joko Tingkir No. 123, Salatiga, Jawa Tengah 50711
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Telepon & WhatsApp</h4>
                  <p className="text-gray-700">
                    <a
                      href="tel:+628123456789"
                      className="text-primary hover:underline"
                    >
                      +62 812 345 6789
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Email</h4>
                  <p className="text-gray-700">
                    <a
                      href="mailto:info@dojanjokotingkir.com"
                      className="text-primary hover:underline"
                    >
                      info@dojanjokotingkir.com
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Jam Operasional</h4>
                  <p className="text-gray-700">
                    Senin - Jumat: 14:00 - 21:00
                    <br />
                    Sabtu - Minggu: 09:00 - 13:00
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">
                Lokasi Kami
              </h3>
              <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1123.2017952748215!2d110.51831058619182!3d-7.338092165230224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a793e30786d3d%3A0xfa78cee49e16ce5!2sJOKO%20TINGKIR%20Taekwondo%20Salatiga!5e0!3m2!1sid!2sid!4v1770041189232!5m2!1sid!2sid"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/628123456789?text=Halo%20Dojang%20Joko%20Tingkir%20Salatiga"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 animate-pulse"
      >
        <MessageCircle size={24} />
      </a>

      {/* Footer */}
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
                  <a href="#" className="hover:text-primary transition">
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
            <p>
              &copy; 2024 Dojang Joko Tingkir Salatiga. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
