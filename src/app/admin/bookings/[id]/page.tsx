"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { checkAdminRole } from "@/lib/auth"
import {
  getBookingById,
  updateBookingStatus,
  sendBookingNotification,
} from "@/services/admin.service"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Send,
  Scissors,
  User,
  Calendar,
  CreditCard,
  Timer,
  Hash,
  AlertCircle,
  Loader2,
  Bell,
  MessageSquare,
  ChevronDown,
} from "lucide-react"

interface BookingDetail {
  id: string
  user: { name: string; email: string }
  barber: { name: string }
  service: { name: string; price: number; duration: number }
  bookingDate: string
  bookingTime: string
  status: string
  createdAt: string
  updatedAt?: string
}

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DONE"

const STATUS_CONFIG: Record<
  string,
  {
    label: string
    color: string
    bg: string
    border: string
    ring: string
    dot: string
    icon: any
    description: string
  }
> = {
  PENDING: {
    label: "Menunggu Konfirmasi",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
    icon: AlertCircle,
    description: "Booking telah dibuat dan menunggu konfirmasi admin.",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    ring: "ring-sky-200",
    dot: "bg-sky-400",
    icon: CheckCircle2,
    description: "Booking telah dikonfirmasi. Customer siap datang.",
  },
  DONE: {
    label: "Selesai",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-200",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
    description: "Layanan telah selesai dilakukan.",
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    ring: "ring-rose-200",
    dot: "bg-rose-400",
    icon: XCircle,
    description: "Booking telah dibatalkan.",
  },
}

const QUICK_MESSAGES = [
  "Booking Anda telah dikonfirmasi! Kami menunggu kedatangan Anda.",
  "Mohon maaf, booking Anda perlu dijadwal ulang. Silakan hubungi kami.",
  "Pengingat: Anda memiliki booking besok. Jangan lupa ya!",
  "Terima kasih telah menggunakan layanan kami. Sampai jumpa lagi!",
  "Booking Anda telah dibatalkan. Silakan buat booking baru jika diperlukan.",
]

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Notification state
  const [showNotifyPanel, setShowNotifyPanel] = useState(false)
  const [notifMessage, setNotifMessage] = useState("")
  const [notifNote, setNotifNote] = useState("")
  const [isSendingNotif, setIsSendingNotif] = useState(false)
  const [notifSuccess, setNotifSuccess] = useState("")
  const [notifError, setNotifError] = useState("")

  useEffect(() => {
    if (!checkAdminRole()) {
      router.push("/")
      return
    }
    fetchBooking()
  }, [router, params])

  const fetchBooking = async () => {
    try {
      setIsLoading(true)
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const data = await getBookingById(id)
      setBooking(data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch booking")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!booking) return
    try {
      setIsUpdating(true)
      setUpdatingStatus(newStatus)
      setError("")
      await updateBookingStatus(booking.id, newStatus)
      setSuccessMessage(`Status berhasil diubah ke "${STATUS_CONFIG[newStatus]?.label}"`)
      fetchBooking()
      setTimeout(() => setSuccessMessage(""), 4000)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update booking status")
    } finally {
      setIsUpdating(false)
      setUpdatingStatus("")
    }
  }

  const handleSendNotification = async () => {
    if (!booking || !notifMessage.trim()) {
      setNotifError("Pesan tidak boleh kosong")
      return
    }
    try {
      setIsSendingNotif(true)
      setNotifError("")
      await sendBookingNotification(booking.id, notifMessage.trim(), notifNote.trim())
      setNotifSuccess(`Notifikasi berhasil dikirim ke ${booking.user.email}`)
      setNotifMessage("")
      setNotifNote("")
      setTimeout(() => {
        setNotifSuccess("")
        setShowNotifyPanel(false)
      }, 3000)
    } catch (err: any) {
      setNotifError(err.response?.data?.message || err.message || "Gagal mengirim notifikasi")
    } finally {
      setIsSendingNotif(false)
    }
  }

  // Status action buttons config
  const actionButtons: {
    status: BookingStatus
    label: string
    icon: any
    style: string
    show: (current: string) => boolean
  }[] = [
    {
      status: "CONFIRMED",
      label: "Konfirmasi",
      icon: CheckCircle2,
      style: "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200",
      show: (s) => s === "PENDING",
    },
    {
      status: "DONE",
      label: "Tandai Selesai",
      icon: CheckCircle2,
      style: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
      show: (s) => s === "CONFIRMED",
    },
    {
      status: "CANCELLED",
      label: "Tolak / Batalkan",
      icon: XCircle,
      style: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200",
      show: (s) => s === "PENDING" || s === "CONFIRMED",
    },
    {
      status: "PENDING",
      label: "Reset ke Pending",
      icon: RefreshCw,
      style: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200",
      show: (s) => s === "CANCELLED",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
          <Loader2 size={36} className="animate-spin text-slate-400" />
          <p className="text-slate-500 text-sm">Memuat detail booking...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Booking tidak ditemukan</p>
          <button
            onClick={() => router.push("/admin/bookings")}
            className="mt-4 text-sm text-sky-600 hover:underline"
          >
            Kembali ke daftar booking
          </button>
        </div>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[booking.status]

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/admin/bookings")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Daftar Booking
        </button>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Detail Booking
            </h1>
          </div>

          {/* Current status badge */}
          {cfg && (
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${cfg.bg} ${cfg.border} shrink-0`}
            >
              <cfg.icon size={16} className={cfg.color} />
              <div>
                <p className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</p>
                <p className={`text-xs ${cfg.color} opacity-70`}>{cfg.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-2xl mb-6">
            <XCircle size={16} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3.5 rounded-2xl mb-6">
            <CheckCircle2 size={16} className="shrink-0" />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Customer info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={15} className="text-slate-400" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Informasi Customer
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-lg font-bold">
                    {booking.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg leading-tight">
                    {booking.user.name}
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">{booking.user.email}</p>
                </div>
              </div>
            </div>

            {/* Booking info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={15} className="text-slate-400" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Detail Booking
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                <InfoField
                  icon={<Hash size={13} className="text-slate-400" />}
                  label="Booking ID"
                  value={booking.id.slice(0, 16) + "..."}
                  mono
                />
                <InfoField
                  icon={<Scissors size={13} className="text-slate-400" />}
                  label="Barber"
                  value={booking.barber.name}
                />
                <InfoField
                  icon={<Calendar size={13} className="text-slate-400" />}
                  label="Tanggal"
                  value={new Date(booking.bookingDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <InfoField
                  icon={<Clock size={13} className="text-slate-400" />}
                  label="Waktu"
                  value={booking.bookingTime}
                />
                <InfoField
                  icon={<Scissors size={13} className="text-slate-400" />}
                  label="Layanan"
                  value={booking.service.name}
                />
                <InfoField
                  icon={<Timer size={13} className="text-slate-400" />}
                  label="Durasi"
                  value={`${booking.service.duration} menit`}
                />
                <InfoField
                  icon={<CreditCard size={13} className="text-slate-400" />}
                  label="Harga"
                  value={`Rp ${booking.service.price.toLocaleString("id-ID")}`}
                  highlight
                />
                <InfoField
                  icon={<Clock size={13} className="text-slate-400" />}
                  label="Dibuat pada"
                  value={new Date(booking.createdAt).toLocaleString("id-ID")}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="space-y-4">
            {/* Status actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Ubah Status
              </h2>

              <div className="space-y-2.5">
                {actionButtons
                  .filter((btn) => btn.show(booking.status))
                  .map((btn) => (
                    <button
                      key={btn.status}
                      onClick={() => handleStatusChange(btn.status)}
                      disabled={isUpdating}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm disabled:opacity-60 ${btn.style}`}
                    >
                      {isUpdating && updatingStatus === btn.status ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <btn.icon size={15} />
                      )}
                      {isUpdating && updatingStatus === btn.status
                        ? "Memperbarui..."
                        : btn.label}
                    </button>
                  ))}

                {/* Current status indicator */}
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${cfg?.bg} ${cfg?.border} mt-1`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg?.dot}`} />
                  <span className={`text-xs font-semibold ${cfg?.color}`}>
                    Status saat ini: {cfg?.label}
                  </span>
                </div>
              </div>

              {/* All statuses - advanced */}
              <details className="mt-4">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 flex items-center gap-1 select-none">
                  <ChevronDown size={12} />
                  Semua opsi status
                </summary>
                <div className="mt-3 space-y-2">
                  {(["PENDING", "CONFIRMED", "DONE", "CANCELLED"] as BookingStatus[]).map((s) => {
                    const c = STATUS_CONFIG[s]
                    const isCurrent = booking.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => !isCurrent && handleStatusChange(s)}
                        disabled={isCurrent || isUpdating}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          isCurrent
                            ? `${c.bg} ${c.border} ${c.color} cursor-default`
                            : "border-slate-100 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        {c.label}
                        {isCurrent && (
                          <span className="ml-auto text-xs opacity-60">✓ Aktif</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </details>
            </div>

            {/* Send notification panel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <button
                onClick={() => setShowNotifyPanel(!showNotifyPanel)}
                className="w-full flex items-center justify-between gap-2 mb-1"
              >
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-slate-400" />
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Kirim Notifikasi
                  </h2>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${showNotifyPanel ? "rotate-180" : ""}`}
                />
              </button>
              <p className="text-xs text-slate-400 mb-4">
                Kirim pesan/informasi langsung ke email customer.
              </p>

              {showNotifyPanel && (
                <div className="space-y-3 border-t border-slate-50 pt-4">
                  {notifSuccess && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2.5 rounded-xl text-xs">
                      <CheckCircle2 size={13} />
                      {notifSuccess}
                    </div>
                  )}
                  {notifError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2.5 rounded-xl text-xs">
                      <XCircle size={13} />
                      {notifError}
                    </div>
                  )}

                  {/* Quick messages */}
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Pesan cepat:</p>
                    <div className="flex flex-col gap-1.5">
                      {QUICK_MESSAGES.map((msg, i) => (
                        <button
                          key={i}
                          onClick={() => setNotifMessage(msg)}
                          className="text-left text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-50 hover:border-slate-100 transition-all leading-relaxed"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message input */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block flex items-center gap-1">
                      <MessageSquare size={11} />
                      Pesan untuk Customer *
                    </label>
                    <textarea
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      placeholder="Tulis pesan untuk customer..."
                      rows={3}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* Admin note */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                      Catatan Internal (opsional)
                    </label>
                    <input
                      type="text"
                      value={notifNote}
                      onChange={(e) => setNotifNote(e.target.value)}
                      placeholder="Catatan untuk log admin..."
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleSendNotification}
                    disabled={isSendingNotif || !notifMessage.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm"
                  >
                    {isSendingNotif ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    {isSendingNotif ? "Mengirim..." : "Kirim Notifikasi"}
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    Akan dikirim ke: <span className="font-medium">{booking.user.email}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component
function InfoField({
  icon,
  label,
  value,
  mono = false,
  highlight = false,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
      <p
        className={`${
          mono ? "font-mono text-xs" : "text-sm"
        } ${highlight ? "font-bold text-slate-800 text-base" : "font-medium text-slate-700"}`}
      >
        {value}
      </p>
    </div>
  )
}