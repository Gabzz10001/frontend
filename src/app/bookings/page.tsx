"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"

interface Booking {
  id: string
  barber: {
    id: string
    name: string
  }
  service: {
    id: string
    name: string
    price: number
    duration: number
  }
  bookingDate: string
  bookingTime: string
  status: string
  createdAt: string
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

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
    fetchBookings()
  }, [isMounted])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to fetch bookings")
        return
      }

      setBookings(data.data || [])
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "DONE":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "✅ Dikonfirmasi"
      case "PENDING":
        return "⏳ Menunggu"
      case "DONE":
        return "✔️ Selesai"
      case "CANCELLED":
        return "❌ Dibatalkan"
      default:
        return status
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                <p className="text-gray-600">Kelola janji potong rambut Anda</p>
              </div>
              <Link
                href="/booking"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                + Booking Baru
              </Link>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Memuat booking Anda...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 mb-4">Anda belum memiliki booking.</p>
                <Link
                  href="/booking"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Buat booking pertama Anda
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {booking.barber.name}
                        </h3>
                        <p className="text-gray-600">{booking.service.name}</p>
                        <p className="text-blue-600 font-semibold mt-1">
                          Rp{booking.service.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
                      <div>
                        <p className="text-gray-500">Tanggal</p>
                        <p className="font-semibold">
                          {new Date(booking.bookingDate).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Jam</p>
                        <p className="font-semibold">{booking.bookingTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Durasi</p>
                        <p className="font-semibold">
                          {booking.service.duration} menit
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Dibuat</p>
                        <p className="font-semibold">
                          {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}