"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

interface Barber {
  id: string
  name: string
  image: string
  experience: number
  createdAt: string
}

export default function BarberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [barber, setBarber] = useState<
    Barber | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchBarber()
    }
  }, [params.id])

  const fetchBarber = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbers/${params.id}`
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message || "Failed to fetch barber"
        )
        return
      }

      setBarber(data.data)
    } catch (err: any) {
      setError(
        err.message || "An error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-600">
              Loading barber profile...
            </p>
          </div>
        </main>
      </>
    )
  }

  if (error || !barber) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error || "Barber not found"}
            </div>
            <button
              onClick={() =>
                router.push("/barbers")
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Barbers
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() =>
                router.push("/barbers")
              }
              className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
            >
              ← Back to Barbers
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {barber.image && (
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-96 object-cover"
                />
              )}

              <div className="p-8">
                <h1 className="text-4xl font-bold mb-6">
                  {barber.name}
                </h1>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">
                      Experience
                    </p>
                    <p className="text-3xl font-bold">
                      {barber.experience}+ years
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">
                      Status
                    </p>
                    <p className="text-xl font-semibold text-green-600">
                      Available
                    </p>
                  </div>
                </div>

                <div className="border-t pt-8 mb-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    About
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    A professional barber with{" "}
                    {barber.experience}+ years of
                    experience in the industry.
                    Specialized in various
                    haircut styles and
                    grooming services. Known for
                    attention to detail and
                    customer satisfaction.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold mb-2">
                    Specialties
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Classic Haircuts</li>
                    <li>
                      ✓ Modern Fade Designs
                    </li>
                    <li>
                      ✓ Beard Grooming
                    </li>
                    <li>✓ Hair Styling</li>
                  </ul>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
