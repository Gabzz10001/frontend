import axios from "@/lib/axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ===== BARBERS =====
export const getBarbers = async () => {
  const response = await axios.get(`${API_URL}/barbers`)
  return response.data
}

export const getBarberById = async (id: string) => {
  const response = await axios.get(`${API_URL}/barbers/${id}`)
  return response.data
}

export const createBarber = async (data: {
  name: string
  experience: number
  image?: string
}) => {
  const response = await axios.post(`${API_URL}/barbers`, data)
  return response.data
}

export const updateBarber = async (
  id: string,
  data: { name?: string; experience?: number; image?: string }
) => {
  const response = await axios.put(`${API_URL}/barbers/${id}`, data)
  return response.data
}

export const deleteBarber = async (id: string) => {
  const response = await axios.delete(`${API_URL}/barbers/${id}`)
  return response.data
}

// ===== SERVICES =====
export const getServices = async () => {
  const response = await axios.get(`${API_URL}/services`)
  return response.data
}

export const getServiceById = async (id: string) => {
  const response = await axios.get(`${API_URL}/services/${id}`)
  return response.data
}

export const createService = async (data: {
  name: string
  price: number
  duration: number
}) => {
  const response = await axios.post(`${API_URL}/services`, data)
  return response.data
}

export const updateService = async (
  id: string,
  data: { name?: string; price?: number; duration?: number }
) => {
  const response = await axios.put(`${API_URL}/services/${id}`, data)
  return response.data
}

export const deleteService = async (id: string) => {
  const response = await axios.delete(`${API_URL}/services/${id}`)
  return response.data
}

// ===== BOOKINGS =====
export const getBookings = async () => {
  const response = await axios.get(`${API_URL}/bookings`)
  return response.data
}

export const getBookingById = async (id: string) => {
  const response = await axios.get(`${API_URL}/bookings/${id}`)
  return response.data
}

export const updateBookingStatus = async (
  id: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "DONE"
) => {
  const response = await axios.put(`${API_URL}/bookings/${id}`, { status })
  return response.data
}

export const deleteBooking = async (id: string) => {
  const response = await axios.delete(`${API_URL}/bookings/${id}`)
  return response.data
}

export const sendBookingNotification = async (
  id: string,
  message: string,
  adminNote?: string
) => {
  const response = await axios.post(`${API_URL}/bookings/${id}/notify`, {
    message,
    adminNote: adminNote || "",
  })
  return response.data
}