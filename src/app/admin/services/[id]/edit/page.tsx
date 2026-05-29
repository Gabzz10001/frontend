"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { checkAdminRole } from "@/lib/auth"
import {
  getServiceById,
  updateService,
} from "@/services/admin.service"

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<Service | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!checkAdminRole()) {
      router.push("/")
      return
    }
    fetchService()
  }, [router, params])

  const fetchService = async () => {
    try {
      setIsLoadingData(true)
      const id = Array.isArray(params.id)
        ? params.id[0]
        : params.id
      const data = await getServiceById(id)
      setFormData(data.data)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch service"
      )
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    if (formData) {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              [name]:
                name === "price" ||
                name === "duration"
                  ? parseFloat(value) || 0
                  : value,
            }
          : null
      )
    }
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    if (!formData) return

    setError("")

    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0")
      return
    }

    if (formData.duration <= 0) {
      setError("Duration must be greater than 0")
      return
    }

    try {
      setIsLoading(true)
      await updateService(formData.id, {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
      })

      router.push("/admin/services")
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update service"
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Service not found</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Edit Service
        </h1>

        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Haircut"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price (Rp) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="30"
                min="1"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading
                  ? "Updating..."
                  : "Update Service"}
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push("/admin/services")
                }
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
