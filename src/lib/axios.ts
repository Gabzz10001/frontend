import axios from "axios"

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (
      typeof window !== "undefined"
    ) {
      const token =
        localStorage.getItem("token")

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`
      }
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance