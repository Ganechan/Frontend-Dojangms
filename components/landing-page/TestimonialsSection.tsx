import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
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
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Testimoni</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
  );
}
