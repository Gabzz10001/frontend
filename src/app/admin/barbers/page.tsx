"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Edit2, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { checkAdminRole } from "@/lib/auth"

interface Barber {
  id: string
  name: string
  image?: string
  experience: number
  createdAt: string
}

export default function BarbersManagementPage() {
  const router = useRouter()
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)

  const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true)
}, [])

useEffect(() => {
  if (!isMounted) return  // tunggu sampai client siap
  checkAdmin()
}, [isMounted])

const checkAdmin = () => {
  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token")

  console.log("role:", role, "token:", token) // pastikan nilainya benar

  if (role !== "ADMIN" || !token) {
    router.push("/")
    return
  }
  setIsAuthorized(true)
  fetchBarbers()
}

  const fetchBarbers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      )
      clearTimeout(timeout)

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to fetch barbers")
        setIsLoading(false)
        return
      }

      setBarbers(data.data || [])
      setIsLoading(false)
    } catch (err: any) {
      console.error("Fetch barbers error:", err)
      setError(err.message || "An error occurred")
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this barber?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || "Failed to delete barber")
        return
      }

      setSuccessMessage("Barber deleted successfully")
      fetchBarbers()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Barbers</h1>
          <Link
            href="/admin/barbers/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Barber
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No barbers found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Experience (years)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {barbers.map((barber) => (
                  <tr
                    key={barber.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{barber.name}</td>
                    <td className="px-6 py-4">
                      {barber.experience}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(
                        barber.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/barbers/${barber.id}/edit`}
                        className="text-blue-500 hover:text-blue-700 mr-4 inline-block"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(barber.id)
                        }
                        className="text-red-500 hover:text-red-700 inline-block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
