"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

interface Service {
  id: string
  name: string
  price: number
  duration: number
  createdAt: string
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<
    Service | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchService()
    }
  }, [params.id])

  const fetchService = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${params.id}`
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message || "Failed to fetch service"
        )
        return
      }

      setService(data.data)
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
              Loading service details...
            </p>
          </div>
        </main>
      </>
    )
  }

  if (error || !service) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error || "Service not found"}
            </div>
            <button
              onClick={() =>
                router.push("/services")
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Services
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
                router.push("/services")
              }
              className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
            >
              ← Back to Services
            </button>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold mb-6">
                {service.name}
              </h1>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    Rp.{" "}
                    {service.price.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Duration
                  </p>
                  <p className="text-3xl font-bold">
                    {service.duration} min
                  </p>
                </div>
              </div>

              <div className="border-t pt-8 mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  About This Service
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  This is a premium barber
                  service designed to give
                  you the best experience.
                  Our experienced barbers
                  are trained to provide
                  high-quality haircuts and
                  grooming services.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-2">
                  Service Details
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    ✓ Professional barbers
                  </li>
                  <li>
                    ✓ Premium tools and
                    products
                  </li>
                  <li>
                    ✓ Comfortable environment
                  </li>
                  <li>
                    ✓ Friendly staff
                  </li>
                </ul>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
                Book Now
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
