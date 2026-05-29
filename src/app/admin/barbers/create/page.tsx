"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { checkAdminRole } from "@/lib/auth"
import { createBarber } from "@/services/admin.service"

export default function CreateBarberPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    experience: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!checkAdminRole()) {
      router.push("/")
    }
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "experience"
          ? parseInt(value) || 0
          : value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }

    if (formData.experience < 0) {
      setError("Experience must be positive")
      return
    }

    try {
      setIsLoading(true)
      await createBarber({
        name: formData.name,
        experience: formData.experience,
      })

      router.push("/admin/barbers")
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create barber"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Add New Barber
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
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter barber name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Barber"}
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push("/admin/barbers")
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
