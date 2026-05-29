"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Edit2, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { checkAdminRole } from "@/lib/auth"
import {
  getServices,
  deleteService,
} from "@/services/admin.service"

interface Service {
  id: string
  name: string
  price: number
  duration: number
  createdAt: string
}

export default function ServicesManagementPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [router])

  const checkAdmin = () => {
    if (!checkAdminRole()) {
      router.push("/")
      return
    }
    setIsAuthorized(true)
    // Load services after a small delay
    setTimeout(() => {
      fetchServices()
    }, 100)
  }

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const data = await getServices()
      setServices(data.data || [])
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch services"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this service?"
      )
    ) {
      return
    }

    try {
      await deleteService(id)
      setSuccessMessage("Service deleted successfully")
      fetchServices()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete service"
      )
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Manage Services
          </h1>
          <Link
            href="/admin/services/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Service
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
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No services found
            </p>
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
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Duration (minutes)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {service.name}
                    </td>
                    <td className="px-6 py-4">
                      Rp{service.price.toLocaleString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {service.duration}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(
                        service.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="text-blue-500 hover:text-blue-700 mr-4 inline-block"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(service.id)
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
