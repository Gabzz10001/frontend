const API_URL =
  process.env.NEXT_PUBLIC_API_URL

// Services
export const getServices = async () => {
  const response = await fetch(
    `${API_URL}/services`
  )
  return response.json()
}

export const getServiceById = async (
  id: string
) => {
  const response = await fetch(
    `${API_URL}/services/${id}`
  )
  return response.json()
}

// Barbers
export const getBarbers = async () => {
  const response = await fetch(
    `${API_URL}/barbers`
  )
  return response.json()
}

export const getBarberById = async (
  id: string
) => {
  const response = await fetch(
    `${API_URL}/barbers/${id}`
  )
  return response.json()
}

// Auth
export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
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
  return response.json()
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(
    `${API_URL}/auth/register`,
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
  return response.json()
}
