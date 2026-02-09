import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProgramsSection() {
  const programs = [
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
      benefits: ["Persiapan Kompetisi", "Program Intensif", "Mentoring"],
    },
  ];

  return (
    <section id="programs" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Program Latihan
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow border-2 border-primary/20"
            >
              <CardHeader>
                <CardTitle className="text-primary">{program.title}</CardTitle>
                <CardDescription>{program.age}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{program.schedule}</p>
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
  );
}
