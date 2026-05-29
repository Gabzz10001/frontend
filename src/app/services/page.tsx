"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"

interface Service {
  id: string
  name: string
  price: number
  duration: number
  createdAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<
    Service[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services`
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message || "Failed to fetch services"
        )
        return
      }

      setServices(data.data || [])
    } catch (err: any) {
      setError(
        err.message || "An error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Our Services
              </h1>
              <p className="text-gray-600 text-lg">
                Choose from our wide range of
                barber services
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Loading services...
                </p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No services available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer h-full">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {service.name}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <p className="text-gray-600">
                            <span className="font-semibold">
                              Price:{" "}
                            </span>
                            Rp.{" "}
                            {service.price.toLocaleString(
                              "id-ID"
                            )}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">
                              Duration:{" "}
                            </span>
                            {service.duration} minutes
                          </p>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
