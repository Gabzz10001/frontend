export const checkAdminRole = (): boolean => {
  try {
    if (typeof window === "undefined") {
      console.log("Server-side: cannot check role")
      return false
    }

    const role = localStorage.getItem("role")
    const token = localStorage.getItem("token")

    console.log("Checking admin - role:", role, "token exists:", !!token)

    return role === "ADMIN" && !!token
  } catch (error) {
    console.error("Error checking admin role:", error)
    return false
  }
}

export const getStoredRole = (): string | null => {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role")
    }
  } catch (error) {
    console.error("Error getting role:", error)
  }
  return null
}

export const getStoredToken = (): string | null => {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
  } catch (error) {
    console.error("Error getting token:", error)
  }
  return null
}