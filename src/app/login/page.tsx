"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Login attempt with:", email)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()
      console.log("Login response:", data)

      if (!response.ok) {
        const errorMsg = data.message || "Login failed"
        console.error("Login error:", errorMsg)
        setError(errorMsg)
        setIsLoading(false)
        return
      }

      if (data.data && data.data.token && data.data.user) {
        console.log("Saving user data:", data.data.user)

        const token = data.data.token
        const userRole = data.data.user.role || "USER"

        // Simpan ke localStorage
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        localStorage.setItem("role", userRole)

        // ✅ FIX UTAMA: Simpan token & role ke Cookie agar middleware bisa baca
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
        document.cookie = `role=${userRole}; path=/; max-age=${60 * 60 * 24 * 7}`

        console.log("User role saved:", userRole)
        console.log("Redirecting to:", userRole === "ADMIN" ? "/admin" : "/")

        // Redirect based on role
        setTimeout(() => {
          if (userRole === "ADMIN") {
            router.push("/admin")
          } else {
            router.push("/")
          }
        }, 500)
      } else {
        const errorMsg = "Invalid response data"
        console.error(errorMsg, data)
        setError(errorMsg)
        setIsLoading(false)
      }
    } catch (err: any) {
      const errorMsg = err.message || "An error occurred"
      console.error("Login exception:", errorMsg, err)
      setError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-lg
          shadow-md
          p-8
        "
      >
        <h1
          className="
            text-2xl
            font-bold
            text-center
            mb-8
          "
        >
          Login
        </h1>

        {error && (
          <div
            className="
              bg-red-100
              border
              border-red-400
              text-red-700
              px-4
              py-3
              rounded
              mb-4
            "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="
                block
                text-gray-700
                font-semibold
                mb-2
              "
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                px-4
                py-2
                border
                border-gray-300
                rounded
                focus:outline-none
                focus:border-blue-500
              "
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="
                block
                text-gray-700
                font-semibold
                mb-2
              "
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                px-4
                py-2
                border
                border-gray-300
                rounded
                focus:outline-none
                focus:border-blue-500
              "
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              bg-blue-600
              text-white
              font-semibold
              py-2
              rounded
              hover:bg-blue-700
              disabled:bg-gray-400
              transition
            "
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="
                text-blue-600
                hover:underline
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}