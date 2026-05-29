"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] =
    useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(
        "token"
      )
      const userData = localStorage.getItem(
        "user"
      )
      const userRole = localStorage.getItem("role")
      if (token && userData) {
        setUser(JSON.parse(userData))
        setRole(userRole)
      }
    }
    setIsLoading(false)
  }

  const handleLogout = () => {
    // Hapus localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")

    // ✅ FIX: Hapus cookie token & role saat logout
    document.cookie = "token=; path=/; max-age=0"
    document.cookie = "role=; path=/; max-age=0"

    setUser(null)
    setRole(null)
    setShowDropdown(false)
    router.push("/")
  }

  return (
    <header
      className="
        border-b
        bg-white/80
        backdrop-blur
        sticky
        top-0
        z-50
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          h-16
          flex
          items-center
          justify-between
        "
      >
        {/* LOGO */}

        <Link
          href="/"
          className="
            text-2xl
            font-bold
            tracking-tight
          "
        >
          Barber<span className="text-blue-600">Book</span>
        </Link>

        {/* MENU */}

        <nav
          className="
            hidden
            md:flex
            items-center
            gap-8
          "
        >
          <Link
            href="/"
            className="text-sm hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            href="/barbers"
            className="text-sm hover:text-blue-600 transition"
          >
            Barbers
          </Link>

          <Link
            href="/services"
            className="text-sm hover:text-blue-600 transition"
          >
            Services
          </Link>
        </nav>

        {/* BUTTON */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {!isLoading && user ? (
            <div className="relative">
              <button
                onClick={() =>
                  setShowDropdown(
                    !showDropdown
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  text-white
                  text-sm
                  hover:bg-blue-700
                  transition
                "
              >
                {user.name}
              </button>
              {showDropdown && (
                <div
                  className="
                    absolute
                    right-0
                    mt-2
                    w-48
                    bg-white
                    rounded-lg
                    shadow-lg
                    border
                  "
                >
                  {role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="
                        block
                        px-4
                        py-2
                        text-sm
                        hover:bg-blue-50
                        transition
                        text-blue-600
                        font-medium
                        border-b
                      "
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/bookings"
                    className="
                      block
                      px-4
                      py-2
                      text-sm
                      hover:bg-gray-100
                      transition
                    "
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2
                      text-sm
                      hover:bg-red-50
                      transition
                      text-red-600
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="
                  px-4
                  py-2
                  rounded-xl
                  border
                  hover:bg-gray-100
                  transition
                "
              >
                Login
              </Link>

              <Link
                href="/register"
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-black
                  text-white
                  hover:opacity-90
                  transition
                "
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}