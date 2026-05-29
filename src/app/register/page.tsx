"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            "Registration failed"
        )
        return
      }

      // Save token, user, and role if returned
      if (data.data?.token) {
        localStorage.setItem(
          "token",
          data.data.token
        )
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        )
        localStorage.setItem(
          "role",
          data.data.user?.role || "USER"
        )
      }

      // Redirect to home after register
      router.push("/")
    } catch (err: any) {
      setError(
        err.message || "An error occurred"
      )
    } finally {
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
          Register
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
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
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
              placeholder="John Doe"
              required
            />
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <label
              className="
                block
                text-gray-700
                font-semibold
                mb-2
              "
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
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
            {isLoading
              ? "Loading..."
              : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="
                text-blue-600
                hover:underline
              "
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
