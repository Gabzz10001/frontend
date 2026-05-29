"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import {
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  Search,
  Bell,
  ChevronDown,
  Clock,
  User,
  Scissors,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { checkAdminRole } from "@/lib/auth"
import { getBookings, deleteBooking } from "@/services/admin.service"

interface Booking {
  id: string
  user: { name: string; email: string }
  barber: { name: string }
  service: { name: string; price: number }
  bookingDate: string
  bookingTime: string
  status: string
  createdAt: string
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    icon: AlertCircle,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-400",
    icon: CheckCircle2,
  },
  DONE: {
    label: "Done",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-400",
    icon: XCircle,
  },
}

export default function BookingsManagementPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [newBookingAlert, setNewBookingAlert] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prevBookingIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    checkAdmin()
    intervalRef.current = setInterval(() => {
      silentRefresh()
    }, 10000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  const checkAdmin = () => {
    if (!checkAdminRole()) {
      router.push("/")
      return
    }
    setIsAuthorized(true)
    setTimeout(() => fetchBookings(), 100)
  }

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getBookings()
      const newBookings: Booking[] = data.data || []
      const newIds = new Set(newBookings.map((b) => b.id))
      if (prevBookingIdsRef.current.size > 0) {
        const hasNew = newBookings.some((b) => !prevBookingIdsRef.current.has(b.id))
        if (hasNew) {
          setNewBookingAlert(true)
          setTimeout(() => setNewBookingAlert(false), 6000)
        }
      }
      prevBookingIdsRef.current = newIds
      setBookings(newBookings)
      setLastUpdated(new Date())
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const silentRefresh = async () => {
    try {
      setIsRefreshing(true)
      const data = await getBookings()
      const newBookings: Booking[] = data.data || []
      const hasNew = newBookings.some((b) => !prevBookingIdsRef.current.has(b.id))
      if (hasNew && prevBookingIdsRef.current.size > 0) {
        setNewBookingAlert(true)
        setTimeout(() => setNewBookingAlert(false), 6000)
      }
      prevBookingIdsRef.current = new Set(newBookings.map((b) => b.id))
      setBookings(newBookings)
      setLastUpdated(new Date())
    } catch {
      // silent
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleManualRefresh = async () => {
    await fetchBookings()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus booking ini? Tindakan ini tidak dapat dibatalkan.")) return
    try {
      setDeletingId(id)
      await deleteBooking(id)
      setSuccessMessage("Booking berhasil dihapus")
      fetchBookings()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete booking")
    } finally {
      setDeletingId(null)
    }
  }

  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const filteredBookings = bookings
    .filter((b) => filterStatus === "ALL" || b.status === filterStatus)
    .filter((b) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        b.user.name.toLowerCase().includes(q) ||
        b.user.email.toLowerCase().includes(q) ||
        b.barber.name.toLowerCase().includes(q) ||
        b.service.name.toLowerCase().includes(q)
      )
    })

  const StatBadge = ({ status, count }: { status: string; count: number }) => {
    const cfg = STATUS_CONFIG[status]
    if (!cfg) return null
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
        <span className={`text-xs font-bold ${cfg.color}`}>{count}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Manajemen Booking
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <Clock size={12} />
                {lastUpdated.toLocaleTimeString("id-ID")}
                {isRefreshing && (
                  <span className="text-sky-500 flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> sync
                  </span>
                )}
              </span>
            )}
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-all duration-200 shadow-sm"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* New booking alert */}
        {newBookingAlert && (
          <div className="flex items-center gap-3 bg-sky-600 text-white px-5 py-3.5 rounded-2xl mb-6 shadow-lg shadow-sky-200 animate-pulse">
            <Bell size={18} className="shrink-0" />
            <p className="text-sm font-medium">Ada booking baru masuk!</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-2xl mb-6">
            <XCircle size={16} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3.5 rounded-2xl mb-6">
            <CheckCircle2 size={16} className="shrink-0" />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "ALL" : key)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                filterStatus === key
                  ? `${cfg.bg} ${cfg.border} shadow-sm`
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <cfg.icon
                  size={16}
                  className={filterStatus === key ? cfg.color : "text-slate-400"}
                />
                <span
                  className={`text-2xl font-bold ${
                    filterStatus === key ? cfg.color : "text-slate-700"
                  }`}
                >
                  {statusCounts[key] || 0}
                </span>
              </div>
              <p
                className={`text-xs font-medium ${
                  filterStatus === key ? cfg.color : "text-slate-500"
                }`}
              >
                {cfg.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filter + Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl p-1 shadow-sm overflow-x-auto">
            {["ALL", "PENDING", "CONFIRMED", "DONE", "CANCELLED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterStatus === s
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {s === "ALL" ? "Semua" : STATUS_CONFIG[s]?.label}
                {s !== "ALL" && statusCounts[s] ? (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      filterStatus === s
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {statusCounts[s]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama, email, barber, atau layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100 shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <Loader2 size={32} className="animate-spin text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Memuat data booking...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <Calendar size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Tidak ada booking ditemukan</p>
            <p className="text-slate-400 text-sm mt-1">
              {searchQuery ? "Coba ubah kata kunci pencarian" : "Belum ada data untuk filter ini"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header info */}
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Menampilkan{" "}
                <span className="font-semibold text-slate-700">{filteredBookings.length}</span>{" "}
                booking
              </p>
              <div className="flex items-center gap-2">
                {Object.entries(statusCounts)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => (
                    <StatBadge key={k} status={k} count={v} />
                  ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-50">
                    {["Customer", "Barber", "Layanan", "Jadwal", "Harga", "Status", "Aksi"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.map((booking) => {
                    const cfg = STATUS_CONFIG[booking.status]
                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50/60 transition-colors duration-150"
                      >
                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center shrink-0">
                              <span className="text-white text-xs font-bold">
                                {booking.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 leading-tight">
                                {booking.user.name}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {booking.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Barber */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Scissors size={13} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{booking.barber.name}</span>
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">{booking.service.name}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {new Date(booking.bookingDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock size={10} />
                            {booking.bookingTime}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-800">
                            Rp {booking.service.price.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {cfg ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">{booking.status}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/bookings/${booking.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-800 hover:text-white transition-all duration-200"
                            >
                              <Eye size={13} />
                              Detail
                            </Link>
                            <button
                              onClick={() => handleDelete(booking.id)}
                              disabled={deletingId === booking.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-600 hover:text-white transition-all duration-200 disabled:opacity-50"
                            >
                              {deletingId === booking.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}