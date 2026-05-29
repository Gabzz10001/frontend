"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"

interface Barber {
  id: string
  name: string
  image: string
  experience: number
  createdAt: string
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<
    Barber[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBarbers()
  }, [])

  const fetchBarbers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbers`
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message || "Failed to fetch barbers"
        )
        return
      }

      setBarbers(data.data || [])
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
                Our Barbers
              </h1>
              <p className="text-gray-600 text-lg">
                Meet our skilled and
                experienced barbers
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
                  Loading barbers...
                </p>
              </div>
            ) : barbers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No barbers available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barbers.map((barber) => (
                  <Link
                    key={barber.id}
                    href={`/barbers/${barber.id}`}
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer h-full">
                      {barber.image && (
                        <img
                          src={barber.image}
                          alt={barber.name}
                          className="w-full h-64 object-cover"
                        />
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {barber.name}
                        </h3>

                        <p className="text-gray-600 mb-4">
                          <span className="font-semibold">
                            Experience:{" "}
                          </span>
                          {barber.experience} years
                        </p>

                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                          View Profile
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
