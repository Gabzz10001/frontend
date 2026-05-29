import axiosInstance
from "@/lib/axios"

export const loginService =
  async (
    email: string,
    password: string
  ) => {
    const response =
      await axiosInstance.post(
        "/auth/login",
        {
          email,
          password,
        }
      )

    return response.data
  }

export const registerService =
  async (
    name: string,
    email: string,
    password: string
  ) => {
    const response =
      await axiosInstance.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      )

    return response.data
  }

export const getMeService =
  async () => {
    const response =
      await axiosInstance.get(
        "/auth/me"
      )

    return response.data
  }