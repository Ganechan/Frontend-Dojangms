import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from "lucide-react";

const contactInfo = [
  {
    icon: <MapPin size={20} />,
    label: "Alamat",
    value: "Jl. Joko Tingkir No. 123, Salatiga, Jawa Tengah 50711",
    href: null,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: <Phone size={20} />,
    label: "Telepon & WhatsApp",
    value: "+62 812 345 6789",
    href: "tel:+628123456789",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: "info@dojanjokotingkir.com",
    href: "mailto:info@dojanjokotingkir.com",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: <Clock size={20} />,
    label: "Jam Operasional",
    value: "Sen – Jum: 14:00 – 21:00 · Sab – Min: 09:00 – 13:00",
    href: null,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const socials = [
  { icon: <Instagram size={18} />, label: "Instagram", href: "#", color: "hover:bg-pink-500" },
  { icon: <Facebook size={18} />, label: "Facebook", href: "#", color: "hover:bg-blue-600" },
  { icon: <Youtube size={18} />, label: "YouTube", href: "#", color: "hover:bg-red-600" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Kontak
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
          Hubungi <span className="text-red-500">Kami</span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
          Ada pertanyaan? Kami siap membantu. Hubungi kami melalui berbagai saluran di bawah ini.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Informasi Kontak
            </h3>
            <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-orange-400 rounded mb-8" />

            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`font-semibold text-sm ${item.color} hover:underline`}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-sm text-gray-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <p className="text-sm font-bold text-gray-700 mb-4">Ikuti Kami</p>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 ${s.color}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Lokasi Kami
            </h3>
            <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-orange-400 rounded mb-8" />
            <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1123.2017952748215!2d110.51831058619182!3d-7.338092165230224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a793e30786d3d%3A0xfa78cee49e16ce5!2sJOKO%20TINGKIR%20Taekwondo%20Salatiga!5e0!3m2!1sid!2sid!4v1770041189232!5m2!1sid!2sid"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
