"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import {
  Scissors,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react"
import { checkAdminRole } from "@/lib/auth"
import Link from "next/link"

interface DashboardStats {
  totalBarbers: number
  totalServices: number
  totalBookings: number
  totalUsers: number
  pendingBookings: number
  confirmedBookings: number
  doneBookings: number
  cancelledBookings: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalBarbers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalUsers: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    doneBookings: 0,
    cancelledBookings: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
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
    setTimeout(() => fetchStats(), 100)
  }

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const API_URL = process.env.NEXT_PUBLIC_API_URL

      const fetchWithTimeout = async (url: string) => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          })
          clearTimeout(timeout)
          return res.ok ? await res.json() : null
        } catch {
          clearTimeout(timeout)
          return null
        }
      }

      const [barbersData, servicesData, bookingsData] = await Promise.all([
        fetchWithTimeout(`${API_URL}/barbers`),
        fetchWithTimeout(`${API_URL}/services`),
        fetchWithTimeout(`${API_URL}/bookings`),
      ])

      let totalBarbers = barbersData?.data?.length || 0
      let totalServices = servicesData?.data?.length || 0
      let totalBookings = 0
      let pendingBookings = 0
      let confirmedBookings = 0
      let doneBookings = 0
      let cancelledBookings = 0

      if (bookingsData) {
        const list = bookingsData.data || []
        totalBookings = list.length
        pendingBookings = list.filter((b: any) => b.status === "PENDING").length
        confirmedBookings = list.filter(
          (b: any) => b.status === "CONFIRMED"
        ).length
        doneBookings = list.filter((b: any) => b.status === "DONE").length
        cancelledBookings = list.filter(
          (b: any) => b.status === "CANCELLED"
        ).length
      }

      setStats({
        totalBarbers,
        totalServices,
        totalBookings,
        totalUsers: 0,
        pendingBookings,
        confirmedBookings,
        doneBookings,
        cancelledBookings,
      })
    } catch (err: any) {
      setError(err.message || "Failed to fetch stats")
    } finally {
      setIsLoading(false)
    }
  }

  const mainStats = [
    {
      label: "Total Booking",
      value: stats.totalBookings,
      icon: Calendar,
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      label: "Dikonfirmasi",
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      iconBg: "bg-sky-100 text-sky-600",
    },
    {
      label: "Selesai",
      value: stats.doneBookings,
      icon: Activity,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Dibatalkan",
      value: stats.cancelledBookings,
      icon: XCircle,
      iconBg: "bg-rose-100 text-rose-600",
    },
  ]

  const menuCards = [
    {
      href: "/admin/barbers",
      icon: Scissors,
      title: "Kelola Barber",
      description: "Tambah, edit, atau hapus data barber",
      badge: stats.totalBarbers + " barber",
      badgeUrgent: false,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      href: "/admin/services",
      icon: BookOpen,
      title: "Kelola Layanan",
      description: "Atur daftar layanan dan harga",
      badge: stats.totalServices + " layanan",
      badgeUrgent: false,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      href: "/admin/bookings",
      icon: Calendar,
      title: "Kelola Booking",
      description: "Konfirmasi, tolak, dan pantau booking",
      badge: stats.pendingBookings + " pending",
      badgeUrgent: stats.pendingBookings > 0,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau dan kelola seluruh aktivitas barbershop Anda.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-2xl mb-6">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isAuthorized || isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <Loader2
              size={36}
              className="animate-spin text-slate-400 mx-auto mb-3"
            />
            <p className="text-slate-500 text-sm">
              {!isAuthorized ? "Memeriksa akses..." : "Memuat data..."}
            </p>
          </div>
        ) : (
          <>
            {/* Booking stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {mainStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <div
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.iconBg} mb-3`}
                  >
                    <stat.icon size={17} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Resource stats + completion rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Scissors size={20} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.totalBarbers}
                  </p>
                  <p className="text-xs text-slate-500">Barber terdaftar</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.totalServices}
                  </p>
                  <p className="text-xs text-slate-500">Layanan tersedia</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={15} className="text-slate-400" />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tingkat Selesai
                  </p>
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">
                  {stats.totalBookings > 0
                    ? Math.round(
                        (stats.doneBookings / stats.totalBookings) * 100
                      )
                    : 0}
                  %
                </p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                    style={{
                      width:
                        stats.totalBookings > 0
                          ? `${(stats.doneBookings / stats.totalBookings) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {stats.doneBookings} dari {stats.totalBookings} booking selesai
                </p>
              </div>
            </div>

            {/* Menu cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {menuCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-2xl ${card.bgColor} flex items-center justify-center`}
                    >
                      <card.icon size={20} className={card.color} />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        card.badgeUrgent
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500">{card.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                    Buka <ChevronRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}