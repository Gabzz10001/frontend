import Navbar from "@/components/navbar"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Premium Barber
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Booking Experience
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Book appointments with our
            skilled barbers. Fast, easy, and
            reliable haircut services.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105"
            >
              Book Now
            </Link>
            <Link
              href="/barbers"
              className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 hover:text-white transition"
            >
              View Barbers
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Our Services
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Professional barber services
            tailored to your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "✂️",
                title: "Haircut",
                desc: "Professional haircuts tailored to your style",
              },
              {
                icon: "🧔",
                title: "Beard Grooming",
                desc: "Expert beard trimming and shaping",
              },
              {
                icon: "💇",
                title: "Hair Styling",
                desc: "Modern styling and trendy cuts",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition text-center"
              >
                <div className="text-5xl mb-4">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Expert Barbers",
                desc: "Highly skilled and experienced professionals",
              },
              {
                title: "Easy Booking",
                desc: "Simple and convenient online booking system",
              },
              {
                title: "Best Prices",
                desc: "Competitive rates for premium services",
              },
              {
                title: "Clean & Hygienic",
                desc: "Maintains highest standards of cleanliness",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Book?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your perfect haircut today
          </p>
          <Link
            href="/booking"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 inline-block"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  )
}