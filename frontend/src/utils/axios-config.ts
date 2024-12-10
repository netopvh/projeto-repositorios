import axios, { AxiosInstance } from "axios"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Substitua pela URL base da sua API
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token") // Ou de outro lugar
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error.response)
  },
)

export default axiosInstance
