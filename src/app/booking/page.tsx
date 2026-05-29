"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

interface Barber {
  id: string
  name: string
  experience: number
}

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

export default function BookingPage() {
  const router = useRouter()
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  const [form, setForm] = useState({
    barberId: "",
    serviceId: "",
    bookingDate: "",
    bookingTime: "",
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchData()
  }, [isMounted])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [barbersRes, servicesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbers`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`),
      ])
      const barbersData = await barbersRes.json()
      const servicesData = await servicesRes.json()
      setBarbers(barbersData.data || [])
      setServices(servicesData.data || [])
    } catch (err: any) {
      setError("Gagal memuat data. Coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.barberId || !form.serviceId || !form.bookingDate || !form.bookingTime) {
      setError("Semua field wajib diisi.")
      return
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Gagal membuat booking.")
        return
      }

      setSuccess("Booking berhasil dibuat! Mengalihkan ke halaman booking Anda...")
      setForm({ barberId: "", serviceId: "", bookingDate: "", bookingTime: "" })

      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate time slots 08:00 - 20:00
  const timeSlots: string[] = []
  for (let h = 8; h <= 20; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`)
    if (h < 20) timeSlots.push(`${String(h).padStart(2, "0")}:30`)
  }

  // Min date = today
  const today = new Date().toISOString().split("T")[0]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-2">Buat Booking</h1>
              <p className="text-gray-600">
                Pilih barber, layanan, tanggal, dan jam yang Anda inginkan
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  {success}
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Pilih Barber */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Pilih Barber
                    </label>
                    <select
                      name="barberId"
                      value={form.barberId}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Barber --</option>
                      {barbers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.experience} thn pengalaman)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pilih Layanan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Pilih Layanan
                    </label>
                    <select
                      name="serviceId"
                      value={form.serviceId}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Layanan --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — Rp{s.price.toLocaleString("id-ID")} ({s.duration} menit)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tanggal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tanggal Booking
                    </label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={form.bookingDate}
                      min={today}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Jam */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Jam Booking
                    </label>
                    <select
                      name="bookingTime"
                      value={form.bookingTime}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Jam --</option>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Memproses..." : "Konfirmasi Booking"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}