import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor: otomatis nempel token kalau ada (misal untuk auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") // ubah ke ram
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api