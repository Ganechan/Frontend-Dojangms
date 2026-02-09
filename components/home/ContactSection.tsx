export default function ContactSection() {
  return (
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
  );
}
