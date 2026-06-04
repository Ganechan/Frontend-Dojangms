import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Orang Tua Siswa",
    initial: "B",
    content:
      "Anak saya sangat senang latihan di Dojang Joko Tingkir. Tidak hanya belajar taekwondo, tapi juga karakter dan disiplin yang luar biasa.",
    rating: 5,
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Siti Nurhaliza",
    role: "Atlet Prestasi",
    initial: "S",
    content:
      "Program latihan di sini sangat profesional. Saya berhasil meraih medali emas berkat bimbingan para master yang berpengalaman.",
    rating: 5,
    color: "from-red-500 to-orange-400",
  },
  {
    name: "Ahmad Wijaya",
    role: "Kelas Dewasa",
    initial: "A",
    content:
      "Latihan taekwondo membantu saya lebih fit dan percaya diri. Lingkungan di dojang sangat mendukung dan menyenangkan.",
    rating: 5,
    color: "from-purple-500 to-violet-400",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Kata Mereka
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
          Testimoni <span className="text-red-500">Anggota</span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
          Pengalaman nyata dari anggota yang telah merasakan manfaat bergabung bersama kami.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-5 right-6 text-gray-100 group-hover:text-gray-200 transition-colors duration-300">
                <Quote size={48} />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed text-sm relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {testimonial.initial}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Bottom accent bar */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${testimonial.color} transition-all duration-500 rounded-b-2xl`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
