"use client"

import { useState } from "react"

import { useRouter }
from "next/navigation"

import { loginService }
from "@/services/auth.service"

import { toast }
from "sonner"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        const response =
          await loginService(
            email,
            password
          )

        localStorage.setItem(
          "token",
          response.data.token
        )

        localStorage.setItem(
          "role",
          response.data.user.role
        )

        toast.success(
          "Login berhasil"
        )

        if (
          response.data.user.role ===
          "ADMIN"
        ) {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Login gagal"
        )
      } finally {
        setLoading(false)
      }
    }

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-2
          "
        >
          Login
        </h1>

        <p
          className="
            text-gray-500
            mb-6
          "
        >
          Login ke akun anda
        </p>

        <form
          onSubmit={handleLogin}
          className="
            space-y-4
          "
        >
          <div>
            <label
              className="
                text-sm
                font-medium
              "
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              className="
                w-full
                mt-1
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-black
              "
            />
          </div>

          <div>
            <label
              className="
                text-sm
                font-medium
              "
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              className="
                w-full
                mt-1
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-black
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-black
              text-white
              py-3
              rounded-xl
              hover:opacity-90
              transition
            "
          >
            {loading
              ? "Loading..."
              : "Login"}
          </button>
        </form>
      </div>
    </main>
  )
}