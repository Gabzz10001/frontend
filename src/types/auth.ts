export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
}

export interface LoginResponse {
  success: boolean
  message: string

  data: {
    token: string
    user: User
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
}